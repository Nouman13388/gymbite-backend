import { Request, Response, NextFunction } from "express";
import prisma from "../database/prisma.js";
import { adminFirestore } from "../config/firebaseAdmin.js";

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

    // If appointment type is CHAT, create Firestore chat room
    if (appointment.type === "CHAT") {
      try {
        // Fetch client and trainer with their user records to get firebaseUids
        const client = await prisma.client.findUnique({
          where: { id: clientId },
          include: { user: true },
        });

        const trainer = await prisma.trainer.findUnique({
          where: { id: trainerId },
          include: { user: true },
        });

        if (client?.user?.firebaseUid && trainer?.user?.firebaseUid) {
          // Create sorted roomId by combining firebaseUids
          const uids = [
            client.user.firebaseUid,
            trainer.user.firebaseUid,
          ].sort();
          const roomId = `${uids[0]}_${uids[1]}`;

          // Create/merge chat room document in Firestore
          await adminFirestore
            .collection("chat_rooms")
            .doc(roomId)
            .set(
              {
                participants: [
                  client.user.firebaseUid,
                  trainer.user.firebaseUid,
                ],
                participantNames: {
                  [client.user.firebaseUid]: client.user.name,
                  [trainer.user.firebaseUid]: trainer.user.name,
                },
                appointmentId: appointment.id,
                createdAt: new Date(),
                lastMessageAt: new Date(),
                type: "CHAT_APPOINTMENT",
              },
              { merge: true }
            );

          console.log(
            `Created chat room ${roomId} for appointment ${appointment.id}`
          );
        } else {
          console.warn(
            `Cannot create chat room: Missing firebaseUid for client ${clientId} or trainer ${trainerId}`
          );
        }
      } catch (firestoreError) {
        console.error("Error creating Firestore chat room:", firestoreError);
        // Don't fail the appointment creation if Firestore fails
      }
    }

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
