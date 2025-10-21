import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma.js";
import { validationResult } from "express-validator";

// Custom error class for API errors
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
};

// Get all clients
export const getClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await prisma.client.findMany({
      include: { user: true },
    });
    res.json(clients);
  } catch (error) {
    next(new ApiError(500, "Failed to fetch clients"));
  }
};

// Get a single client by ID
export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });
    if (!client) {
      throw new ApiError(404, "Client not found");
    }
    res.json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Failed to fetch client"));
    }
  }
};

// Get client by user ID
export const getClientByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const client = await prisma.client.findFirst({
      where: { userId: parseInt(userId) },
      include: { user: true },
    });

    if (!client) {
      return res
        .status(404)
        .json({ error: "Client not found for this user ID" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client by user ID:", error);
    next(new ApiError(500, "Failed to fetch client by user ID"));
  }
};

// Create a new client
export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, weight, height, BMI, fitnessGoals, dietaryPreferences } =
    req.body;
  try {
    // Validate that the userId corresponds to a user with the CLIENT role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "CLIENT") {
      throw new ApiError(
        400,
        "Invalid userId. The user must have the CLIENT role."
      );
    }

    // Check if client already exists for this user
    const existingClient = await prisma.client.findUnique({
      where: { userId },
    });
    if (existingClient) {
      throw new ApiError(400, "A client profile already exists for this user");
    }

    const client = await prisma.client.create({
      data: {
        userId,
        weight,
        height,
        BMI,
        fitnessGoals,
        dietaryPreferences,
      },
    });
    res.status(201).json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Failed to create client"));
    }
  }
};

// Update a client
export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { weight, height, BMI, fitnessGoals, dietaryPreferences } = req.body;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingClient) {
      throw new ApiError(404, "Client not found");
    }

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        weight,
        height,
        BMI,
        fitnessGoals,
        dietaryPreferences,
      },
    });
    res.json(client);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Failed to update client"));
    }
  }
};

// Delete a client
export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingClient) {
      throw new ApiError(404, "Client not found");
    }

    await prisma.client.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Failed to delete client"));
    }
  }
};

// Get client's complete profile with related data
export const getClientCompleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        progress: {
          orderBy: { progressDate: "desc" },
          take: 10,
        },
        appointments: {
          include: {
            trainer: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: { appointmentTime: "desc" },
          take: 10,
        },
      },
    });

    if (!client) {
      throw new ApiError(404, "Client not found");
    }

    // Get workout and meal plans
    const [workoutPlans, mealPlans] = await Promise.all([
      prisma.workoutPlan.findMany({
        where: { userId: client.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.mealPlan.findMany({
        where: { userId: client.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // Calculate progress stats
    const progressStats =
      client.progress.length > 0
        ? {
            currentWeight: client.progress[0].weight,
            currentBMI: client.progress[0].BMI,
            totalEntries: client.progress.length,
            lastUpdated: client.progress[0].progressDate,
          }
        : null;

    res.json({
      ...client,
      workoutPlans,
      mealPlans,
      progressStats,
      stats: {
        totalAppointments: client.appointments.length,
        totalProgressEntries: client.progress.length,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      console.error("Error fetching complete client profile:", error);
      next(new ApiError(500, "Failed to fetch complete client profile"));
    }
  }
};

// Get client's workout and meal plans
export const getClientPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    // First get the client to get their userId
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      select: { userId: true },
    });

    if (!client) {
      throw new ApiError(404, "Client not found");
    }

    const [workoutPlans, mealPlans] = await Promise.all([
      prisma.workoutPlan.findMany({
        where: { userId: client.userId },
      }),
      prisma.mealPlan.findMany({
        where: { userId: client.userId },
      }),
    ]);

    res.json({
      workoutPlans,
      mealPlans,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Failed to fetch client plans"));
    }
  }
};

// Get client's progress history
export const getClientProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { limit = 30 } = req.query;

  try {
    const progress = await prisma.progress.findMany({
      where: { clientId: parseInt(id) },
      orderBy: { progressDate: "desc" },
      take: parseInt(limit as string),
    });

    if (progress.length === 0) {
      return res.json({
        progress: [],
        trends: null,
        message: "No progress data available",
      });
    }

    // Calculate trends
    const latestProgress = progress[0];
    const oldestProgress = progress[progress.length - 1];

    const weightChange = parseFloat(
      (
        parseFloat(latestProgress.weight.toString()) -
        parseFloat(oldestProgress.weight.toString())
      ).toFixed(2)
    );

    const bmiChange = parseFloat(
      (
        parseFloat(latestProgress.BMI.toString()) -
        parseFloat(oldestProgress.BMI.toString())
      ).toFixed(2)
    );

    res.json({
      progress,
      trends: {
        weightChange,
        bmiChange,
        direction:
          weightChange > 0 ? "gain" : weightChange < 0 ? "loss" : "stable",
        timeRange: {
          from: oldestProgress.progressDate,
          to: latestProgress.progressDate,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching client progress:", error);
    next(new ApiError(500, "Failed to fetch client progress"));
  }
};

// Get client's recent activities
export const getClientActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingClient) {
      throw new ApiError(404, "Client not found");
    }

    const [appointments, progress, notifications] = await Promise.all([
      prisma.appointment.findMany({
        where: { clientId: parseInt(id) },
        orderBy: { appointmentTime: "desc" },
        take: 5,
      }),
      prisma.progress.findMany({
        where: { clientId: parseInt(id) },
        orderBy: { progressDate: "desc" },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { userId: existingClient.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    res.json({
      appointments,
      progress,
      notifications,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Failed to fetch client activities"));
    }
  }
};

// Get client's appointments
export const getClientAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { status } = req.query;

  try {
    const whereClause: any = { clientId: parseInt(id) };
    if (status) {
      whereClause.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        trainer: {
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
      orderBy: { appointmentTime: "desc" },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching client appointments:", error);
    next(new ApiError(500, "Failed to fetch client appointments"));
  }
};
