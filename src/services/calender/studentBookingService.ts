import { executeSQLQuery } from "../../database";

export const createStudentBooking = async (studentId:any, tutorId:any, selectedDate:any, name:any, message:any ) => {
  await executeSQLQuery(
    'INSERT INTO student_bookings (user_id , tutor_id, booking_date,status,name,message) VALUES ($1, $2, $3,$4,$5,$6)',
    [studentId, tutorId, selectedDate,'pending',name,message]
  );
};


export const getAllBookings = async (tutorId:any) => {
  const result = await executeSQLQuery(
    `SELECT id, tutor_id, user_id, booking_date, status ,name, message
     FROM student_bookings
     WHERE user_id = $1 `,
    [tutorId]
  );
  return result.rows;
};

export const getPendingBookings = async (tutorId:any) => {
  const result = await executeSQLQuery(
    `SELECT id, tutor_id, user_id, booking_date, status ,name, message
     FROM student_bookings
     WHERE tutor_id = $1 AND status = 'pending'`,
    [tutorId]
  );
  return result.rows;
};

export const acceptBooking = async (bookingId:any) => {
  const result = await executeSQLQuery(
    `UPDATE student_bookings SET status = 'accepted' WHERE id = $1 RETURNING *`,
    [bookingId]
  );
  const studentId = result.rows[0].user_id;
  const message = `Your booking has been accepted!`;
  await executeSQLQuery(
    'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
    [studentId, 'booking_accepted', message]
  )
};

export const declineBooking = async (bookingId:any) => {
  await executeSQLQuery(
    `UPDATE student_bookings SET status = 'declined' WHERE id = $1`,
    [bookingId]
  );
};