/**
 * Forms Demo Page — SERVER COMPONENT (page layout)
 * The form itself is a Client Component (needs react-hook-form hooks).
 */
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProjectForm } from "@/components/forms/project-form";
import { SchemaDisplay } from "@/components/forms/schema-display";
import { FileText, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Type-Safe Forms",
  description: "react-hook-form + Zod + Server Action demonstration",
};

export default function FormsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/20">
            <FileText className="h-3 w-3 mr-1" />
            Part C — Type-Safe Forms
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Type-Safe Form + Server Action</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          A &quot;Create Project&quot; form using react-hook-form, Zod validation, and a Next.js Server Action.
          The same Zod schema runs on both client and server — no client validation is ever trusted alone.
        </p>
      </div>

      {/* Flow explanation */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <FlowStep step="1" label="User fills form" />
            <FlowArrow />
            <FlowStep step="2" label="react-hook-form validates client-side (Zod)" />
            <FlowArrow />
            <FlowStep step="3" label="Server Action called" />
            <FlowArrow />
            <FlowStep step="4" label="Server validates again (same Zod schema)" />
            <FlowArrow />
            <FlowStep step="5" label="Success / Error response" />
          </div>
        </CardContent>
      </Card>

      {/* Main: form + schema side by side */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form — 3 columns */}
        <div className="lg:col-span-3">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Create Project
          </h2>
          <ProjectForm />
        </div>

        {/* Schema viewer — 2 columns */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Shared Zod Schema
          </h2>
          <SchemaDisplay />
        </div>
      </div>

      <Separator />

      {/* Architecture explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Why This Architecture?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Single source of truth",
                content:
                  "The Zod schema in lib/validations/project-schema.ts defines all rules. It's imported in both the Client Component (for react-hook-form) and the Server Action. No duplication, no inconsistency.",
              },
              {
                title: "Client-side UX",
                content:
                  "react-hook-form + @hookform/resolvers/zod gives instant inline errors without a server round-trip. Error messages are accessible (aria-describedby).",
              },
              {
                title: "Server-side security",
                content:
                  "The Server Action never trusts client validation. It parses and validates the raw payload independently. Malformed or malicious submissions are rejected.",
              },
              {
                title: "Mutation UX states",
                content:
                  "Idle → Submitting (disabled button + spinner) → Success (green toast + form reset) or Error (red toast + preserved form state). Never faked.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-1">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FlowStep({ step, label }: { step: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {step}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function FlowArrow() {
  return <span className="text-muted-foreground/50 text-sm font-bold">→</span>;
}
