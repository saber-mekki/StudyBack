import {getTutorAvailability, addTutorAvailability, updateTutorAvailability, removeTutorAvailability } from '../../services/calender/tutorAvailabilityService';


export const getAvailability = async ( req: any, res: any)=> {
  const { tutorId } = req.params;
  try {
    const availability = await getTutorAvailability(tutorId);
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAvailability = async ( req: any, res: any)=> {
  const { tutorId, availableDate } = req.body;
  try {
    await addTutorAvailability(tutorId, availableDate);
    res.status(201).json({ message: 'Availability added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAvailability = async ( req: any, res: any)=> {
  const { tutorId, availableDate, status } = req.body;
  try {
    await updateTutorAvailability(tutorId, availableDate, status);
    res.status(200).json({ message: 'Availability updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeAvailability = async ( req: any, res: any)=> {
  const { tutorId, availableDate } = req.body;
  try {
    await removeTutorAvailability(tutorId, availableDate);
    res.status(200).json({ message: 'Availability removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
