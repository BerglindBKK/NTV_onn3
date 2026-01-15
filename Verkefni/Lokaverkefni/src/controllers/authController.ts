import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  CreateUser,
  findUserByEmail,
  UserTokenPayload,
} from "../models/userModel.js";

//signin JWT tokens - chrashes immediately if the key is missing
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw Error("Missing JWT_SECRET in environment");
}
//rounds of hashing
const SALT_ROUNDS = 12;

// saves the new user and returns th information without the hashed password
export const signup = async (request: Request, response: Response) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return response.status(400).json({
      error: "Name, email and/or password missing",
    });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return response.status(409).json({
      error: "Email already in use",
    });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser: CreateUser = {
    name,
    email,
    password_hash: hashedPassword,
  };

  // insert into DB
  const savedUser = await createUser(newUser);

  // return only safe fields
  return response.status(201).json({
    id: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
    created_at: savedUser.created_at,
    updated_at: savedUser.updated_at,
  });
};

// logs in user and returns a token
export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return response.status(400).json({
      error: "Email or password missing",
    });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return response.status(401).json({ error: "Wrong email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return response.status(401).json({ error: "Wrong email or password" });
  }

  //creates a signed token
  const payload: UserTokenPayload = {
    sub: user.id,
  };

  // valid for an hour
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  //returns the token
  response.status(200).json({ token });
};
