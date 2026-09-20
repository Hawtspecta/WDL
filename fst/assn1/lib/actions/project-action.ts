"use server";

/**
 * Server Action for creating a project.
 *
 * ARCHITECTURE NOTE:
 * - This runs ONLY on the server — never in the browser
 * - We validate with the SAME Zod schema used client-side
 * - We never trust client-side validation alone
 * - Returns a structured ActionResult so the client can handle success/error
 */

import { projectSchema, type ProjectFormValues } from "@/lib/validations/project-schema";

export type ActionResult =
  | { success: true; message: string; data: ProjectFormValues & { id: string; createdAt: string } }
  | { success: false; message: string; errors?: Partial<Record<keyof ProjectFormValues, string[]>> };

/**
 * Sanitize a string: trim and collapse internal whitespace.
 * This runs server-side only — a simple but effective sanitization step.
 */
function sanitize(value: unknown): unknown {
  if (typeof value === "string") {
    return value.trim().replace(/\s+/g, " ");
  }
  return value;
}

export async function createProjectAction(rawData: unknown): Promise<ActionResult> {
  // Simulate server processing latency (realistic demo)
  await new Promise((r) => setTimeout(r, 1200));

  // Sanitize all string fields before validation
  let sanitizedData: Record<string, unknown> = {};
  if (typeof rawData === "object" && rawData !== null) {
    for (const [key, value] of Object.entries(rawData as Record<string, unknown>)) {
      sanitizedData[key] = sanitize(value);
    }
  }

  // Parse & validate with the shared Zod schema
  const result = projectSchema.safeParse(sanitizedData);

  if (!result.success) {
    // Transform ZodError into a flat field→messages map
    const fieldErrors: Partial<Record<keyof ProjectFormValues, string[]>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ProjectFormValues;
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field]!.push(issue.message);
    }

    return {
      success: false,
      message: "Validation failed. Please correct the errors and try again.",
      errors: fieldErrors,
    };
  }

  // If we had a database, we'd insert here.
  // For the demo we return a mock created record.
  const created = {
    ...result.data,
    id: `proj_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Project "${created.name}" created successfully!`,
    data: created,
  };
}
