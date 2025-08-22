import { Request, Response } from "express";
import { getMessagesForUser, addMessage, getMessagesBetweenUsers, getUnreadCountForUser, markMessagesAsRead, getUsersWithUnreadCount } from "../../services/messages";

export const getMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const messages = await getMessagesForUser(userId);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessageController = async (req: Request, res: Response) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newMessage = await addMessage({ senderId, receiverId, message });
    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const getConversationBetweenUsers = async (req: Request, res: Response) => {
  const { user1Id, user2Id } = req.params;

  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  try {
    const messages = await getMessagesBetweenUsers(user1Id, user2Id);
    await markMessagesAsRead(user2Id, user1Id);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const count = await getUnreadCountForUser(userId);
    res.json({ unreadCount: count });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getUsersWithUnread = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const users = await getUsersWithUnreadCount(userId);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
