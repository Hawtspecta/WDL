# Assignment 1
## Responsive Accessible Component Architecture, Client State Management & End-to-End Type-Safe Form Mutations

**Course:** Full Stack Development Lab (FSTL)  
**Framework:** Next.js 16.3 (App Router) + React 19  
**Language:** TypeScript  
**Styling & UI:** Tailwind CSS v4, shadcn/ui, Radix UI primitives, Lucide Icons  
**State & Forms:** Zustand v5, Zod v4, React Hook Form v7  

---

### 1. Introduction

Modern web application development demands a clear separation of concerns between server-side computation and client-side interactivity. The **Full-Stack Next.js Architecture Lab** is an academic demonstration designed to implement, test, and document the core architectural patterns required by Assignment 1 for the Full Stack Development Lab (FSTL) curriculum.

The primary objective of this project is to build a production-quality, accessible, and responsive dashboard that demonstrates:
1. **React Server Components (RSC) vs. Client Components**: Explicit component trees, serialization boundary enforcement, and server-first data fetching.
2. **Client State Isolation with Zustand**: Local state management using selector-based subscriptions and `localStorage` persistence without polluting server component trees.
3. **End-to-End Type-Safe Form Mutations**: Unified validation using a single Zod schema shared between React Hook Form client validation and native Next.js Server Actions.
4. **Hydration Optimization & Layout Stability**: Elimination of layout shifts (CLS), prevention of theme hydration mismatches via `next-themes`, and React Suspense streaming.
5. **Core Web Vitals & Audit Readiness**: Performance metrics architecture targeting LCP, CLS, and INP, prepared for Lighthouse audits.

---

### 2. RSC vs Client Component Render Trees

Next.js App Router separates rendering into Server Components (rendered exclusively on the Node.js server to static HTML/RSC payloads) and Client Components (hydrated on the client to attach event handlers and state).

#### Component Classification in the Workspace

| Component | Type | Responsibility / Rationale | File Path |
|---|---|---|---|
| `RootLayout` | Server | Main app shell, metadata, global fonts | [`app/layout.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/layout.tsx) |
| `Sidebar` | Server | Navigation layout without client JavaScript overhead | [`components/layout/sidebar.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/layout/sidebar.tsx) |
| `Header` | Server | Top bar header layout, breadcrumbs | [`components/layout/header.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/layout/header.tsx) |
| `ServerDataCard` | Server | Asynchronous server-side data fetching (simulated database query) | [`components/rsc/server-data-card.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/rsc/server-data-card.tsx) |
| `RscPage` | Server | Page wrapper composing Server Components and Client Islands | [`app/demo/rsc/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/rsc/page.tsx) |
| `ZustandPage` | Server | Page wrapper passing static catalogue props across RSC boundary | [`app/demo/zustand/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/zustand/page.tsx) |
| `SidebarLink` | Client (`"use client"`) | Needs `usePathname()` to compute active link styling | [`components/layout/sidebar-link.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/layout/sidebar-link.tsx) |
| `MobileNav` | Client (`"use client"`) | Responsive drawer sheet state and toggle button | [`components/layout/mobile-nav.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/layout/mobile-nav.tsx) |
| `ClientIsland` | Client (`"use client"`) | Interactive counter state, theme controls, and local state | [`components/rsc/client-island.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/rsc/client-island.tsx) |
| `ProductGrid` | Client (`"use client"`) | Consumes Zustand `addItem` action, receives static product array | [`components/cart/product-grid.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/cart/product-grid.tsx) |
| `CartPanel` | Client (`"use client"`) | Consumes Zustand cart items, quantities, and totals | [`components/cart/cart-panel.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/cart/cart-panel.tsx) |
| `ProjectForm` | Client (`"use client"`) | React Hook Form input handling, submission transitions | [`components/forms/project-form.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/forms/project-form.tsx) |

#### RSC → Client Boundary & Prop Serialization

Props passed across the RSC → Client boundary must be JSON-serializable. Functions, class instances, or React components cannot cross this boundary.

In [`app/demo/rsc/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/rsc/page.tsx):
- `RscPage` (Server) formats server timestamps as `string` (`new Date().toISOString()`) and system metadata as primitive strings/numbers.
- These primitives are passed to `ClientIsland` (`serverTimestamp: string`, `nodeVersion: string`).

In [`app/demo/zustand/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/zustand/page.tsx):
- `ZustandPage` (Server) defines a static product catalogue array `PRODUCTS` containing plain serializable objects (`id`, `name`, `price`, `category`).
- The array is passed as a prop to `ProductGrid` (Client Component), keeping data fetching on the server while delegating cart interaction to the client island.

#### Render Tree Architecture

```
                                  +-----------------------+
                                  |    RootLayout (RSC)   |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
         +-----------v-----------+                         +-----------v-----------+
         |     Sidebar (RSC)     |                         |   RscPage / Zustand   |
         +-----------+-----------+                         +-----------+-----------+
                     |                                                 |
         +-----------v-----------+                         +-----------v-----------+
         |   SidebarLink (Client)|                         | ServerDataCard (RSC)  |
         +-----------------------+                         +-----------+-----------+
                                                                       |
                                                           +-----------v-----------+
                                                           |  Serializable Props   |
                                                           |   (strings, arrays)   |
                                                           +-----------+-----------+
                                                                       |
                                                           +-----------v-----------+
                                                           | ClientIsland / Cart   |
                                                           |  ("use client" State) |
                                                           +-----------------------+
```

---

### 3. Hydration Optimization Strategies

Hydration is the process by which React attaches event listeners and state to the server-rendered HTML in the browser. Inefficient boundaries or non-deterministic code can lead to hydration mismatches and layout shifts.

#### Key Optimization Strategies Implemented

1. **Leaf-Level Client Boundaries ("Islands Architecture")**:
   Entire layout pages (`app/demo/rsc/page.tsx`, `app/demo/zustand/page.tsx`, `app/demo/forms/page.tsx`) remain Server Components. `"use client"` is pushed down exclusively to interactive elements (e.g., buttons, form inputs, cart drawers). This keeps the JavaScript bundle size minimal.

2. **Hydration Mismatch Prevention (`next-themes`)**:
   Theme switching causes initial server HTML class mismatches if the server renders `"light"` while the user's browser prefers `"dark"`.
   - In [`app/layout.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/layout.tsx), `suppressHydrationWarning` is added strictly to the `<html>` tag.
   - In [`components/theme/theme-provider.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/theme/theme-provider.tsx), `NextThemesProvider` is configured with `scriptProps={{ suppressHydrationWarning: true }}` to eliminate React 19 script element console warnings.

3. **Deterministic Render Count Tracking**:
   In [`components/cart/rerender-demo.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/cart/rerender-demo.tsx), components demonstrate render optimization. To avoid SSR vs. Client hydration mismatch caused by modifying refs during initial render, a custom `useRenderCount()` hook yields `1` during both SSR and initial client hydration, incrementing only on subsequent client updates.

4. **Layout Stability (Zero CLS)**:
   - Fonts are loaded using Next.js `Geist` and `Geist_Mono` with `display: "swap"` and CSS variables in [`app/layout.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/layout.tsx).
   - Component containers reserve exact dimensions using Tailwind CSS grid layouts and explicit min-height utilities.

5. **React Suspense & Streaming**:
   In [`app/demo/rsc/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/rsc/page.tsx), slow server-rendered data blocks are wrapped in `<React.Suspense fallback={<ServerDataCardSkeleton />}>`. The initial shell renders immediately, and server data streams seamlessly without blocking page load.

---

### 4. Server State vs Zustand Client State

State management in Next.js is divided into **Server State** (database, server data fetched in RSC) and **Client State** (transient UI selections, active filters, shopping carts).

#### Architectural Comparison

| Aspect | Server State / RSC | Zustand Client State |
|---|---|---|
| **Purpose** | Authoritative application data, database records | Transient UI state, interactive cart, active filters |
| **Location** | Node.js Server memory / Database | Browser Client memory (React context-free store) |
| **Persistence** | Database / Server storage | `localStorage` via Zustand `persist` middleware |
| **Interactivity** | Read-only rendering; mutated via Server Actions | Instant synchronous client updates without server roundtrips |
| **Caching** | Next.js Data Cache / `fetch` cache | Client memory / `localStorage` under key `"nextjs-lab-cart"` |
| **Revalidation** | `revalidatePath()` / `revalidateTag()` | Direct store set actions (`addItem`, `clearCart`) |
| **Example in Project** | `PRODUCTS` array in [`app/demo/zustand/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/zustand/page.tsx) | `useCartStore` in [`store/use-cart-store.ts`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/store/use-cart-store.ts) |

#### Zustand Store Implementation Details

The store is defined in [`store/use-cart-store.ts`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/store/use-cart-store.ts) using `create()` and `persist()` middleware:

```typescript
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => { ... },
      removeItem: (id) => { ... },
      increaseQty: (id) => { ... },
      decreaseQty: (id) => { ... },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "nextjs-lab-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

#### Selector-Based Re-render Optimization

Subscribing components to the entire store (`useCartStore()`) forces re-renders whenever any property changes. This application exports fine-grained selector hooks:

```typescript
// Subscribes ONLY to items array
export const useCartItems = () => useCartStore((state) => state.items);

// Computes primitive total count (re-renders only when total changes)
export const useCartTotalItems = () =>
  useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

// Computes primitive total price
export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

// Uses useShallow to cache action object references
export const useCartActions = () =>
  useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      increaseQty: state.increaseQty,
      decreaseQty: state.decreaseQty,
      clearCart: state.clearCart,
    }))
  );
```

By utilizing `useShallow` for action object references and primitive derivations for totals, components like `ProductGrid` and `CartPanel` re-render exclusively when their targeted slice updates.

---

### 5. Type-Safe Form Handling and Server Actions

End-to-end type safety guarantees that client-side form data complies with business rules before transmission, and that the server independently validates incoming payloads prior to mutation.

#### Data Validation Flow Diagram

```
 +-----------------------------------------------------------------------+
 |                            User Input                                 |
 +-----------------------------------+-----------------------------------+
                                     |
                                     v
 +-----------------------------------+-----------------------------------+
 |  React Hook Form (components/forms/project-form.tsx)                  |
 |  - Controls state, accessibility attributes (aria-invalid)            |
 +-----------------------------------+-----------------------------------+
                                     |
                                     v
 +-----------------------------------+-----------------------------------+
 |  Client Zod Resolver (lib/validations/project-schema.ts)               |
 |  - Evaluates projectSchema; outputs inline errors without server call |
 +-----------------------------------+-----------------------------------+
                                     |
                                     v (Valid Payload)
 +-----------------------------------+-----------------------------------+
 |  Next.js Server Action (lib/actions/project-action.ts)                 |
 |  - Invoked via React useTransition                                    |
 +-----------------------------------+-----------------------------------+
                                     |
                                     v
 +-----------------------------------+-----------------------------------+
 |  Server-Side Zod Validation (lib/actions/project-action.ts)           |
 |  - Re-evaluates projectSchema.safeParse(data); sanitizes payload      |
 +-----------------------------------+-----------------------------------+
                                     |
                         +-----------+-----------+
                         |                       |
               (Success) v                       v (Validation Error)
 +-----------------------+---------------+ +-----+-----------------------+
 | Structured Result:                    | | Structured Error:           |
 | { success: true, data, message }      | | { success: false, message }  |
 +-----------------------+---------------+ +-----+-----------------------+
                         |                       |
                         +-----------+-----------+
                                     |
                                     v
 +-----------------------------------+-----------------------------------+
 |  UI Feedback (sonner toast + status banner + form.reset())            |
 +-----------------------------------------------------------------------+
```

#### Shared Zod Validation Schema

Defined in [`lib/validations/project-schema.ts`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/lib/validations/project-schema.ts):

```typescript
export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(60, "Project name must be at most 60 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Only letters, numbers, spaces, hyphens, and underscores allowed"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  category: z.enum(["frontend", "backend", "fullstack", "mobile", "devops", "data"], {
    message: "Please select a valid category",
  }),
  priority: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select a priority level",
  }),
  email: z.string().email("Please enter a valid email address"),
  deadline: z.string().optional(),
});
```

#### Native Next.js Server Action

Implemented in [`lib/actions/project-action.ts`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/lib/actions/project-action.ts) with `"use server"`:

```typescript
"use server";

export async function createProjectAction(
  data: ProjectFormValues
): Promise<ActionResult<ProjectRecord>> {
  // 1. Server-side re-validation
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: "Server validation failed. Please check input.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // 2. Business logic & mutation
  await new Promise((res) => setTimeout(res, 1000)); // Simulated DB latency

  return {
    success: true,
    message: `Project "${validated.data.name}" created successfully!`,
    data: { id: `proj_${Date.now()}`, ...validated.data },
  };
}
```

#### Mutation UX & Accessible Form Integration

In [`components/forms/project-form.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/components/forms/project-form.tsx):
- `useForm` incorporates `zodResolver(projectSchema)`.
- Controlled components (`Select`) fallback to `value={field.value ?? ""}` to prevent controlled/uncontrolled state transitions.
- Inputs bind accessible attributes (`aria-required="true"`, `aria-invalid`, `aria-describedby`).
- Submission state transitions cleanly: `Idle → Submitting → Success / Error`, featuring spinner loaders (`Loader2`), button disabling, status banners, and Sonner toast notifications.

---

### 6. Lighthouse and Core Web Vitals

Performance evaluation is structured around Google's Core Web Vitals metrics. To preserve academic integrity, audit values are not fabricated and must be recorded by executing Lighthouse against the application environment.

#### Standard Measurement Status

| Metric / Category | Audit Status | Good Threshold | Target Metric Definition |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | To be measured | ≤ 2.5s | Time taken to render the largest visual element |
| **CLS** (Cumulative Layout Shift) | To be measured | ≤ 0.1 | Visual stability score measuring unexpected layout movement |
| **INP** (Interaction to Next Paint) | To be measured | ≤ 200ms | Latency of user interactions to next visual frame update |
| **Performance** | To be measured | 90–100 | Overall page load & execution efficiency |
| **Accessibility** | To be measured | 90–100 | ARIA compliance, contrast ratios, keyboard navigability |
| **Best Practices** | To be measured | 90–100 | Modern web standards and security conformance |
| **SEO** | To be measured | 90–100 | Metadata, crawlability, and indexability |

#### Metric Optimization Analysis

1. **Largest Contentful Paint (LCP)**:
   - *Optimization Implemented*: Server Components deliver fully rendered HTML on first byte. Typography relies on `next/font` with zero network font blocking. Heavy components are streamed via React Suspense.

2. **Cumulative Layout Shift (CLS)**:
   - *Optimization Implemented*: `display: "swap"` on font declarations prevents font swap shifts. Component dimensions, badges, and cards use explicit CSS grid and flex bounds to reserve layout space prior to hydration.

3. **Interaction to Next Paint (INP)**:
   - *Optimization Implemented*: Isolated Zustand selectors eliminate unnecessary re-renders across the component tree. Form submissions leverage React `useTransition` to prevent UI thread blocking during Server Action mutations.

#### Audit Execution Guide

Instructions for recording real audit values are provided in the application UI at [`app/demo/lighthouse/page.tsx`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/app/demo/lighthouse/page.tsx) and documented in [`README.md`](file:///c:/Users/Sahana%20Santosh%20Nayak/OneDrive/Desktop/WDL/fst/assn1/README.md):
1. Start production server: `npm run build && npm start`.
2. Open Google Chrome DevTools (`F12`) → **Lighthouse** tab.
3. Select **Desktop** mode and run **Analyze page load**.
4. Capture scores and populate the measurement table in `docs/assignment-1-report.md`.

---

### 7. Conclusion

The **Full-Stack Next.js Architecture Lab** demonstrates an academic implementation of modern Next.js 16 App Router principles. By enforcing a strict Server Component baseline and delegating interactivity to isolated Client Islands, the application minimizes client JavaScript delivery. Zustand provides persistent, selector-optimized state management for transient user interactions without polluting server boundaries. End-to-end type safety is achieved by pairing React Hook Form with Server Actions through a single shared Zod schema. Finally, hydration mismatch preventions and layout stability techniques ensure a high-performance foundation suitable for Core Web Vitals compliance.

---

### 8. References

1. **Next.js App Router Documentation**: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
2. **React 19 Server Components Specification**: [https://react.dev/reference/rsc/server-components](https://react.dev/reference/rsc/server-components)
3. **Zustand Documentation & React 19 Usage**: [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)
4. **Zod Schema Validation**: [https://zod.dev/](https://zod.dev/)
5. **React Hook Form**: [https://react-hook-form.com/](https://react-hook-form.com/)
6. **Radix UI Primitives & Accessibility**: [https://www.radix-ui.com/](https://www.radix-ui.com/)
7. **Google Web Vitals (LCP, CLS, INP)**: [https://web.dev/vitals/](https://web.dev/vitals/)
