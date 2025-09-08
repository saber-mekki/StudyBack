import { Request, Response } from "express";
import { CreatePurchases, GetPurchasesByUser } from "../../services/purchases";

export const CreatePurchaseController = async (req: Request, res: Response) => {
  try {
    const { courseId, studentId, paypalOrderId, amount } = req.body;
    if (!courseId || !studentId || !paypalOrderId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const purchase = await CreatePurchases(courseId, studentId, paypalOrderId, amount);
    res.status(201).json({ success: true, purchase });
  } catch (err) {
    console.error("Error creating purchase:", err);
    res.status(500).json({ success: false, error: "Failed to record purchase" });
  }
};

export const GetPurchasesByUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // student id
    const purchases = await GetPurchasesByUser(id);
    res.status(200).json({ success: true, purchases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch purchases" });
  }
};
