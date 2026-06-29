import { Document, Types } from "mongoose";

export enum ContactStatus {
  new = "new",
  read = "read",
  archived = "archived",
}

export interface IContactInitial {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  description: string;
  status: ContactStatus;
  isDeleted: boolean;
}

export type IContact = IContactInitial & Document;
