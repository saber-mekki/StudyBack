import { Request, Response } from "express";
import { addMessage, getMessagesBetweenUsers } from "../../services/messages";

export const addMessageController = async (req: Request, res: Response) => {
  const { tutorId, studentId, message } = req.body;

  if (!tutorId || !studentId || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newMessage = await addMessage({ tutorId, studentId, message });
    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesController = async (req: Request, res: Response) => {
  const { tutorId, studentId } = req.params;

  if (!tutorId || !studentId) {
    return res.status(400).json({ message: "Invalid tutor or student ID" });
  }

  try {
    const messages = await getMessagesBetweenUsers(Number(tutorId), Number(studentId));
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
