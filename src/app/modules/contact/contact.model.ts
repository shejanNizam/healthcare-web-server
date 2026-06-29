import { model, Schema } from "mongoose";
import { ContactStatus, IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(ContactStatus), default: ContactStatus.new },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const Contact = model<IContact>("Contact", contactSchema);
