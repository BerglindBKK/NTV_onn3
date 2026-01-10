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

export type UpdateUserInput = {
  id: number;
  name: string | null;
  email: string | null;
  password_hash: string | null;
};

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

export const updateUser = async (data: UpdateUserInput) => {
  const { id, name, email, password_hash } = data;
  return await db.one(
    `UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      password_hash = COALESCE($3, password_hash),
      updated_at = NOW()
    WHERE id = $4
    RETURNING id, name, email, created_at, updated_at;
`,
    [name, email, password_hash, id]
  );
};
