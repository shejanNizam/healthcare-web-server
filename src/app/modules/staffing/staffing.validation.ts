import { z } from "zod";
import { StaffingType } from "./staffing.interface";

const staffingTypeValues = Object.values(StaffingType) as [string, ...string[]];

export const createStaffingSchema = z.object({
  body: z.object({
    bannerTitle: z.string().min(1),
    bannerSubTitle: z.string().min(1),
    pageTitle: z.string().min(1),
    type: z.enum(staffingTypeValues),
    url: z.string().min(1),
    metaDescription: z.string().min(1),
    guaranteesDescription: z.array(z.string()).optional(),
    patientCareDescription: z.array(z.string()).optional(),
    serviceSuccessDescription: z.array(z.string()).optional(),
    specialityDescription: z.array(z.string()).optional(),
    standsDescription: z.array(z.string()).optional(),
    whatWeDo: z.array(z.string()).optional(),
  }),
});

export const updateStaffingSchema = z.object({
  body: createStaffingSchema.shape.body.partial(),
});

export const faqPatchSchema = z.object({
  body: z.object({
    action: z.enum(["add", "delete"]),
    faqId: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
  }),
});

export const whatWeDoSchema = z.object({
  body: z.object({
    action: z.enum(["add", "delete"]),
    item: z.string().optional(),
  }),
});
