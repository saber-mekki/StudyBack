import { executeSQLQuery } from "../../database";

export const addMessage = async ({
  tutorId,
  studentId,
  message
}: {
  tutorId: number;
  studentId: number;
  message: string;
}) => {
  const query = `
    INSERT INTO messagesChat (tutor_id, student_id, message, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `;
  const values = [tutorId, studentId, message];

  try {
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error sending message: " + error);
  }
};

export const getMessagesBetweenUsers = async (tutorId: number, studentId: number) => {
  const query = `
    SELECT * FROM messagesChat
    WHERE tutor_id = $1 AND student_id = $2
       OR tutor_id = $2 AND student_id = $1
    ORDER BY created_at ASC
  `;

  try {
    const result = await executeSQLQuery(query, [tutorId, studentId]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching messages: " + error);
  }
};
