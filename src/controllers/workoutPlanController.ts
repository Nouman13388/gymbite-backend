import { Request, Response } from "express";
import prisma from "../database/prisma.js";

// Get all workout plans
export const getWorkoutPlans = async (req: Request, res: Response) => {
  try {
    const workoutPlans = await prisma.workoutPlan.findMany();
    res.status(200).json(workoutPlans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workout plans" });
  }
};

// Get a workout plan by ID
export const getWorkoutPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const workoutPlan = await prisma.workoutPlan.findUnique({
      where: { id: parseInt(id) },
    });
    if (!workoutPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }
    res.status(200).json(workoutPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workout plan" });
  }
};

// Create a new workout plan
export const createWorkoutPlan = async (req: Request, res: Response) => {
  const {
    userId,
    title,
    name, // Backward compatibility
    description,
    category = "Full Body",
    duration = 30,
    difficulty = "Intermediate",
    imageUrl,
    exercises,
  } = req.body;

  try {
    const newWorkoutPlan = await prisma.workoutPlan.create({
      data: {
        userId,
        title: title || name, // Use title if provided, else fall back to name
        description,
        category,
        duration,
        difficulty,
        imageUrl,
        exercises,
      },
    });
    res.status(201).json(newWorkoutPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to create workout plan" });
  }
};

// Update a workout plan by ID
export const updateWorkoutPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    name, // Backward compatibility
    description,
    category,
    duration,
    difficulty,
    imageUrl,
    exercises,
  } = req.body;

  try {
    const updateData: any = {};
    if (title || name) updateData.title = title || name;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (duration !== undefined) updateData.duration = duration;
    if (difficulty) updateData.difficulty = difficulty;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (exercises) updateData.exercises = exercises;

    const updatedWorkoutPlan = await prisma.workoutPlan.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.status(200).json(updatedWorkoutPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to update workout plan" });
  }
};

// Delete a workout plan by ID
export const deleteWorkoutPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.workoutPlan.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete workout plan" });
  }
};
