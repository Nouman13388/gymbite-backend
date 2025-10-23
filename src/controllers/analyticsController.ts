import { Request, Response, NextFunction } from "express";
import {
  getUserAnalytics,
  getUserGrowthTrends,
  getTrainerAnalytics,
  getClientAnalytics,
  getAppointmentAnalytics,
  getAppointmentTrends,
  getSystemHealth,
  getDashboardOverview,
} from "../services/analyticsService.js";

// Get dashboard overview
export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const overview = await getDashboardOverview();
    res.json(overview);
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    next(error);
  }
};

// Get user analytics
export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analytics = await getUserAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    next(error);
  }
};

// Get user growth trends
export const getUserGrowth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { days = 30 } = req.query;

  try {
    const trends = await getUserGrowthTrends(parseInt(days as string));
    res.json(trends);
  } catch (error) {
    console.error("Error fetching user growth trends:", error);
    next(error);
  }
};

// Get trainer analytics
export const getTrainerStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analytics = await getTrainerAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching trainer analytics:", error);
    next(error);
  }
};

// Get client analytics
export const getClientStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analytics = await getClientAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching client analytics:", error);
    next(error);
  }
};

// Get appointment analytics
export const getAppointmentStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analytics = await getAppointmentAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching appointment analytics:", error);
    next(error);
  }
};

// Get appointment trends
export const getAppointmentTrendsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { days = 30 } = req.query;

  try {
    const trends = await getAppointmentTrends(parseInt(days as string));
    res.json(trends);
  } catch (error) {
    console.error("Error fetching appointment trends:", error);
    next(error);
  }
};

// Get system health
export const getSystemHealthData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const health = await getSystemHealth();
    res.json(health);
  } catch (error) {
    console.error("Error fetching system health:", error);
    next(error);
  }
};
