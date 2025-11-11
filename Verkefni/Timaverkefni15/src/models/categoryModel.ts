import pool from '../config/db.js';

export interface Category {
  name: string;
}

export const createCategory = async (
  category: Category
): Promise<Category[]> => {
  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [category.name]
    );
    return result;
  } catch (e: any) {
    console.log(e.message);
    throw new Error(e as string);
  }
};
