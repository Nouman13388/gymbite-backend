import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma.js";

// Get all appointments
export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { client: true, trainer: true },
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: { client: true, trainer: true },
    });
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// Create a new appointment
export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    clientId,
    trainerId,
    appointmentTime,
    status,
    type = "IN_PERSON",
    duration = 60,
    meetingLink,
    notes,
  } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        trainerId,
        appointmentTime,
        status,
        type,
        duration,
        meetingLink,
        notes,
      },
    });
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// Update an appointment
export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { appointmentTime, status, type, duration, meetingLink, notes } =
    req.body;

  try {
    const updateData: any = {};
    if (appointmentTime) updateData.appointmentTime = appointmentTime;
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    if (duration !== undefined) updateData.duration = duration;
    if (meetingLink !== undefined) updateData.meetingLink = meetingLink;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// Delete an appointment
export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
