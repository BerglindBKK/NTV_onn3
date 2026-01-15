import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import {
  updateUser,
  findUserByEmail,
  cancelAllBookingsAndDeleteUser,
} from "../models/userModel.js";

//rounds of hashing
const SALT_ROUNDS = 12;

//update user profile
export const updateUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //user must be authenticated, fetches user id
    const userId = req.user?.id;

    // middleware checks user's authorarization,
    // verifies JWT signatures and
    // extracts id from token and attaches userId to req.user
    // If user.id.id is missing, the user is not authenticated
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    //fetches fields the user wishes to update
    const { name, email, password } = req.body;

    //checks if at least one field is provided
    if (name === undefined && email === undefined && password === undefined) {
      res.status(400).json({
        error: "At least one field must be provided",
      });
      return;
    }

    // check if user wishes to update name
    if (name !== undefined && typeof name !== "string") {
      res.status(400).json({ error: "Invalid name" });
      return;
    }

    // check if user wishes to update email
    if (email !== undefined) {
      if (typeof email !== "string") {
        res.status(400).json({ error: "Invalid email" });
        return;
      }

      // if yes - checks if email is already being used by another user
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    // check if user wishes to update password
    if (password !== undefined && typeof password !== "string") {
      res.status(400).json({ error: "Invalid password" });
      return;
    }
    // hashes password
    let passwordHash: string | null = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    // calls the model to update the database
    const updatedUser = await updateUser({
      id: userId,
      name: name ?? null,
      email: email ?? null,
      password_hash: passwordHash,
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const cancelAllBookingsAndDeleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //user must be authenticated, fetches user id
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    //cancel all bookings for user and delete profile
    await cancelAllBookingsAndDeleteUser(userId);
    res.status(200).json({ message: "Userprofile deleted successfully" });
  } catch (error: any) {
    const msg = error?.message;

    if (msg === "User not found") {
      res.status(404).json({ error: msg });
      return;
    }
    next(error);
  }
};
