import { model, Schema } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, default: "system" },
    recipientRole: { type: String, required: true, default: "admin" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    referenceType: { type: String },
    referenceId: { type: String },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

notificationSchema.index({ recipientRole: 1, isRead: 1 });
notificationSchema.index({ userId: 1 });

export const Notification = model<INotification>("Notification", notificationSchema);
