import { Document, Types } from "mongoose";

export enum PaymentStatus {
  pending = "pending",
  completed = "completed",
  failed = "failed",
  refunded = "refunded",
}

export interface IPaymentInitial {
  _id?: Types.ObjectId;
  amount: number;
  currency: string;
  type: string;
  status: PaymentStatus;
  payerUserId?: Types.ObjectId;
  relatedType?: string;
  relatedId?: string;
  reference?: string;
  isDeleted: boolean;
}

export type IPayment = IPaymentInitial & Document;
