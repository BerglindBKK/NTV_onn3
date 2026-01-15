import db from "../config/db.js";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Category>("SELECT * FROM categories ORDER BY name");
  return rows;
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  const row = await db.oneOrNone<Category>(
    "SELECT * FROM categories WHERE id=$1",
    [id]
  );
  return row;
};
