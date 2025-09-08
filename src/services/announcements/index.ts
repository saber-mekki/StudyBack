import { executeSQLQuery } from "../../database";
import { uploadPdfToS3 } from "./s3";
interface AnnouncementInput {
    title: string;
    content: string;
    recipientType: "all" | "students" | "tutors" | "custom";
    userIds?: string[];
    pdf?: Express.Multer.File;
  }
  
  export const createAnnouncement = async (input: AnnouncementInput) => {
    let pdfUrl: string | null = null;
    if (input.pdf) {
      pdfUrl = await uploadPdfToS3(input.pdf);
    }
  
    // Insérer l’annonce
    const insertQuery = `
      INSERT INTO announcements (title, content, recipient_type, pdf_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  
    const result:any = await executeSQLQuery(insertQuery, [
      input.title,
      input.content,
      input.recipientType,
      pdfUrl,
    ]);
    const announcement = result.rows[0]
  
    if (input.recipientType === "custom" && input.userIds?.length) {
      const insertUserQuery = `
        INSERT INTO announcement_users (announcement_id, user_id)
        VALUES ($1, $2)
      `;
  
      for (const userId of input.userIds) {
        await executeSQLQuery(insertUserQuery, [announcement.id, userId]);
      }
    }
  
    return announcement;
  };


  export const getAnnouncementsForUser = async (
    userId: string,
    userType: "student" | "tutor" | "admin"
  ) => {
    const query = `
      SELECT a.*, au.is_read
      FROM announcements a
      LEFT JOIN announcement_users au ON a.id = au.announcement_id AND au.user_id = $1
      WHERE a.recipient_type = 'all'
         OR (a.recipient_type = 'students' AND $2 = 'student')
         OR (a.recipient_type = 'tutors' AND $2 = 'tutor')
         OR (a.recipient_type = 'custom' AND au.user_id = $1)
      ORDER BY a.created_at DESC
    `;
  
    return await executeSQLQuery(query, [userId, userType]);
  };
  
  export const getUnreadAnnouncementsCount = async (userId: string, userType: "student" | "tutor" | "admin") => {
    const query = `
      SELECT COUNT(*) as count
      FROM announcements a
      LEFT JOIN announcement_users au ON a.id = au.announcement_id AND au.user_id = $1
      WHERE (
        a.recipient_type = 'all'
        OR (a.recipient_type = 'students' AND $2 = 'student')
        OR (a.recipient_type = 'tutors' AND $2 = 'tutor')
        OR (a.recipient_type = 'custom' AND au.user_id = $1)
      )
      AND (au.is_read = false OR au.is_read IS NULL)
    `;
  
    const result = await executeSQLQuery(query, [userId, userType]);
    return result.rows[0].count;
  };