import { Request, Response } from "express";
import prisma from "../database/prisma.js";

// Get all meal plans
export const getMealPlans = async (req: Request, res: Response) => {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meals: true, // Include related meals
      },
    });
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    res.status(500).json({ error: "Failed to fetch meal plans" });
  }
};

// Get a meal plan by ID
export const getMealPlanById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        meals: true, // Include related meals
      },
    });
    if (!mealPlan) {
      return res.status(404).json({ error: "Meal plan not found" });
    }
    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
};

// Create a new meal plan
export const createMealPlan = async (req: Request, res: Response) => {
  const {
    userId,
    title,
    description,
    category = "General",
    imageUrl,
    calories = 0,
    protein = 0,
    fat = 0,
    carbs = 0,
    meals = [],
  } = req.body;

  try {
    const newMealPlan = await prisma.mealPlan.create({
      data: {
        userId,
        title,
        description,
        category,
        imageUrl,
        calories,
        protein,
        fat,
        carbs,
        meals: {
          create: meals.map((meal: any) => ({
            name: meal.name,
            description: meal.description,
            type: meal.type || "Breakfast",
            ingredients: meal.ingredients || [],
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            imageUrl: meal.imageUrl,
          })),
        },
      },
      include: {
        meals: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error("Error creating meal plan:", error);
    res.status(500).json({ error: "Failed to create meal plan" });
  }
};

// Update a meal plan by ID
export const updateMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    imageUrl,
    calories,
    protein,
    fat,
    carbs,
    meals,
  } = req.body;

  try {
    // If meals are provided, we need to update them as well
    const updateData: any = {
      title,
      description,
      category,
      imageUrl,
      calories,
      protein,
      fat,
      carbs,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // If meals are provided, replace all meals
    if (meals && Array.isArray(meals)) {
      updateData.meals = {
        deleteMany: {}, // Delete all existing meals
        create: meals.map((meal: any) => ({
          name: meal.name,
          description: meal.description,
          type: meal.type || "Breakfast",
          ingredients: meal.ingredients || [],
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          imageUrl: meal.imageUrl,
        })),
      };
    }

    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        meals: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).json({ error: "Failed to update meal plan" });
  }
};

// Delete a meal plan by ID
export const deleteMealPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.mealPlan.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meal plan" });
  }
};
