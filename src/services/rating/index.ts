import { executeSQLQuery } from "../../database";

export const addRating = async ({
    tutorId,
  studentId,
  rating,
  comment
}: {
    tutorId: any;
    studentId: any;
  rating: any;
  comment?: string;
}) => {
  
  const query = `
    INSERT INTO tutor_ratings (tutor_id, student_id, rating, comment, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
  `;
  const values = [tutorId, studentId, rating, comment ?? null];

  try {
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error adding rating: " + error);
  }
};

export const getTutorAverageRating = async (tutor_id: any) => {
  const query = `
    SELECT 
      AVG(rating)::numeric(10,2) AS average_rating,
      COUNT(*) AS total_reviews
    FROM tutor_ratings
    WHERE tutor_id = $1
  `;
  try {
    const result = await executeSQLQuery(query, [tutor_id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error fetching average rating: " + error);
  }
};
