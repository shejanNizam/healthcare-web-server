import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { createNotification } from "../notification/notification.service";
import { ApplyType } from "./apply.interface";
import {
  AppliedJob,
  EducationHistory,
  EmploymentHistory,
  JobInfo,
  ProfessionalLicense,
} from "./apply.model";

// Step 1 — create JobInfo + AppliedJob atomically
const step1PersonalInfo = async (payload: {
  fullName: string;
  email: string;
  gender?: "Male" | "Female" | "Other";
  phone: string;
  country: string;
  state: string;
  city: string;
  profession?: string;
  discipline?: string;
  specialty?: string;
  secondarySpecialty?: string;
  applyType?: "local" | "international";
  jobPostId?: string;
  certifications?: string[];
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [jobInfo] = await JobInfo.create(
      [
        {
          fullName: payload.fullName,
          email: payload.email,
          gender: payload.gender,
          phone: payload.phone,
          country: payload.country,
          state: payload.state,
          city: payload.city,
          profession: payload.profession,
          discipline: payload.discipline,
          specialty: payload.specialty,
          secondarySpecialty: payload.secondarySpecialty,
        },
      ],
      { session },
    );

    const applyType: ApplyType = (payload.applyType as ApplyType) ?? ApplyType.local;

    const [appliedJob] = await AppliedJob.create(
      [
        {
          applyType,
          personalInfoId: jobInfo._id,
          jobPostId: payload.jobPostId || undefined,
          applicantEmail: payload.email,
          applicantName: payload.fullName,
          applicantPhone: payload.phone,
          certifications: payload.certifications ?? [],
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await createNotification({
      title: "New Application Received",
      message: `${payload.fullName} (${payload.email}) submitted a new ${applyType} application.`,
      type: "new_application",
      referenceType: "applied_job",
      referenceId: String(appliedJob._id),
    });

    return { applicationId: appliedJob._id };
  } catch (err: unknown) {
    await session.abortTransaction();
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      throw new AppError(httpStatus.CONFLICT, "You have already applied for this job");
    }
    throw err;
  } finally {
    await session.endSession();
  }
};

// Step 2 — education + licenses
const step2Education = async (
  applicationId: string,
  payload: {
    licenses?: { medicalAssistant?: string; city?: string; state?: string; licenseType?: string }[];
    education?: { degree: string; school: string; year: string; major: string; city: string; country: string }[];
  },
) => {
  const application = await AppliedJob.findOne({ _id: applicationId, isDeleted: false });
  if (!application) throw new AppError(httpStatus.NOT_FOUND, "Application not found");

  const ops: Promise<unknown>[] = [];

  if (payload.licenses?.length) {
    ops.push(
      ProfessionalLicense.insertMany(
        payload.licenses.map((l) => ({ ...l, appliedJobId: applicationId })),
      ),
    );
  }
  if (payload.education?.length) {
    ops.push(
      EducationHistory.insertMany(
        payload.education.map((e) => ({ ...e, appliedJobId: applicationId })),
      ),
    );
  }

  await Promise.all(ops);
  return application;
};

// Step 3 — employment history → mark complete
const step3Employment = async (
  applicationId: string,
  payload: {
    employment?: {
      company?: string;
      specialty?: string;
      country?: string;
      state?: string;
      city?: string;
      startDate?: string;
      endDate?: string;
    }[];
  },
) => {
  const application = await AppliedJob.findOne({ _id: applicationId, isDeleted: false });
  if (!application) throw new AppError(httpStatus.NOT_FOUND, "Application not found");

  if (payload.employment?.length) {
    await EmploymentHistory.insertMany(
      payload.employment.map((e) => ({ ...e, appliedJobId: applicationId })),
    );
  }

  application.isCompleted = true;
  await application.save();

  return application;
};

// Admin — list applicants for a job
const getAllForJob = async (jobPostId: string, query: Record<string, string>) => {
  const baseQuery = AppliedJob.find({ jobPostId, isDeleted: false }).populate("personalInfoId");
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

// Admin — single applicant full detail
const getSingleApplication = async (id: string) => {
  const application = await AppliedJob.findOne({ _id: id, isDeleted: false })
    .populate("personalInfoId")
    .populate("jobPostId");
  if (!application) throw new AppError(httpStatus.NOT_FOUND, "Application not found");

  const [licenses, education, employment] = await Promise.all([
    ProfessionalLicense.find({ appliedJobId: id }),
    EducationHistory.find({ appliedJobId: id }),
    EmploymentHistory.find({ appliedJobId: id }),
  ]);

  return { ...application.toObject(), licenses, education, employment };
};

// Admin — list international applications
const getAllInternational = async (query: Record<string, string>) => {
  const baseQuery = AppliedJob.find({ applyType: ApplyType.international, isDeleted: false }).populate("personalInfoId");
  const qb = new QueryBuilder(baseQuery, query);
  const data = await qb.sort().paginate().build();
  const meta = await qb.getMeta();
  return { data, meta };
};

// Admin — single international application
const getSingleInternational = async (id: string) => {
  const application = await AppliedJob.findOne({ _id: id, applyType: ApplyType.international, isDeleted: false })
    .populate("personalInfoId");
  if (!application) throw new AppError(httpStatus.NOT_FOUND, "International application not found");

  const [licenses, education, employment] = await Promise.all([
    ProfessionalLicense.find({ appliedJobId: id }),
    EducationHistory.find({ appliedJobId: id }),
    EmploymentHistory.find({ appliedJobId: id }),
  ]);

  return { ...application.toObject(), licenses, education, employment };
};

export const ApplyServices = {
  step1PersonalInfo,
  step2Education,
  step3Employment,
  getAllForJob,
  getSingleApplication,
  getAllInternational,
  getSingleInternational,
};
