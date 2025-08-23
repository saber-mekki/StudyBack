import express from "express";
import { CreatePurchaseController, GetPurchasesByUserController } from "../../controllers/purchases";

const router = express.Router();

/**
 * @route POST /api/purchases
 * @desc Record a course purchase
 */
router.post("/purchases", CreatePurchaseController);

/**
 * @route GET /api/purchases/user/:id
 * @desc Get all purchases for a student
 */
router.get("/purchases/user/:id", GetPurchasesByUserController);

export default router;
