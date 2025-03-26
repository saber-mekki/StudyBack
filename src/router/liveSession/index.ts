import express from "express";
import multer from "multer";
import {uploadVideo,joinSessionController, createSession, listSessions, closeSession } from "../../controllers/liveSession";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-video", upload.single("video"), uploadVideo);
router.post("/start", createSession);
router.post("/join", joinSessionController);
router.get("/", listSessions);
router.post("/end", closeSession);

export default router;
