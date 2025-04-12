import  { createStudentBooking }  from '../../services/calender/studentBookingService';

export const createBooking = async (req:any, res:any) => {
  const { studentId, tutorId, selectedDate } = req.body;
  try {
    await createStudentBooking(studentId, tutorId, selectedDate);
    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
