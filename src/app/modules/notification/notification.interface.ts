import { Document, Types } from "mongoose";

export enum NotificationType {
  newApplication = "new_application",
  newContact = "new_contact",
  system = "system",
}

export interface INotificationInitial {
  _id?: Types.ObjectId;
  title: string;
  message: string;
  type: string;
  recipientRole: string;
  userId?: Types.ObjectId;
  referenceType?: string;
  referenceId?: string;
  isRead: boolean;
  isDeleted: boolean;
}

export type INotification = INotificationInitial & Document;
