import { model, Schema } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    type: { type: String, required: true },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.completed },
    payerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    relatedType: { type: String },
    relatedId: { type: String },
    reference: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ payerUserId: 1 });

export const Payment = model<IPayment>("Payment", paymentSchema);
