import { model, Schema } from "mongoose";
import { ICharge } from "./charge.interface";

const chargeSchema = new Schema<ICharge>(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    period: { type: String },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const Charge = model<ICharge>("Charge", chargeSchema);
