import { z } from "zod";

export const step1Schema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email required"),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    phone: z.string().min(1, "Phone is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    profession: z.string().optional(),
    discipline: z.string().optional(),
    specialty: z.string().optional(),
    secondarySpecialty: z.string().optional(),
    applyType: z.enum(["local", "international"]).default("local"),
    jobPostId: z.string().optional(),
    certifications: z.array(z.string()).optional(),
  }),
});

const licenseSchema = z.object({
  medicalAssistant: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  licenseType: z.string().optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  school: z.string().min(1),
  year: z.string().min(1),
  major: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
});

export const step2Schema = z.object({
  body: z.object({
    licenses: z.array(licenseSchema).optional(),
    education: z.array(educationSchema).optional(),
  }),
});

const employmentSchema = z.object({
  company: z.string().optional(),
  specialty: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const step3Schema = z.object({
  body: z.object({
    employment: z.array(employmentSchema).optional(),
  }),
});
