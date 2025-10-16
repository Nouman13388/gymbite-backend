import prisma from "../database/prisma.js";

// ============================================
// USER ANALYTICS
// ============================================

export const getUserAnalytics = async () => {
  const [totalUsers, usersByRole, recentUsers] = await Promise.all([
    // Total users count
    prisma.user.count(),

    // Users by role
    prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    }),

    // Recent registrations (last 30 days)
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    totalUsers,
    usersByRole: usersByRole.map((item) => ({
      role: item.role,
      count: item._count.id,
    })),
    recentRegistrations: recentUsers,
  };
};

export const getUserGrowthTrends = async (days: number = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      role: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by date
  const growthMap: {
    [key: string]: { date: string; count: number; byRole: any };
  } = {};

  users.forEach((user) => {
    const dateKey = user.createdAt.toISOString().split("T")[0];
    if (!growthMap[dateKey]) {
      growthMap[dateKey] = {
        date: dateKey,
        count: 0,
        byRole: { CLIENT: 0, TRAINER: 0, ADMIN: 0 },
      };
    }
    growthMap[dateKey].count++;
    growthMap[dateKey].byRole[user.role]++;
  });

  return Object.values(growthMap);
};

// ============================================
// TRAINER ANALYTICS
// ============================================

export const getTrainerAnalytics = async () => {
  const [totalTrainers, avgRating, trainersBySpecialty, topTrainers] =
    await Promise.all([
      // Total trainers
      prisma.trainer.count(),

      // Average rating across all feedback
      prisma.feedback.aggregate({
        _avg: { rating: true },
      }),

      // Trainers by specialty
      prisma.trainer.groupBy({
        by: ["specialty"],
        _count: { id: true },
      }),

      // Top trainers by feedback rating
      prisma.trainer.findMany({
        include: {
          feedbacks: {
            select: { rating: true },
          },
          user: {
            select: { name: true, email: true },
          },
          _count: {
            select: {
              appointments: true,
              consultations: true,
              feedbacks: true,
            },
          },
        },
        take: 10,
      }),
    ]);

  // Calculate average rating for each trainer
  const trainersWithRating = topTrainers
    .map((trainer) => {
      const avgRating =
        trainer.feedbacks.length > 0
          ? trainer.feedbacks.reduce((sum, f) => sum + f.rating, 0) /
            trainer.feedbacks.length
          : 0;

      return {
        id: trainer.id,
        name: trainer.user.name,
        email: trainer.user.email,
        specialty: trainer.specialty,
        experienceYears: trainer.experienceYears,
        averageRating: avgRating,
        totalAppointments: trainer._count.appointments,
        totalConsultations: trainer._count.consultations,
        totalReviews: trainer._count.feedbacks,
      };
    })
    .sort((a, b) => b.averageRating - a.averageRating);

  return {
    totalTrainers,
    averageRating: avgRating._avg.rating || 0,
    trainersBySpecialty: trainersBySpecialty.map((item) => ({
      specialty: item.specialty,
      count: item._count.id,
    })),
    topTrainers: trainersWithRating,
  };
};

// ============================================
// CLIENT ANALYTICS
// ============================================

export const getClientAnalytics = async () => {
  const [totalClients, clientsByGoal, clientsWithProgress, activeClients] =
    await Promise.all([
      // Total clients
      prisma.client.count(),

      // Clients by fitness goals
      prisma.client.groupBy({
        by: ["fitnessGoals"],
        _count: { id: true },
      }),

      // Clients with progress tracking
      prisma.client.count({
        where: {
          progress: {
            some: {},
          },
        },
      }),

      // Active clients (with appointments in last 30 days)
      prisma.client.count({
        where: {
          appointments: {
            some: {
              appointmentTime: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      }),
    ]);

  return {
    totalClients,
    clientsByGoal: clientsByGoal
      .filter((item) => item.fitnessGoals)
      .map((item) => ({
        goal: item.fitnessGoals,
        count: item._count.id,
      })),
    clientsWithProgress,
    activeClients,
    inactiveClients: totalClients - activeClients,
  };
};

// ============================================
// APPOINTMENT ANALYTICS
// ============================================

export const getAppointmentAnalytics = async () => {
  const [
    totalAppointments,
    appointmentsByStatus,
    recentAppointments,
    completionRate,
  ] = await Promise.all([
    // Total appointments
    prisma.appointment.count(),

    // Appointments by status
    prisma.appointment.groupBy({
      by: ["status"],
      _count: { id: true },
    }),

    // Recent appointments (last 30 days)
    prisma.appointment.count({
      where: {
        appointmentTime: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // Completion rate calculation
    prisma.appointment.findMany({
      select: { status: true },
    }),
  ]);

  const completed = completionRate.filter(
    (a) => a.status === "COMPLETED"
  ).length;
  const total = completionRate.length;
  const rate = total > 0 ? (completed / total) * 100 : 0;

  return {
    totalAppointments,
    appointmentsByStatus: appointmentsByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
    })),
    recentAppointments,
    completionRate: rate,
  };
};

export const getAppointmentTrends = async (days: number = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentTime: { gte: startDate },
    },
    select: {
      appointmentTime: true,
      status: true,
    },
    orderBy: { appointmentTime: "asc" },
  });

  // Group by date
  const trendsMap: {
    [key: string]: { date: string; total: number; byStatus: any };
  } = {};

  appointments.forEach((appt) => {
    const dateKey = appt.appointmentTime.toISOString().split("T")[0];
    if (!trendsMap[dateKey]) {
      trendsMap[dateKey] = {
        date: dateKey,
        total: 0,
        byStatus: { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 },
      };
    }
    trendsMap[dateKey].total++;
    trendsMap[dateKey].byStatus[appt.status]++;
  });

  return Object.values(trendsMap);
};

// ============================================
// SYSTEM HEALTH
// ============================================

export const getSystemHealth = async () => {
  const [
    totalUsers,
    totalTrainers,
    totalClients,
    totalAppointments,
    totalConsultations,
    totalProgress,
    totalFeedback,
    totalNotifications,
    totalWorkoutPlans,
    totalMealPlans,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trainer.count(),
    prisma.client.count(),
    prisma.appointment.count(),
    prisma.consultation.count(),
    prisma.progress.count(),
    prisma.feedback.count(),
    prisma.notification.count(),
    prisma.workoutPlan.count(),
    prisma.mealPlan.count(),
  ]);

  return {
    database: {
      users: totalUsers,
      trainers: totalTrainers,
      clients: totalClients,
      appointments: totalAppointments,
      consultations: totalConsultations,
      progressRecords: totalProgress,
      feedback: totalFeedback,
      notifications: totalNotifications,
      workoutPlans: totalWorkoutPlans,
      mealPlans: totalMealPlans,
    },
    health: "healthy",
    timestamp: new Date(),
  };
};

// ============================================
// DASHBOARD OVERVIEW
// ============================================

export const getDashboardOverview = async () => {
  const [
    userAnalytics,
    trainerAnalytics,
    clientAnalytics,
    appointmentAnalytics,
    systemHealth,
  ] = await Promise.all([
    getUserAnalytics(),
    getTrainerAnalytics(),
    getClientAnalytics(),
    getAppointmentAnalytics(),
    getSystemHealth(),
  ]);

  return {
    users: userAnalytics,
    trainers: trainerAnalytics,
    clients: clientAnalytics,
    appointments: appointmentAnalytics,
    system: systemHealth,
    generatedAt: new Date(),
  };
};
