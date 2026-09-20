# Assignment 1 Technical Report

**Course:** Full Stack Development Lab (FSTL)
**Assignment:** Responsive Accessible Component Architecture, Client State Management & End-to-End Type-Safe Form Mutations

---

## 1. Introduction

This report documents the design decisions and implementation choices made in **Assignment 1**, which required building a full-stack Next.js application demonstrating:

- React Server Components (RSC) and Client Component boundary management
- Hydration optimization strategies
- Zustand client state management vs server state
- Type-safe form mutations using Zod and Next.js Server Actions
- Core Web Vitals awareness and Lighthouse audit readiness

The application was built using Next.js 16.3.5 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Base UI primitives), Zustand v5, Zod v4, and react-hook-form v7.

---

## 2. RSC vs Client Component Render Trees

### 2.1 Server Components

React Server Components (RSCs) are the **default** in the Next.js App Router. They run exclusively on the server or at build time. Key properties:

- Can be `async` and directly `await` data sources (databases, APIs, filesystem)
- Produce **zero JavaScript** in the browser bundle — the server sends HTML
- Cannot use React hooks (`useState`, `useEffect`) or browser APIs
- Can import Node.js-only libraries that cannot run in the browser

In this project, all pages in `app/` are RSCs. The homepage fetches no external data but is rendered server-side as static HTML. The RSC demo page (`app/demo/rsc/page.tsx`) fetches data asynchronously with a simulated delay.

### 2.2 Client Components

Client Components are declared with the `"use client"` directive at the top of the file. They:

- Are bundled into JavaScript sent to the browser
- Can use all React hooks and browser APIs
- Are **hydrated** by React: existing server HTML is enhanced with event handlers

In this project, only the truly interactive parts are Client Components:
- `ThemeToggle` — uses `useTheme`, `useState`
- `MobileNav` — uses `useState` for drawer open/close
- `SidebarLink` — uses `usePathname` for active state
- `ClientIsland` — uses `useState`, `useEffect`
- `ProjectForm` — uses react-hook-form hooks
- `CartPanel`, `ProductGrid`, `RerenderDemo` — use Zustand store
- `HydrationDemo` — uses `useEffect` to detect hydration timing

### 2.3 RSC → Client Boundary

The RSC/Client boundary is the interface at which a Server Component renders a Client Component. Props passed across this boundary are serialized to JSON and embedded in the HTML response. Therefore:

**Props MUST be serializable:**
- ✅ Primitives: `string`, `number`, `boolean`, `null`
- ✅ Plain objects and arrays of the above
- ❌ Functions (callbacks, event handlers)
- ❌ `Date` objects (pass ISO strings instead)
- ❌ Class instances, `Symbol`, `Map`, `Set`
- ❌ React elements or JSX

A concrete example from this project: the `ClientIsland` component receives `serverTimestamp: string` (not `Date`) from the RSC parent. Similarly, the `SidebarLink` client component receives `iconName: string` rather than a `LucideIcon` component reference (which is a function).

### 2.4 Render Flow

```
1. HTTP request arrives at server
2. Next.js renders Server Components → HTML (async, can await data)
3. HTML + serialized RSC payload sent to browser
4. Browser displays HTML immediately (content visible)
5. React JS bundle loads in background
6. React "hydrates" Client Components:
   - Reconciles server HTML with component tree
   - Attaches event handlers
   - Initializes state (e.g., Zustand from localStorage)
7. Page becomes fully interactive
```

### 2.5 Hydration

Hydration is the process of React taking over the server-rendered HTML and making it interactive. It does **not** re-render — it only attaches event listeners and initializes client-side state on top of the existing DOM.

A failed hydration occurs when the server-rendered HTML and the client-rendered output differ. React logs a warning and may discard the server HTML and re-render from scratch, causing a layout flash.

---

## 3. Hydration Optimization Strategies

### 3.1 Minimizing Client Boundaries

The most important optimization is to **push `"use client"` as far down the component tree as possible**. If a layout or page wrapper becomes a Client Component, all of its children are also treated as Client Components — even if they don't need interactivity.

In this project, the root layout stays as a Server Component. Only the small interactive "islands" inside the layout (ThemeToggle, MobileNav) are Client Components.

### 3.2 Server-First Architecture

Data fetching happens in Server Components where possible. Client Components receive pre-fetched data as serializable props. This avoids:
- Client-side `useEffect` data fetching waterfalls
- Loading spinners blocking content
- Extra network requests from the browser

### 3.3 Avoiding Unnecessary JavaScript

Every component that doesn't need interactivity should remain an RSC. In this project, the architecture diagram, server data display, schema display, and all page layouts are RSCs — they add zero bytes to the JS bundle.

### 3.4 next-themes Hydration Considerations

`next-themes` reads the user's preferred theme (system, light, dark) from `localStorage`. Because the server does not know the user's preference, it renders the default theme. After React loads in the browser, it reads `localStorage` and may apply a different `.dark` class to `<html>`.

To prevent the resulting hydration mismatch warning:
- `suppressHydrationWarning` is placed on the `<html>` element only
- The `ThemeToggle` component renders a placeholder until `mounted === true` (checked via `useEffect`)
- `disableTransitionOnChange={false}` enables smooth transitions

### 3.5 Suspense and Streaming

React's `<Suspense>` boundary allows Next.js to stream HTML progressively. Instead of waiting for all data to be fetched before sending any HTML, the server can:
1. Immediately send the page shell (header, sidebar, navigation)
2. Stream in deferred sections as their data resolves

This improves **Largest Contentful Paint (LCP)** for data-heavy pages.

### 3.6 Component-Level Interactivity

The "interactive island" pattern keeps client-side JS contained to small, focused components. In this project:
- The `CartPanel` and `ProductGrid` are isolated islands
- Their parent page (`/demo/zustand/page.tsx`) remains a Server Component
- The Zustand store is only imported inside these islands

---

## 4. Server State vs Zustand Client State

| Dimension | Server State (RSC) | Zustand Client State |
|-----------|-------------------|----------------------|
| **Source of truth** | Server/database/API | Browser memory / localStorage |
| **Persistence** | Persistent (database) | Session or localStorage |
| **Fetching** | `async`/`await` in RSC | `useEffect` or store action |
| **Caching** | Next.js `fetch` cache, ISR | Zustand `persist` middleware |
| **Revalidation** | `revalidatePath`, `revalidateTag` | Manual action in store |
| **Interactivity** | ❌ None — static HTML | ✅ Full reactivity |
| **JS bundle cost** | Zero | Included in client bundle |
| **Appropriate for** | Content, auth, product data | UI state, cart, filters, preferences |
| **Risk of overuse** | Missing interactivity | Stale state, prop drilling replaced with global state misuse |

### When to use Zustand vs Server State

Use **Server State** (RSC) for:
- Product listings, articles, user profiles
- Data that changes infrequently
- Data that doesn't depend on user interaction

Use **Zustand** for:
- Shopping cart contents
- UI preferences (sidebar open/closed, selected filters)
- Multi-step form wizard state
- Anything that changes frequently based on user actions without needing a server round-trip

---

## 5. Zustand Implementation

The cart store (`store/use-cart-store.ts`) demonstrates production-quality Zustand patterns:

### 5.1 Store Structure

```typescript
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
```

### 5.2 Persistence

The `persist` middleware from Zustand serializes the store to `localStorage` under the key `"nextjs-lab-cart"`. The cart survives page refreshes and browser restarts (until cleared or expired).

### 5.3 Selector Hooks

```typescript
// Only re-renders when items array changes
export const useCartItems = () => useCartStore(state => state.items);

// Only re-renders when total price changes
export const useCartTotalPrice = () => useCartStore(state => state.totalPrice());

// Actions are stable references — never causes re-renders
export const useCartActions = () => useCartStore(state => ({
  addItem: state.addItem,
  removeItem: state.removeItem,
  // ...
}));
```

Instead of every component subscribing to the full store (`useCartStore()`), each component subscribes only to the slice it needs. This minimises unnecessary re-renders — visible in the `RerenderDemo` component which counts renders per component.

---

## 6. Type-Safe Form Mutation

### 6.1 react-hook-form

`react-hook-form` provides performant, uncontrolled form management. It avoids re-rendering the entire form on every keystroke by using native form elements and refs.

### 6.2 Zod

Zod is a TypeScript-first schema validation library. The schema is defined once and TypeScript types are inferred from it:

```typescript
const projectSchema = z.object({ ... });
type ProjectFormValues = z.infer<typeof projectSchema>;
```

### 6.3 Shared Validation

The schema in `lib/validations/project-schema.ts` is imported by:
1. **`components/forms/project-form.tsx`** — via `zodResolver` for client-side validation
2. **`lib/actions/project-action.ts`** — for server-side validation

This ensures both layers enforce the exact same rules, preventing inconsistencies.

### 6.4 Server Actions

Next.js Server Actions (`"use server"`) are server-side functions called directly from Client Components. They:
- Execute only on the server
- Receive form data
- Can interact with databases, send emails, etc.
- Return serializable results

### 6.5 Sanitization

Before validation, the Server Action sanitizes inputs:
```typescript
function sanitize(value: unknown): unknown {
  if (typeof value === "string") return value.trim().replace(/\s+/g, " ");
  return value;
}
```

This prevents whitespace-only fields from passing validation and normalizes spacing.

### 6.6 Mutation Response Handling

The Server Action returns a discriminated union:
```typescript
type ActionResult =
  | { success: true; message: string; data: ProjectFormValues & { id: string } }
  | { success: false; message: string; errors?: FieldErrors }
```

The Client Component handles both cases with appropriate toasts and UI state changes.

---

## 7. Lighthouse and Core Web Vitals

### 7.1 LCP — Largest Contentful Paint

**What it measures:** The render time of the largest visible content element (image or text block) in the viewport.
**Good threshold:** ≤ 2.5 seconds
**Optimizations in this project:**
- Server-rendered HTML means content is visible immediately
- Fonts loaded with `display: swap` to prevent render blocking
- No large images on critical path

### 7.2 CLS — Cumulative Layout Shift

**What it measures:** The total amount of unexpected layout shift throughout the page lifecycle.
**Good threshold:** ≤ 0.1
**Optimizations in this project:**
- `next/font` with `display: swap` prevents FOIT/FOUT
- `suppressHydrationWarning` prevents theme-related shift
- No images without dimensions (not applicable — no images used)

### 7.3 INP — Interaction to Next Paint

**What it measures:** The 98th percentile latency for all user interactions (clicks, taps, key presses) during the entire page session.
**Good threshold:** ≤ 200ms
**Note:** INP replaced FID (First Input Delay) as a Core Web Vital in March 2024. FID only measured the first interaction; INP measures all.
**Optimizations in this project:**
- Small Client Component islands reduce JavaScript execution time
- Zustand selectors prevent unnecessary re-renders
- No heavy computations on the main thread
- `useTransition` wraps Server Action calls to prevent UI blocking

---

## 8. Audit Results

> ⚠️ **All Lighthouse scores must be measured by running an actual audit.**
> No scores are pre-populated in this report to avoid fabrication.
> Follow the instructions in the `/demo/lighthouse` page of the application.

### Instructions

1. Run `npm run build && npm start`
2. Open `http://localhost:3000` in Chrome
3. DevTools → Lighthouse tab → Analyze page load
4. Replace the placeholder table below with real measured values

### Placeholder Results (to be measured)

| Category | Score | Notes |
|----------|-------|-------|
| Performance | — | Run Lighthouse |
| Accessibility | — | Run Lighthouse |
| Best Practices | — | Run Lighthouse |
| SEO | — | Run Lighthouse |

### Core Web Vitals (to be measured)

| Metric | Measured Value | Status |
|--------|---------------|--------|
| LCP | — | — |
| CLS | — | — |
| INP | — | — |
| TBT | — | — |
| FCP | — | — |

---

## 9. Conclusion

This project demonstrates a disciplined approach to Next.js architecture:

- **Server Components by default**: Every page and layout is an RSC unless explicitly marked as a Client Component
- **Minimal client boundaries**: Interactive "islands" are isolated to small, focused Client Components
- **Type safety end-to-end**: Zod schemas are shared between client and server validation
- **Performance-conscious state**: Zustand selectors prevent unnecessary re-renders
- **Accessible and responsive**: shadcn/ui components provide keyboard navigation, ARIA labels, and semantic HTML across all screen sizes

The result is an application that is fast, maintainable, and demonstrates the key principles of modern React architecture.
