import { executeSQLQuery } from "../../database";

export const addMessage = async ({
  senderId,
  receiverId,
  message
}: {
  senderId: string;
  receiverId: string;
  message: string;
}) => {
  const query = `
    INSERT INTO messagesChat (sender_id, receiver_id, message, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `;
  const values = [senderId, receiverId, message];

  try {
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error sending message: " + error);
  }
};

export const getMessagesBetweenUsers = async (user1Id: string, user2Id: string) => {
  const query = `
    SELECT * FROM messagesChat
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `;

  try {
    const result = await executeSQLQuery(query, [user1Id, user2Id]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching messages: " + error);
  }
};

export const getMessagesForUser = async (userId: string) => {
  const query = `
    SELECT * FROM messagesChat
    WHERE receiver_id = $1
    ORDER BY created_at DESC
  `;
  const result = await executeSQLQuery(query, [userId]);
  return result.rows;
};


export const markMessagesAsRead = async (senderId: string, receiverId: string) => {
  const query = `
    UPDATE messagesChat
    SET is_read = TRUE
    WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE
  `;
  await executeSQLQuery(query, [senderId, receiverId]);
};

export const getUnreadCountForUser = async (userId: string) => {
  const query = `
    SELECT COUNT(*) AS unread_count
    FROM messagesChat
    WHERE receiver_id = $1 AND is_read = FALSE
  `;
  const result = await executeSQLQuery(query, [userId]);
  return result.rows[0].unread_count;
};

export const getUsersWithUnreadCount = async (currentUserId: string) => {
  const query = `
    SELECT u.user_id, u.user_name, u.user_email,
           COALESCE(SUM(CASE WHEN m.sender_id = u.user_id AND m.receiver_id = $1 AND is_read = FALSE THEN 1 ELSE 0 END), 0) AS unread_count
    FROM users u
    LEFT JOIN messagesChat m ON (m.sender_id = u.user_id AND m.receiver_id = $1)
    WHERE u.user_id != $1
    GROUP BY u.user_id, u.user_name, u.user_email
  `;
  const result = await executeSQLQuery(query, [currentUserId]);
  return result.rows;
};