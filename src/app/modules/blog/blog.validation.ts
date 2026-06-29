import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    category: z.string().min(1, "Category is required"),
    blogTitle: z.string().min(1, "Blog title is required"),
    description: z.string().min(1, "Description is required"),
    banner: z.string().min(1, "Banner is required"),
    metaDescription: z.string().min(1, "Meta description is required"),
    tags: z.array(z.string()).optional(),
    pageTitle: z.string().min(1, "Page title is required"),
    url: z.string().min(1, "URL/slug is required"),
  }),
});

export const updateBlogSchema = z.object({
  body: createBlogSchema.shape.body.partial(),
});
