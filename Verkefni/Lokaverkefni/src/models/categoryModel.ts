import { db } from "../config/db";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Category>("SELECT * FROM categories ORDER BY name");
  console.log("Categories fetched from database:", rows);
  return rows;
};
