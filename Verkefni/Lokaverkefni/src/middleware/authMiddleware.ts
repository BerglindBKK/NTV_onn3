import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserTokenPayload } from "../models/userModel";

// Load the secret used to verify JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;

//if something is wrong, throw immediatelly
if (!JWT_SECRET) {
  throw Error("Missing JWT_SECRET in environment");
}

export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract "Authorization: Bearer <token>"
    const authHeader = request.headers["authorization"];
    // Extract the token after "Bearer ". If no header or incorrect, token will be undefined
    const token = authHeader && authHeader.split("Bearer ")[1];
    if (!token) {
      response.status(401).json({ error: "Missing token." });
      return;
    }

    // Decode and verify token
    const decodedToken = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as UserTokenPayload;

    // Attach user ID to the request object
    request.user = {
      id: decodedToken.sub,
    };

    next();
  } catch (error) {
    // handles invalid or expired tokens
    if (error instanceof jwt.JsonWebTokenError) {
      response.status(403).json({ error: "Aðgangur óheimill: Ógilt token..." });
      return;
    }
    throw error;
  }
};
