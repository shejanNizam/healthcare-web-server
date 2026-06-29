import bcrypt from "bcrypt";
import crypto from "crypto";
import httpStatus from "http-status";
import { configs } from "../../config/index";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { createUserTokens } from "../../utils/userTokens";
import { UserRole } from "./user.interface";
import { PendingUser } from "./pending_user.model";
import { User } from "./user.model";

const OTP_TTL = 10 * 60;
const OTP_MAX_ATTEMPTS = 5;

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const otpKey = (purpose: string, email: string) => `otp:${purpose}:${email}`;
const attemptsKey = (purpose: string, email: string) => `otp:attempts:${purpose}:${email}`;

// ─── Signup ──────────────────────────────────────────────────────────────────

const signup = async (payload: { name: string; email: string; password: string }) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new AppError(httpStatus.CONFLICT, "Email already in use");

  const hashedPassword = await bcrypt.hash(payload.password, Number(configs.bcrypt_salt_round));

  await PendingUser.findOneAndUpdate(
    { email: payload.email },
    {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    { upsert: true, runValidators: true },
  );

  const otp = generateOtp();
  await redisClient.set(otpKey("register", payload.email), otp, { expiration: { type: "EX", value: OTP_TTL } });
  await redisClient.del([attemptsKey("register", payload.email)]);

  await sendEmail({
    to: payload.email,
    subject: "Verify Your Email",
    templateName: "otp",
    templateData: { name: payload.name, otp },
  });
};

// ─── Verify email (promote pending → user, issue tokens) ─────────────────────

const verifyEmail = async (email: string, otp: string) => {
  const pending = await PendingUser.findOne({ email });
  if (!pending) throw new AppError(httpStatus.NOT_FOUND, "No pending registration found for this email");

  const attempts = await redisClient.get(attemptsKey("register", email));
  if (Number(attempts) >= OTP_MAX_ATTEMPTS) {
    throw new AppError(httpStatus.TOO_MANY_REQUESTS, "Too many failed attempts. Please sign up again.");
  }

  const savedOtp = await redisClient.get(otpKey("register", email));
  if (!savedOtp) throw new AppError(httpStatus.GONE, "OTP expired. Please request a new one.");

  if (savedOtp !== otp) {
    const newAttempts = await redisClient.incr(attemptsKey("register", email));
    if (newAttempts === 1) await redisClient.expire(attemptsKey("register", email), OTP_TTL);
    const remaining = OTP_MAX_ATTEMPTS - newAttempts;
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      remaining > 0
        ? `Invalid OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
        : "Too many failed attempts.",
    );
  }

  const validRole = Object.values(UserRole).includes(pending.role as UserRole)
    ? (pending.role as UserRole)
    : UserRole.user;

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    role: validRole,
    isEmailVerified: true,
  });

  await Promise.all([
    PendingUser.deleteOne({ email }),
    redisClient.del([otpKey("register", email)]),
    redisClient.del([attemptsKey("register", email)]),
  ]);

  const tokens = createUserTokens(user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userObj = (user as any).toObject() as Record<string, unknown>;
  delete userObj.password;

  return { user: userObj, ...tokens };
};

// ─── Forget password (send OTP) ──────────────────────────────────────────────

const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (user.status === "blocked") throw new AppError(httpStatus.FORBIDDEN, "Account is blocked");

  const otp = generateOtp();
  await redisClient.set(otpKey("forget-password", email), otp, { expiration: { type: "EX", value: OTP_TTL } });
  await redisClient.del([attemptsKey("forget-password", email)]);

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    templateName: "otp",
    templateData: { name: user.name, otp },
  });
};

// ─── Verify forget-password OTP ──────────────────────────────────────────────

const verifyForgetOtp = async (email: string, otp: string) => {
  const attempts = await redisClient.get(attemptsKey("forget-password", email));
  if (Number(attempts) >= OTP_MAX_ATTEMPTS) {
    throw new AppError(httpStatus.TOO_MANY_REQUESTS, "Too many failed attempts. Please request a new OTP.");
  }

  const savedOtp = await redisClient.get(otpKey("forget-password", email));
  if (!savedOtp) throw new AppError(httpStatus.GONE, "OTP expired. Please request a new one.");

  if (savedOtp !== otp) {
    const newAttempts = await redisClient.incr(attemptsKey("forget-password", email));
    if (newAttempts === 1) await redisClient.expire(attemptsKey("forget-password", email), OTP_TTL);
    const remaining = OTP_MAX_ATTEMPTS - newAttempts;
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      remaining > 0 ? `Invalid OTP. ${remaining} remaining.` : "Too many failed attempts.",
    );
  }

  // Issue a short-lived reset grant stored in Redis
  const resetGrant = crypto.randomBytes(32).toString("hex");
  await redisClient.set(`reset-grant:${email}`, resetGrant, { expiration: { type: "EX", value: 15 * 60 } });
  await redisClient.del([otpKey("forget-password", email)]);
  await redisClient.del([attemptsKey("forget-password", email)]);

  return { resetGrant };
};

// ─── Reset password ───────────────────────────────────────────────────────────

const resetPassword = async (email: string, resetGrant: string, newPassword: string) => {
  const storedGrant = await redisClient.get(`reset-grant:${email}`);
  if (!storedGrant || storedGrant !== resetGrant) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired reset grant");
  }

  const user = await User.findOne({ email, isDeleted: false }).select("+password");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  user.password = await bcrypt.hash(newPassword, Number(configs.bcrypt_salt_round));
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();

  await redisClient.del([`reset-grant:${email}`]);
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────

const resendOtp = async (email: string) => {
  const pending = await PendingUser.findOne({ email });
  const user = pending ? null : await User.findOne({ email, isDeleted: false, isEmailVerified: false });

  if (!pending && !user) {
    throw new AppError(httpStatus.NOT_FOUND, "No unverified account found for this email");
  }

  const name = pending ? pending.name : user!.name;
  const purpose = pending ? "register" : "register";

  const otp = generateOtp();
  await redisClient.set(otpKey(purpose, email), otp, { expiration: { type: "EX", value: OTP_TTL } });
  await redisClient.del([attemptsKey(purpose, email)]);

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: { name, otp },
  });
};

// ─── Update own profile ───────────────────────────────────────────────────────

const updateMyProfile = async (userId: string, payload: { name?: string; phone?: string; address?: string; avatar?: { url: string; publicId: string } }) => {
  const user = await User.findByIdAndUpdate(userId, payload, { returnDocument: "after", runValidators: true });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

export const UserAuthService = {
  signup,
  verifyEmail,
  forgetPassword,
  verifyForgetOtp,
  resetPassword,
  resendOtp,
  updateMyProfile,
};
