import { model, Schema } from "mongoose";
import { IValue, ValueGroup } from "./value.interface";

const valueSchema = new Schema<IValue>(
  {
    group: { type: String, enum: Object.values(ValueGroup), required: true },
    label: { type: String, required: true },
    logo: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

valueSchema.index({ group: 1, label: 1 }, { unique: true });
valueSchema.index({ group: 1, isDeleted: 1 });

export const Value = model<IValue>("Value", valueSchema);
