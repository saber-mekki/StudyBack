import { executeSQLQuery } from "../../database";

export const createStudentBooking = async (studentId: any, tutorId: any, selectedDate: any, name: any, message: any) => {
  await executeSQLQuery(
    'INSERT INTO student_bookings (user_id , tutor_id, booking_date,status,name,message) VALUES ($1, $2, $3,$4,$5,$6)',
    [studentId, tutorId, selectedDate, 'pending', name, message]
  );
  const notifMessage = `${name} book a date to get a cours at ${selectedDate}`;
  await executeSQLQuery(
    'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
    [tutorId, 'calendar', notifMessage]
  )
};


export const getAllBookings = async (tutorId: any, itsTutor: any) => {

  const result = await executeSQLQuery(
    `SELECT id, tutor_id, user_id, booking_date, status ,live_link,name, message
     FROM student_bookings
     WHERE ${itsTutor === 'true' ? 'tutor_id = $1' : 'user_id = $1'} `,
    [tutorId]
  );
  return result.rows;
};

export const getPendingBookings = async (tutorId: any) => {
  const result = await executeSQLQuery(
    `SELECT id, tutor_id, user_id, booking_date, status ,name, message
     FROM student_bookings
     WHERE tutor_id = $1 AND status = 'pending'`,
    [tutorId]
  );
  return result.rows;
};

export const acceptBooking = async (bookingId: any) => {
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

export const declineBooking = async (bookingId: any) => {
  await executeSQLQuery(
    `UPDATE student_bookings SET status = 'declined' WHERE id = $1`,
    [bookingId]
  );
};
export const updateBooking = async (
  bookingId: number,
  fields: {
    liveLink?: string;
    selectedDate?: string;
    status?: string;
    message?: string;
  }
) => {
  const updates = [];
  const values: any[] = [];
  let i = 1;

  if (fields.liveLink !== undefined) {
    updates.push(`live_link = $${i++}`);
    values.push(fields.liveLink);
  }
  if (fields.selectedDate) {
    updates.push(`booking_date = $${i++}`);
    values.push(fields.selectedDate);
  }
  if (fields.status) {
    updates.push(`status = $${i++}`);
    values.push(fields.status);
  }
  if (fields.message) {
    updates.push(`message = $${i++}`);
    values.push(fields.message);
  }

  if (updates.length === 0) return;

  values.push(bookingId);
  console.log({ bookingId })
  const query = `
    UPDATE student_bookings
    SET ${updates.join(', ')}
    WHERE id = $${i}
  `;

  await executeSQLQuery(query, values);


  if (fields.liveLink !== undefined) {
    const result = await executeSQLQuery(
      `SELECT user_id FROM student_bookings WHERE id = $1`,
      [bookingId]
    );

    const studentId = result.rows[0]?.user_id;

    if (studentId) {
      await executeSQLQuery(
        `INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)`,
        [studentId, `${fields.liveLink === "" ? 'live_started' : 'live_s'}`, `${fields.liveLink === "" ? 'Your tutor has stopped the live session. Click to join.' : 'Your tutor has started a live session. Click to join.'}`]
      );
    }
  }
};
