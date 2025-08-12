import { executeSQLQuery } from "../../database";


export const getNotificationsByUserId = async (userId:any) => {
    const result = await executeSQLQuery(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};


export const markNotificationAsRead = async (id: any): Promise<boolean> => {
    const result:any = await executeSQLQuery(
      `UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rowCount > 0;
  };

  export const deleteNotificationById = async (id: any): Promise<boolean> => {
    const result: any = await executeSQLQuery(
      `DELETE FROM notifications WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rowCount > 0;
  };
  