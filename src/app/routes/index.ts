import { Router } from "express";
import { ApplyRoutes } from "../modules/apply/apply.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BannerRoutes } from "../modules/banner/banner.route";
import { BlogRoutes } from "../modules/blog/blog.route";
import { ChargeRoutes } from "../modules/charge/charge.route";
import { CommunityRoutes } from "../modules/community/community.route";
import { ContactRoutes } from "../modules/contact/contact.route";
import { ContentRoutes } from "../modules/content/content.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";
import { DeviceTokenRoutes } from "../modules/device_token/device_token.route";
import { FeedbackRoutes } from "../modules/feedback/feedback.route";
import { JobPostRoutes } from "../modules/job_post/job_post.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { StaffingRoutes } from "../modules/staffing/staffing.route";
import { UploadRoutes } from "../modules/upload/upload.route";
import { UserRoutes } from "../modules/user/user.route";
import { ValueRoutes } from "../modules/value/value.route";

const router = Router();

const moduleRoutes = [
  // Auth & User
  { path: "/auth", route: AuthRoutes },
  { path: "/user", route: UserRoutes },
  { path: "/otp", route: OtpRoutes },
  { path: "/device-token", route: DeviceTokenRoutes },

  // File upload
  { path: "/uploded", route: UploadRoutes },  // legacy path per spec
  { path: "/upload", route: UploadRoutes },   // clean path alias

  // Values / dropdowns
  { path: "/value", route: ValueRoutes },

  // Jobs & Applications
  { path: "/job", route: JobPostRoutes },
  { path: "/apply", route: ApplyRoutes },

  // Content
  { path: "/blog", route: BlogRoutes },
  { path: "/staffing", route: StaffingRoutes },
  { path: "", route: ContentRoutes },           // /about, /terms, /privacy — no prefix
  { path: "/banner", route: BannerRoutes },

  // Communication
  { path: "/contact", route: ContactRoutes },
  { path: "/notification", route: NotificationRoutes },
  { path: "/feedback", route: FeedbackRoutes },

  // Dashboard (stats + user-list + international apps)
  { path: "/dashboard", route: DashboardRoutes },

  // Finance
  { path: "/payment", route: PaymentRoutes },
  { path: "/charge", route: ChargeRoutes },

  // Community (placeholder)
  { path: "/community", route: CommunityRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
