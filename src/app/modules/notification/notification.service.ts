import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Notification } from "./notification.model";

export const createNotification = async (payload: {
  title: string;
  message: string;
  type: string;
  referenceType?: string;
  referenceId?: string;
  recipientRole?: string;
}) => {
  return Notification.create({
    ...payload,
    recipientRole: payload.recipientRole ?? "admin",
  });
};

const getAdminNotifications = async (query: Record<string, string>) => {
  const baseQuery = Notification.find({ recipientRole: "admin", isDeleted: false });
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

const markRead = async (id: string) => {
  const n = await Notification.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isRead: true },
    { returnDocument: "after" },
  );
  if (!n) throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
  return n;
};

export const NotificationServices = { createNotification, getAdminNotifications, markRead };
