import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin.js";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    emailVerified?: boolean;
  };
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await adminAuth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
