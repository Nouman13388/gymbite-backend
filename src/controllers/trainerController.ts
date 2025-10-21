import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma.js";

// Get trainer by user ID
export const getTrainerByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const trainer = await prisma.trainer.findFirst({
      where: { userId: parseInt(userId) },
      include: { user: true },
    });

    if (!trainer) {
      return res
        .status(404)
        .json({ error: "Trainer not found for this user ID" });
    }

    res.json(trainer);
  } catch (error) {
    console.error("Error fetching trainer by user ID:", error);
    next(error);
  }
};

// Get all trainers
export const getTrainers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: { user: true },
    });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
};

// Get a single trainer by ID
export const getTrainerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Create a new trainer
export const createTrainer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, specialty, experienceYears } = req.body;
  try {
    const trainer = await prisma.trainer.create({
      data: {
        userId,
        specialty,
        experienceYears,
      },
    });
    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
};

// Update a trainer
export const updateTrainer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { specialty, experienceYears } = req.body;
  try {
    const trainer = await prisma.trainer.update({
      where: { id: parseInt(id) },
      data: {
        specialty,
        experienceYears,
      },
    });
    res.json(trainer);
  } catch (error) {
    next(error);
  }
};

// Delete a trainer
export const deleteTrainer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.trainer.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get trainer's complete profile with related data
export const getTrainerCompleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        feedbacks: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        appointments: {
          include: {
            client: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
          where: {
            appointmentTime: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          orderBy: { appointmentTime: "desc" },
        },
      },
    });

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    // Calculate rating average
    const avgRating =
      trainer.feedbacks.length > 0
        ? trainer.feedbacks.reduce((sum, f) => sum + f.rating, 0) /
          trainer.feedbacks.length
        : 0;

    // Calculate stats
    const stats = {
      totalClients: new Set(trainer.appointments.map((a) => a.clientId)).size,
      totalAppointments: trainer.appointments.length,
      averageRating: avgRating.toFixed(2),
      totalReviews: trainer.feedbacks.length,
    };

    res.json({
      ...trainer,
      stats,
    });
  } catch (error) {
    console.error("Error fetching complete trainer profile:", error);
    next(error);
  }
};

// Get trainer's client list
export const getTrainerClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    // Get unique clients from appointments
    const appointments = await prisma.appointment.findMany({
      where: { trainerId: parseInt(id) },
      include: {
        client: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            progress: {
              orderBy: { progressDate: "desc" },
              take: 1, // Latest progress
            },
          },
        },
      },
      distinct: ["clientId"],
    });

    const clients = appointments.map((a) => ({
      ...a.client,
      lastAppointment: a.appointmentTime,
      appointmentStatus: a.status,
    }));

    res.json(clients);
  } catch (error) {
    console.error("Error fetching trainer clients:", error);
    next(error);
  }
};

// Get trainer's schedule
export const getTrainerSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const whereClause: any = {
      trainerId: parseInt(id),
    };

    if (startDate && endDate) {
      whereClause.appointmentTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { appointmentTime: "asc" },
    });

    res.json({
      appointments,
      summary: {
        totalAppointments: appointments.length,
        upcomingAppointments: appointments.filter(
          (a) => new Date(a.appointmentTime) > new Date()
        ).length,
        appointmentsByType: {
          inPerson: appointments.filter((a) => a.type === "IN_PERSON").length,
          videoCall: appointments.filter((a) => a.type === "VIDEO_CALL").length,
          phoneCall: appointments.filter((a) => a.type === "PHONE_CALL").length,
          chat: appointments.filter((a) => a.type === "CHAT").length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching trainer schedule:", error);
    next(error);
  }
};

// Get trainer's performance metrics
export const getTrainerMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const trainerId = parseInt(id);

  try {
    const [feedbacks, appointments] = await Promise.all([
      prisma.feedback.findMany({ where: { trainerId } }),
      prisma.appointment.findMany({ where: { trainerId } }),
    ]);

    const avgRating =
      feedbacks.length > 0
        ? feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) /
          feedbacks.length
        : 0;

    const completedAppointments = appointments.filter(
      (a: any) => a.status === "COMPLETED"
    ).length;
    const activeClients = new Set(appointments.map((a: any) => a.clientId))
      .size;

    res.json({
      rating: {
        average: avgRating.toFixed(2),
        total: feedbacks.length,
      },
      appointments: {
        total: appointments.length,
        completed: completedAppointments,
        completionRate:
          appointments.length > 0
            ? ((completedAppointments / appointments.length) * 100).toFixed(2)
            : "0.00",
        byType: {
          inPerson: appointments.filter((a: any) => a.type === "IN_PERSON")
            .length,
          videoCall: appointments.filter((a: any) => a.type === "VIDEO_CALL")
            .length,
          phoneCall: appointments.filter((a: any) => a.type === "PHONE_CALL")
            .length,
          chat: appointments.filter((a: any) => a.type === "CHAT").length,
        },
      },
      clients: {
        active: activeClients,
      },
    });
  } catch (error) {
    console.error("Error fetching trainer metrics:", error);
    next(error);
  }
};
