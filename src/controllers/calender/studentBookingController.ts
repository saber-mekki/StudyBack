import  { createStudentBooking ,getPendingBookings,acceptBooking,declineBooking, getAllBookings,updateBooking}  from '../../services/calender/studentBookingService';

export const createBooking = async (req:any, res:any) => {
  const { studentId, tutorId, selectedDate, name, message } = req.body;
  try {
    await createStudentBooking(studentId, tutorId, selectedDate, name, message);
   
    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    console.log({error})
    res.status(500).json({ message: 'Server error' });
  }
};



export const getAllBookingsController = async (req:any, res:any) => {
  const { user_id } = req.params;
    const { itsTutor } = req.query;
  try {
    const bookings = await getAllBookings(user_id,itsTutor);
    res.json(bookings);
  } catch (error:any) {
    res.status(500).json({ message: 'Error retrieving pending bookings', error: error.message });
  }
};
export const getPendingBookingsController = async (req:any, res:any) => {
  const { tutorId } = req.params;
  try {
    const bookings = await getPendingBookings(tutorId);
    res.json(bookings);
  } catch (error:any) {
    res.status(500).json({ message: 'Error retrieving pending bookings', error: error.message });
  }
};

export const acceptBookingController = async (req:any, res:any) => {
  const { bookingId } = req.body;
  try {
    await acceptBooking(bookingId);
    res.json({ message: 'Booking accepted' });
  } catch (error:any) {
    res.status(500).json({ message: 'Error accepting booking', error: error.message });
  }
};

export const declineBookingController = async (req:any, res:any) => {
  const { bookingId } = req.body;
  try {
    await declineBooking(bookingId);
    res.json({ message: 'Booking declined' });
  } catch (error:any) {
    res.status(500).json({ message: 'Error declining booking', error: error.message });
  }
};

export const updateBookingController = async (req: any, res: any) => {
  const { bookingId, liveLink, selectedDate, status, message } = req.body;
  try {
    await updateBooking(bookingId, { liveLink, selectedDate, status, message });
    res.json({ message: 'Booking updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};
