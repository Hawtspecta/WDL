/**
 * Shared Zod schema used for BOTH client-side and server-side validation.
 * This is the single source of truth — the same schema runs in the browser
 * (via react-hook-form) and on the server (inside the Server Action).
 */
import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(60, "Project name must be at most 60 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Only letters, numbers, spaces, hyphens, and underscores are allowed"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),

  // Zod v4 — z.enum() with message option
  category: z.enum(["frontend", "backend", "fullstack", "mobile", "devops", "data"], {
    message: "Please select a valid category",
  }),

  priority: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select a priority level",
  }),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be at most 100 characters"),

  deadline: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true; // optional
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Deadline must be a valid future date"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const CATEGORY_OPTIONS = [
  { value: "frontend" as const, label: "Frontend" },
  { value: "backend" as const, label: "Backend" },
  { value: "fullstack" as const, label: "Full Stack" },
  { value: "mobile" as const, label: "Mobile" },
  { value: "devops" as const, label: "DevOps / Infrastructure" },
  { value: "data" as const, label: "Data / ML" },
];

export const PRIORITY_OPTIONS = [
  { value: "low" as const, label: "Low" },
  { value: "medium" as const, label: "Medium" },
  { value: "high" as const, label: "High" },
  { value: "critical" as const, label: "Critical" },
];
