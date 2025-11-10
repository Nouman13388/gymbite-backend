import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all progress records
export const getAllProgress = async (req: Request, res: Response) => {
  try {
    const progress = await prisma.progress.findMany();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress records" });
  }
};

// Get a single progress record by ID
export const getProgressById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const progress = await prisma.progress.findUnique({
      where: { id: parseInt(id) },
    });
    if (!progress) {
      return res.status(404).json({ error: "Progress record not found" });
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress record" });
  }
};

// Create a new progress record
export const createProgress = async (req: Request, res: Response) => {
  const { clientId, weight, bodyFat, muscleMass, notes } = req.body;

  try {
    // Validate required fields
    if (!clientId || !weight) {
      return res
        .status(400)
        .json({ error: "clientId and weight are required" });
    }

    // Get client to verify existence and get height for BMI calculation
    const client = await prisma.client.findUnique({
      where: { userId: clientId },
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Calculate BMI using client's actual height
    // BMI = weight (kg) / (height in meters)^2
    const heightInMeters = Number(client.height) / 100; // Convert cm to meters
    const calculatedBMI = Number(weight) / (heightInMeters * heightInMeters);

    // Create progress record
    const newProgress = await prisma.progress.create({
      data: {
        clientId,
        weight,
        BMI: calculatedBMI,
        progressDate: new Date(),
        workoutPerformance: bodyFat
          ? `Body Fat: ${bodyFat}%${
              muscleMass ? `, Muscle Mass: ${muscleMass}kg` : ""
            }`
          : muscleMass
          ? `Muscle Mass: ${muscleMass}kg`
          : null,
        mealPlanCompliance: notes || null,
      },
    });

    res.status(201).json(newProgress);
  } catch (error) {
    console.error("Error creating progress record:", error);
    res.status(500).json({ error: "Failed to create progress record" });
  }
};

// Update a progress record by ID
export const updateProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { weight, BMI, progressDate, workoutPerformance, mealPlanCompliance } =
    req.body;
  try {
    const updatedProgress = await prisma.progress.update({
      where: { id: parseInt(id) },
      data: {
        weight,
        BMI,
        progressDate,
        workoutPerformance,
        mealPlanCompliance,
      },
    });
    res.status(200).json(updatedProgress);
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress record" });
  }
};

// Delete a progress record by ID
export const deleteProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.progress.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete progress record" });
  }
};

// Get progress records by client ID
export const getProgressByClientId = async (req: Request, res: Response) => {
  const { clientId } = req.params;
  const { limit = 30, orderBy = "desc" } = req.query;

  try {
    const progress = await prisma.progress.findMany({
      where: { clientId: parseInt(clientId) },
      orderBy: { progressDate: orderBy as "asc" | "desc" },
      take: parseInt(limit as string),
    });

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress by client:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch progress records for client" });
  }
};

// Get progress trends for a client
export const getProgressTrends = async (req: Request, res: Response) => {
  const { clientId } = req.params;
  const { period = "30" } = req.query; // days

  try {
    const periodDays = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const progress = await prisma.progress.findMany({
      where: {
        clientId: parseInt(clientId),
        progressDate: {
          gte: startDate,
        },
      },
      orderBy: { progressDate: "asc" },
    });

    if (progress.length === 0) {
      return res.status(200).json({
        message: "No progress data available for the specified period",
        trends: null,
      });
    }

    const first = progress[0];
    const last = progress[progress.length - 1];

    const weightChange = parseFloat(
      (
        parseFloat(last.weight.toString()) - parseFloat(first.weight.toString())
      ).toFixed(2)
    );

    const bmiChange = parseFloat(
      (
        parseFloat(last.BMI.toString()) - parseFloat(first.BMI.toString())
      ).toFixed(2)
    );

    // Calculate weekly averages
    const weeklyData: { [key: string]: { weights: number[]; bmis: number[] } } =
      {};

    progress.forEach((p) => {
      const weekKey = new Date(p.progressDate)
        .toISOString()
        .split("T")[0]
        .slice(0, 10);
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { weights: [], bmis: [] };
      }
      weeklyData[weekKey].weights.push(parseFloat(p.weight.toString()));
      weeklyData[weekKey].bmis.push(parseFloat(p.BMI.toString()));
    });

    const weeklyAverages = Object.entries(weeklyData).map(([date, data]) => ({
      date,
      avgWeight: (
        data.weights.reduce((a, b) => a + b, 0) / data.weights.length
      ).toFixed(2),
      avgBMI: (data.bmis.reduce((a, b) => a + b, 0) / data.bmis.length).toFixed(
        2
      ),
    }));

    res.status(200).json({
      period: {
        days: periodDays,
        from: first.progressDate,
        to: last.progressDate,
      },
      overall: {
        weightChange,
        bmiChange,
        direction:
          weightChange > 0 ? "gain" : weightChange < 0 ? "loss" : "stable",
        totalEntries: progress.length,
      },
      weeklyAverages,
      dataPoints: progress.map((p) => ({
        date: p.progressDate,
        weight: p.weight,
        bmi: p.BMI,
      })),
    });
  } catch (error) {
    console.error("Error calculating progress trends:", error);
    res.status(500).json({ error: "Failed to calculate progress trends" });
  }
};

// Get progress summary for a client
export const getProgressSummary = async (req: Request, res: Response) => {
  const { clientId } = req.params;

  try {
    const allProgress = await prisma.progress.findMany({
      where: { clientId: parseInt(clientId) },
      orderBy: { progressDate: "asc" },
    });

    if (allProgress.length === 0) {
      return res.status(200).json({
        message: "No progress data available",
        summary: null,
      });
    }

    const latest = allProgress[allProgress.length - 1];
    const earliest = allProgress[0];

    const weights = allProgress.map((p) => parseFloat(p.weight.toString()));
    const bmis = allProgress.map((p) => parseFloat(p.BMI.toString()));

    const avgWeight = (
      weights.reduce((a, b) => a + b, 0) / weights.length
    ).toFixed(2);
    const avgBMI = (bmis.reduce((a, b) => a + b, 0) / bmis.length).toFixed(2);

    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);

    res.status(200).json({
      current: {
        weight: latest.weight,
        bmi: latest.BMI,
        date: latest.progressDate,
      },
      starting: {
        weight: earliest.weight,
        bmi: earliest.BMI,
        date: earliest.progressDate,
      },
      averages: {
        weight: avgWeight,
        bmi: avgBMI,
      },
      range: {
        maxWeight,
        minWeight,
        difference: (maxWeight - minWeight).toFixed(2),
      },
      totalEntries: allProgress.length,
      trackingPeriod: {
        from: earliest.progressDate,
        to: latest.progressDate,
        days: Math.floor(
          (new Date(latest.progressDate).getTime() -
            new Date(earliest.progressDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      },
    });
  } catch (error) {
    console.error("Error generating progress summary:", error);
    res.status(500).json({ error: "Failed to generate progress summary" });
  }
};
