import db from '../config/db.js';

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export type UserTokenPayload = {
  sub: number;
  role: UserRole;
};

export type CreateUser = Pick<User, 'email' | 'password_hash' | 'role'>;

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
};

export const createUser = async (user: CreateUser): Promise<User> => {
  return await db.one(
    'INSERT INTO USERS (email, password_hash, role) VALUES($1, $2, $3) RETURNING id, email, role, created_at, updated_at',
    [user.email, user.password_hash, user.role]
  );
};
