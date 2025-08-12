import { Request, Response } from 'express';
import {markNotificationAsRead,getNotificationsByUserId,deleteNotificationById} from '../../services/notification';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const notifications = await getNotificationsByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const notificationId = req.params.id;

  try {
    const updated = await markNotificationAsRead(notificationId);
    if (!updated) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error marking notification as read' });
  }
};


export const deleteNotification = async (req: Request, res: Response) => {
  const notificationId = req.params.id;

  try {
    const deleted = await deleteNotificationById(notificationId);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Error deleting notification' });
  }
};