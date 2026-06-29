import { Document, Types } from "mongoose";

export interface IChargeInitial {
  _id?: Types.ObjectId;
  name: string;
  amount: number;
  currency: string;
  period?: string;
  isActive: boolean;
  updatedBy?: Types.ObjectId;
}

export type ICharge = IChargeInitial & Document;
