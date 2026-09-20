"use client";

/**
 * ProjectForm — CLIENT COMPONENT
 *
 * Uses react-hook-form with Zod resolver for client-side validation.
 * On submit, calls the Server Action and handles the ActionResult.
 *
 * Mutation UX states:
 *   Idle → Submitting → Success ✅ / Error ❌
 */
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  projectSchema,
  type ProjectFormValues,
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/lib/validations/project-schema";
import { createProjectAction } from "@/lib/actions/project-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ProjectForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "" as any,
      priority: "" as any,
      email: "",
      deadline: "",
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    setSubmitState("submitting");
    setServerMessage("");

    startTransition(async () => {
      const result = await createProjectAction(data);

      if (result.success) {
        setSubmitState("success");
        setServerMessage(result.message);
        toast.success(result.message, {
          description: `Project ID: ${result.data.id}`,
        });
        reset();
      } else {
        setSubmitState("error");
        setServerMessage(result.message);
        toast.error("Submission failed", {
          description: result.message,
        });
      }
    });
  };

  const isLoading = submitState === "submitting" || isPending;

  return (
    <Card>
      <CardContent className="pt-5">
        {/* Status banner */}
        {submitState === "success" && (
          <div
            className="flex items-start gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 mb-4"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">{serverMessage}</p>
          </div>
        )}
        {submitState === "error" && (
          <div
            className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 mb-4"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{serverMessage}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Create project form"
          className="space-y-4"
        >
          {/* Project Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Project Name <RequiredStar />
            </Label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              {...register("name")}
              aria-required="true"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
              disabled={isLoading}
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <RequiredStar />
            </Label>
            <textarea
              id="description"
              placeholder="Describe the project goals and scope..."
              {...register("description")}
              aria-required="true"
              aria-describedby={errors.description ? "description-error" : undefined}
              aria-invalid={!!errors.description}
              disabled={isLoading}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            {errors.description && (
              <p id="description-error" className="text-xs text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category + Priority row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category-trigger">
                Category <RequiredStar />
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="category-trigger"
                      className="w-full"
                      aria-required="true"
                      aria-describedby={errors.category ? "category-error" : undefined}
                      aria-invalid={!!errors.category}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p id="category-error" className="text-xs text-destructive" role="alert">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <Label htmlFor="priority-trigger">
                Priority <RequiredStar />
              </Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="priority-trigger"
                      className="w-full"
                      aria-required="true"
                      aria-describedby={errors.priority ? "priority-error" : undefined}
                      aria-invalid={!!errors.priority}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p id="priority-error" className="text-xs text-destructive" role="alert">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Contact Email <RequiredStar />
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Deadline (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="deadline">
              Deadline{" "}
              <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="deadline"
              type="date"
              {...register("deadline")}
              aria-describedby={errors.deadline ? "deadline-error" : undefined}
              aria-invalid={!!errors.deadline}
              disabled={isLoading}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.deadline && (
              <p id="deadline-error" className="text-xs text-destructive" role="alert">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Creating Project…
              </>
            ) : (
              "Create Project"
            )}
          </Button>

          {/* State indicator */}
          <div className="flex items-center gap-2 justify-center" aria-live="polite">
            <span className="text-xs text-muted-foreground">State:</span>
            <Badge
              variant="outline"
              className={
                submitState === "success"
                  ? "text-green-600 border-green-600/30"
                  : submitState === "error"
                  ? "text-destructive border-destructive/30"
                  : submitState === "submitting"
                  ? "text-yellow-600 border-yellow-600/30"
                  : "text-muted-foreground"
              }
            >
              {submitState === "idle" && "Idle"}
              {submitState === "submitting" && "⏳ Submitting…"}
              {submitState === "success" && "✅ Success"}
              {submitState === "error" && "❌ Error"}
            </Badge>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function RequiredStar() {
  return (
    <span className="text-destructive ml-0.5" aria-hidden="true">
      *
    </span>
  );
}
