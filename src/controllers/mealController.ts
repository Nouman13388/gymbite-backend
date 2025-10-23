import { Request, Response } from "express";
import prisma from "../database/prisma.js";

// Get all meals for a meal plan
export const getMealsByMealPlanId = async (req: Request, res: Response) => {
  const { mealPlanId } = req.params;
  try {
    const meals = await prisma.meal.findMany({
      where: { mealPlanId: parseInt(mealPlanId) },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.status(200).json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
};

// Get a meal by ID
export const getMealById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meal = await prisma.meal.findUnique({
      where: { id: parseInt(id) },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.status(200).json(meal);
  } catch (error) {
    console.error("Error fetching meal:", error);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
};

// Create a new meal
export const createMeal = async (req: Request, res: Response) => {
  const {
    mealPlanId,
    name,
    description,
    type = "Breakfast",
    ingredients = [],
    calories = 0,
    protein = 0,
    imageUrl,
  } = req.body;

  try {
    const newMeal = await prisma.meal.create({
      data: {
        mealPlanId,
        name,
        description,
        type,
        ingredients,
        calories,
        protein,
        imageUrl,
      },
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.status(201).json(newMeal);
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ error: "Failed to create meal" });
  }
};

// Update a meal by ID
export const updateMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, type, ingredients, calories, protein, imageUrl } =
    req.body;

  try {
    const updateData: any = {
      name,
      description,
      type,
      ingredients,
      calories,
      protein,
      imageUrl,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedMeal = await prisma.meal.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        mealPlan: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.status(200).json(updatedMeal);
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ error: "Failed to update meal" });
  }
};

// Delete a meal by ID
export const deleteMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.meal.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  }
};
