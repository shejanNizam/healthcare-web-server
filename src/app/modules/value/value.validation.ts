import { z } from "zod";
import { ValueGroup } from "./value.interface";

export const createValueSchema = z.object({
  body: z.object({
    label: z.string().min(1, "Label is required"),
    logo: z.string().url("Logo must be a valid URL").optional(),
  }),
});

export const updateValueSchema = z.object({
  body: z.object({
    label: z.string().min(1).optional(),
    logo: z.string().url().optional(),
  }),
});

export const valueGroupParam = z.enum(Object.values(ValueGroup) as [string, ...string[]]);
