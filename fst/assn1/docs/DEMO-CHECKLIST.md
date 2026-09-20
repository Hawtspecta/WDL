# Demo Checklist — Assignment 1

Use this checklist when demonstrating the application to your evaluator.
Each item maps a requirement to its implementation and how to demonstrate it.

---

## Part A — Accessible UI + RSC/Client Boundary

| Requirement | Implemented | File | How to Demonstrate |
|------------|-------------|------|--------------------|
| shadcn/ui components | ✅ | `components/ui/` | Visible throughout the app: Cards, Badges, Buttons, Inputs, Select, Sheet, Dialog, Skeleton, Separator, Progress, Sonner |
| Keyboard accessibility | ✅ | All interactive components | Tab through the page — all buttons/links are focusable; focus rings visible |
| Accessible labels | ✅ | `components/forms/project-form.tsx` | `htmlFor`, `aria-required`, `aria-invalid`, `aria-describedby` on form fields |
| Theme switching (Light) | ✅ | `components/theme/theme-toggle.tsx` | Click sun icon → Light theme |
| Theme switching (Dark) | ✅ | `components/theme/theme-toggle.tsx` | Click moon icon → Dark theme |
| Theme switching (System) | ✅ | `components/theme/theme-toggle.tsx` | Click monitor icon → System preference |
| No hydration mismatch | ✅ | `app/layout.tsx`, `ThemeToggle` | Open browser console — no hydration warnings |
| No layout shifts | ✅ | `app/layout.tsx`, `globals.css` | `suppressHydrationWarning` on `<html>`, `display: swap` fonts |
| Server Component tree | ✅ | `app/demo/rsc/page.tsx` | Navigate to `/demo/rsc` — see architecture diagram |
| Client Component tree | ✅ | `components/rsc/client-island.tsx` | See interactive counter, live clock in the orange panel |
| Architecture visual | ✅ | `components/rsc/architecture-diagram.tsx` | The blue/orange tree diagram on `/demo/rsc` |
| Server-rendered data | ✅ | `components/rsc/server-data-card.tsx` | Node.js version and server timestamp visible on `/demo/rsc` |
| Serializable props | ✅ | `app/demo/rsc/page.tsx` | Props passed to ClientIsland: strings and numbers only |
| RSC → Client boundary | ✅ | `app/demo/rsc/page.tsx` | `serverTimestamp: string` (not `Date`) crosses boundary |

---

## Part B — Zustand Client State

| Requirement | Implemented | File | How to Demonstrate |
|------------|-------------|------|--------------------|
| Zustand store | ✅ | `store/use-cart-store.ts` | Navigate to `/demo/zustand` |
| Add item | ✅ | `components/cart/product-grid.tsx` | Click "Add" on any product |
| Remove item | ✅ | `components/cart/cart-panel.tsx` | Click trash icon in cart |
| Increase quantity | ✅ | `components/cart/cart-panel.tsx` | Click + button in cart |
| Decrease quantity | ✅ | `components/cart/cart-panel.tsx` | Click - button in cart |
| Clear all | ✅ | `components/cart/cart-panel.tsx` | Click "Clear Cart" button |
| Calculate total | ✅ | `components/cart/cart-panel.tsx` | Total updates automatically |
| localStorage persistence | ✅ | `store/use-cart-store.ts` (persist middleware) | Add items, refresh page — items still there |
| Filter/selection client state | ✅ | `components/cart/rerender-demo.tsx` | Render counters show selector-based updates |
| Selector optimization | ✅ | `store/use-cart-store.ts` (selector hooks) | Separate `useCartItems`, `useCartTotalPrice`, `useCartActions` |
| Re-render demo | ✅ | `components/cart/rerender-demo.tsx` | Add/change items — watch individual components flash |
| Isolated state | ✅ | All cart components | Parent page `page.tsx` has no Zustand imports |
| No unnecessary re-renders | ✅ | `store/use-cart-store.ts` | Each selector hook subscribes to its own slice only |

---

## Part C — Type-Safe Form + Zod + Server Action

| Requirement | Implemented | File | How to Demonstrate |
|------------|-------------|------|--------------------|
| Zod schema | ✅ | `lib/validations/project-schema.ts` | View the schema file — 6 fields with validation rules |
| Shared schema (client + server) | ✅ | `lib/validations/project-schema.ts` | Same file imported by both form and action |
| react-hook-form | ✅ | `components/forms/project-form.tsx` | Form state managed by react-hook-form |
| Inline errors | ✅ | `components/forms/project-form.tsx` | Submit empty form — errors appear below each field |
| Accessible error messages | ✅ | `components/forms/project-form.tsx` | `aria-describedby`, `role="alert"`, `aria-invalid` |
| Required field indicators | ✅ | `components/forms/project-form.tsx` | Red asterisks (*) next to required fields |
| Server Action | ✅ | `lib/actions/project-action.ts` | `"use server"` directive at top |
| Server validates independently | ✅ | `lib/actions/project-action.ts` | `projectSchema.safeParse(sanitizedData)` in action |
| Sanitization | ✅ | `lib/actions/project-action.ts` | `sanitize()` function trims and collapses whitespace |
| Structured response | ✅ | `lib/actions/project-action.ts` | Returns `{ success, message, data? }` or `{ success, message, errors? }` |
| Loading state | ✅ | `components/forms/project-form.tsx` | Submit — button shows spinner, is disabled |
| Disabled submit while loading | ✅ | `components/forms/project-form.tsx` | `disabled={isLoading}` on Button |
| Success toast | ✅ | `components/forms/project-form.tsx` | Valid form → green sonner toast appears |
| Error toast | ✅ | `components/forms/project-form.tsx` | Simulated error → red toast |
| State indicator | ✅ | `components/forms/project-form.tsx` | Badge shows: Idle / Submitting / Success / Error |
| Mutation UX demo | ✅ | `app/demo/forms/page.tsx` | Flow diagram visible at top of page |

---

## Hydration & Performance

| Requirement | Implemented | File | How to Demonstrate |
|------------|-------------|------|--------------------|
| Hydration demo | ✅ | `components/hydration/hydration-demo.tsx` | Navigate to `/demo/hydration` — server vs client timestamps |
| Hydration explanation | ✅ | `app/demo/hydration/page.tsx` | Read the 3-step hydration flow card |
| Common pitfalls | ✅ | `app/demo/hydration/page.tsx` | Theme flash, dates, localStorage sections |
| Serializable props explanation | ✅ | `app/demo/hydration/page.tsx` | Green/red table of serializable vs not |
| LCP definition + optimization | ✅ | `app/demo/performance/page.tsx` | Navigate to `/demo/performance` |
| CLS definition + optimization | ✅ | `app/demo/performance/page.tsx` | CLS section with strategies |
| INP definition + optimization | ✅ | `app/demo/performance/page.tsx` | INP section (successor to FID) |
| FID historical note | ✅ | `app/demo/performance/page.tsx` | Historical note at bottom |
| Next.js-specific optimizations | ✅ | `app/demo/performance/page.tsx` | next/image, next/font, RSC, streaming, prefetch |

---

## Lighthouse & Audit

| Requirement | Implemented | File | How to Demonstrate |
|------------|-------------|------|--------------------|
| Lighthouse instructions | ✅ | `app/demo/lighthouse/page.tsx` | Three methods: DevTools, CLI, PageSpeed Insights |
| Report template | ✅ | `app/demo/lighthouse/page.tsx` | Placeholder cards for all categories |
| No fabricated scores | ✅ | All docs | Placeholders say "Run Lighthouse" — no invented numbers |
| Populate after audit | ✅ | `docs/assignment-1-report.md` | Section 8 has placeholder table to fill |
| What Lighthouse audits | ✅ | `app/demo/lighthouse/page.tsx` | Grid showing Performance, Accessibility, Best Practices, SEO checks |

**⚠️ TO COMPLETE: Run Lighthouse and fill in `docs/assignment-1-report.md` Section 8.**

---

## Responsiveness & Accessibility

| Requirement | Implemented | File | How to Demonstrate |
|------------|-------------|------|--------------------|
| Desktop layout | ✅ | All pages | View at full width — sidebar + content |
| Tablet layout | ✅ | All pages | Resize to ~768px — sidebar hides |
| Mobile layout | ✅ | All pages | Resize to mobile — hamburger menu appears |
| Mobile navigation | ✅ | `components/layout/mobile-nav.tsx` | Click hamburger on mobile → Sheet drawer opens |
| Semantic HTML | ✅ | All pages | `<aside>`, `<nav>`, `<main>`, `<header>`, `<section>`, `<h1-h3>` |
| Focus states | ✅ | All interactive elements | Tab through — blue ring visible on focused elements |
| Sufficient contrast | ✅ | `app/globals.css` | oklch color palette with accessible contrast ratios |
| ARIA attributes | ✅ | Multiple components | `aria-current`, `aria-label`, `aria-live`, `aria-busy`, `aria-invalid` |
| Accessible dialogs | ✅ | Sheet component in MobileNav | Uses Base UI Dialog primitive with proper ARIA roles |

---

## Documentation

| Requirement | Implemented | File |
|------------|-------------|------|
| README | ✅ | `README.md` |
| Technical report | ✅ | `docs/assignment-1-report.md` |
| Demo checklist | ✅ | `docs/DEMO-CHECKLIST.md` (this file) |

---

## Quick Demo Flow (5 minutes)

1. **Home** (`/`) — Show overview, tech stack badges
2. **RSC vs Client** (`/demo/rsc`) — Architecture diagram, server timestamp, interactive counter
3. **Zustand Cart** (`/demo/zustand`) — Add 3 products, change quantity, refresh browser (persists!), watch render counters
4. **Forms** (`/demo/forms`) — Submit empty (client errors), fill and submit (loading state → success toast)
5. **Hydration** (`/demo/hydration`) — Show server vs client timestamps
6. **Performance** (`/demo/performance`) — LCP/CLS/INP cards
7. **Lighthouse** (`/demo/lighthouse`) — Run audit now using DevTools, record scores
8. **Theme** (header) — Toggle Light/Dark/System
9. **Mobile** (resize browser) — Hamburger menu on mobile
