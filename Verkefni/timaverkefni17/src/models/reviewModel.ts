import db from "../config/db.js";

export interface Review {
  id?: number;
  rating: number;
  comment?: string;
  movie_id: number;
  user_id: number;
  created_at?: Date;
}

export interface ReviewWithUser extends Review {
  user_email: string;
}

export const createReview = async (review: Review): Promise<Review> => {
  return await db.one(
    "INSERT INTO reviews (rating, comment, movie_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [review.rating, review.comment, review.movie_id, review.user_id]
  );
};

export const getReviewsByMovieId = async (
  movieId: number
): Promise<ReviewWithUser[]> => {
  return await db.query(
    `SELECT
      reviews.id,
      reviews.rating,
      reviews.comment,
      reviews.movie_id,
      reviews.user_id,
      reviews.created_at,
      users.email as user_email
    FROM reviews
    LEFT JOIN users ON reviews.user_id = users.id
    WHERE reviews.movie_id = $1
    ORDER BY reviews.created_at DESC`,
    [movieId]
  );
};
