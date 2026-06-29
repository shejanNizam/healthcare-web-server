import httpStatus from "http-status";
import { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { checkAuth } from "../../middlewares/checkAuth";
import { authLimiter, otpLimiter } from "../../middlewares/rateLimiter";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { UserAuthService } from "./user.auth.service";
import { UserRole } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);

/**
 * @swagger
 * /user/all-users:
 *   get:
 *     tags: [User]
 *     summary: Get all users (admin/super_admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — insufficient role
 */
router.get(
  "/all-users",
  checkAuth(UserRole.admin, UserRole.super_admin),
  UserControllers.getAllUsers,
);

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags: [User]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *   delete:
 *     tags: [User]
 *     summary: Soft-delete the authenticated user's own account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  UserControllers.getMe,
);

router.delete(
  "/me",
  checkAuth(...Object.values(UserRole)),
  UserControllers.deleteMe,
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by ID (admin/super_admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   patch:
 *     tags: [User]
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   delete:
 *     tags: [User]
 *     summary: Delete a user by ID (admin/super_admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  UserControllers.getSingleUser,
);

router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser,
);

router.delete(
  "/:id",
  checkAuth(UserRole.admin, UserRole.super_admin),
  UserControllers.deleteUser,
);

// ─── Healthcare-spec routes ───────────────────────────────────────────────────

// POST /user/signup → create pending_users + send OTP
router.post(
  "/signup",
  authLimiter,
  catchAsync(async (req: Request, res: Response) => {
    await UserAuthService.signup(req.body);
    sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "OTP sent to your email. Please verify.", data: null });
  }),
);

// POST /user/verify-email?email= → verify OTP → promote to users → issue tokens
router.post(
  "/verify-email",
  catchAsync(async (req: Request, res: Response) => {
    const email = (req.query.email || req.body.email) as string;
    const { otp } = req.body;
    const result = await UserAuthService.verifyEmail(email, otp);
    setAuthCookie(res, result);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Email verified successfully", data: result });
  }),
);

// POST /user/forget-password → send reset OTP
router.post(
  "/forget-password",
  authLimiter,
  catchAsync(async (req: Request, res: Response) => {
    await UserAuthService.forgetPassword(req.body.email);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OTP sent to your email", data: null });
  }),
);

// POST /user/verify-forget-otp → verify OTP → issue reset grant
router.post(
  "/verify-forget-otp",
  catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const data = await UserAuthService.verifyForgetOtp(email, otp);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OTP verified", data });
  }),
);

// POST /user/resend?email= → resend OTP
router.post(
  "/resend",
  otpLimiter,
  catchAsync(async (req: Request, res: Response) => {
    const email = (req.query.email || req.body.email) as string;
    await UserAuthService.resendOtp(email);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "OTP resent successfully", data: null });
  }),
);

// POST /user/reset-password → complete reset
router.post(
  "/reset-password",
  catchAsync(async (req: Request, res: Response) => {
    const { email, resetGrant, newPassword } = req.body;
    await UserAuthService.resetPassword(email, resetGrant, newPassword);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Password reset successfully", data: null });
  }),
);

// GET /user/my-profile → current user profile (alias for /me)
router.get(
  "/my-profile",
  checkAuth(...Object.values(UserRole)),
  UserControllers.getMe,
);

// POST /user/update → update own profile (name, phone, address, image)
router.post(
  "/update",
  checkAuth(...Object.values(UserRole)),
  catchAsync(async (req: Request, res: Response) => {
    const { _id } = req.user as JwtPayload;
    const data = await UserAuthService.updateMyProfile(_id, req.body);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Profile updated successfully", data });
  }),
);

export const UserRoutes = router;
