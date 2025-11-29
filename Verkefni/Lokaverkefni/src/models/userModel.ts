import db from "../config/db.js";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export type UserTokenPayload = {
  sub: number;
};

export type CreateUser = Pick<User, "email" | "password_hash" | "name">;

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);
};

export const createUser = async (user: CreateUser): Promise<User> => {
  return await db.one(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at",
    [user.email, user.name, user.password_hash]
  );
};
