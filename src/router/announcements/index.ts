import { Router } from "express";
import multer from "multer";
import { sendAnnouncement, getUserAnnouncements,getUnreadCount ,markAnnouncementAsRead} from "../../controllers/announcements";

const upload = multer(); 
const router = Router();

router.post("/announcements/send", upload.single("pdf"), sendAnnouncement);
router.get("/announcements/:userId", getUserAnnouncements);
router.post("/announcements/read", markAnnouncementAsRead);
router.get("/announcements/:userId/unread/count", getUnreadCount);

export default router;