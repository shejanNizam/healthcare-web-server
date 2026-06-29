import { model, Schema } from "mongoose";

export interface IPendingUser {
  email: string;
  name: string;
  password: string;
  role: string;
  expiresAt: Date;
}

const pendingUserSchema = new Schema<IPendingUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Auto-purge after expiresAt (MongoDB TTL index)
pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingUser = model<IPendingUser>("PendingUser", pendingUserSchema);
