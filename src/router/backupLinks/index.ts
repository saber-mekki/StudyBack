import express from "express";
import { getBackupLinkController } from "../../controllers/backupLinks";

const router = express.Router();

router.get("/backup-link", getBackupLinkController);


export default router;
