/**
 * SchemaDisplay — SERVER COMPONENT
 * Shows the Zod schema definition for educational purposes.
 * Static content — no client JS needed.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SchemaDisplay() {
  const schemaCode = `// lib/validations/project-schema.ts
// SHARED: used on CLIENT & SERVER

const projectSchema = z.object({
  name: z.string()
    .min(3).max(60)
    .regex(/^[a-zA-Z0-9\\s\\-_]+$/),

  description: z.string()
    .min(10).max(500),

  category: z.enum([
    "frontend","backend",
    "fullstack","mobile",
    "devops","data"
  ]),

  priority: z.enum([
    "low","medium",
    "high","critical"
  ]),

  email: z.string().email().max(100),

  deadline: z.string()
    .optional()
    .refine(val => /* future date */ true),
});`;

  return (
    <div className="space-y-3">
      <Card className="border-green-200 dark:border-green-900/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 text-xs">
              Single Source of Truth
            </Badge>
          </div>
          <pre className="text-xs font-mono text-muted-foreground overflow-auto whitespace-pre-wrap leading-relaxed">
            {schemaCode}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <p className="text-xs font-semibold mb-2">Used in:</p>
          <ul className="space-y-1.5">
            {[
              {
                file: "components/forms/project-form.tsx",
                role: "Client validation via zodResolver",
                color: "orange",
              },
              {
                file: "lib/actions/project-action.ts",
                role: "Server validation (\"use server\")",
                color: "blue",
              },
            ].map((item) => (
              <li key={item.file} className="text-xs">
                <code
                  className={`inline-block font-mono text-xs px-1.5 py-0.5 rounded mb-0.5 ${
                    item.color === "orange"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {item.file}
                </code>
                <span className="block text-muted-foreground pl-1">{item.role}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <p className="text-xs font-semibold mb-2">Server Action structure:</p>
          <pre className="text-xs font-mono text-muted-foreground overflow-auto whitespace-pre-wrap">
{`// lib/actions/project-action.ts
"use server"

async function createProjectAction(raw) {
  // 1. Sanitize inputs
  const sanitized = sanitize(raw);
  
  // 2. Validate with Zod
  const result = projectSchema
    .safeParse(sanitized);
  
  // 3. Return structured response
  if (!result.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: result.error.flatten()
    };
  }
  
  // 4. Proceed (DB write, etc.)
  return { success: true, data: ... };
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
