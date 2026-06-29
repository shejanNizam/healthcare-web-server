import { AppliedJob } from "../apply/apply.model";
import { Contact } from "../contact/contact.model";
import { JobPost } from "../job_post/job_post.model";
import { User } from "../user/user.model";

const getOverview = async () => {
  const [totalJobs, totalApplicants, totalContacts, totalUsers] = await Promise.all([
    JobPost.countDocuments({ isDeleted: false }),
    AppliedJob.countDocuments({ isDeleted: false }),
    Contact.countDocuments({ isDeleted: false }),
    User.countDocuments({ isDeleted: false }),
  ]);

  return { totalJobs, totalApplicants, totalContacts, totalUsers };
};

const getApplicantsByMonth = async (year: number) => {
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  const result = await AppliedJob.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end }, isDeleted: false } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill all 12 months, defaulting missing months to 0
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = result.find((r) => r._id === i + 1);
    return { month: i + 1, count: found ? found.count : 0 };
  });

  return months;
};

export const DashboardServices = { getOverview, getApplicantsByMonth };
