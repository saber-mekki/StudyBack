import { executeSQLQuery } from "../../database";
import { v4 as uuidv4 } from "uuid";

export const CreatePurchases = async (
  courseIds: string | string[], // ✅ accept single or array
  studentId: string,
  paypalOrderId: string,
  totalAmount: number
) => {
  const results = [];

  const ids = Array.isArray(courseIds) ? courseIds : [courseIds];

  const perCourseAmount = (totalAmount / ids.length).toFixed(2);

  for (const courseId of ids) {
    const query = `
      INSERT INTO course_purchases 
        (id, course_id, student_id, paypal_order_id, amount, status)
      VALUES ($1, $2, $3, $4, $5, 'completed')
      RETURNING *;
    `;
    const values = [
      uuidv4(),
      courseId,
      studentId,
      paypalOrderId,
      perCourseAmount,
    ];
    const result = await executeSQLQuery(query, values);
    results.push(result.rows[0]);
  }

  return results;
};

export const GetPurchasesByUser = async (studentId: string) => {
  const query = `
      SELECT c.*, cp.paypal_order_id, cp.amount, cp.status AS purchase_status, cp.id AS purchase_id
    FROM course_purchases cp
    JOIN courses c ON cp.course_id = c.id
    WHERE cp.student_id = $1
    ORDER BY cp.created_at DESC
  `;
  const result = await executeSQLQuery(query, [studentId]);
  return result.rows;
};
