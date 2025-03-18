import express from "express";
import {joinSessionController, createSession, listSessions, closeSession } from "../../controllers/liveSession";

const router = express.Router();

router.post("/start", createSession);
router.post("/join", joinSessionController);
router.get("/", listSessions);
router.post("/end", closeSession);

export default router;
