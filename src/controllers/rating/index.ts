import { Request, Response } from "express";
import { addRating, getTutorAverageRating } from "../../services/rating";

export const addRatingController = async (req: Request, res: Response) => {
  const { tutorId, studentId, rating, comment } = req.body;

  if (!tutorId || !studentId || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newRating = await addRating({ tutorId, studentId, rating, comment });
    res.status(201).json(newRating);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTutorRatingController = async (req: Request, res: Response) => {
  const tutorId = req.params.tutorId

  if (!tutorId) {
    return res.status(400).json({ message: "Invalid tutor ID" });
  }

  try {
    const ratingData = await getTutorAverageRating(tutorId);
    res.json(ratingData);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
