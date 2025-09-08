import { Request, Response } from "express";
import * as announcementService from "../../services/announcements";
import { executeSQLQuery } from "../../database";

export const sendAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, recipientType, userIds } = req.body;

    const result = await announcementService.createAnnouncement({
      title,
      content,
      recipientType,
      userIds: userIds ? JSON.parse(userIds) : undefined,
      pdf: req.file,
    });

console.log({result})
const announcement = result[0];
    res.status(201).json(announcement);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to send announcement" });
  }
};

export const getUserAnnouncements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { userType } = req.query; // student | tutor | admin

    const announcements = await announcementService.getAnnouncementsForUser(
      userId,
      userType as "student" | "tutor" | "admin"
    );

    res.json(announcements.rows);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

export const getAnnouncementsCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { userType } = req.query;

    const announcements = await announcementService.getAnnouncementsForUser(
      userId,
      userType as "student" | "tutor" | "admin"
    );

    res.json({ count: announcements.rows.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcements count" });
  }
};

export const markAnnouncementAsRead = async (req: Request, res: Response) => {
  try {
    const { announcementId, userId } = req.body;
   //announcementId not existe in the table 
 const test=   await executeSQLQuery(
      `UPDATE announcement_users SET is_read = true WHERE announcement_id = $1 AND user_id = $2 `,
      [announcementId, userId]
    );

    res.json({test, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { userType } = req.query;

    const count = await announcementService.getUnreadAnnouncementsCount(userId, userType as any);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get unread count" });
  }
};
