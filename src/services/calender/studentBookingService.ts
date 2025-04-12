import { executeSQLQuery } from "../../database";

export const createStudentBooking = async (studentId:any, tutorId:any, selectedDate:any) => {
  await executeSQLQuery(
    'INSERT INTO student_bookings (student_id, tutor_id, booking_date) VALUES ($1, $2, $3)',
    [studentId, tutorId, selectedDate]
  );
};
