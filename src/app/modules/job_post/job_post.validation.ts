import { z } from "zod";
import { JobType, SalaryPeriod } from "./job_post.interface";

const jobTypeValues = Object.values(JobType) as [string, ...string[]];
const salaryPeriodValues = Object.values(SalaryPeriod) as [string, ...string[]];

export const createJobPostSchema = z.object({
  body: z.object({
    hospitalName: z.string().min(1, "Hospital name is required"),
    title: z.string().min(1, "Title is required"),
    address: z.string().optional(),
    deadline: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
    category: z.string().optional(),
    profession: z.string().optional(),
    jobType: z.enum(jobTypeValues),
    salaryMin: z.number().int().min(0).optional(),
    salaryMax: z.number().int().min(0).optional(),
    currency: z.string().default("USD"),
    salaryPeriod: z.enum(salaryPeriodValues).default(SalaryPeriod.year),
    vacancy: z.number().int().min(1).optional(),
    startDate: z.string().datetime({ offset: true }).or(z.string().date()).optional(),
    hoursPerWeek: z.number().int().min(1, "Hours per week is required"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    summary: z.string().optional(),
    responsibilities: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    companyLogo: z.string().url().optional(),
  }).refine(
    (d) => !d.salaryMin || !d.salaryMax || d.salaryMin <= d.salaryMax,
    { message: "salaryMin must be ≤ salaryMax", path: ["salaryMin"] },
  ),
});

const updateBodySchema = z.object({
  hospitalName: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  address: z.string().optional(),
  deadline: z.string().optional(),
  category: z.string().optional(),
  profession: z.string().optional(),
  jobType: z.enum(jobTypeValues).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().optional(),
  salaryPeriod: z.enum(salaryPeriodValues).optional(),
  vacancy: z.number().int().min(1).optional(),
  startDate: z.string().optional(),
  hoursPerWeek: z.number().int().min(1).optional(),
  description: z.string().min(50).optional(),
  summary: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  companyLogo: z.string().url().optional(),
}).refine(
  (d) => !d.salaryMin || !d.salaryMax || d.salaryMin <= d.salaryMax,
  { message: "salaryMin must be ≤ salaryMax", path: ["salaryMin"] },
);

export const updateJobPostSchema = z.object({ body: updateBodySchema });
