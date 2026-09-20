# Full-Stack Next.js Architecture Lab — Assignment 1

> **Academic Demonstration** of modern Next.js 16 architecture patterns for the FSTL (Full Stack Development Lab) course.

---

## Project Overview

This application is a professional, production-quality dashboard demonstrating:

1. **React Server Components (RSC) vs Client Components** — clear visual boundary, render tree, hydration
2. **Zustand Client State Management** — shopping cart with persistence, selector-based optimization
3. **Type-Safe Form Mutations** — react-hook-form + Zod + Next.js Server Actions
4. **Hydration Optimization** — server/client render timing, preventing layout shifts
5. **Core Web Vitals** — LCP, CLS, INP definitions and optimization strategies
6. **Lighthouse Audit** — real audit instructions and report template

---

## Assignment Objectives

| Part | Topic | Status |
|------|-------|--------|
| A | Accessible UI + RSC/Client boundary | ✅ Complete |
| B | Zustand client state management | ✅ Complete |
| C | Type-safe form + Zod + Server Action | ✅ Complete |
| — | Hydration optimization | ✅ Complete |
| — | Core Web Vitals dashboard | ✅ Complete |
| — | Lighthouse audit section | ✅ Complete |
| — | README + Technical Report + Demo Checklist | ✅ Complete |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.3.5 (App Router) |
| Language | TypeScript |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui v4 (Base UI primitives) |
| Theme | next-themes |
| State Management | Zustand v5 |
| Validation | Zod v4 |
| Forms | react-hook-form v7 + @hookform/resolvers |
| Icons | Lucide React |
| Toasts | Sonner |

---

## Installation

```bash
# Clone / enter project directory
cd assn1

# Install all dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Production build (type-checks + optimizes)
npm run build

# Serve production build
npm start

# Lint
npm run lint
```

---

## Architecture

### Server Components (RSC)

Every page in the `app/` directory is a **Server Component by default**. They:
- Run only on the server (or at build time)
- Can be `async` and fetch data directly
- Contribute **zero JavaScript** to the browser bundle
- Cannot use `useState`, `useEffect`, or event handlers

### Client Components

Files with `"use client"` at the top are Client Components. They:
- Have their JavaScript sent to the browser
- Can use hooks (`useState`, `useEffect`, etc.)
- Are hydrated by React after the server HTML loads
- Should be kept **as small as possible**

### RSC → Client Boundary Rules

Props passed across the boundary **must be serializable**:
- ✅ `string`, `number`, `boolean`, plain `{}`, `[]`
- ❌ Functions, `Date` objects, class instances, `Symbol`, React elements

---

## RSC vs Client Component Explanation

```
SERVER (no JS bundle)          CLIENT (JS bundle)
─────────────────────          ──────────────────
app/layout.tsx                 ThemeToggle.tsx
app/page.tsx                   MobileNav.tsx
app/demo/rsc/page.tsx          SidebarLink.tsx
components/rsc/               ClientIsland.tsx
  server-data-card.tsx         ProjectForm.tsx
app/demo/forms/page.tsx        CartPanel.tsx
app/demo/performance/page.tsx  ProductGrid.tsx
app/demo/lighthouse/page.tsx   RerenderDemo.tsx
                               HydrationDemo.tsx
```

The layout and pages stay as Server Components. Interactive "islands" are pushed to the leaves of the component tree.

---

## Zustand Architecture

The cart store (`store/use-cart-store.ts`) uses:

1. **`persist` middleware** — automatically syncs to `localStorage`
2. **Selector hooks** — prevent unnecessary re-renders:

```ts
// ✅ Only re-renders when items change
const items = useCartItems();

// ✅ Only re-renders when price changes  
const total = useCartTotalPrice();

// ❌ Re-renders on every store change
const store = useCartStore();
```

3. **Isolated state** — store is only imported in the client components that need it. Server Components (pages, layouts) never touch Zustand.

---

## Zod + Server Action Flow

```
Client form submit
      ↓
react-hook-form validates (Zod schema)
      ↓  [ONLY if client passes]
Server Action called (POST to server)
      ↓
Server validates independently (same Zod schema)
      ↓
Returns ActionResult { success, message, errors? }
      ↓
Client updates UI (toast + form state)
```

The critical principle: **the server NEVER trusts client validation**.

### Shared Schema Location

`lib/validations/project-schema.ts` — imported by both:
- `components/forms/project-form.tsx` (client validation)
- `lib/actions/project-action.ts` (server validation)

---

## Hydration Optimization

Key techniques used in this project:

1. **`suppressHydrationWarning` on `<html>`** — prevents next-themes theme class mismatch warning
2. **`mounted` state** in ThemeToggle — prevents rendering before hydration
3. **Small client islands** — only the interactive parts are `"use client"`
4. **Serializable props** — icons passed as strings, not React components, across RSC boundary
5. **`display: swap`** on fonts — prevents layout shift during font loading

---

## Lighthouse Testing Instructions

### Method 1: Chrome DevTools

1. `npm run build && npm start` (or `npm run dev`)
2. Open `http://localhost:3000` in Chrome
3. DevTools (`F12`) → Lighthouse tab
4. Select categories + device → **Analyze page load**
5. Record results in `docs/assignment-1-report.md`

### Method 2: Lighthouse CLI

```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### Method 3: PageSpeed Insights

Deploy to Vercel, then visit https://pagespeed.web.dev/ with your URL.

---

## Core Web Vitals

| Metric | Full Name | Good |
|--------|-----------|------|
| LCP | Largest Contentful Paint | ≤ 2.5s |
| CLS | Cumulative Layout Shift | ≤ 0.1 |
| INP | Interaction to Next Paint | ≤ 200ms |

> **Note**: FID (First Input Delay) was deprecated in March 2024 and replaced by INP.

---

## Folder Structure

```
assn1/
├── app/
│   ├── layout.tsx              # Root layout (RSC) — ThemeProvider, Sidebar, Header
│   ├── page.tsx                # Dashboard homepage (RSC)
│   └── demo/
│       ├── rsc/page.tsx        # RSC vs Client demo (RSC + async data fetch)
│       ├── zustand/page.tsx    # Cart demo page (RSC)
│       ├── forms/page.tsx      # Form demo page (RSC)
│       ├── hydration/page.tsx  # Hydration explainer (RSC)
│       ├── performance/page.tsx # Core Web Vitals (RSC)
│       └── lighthouse/page.tsx  # Lighthouse audit (RSC)
├── components/
│   ├── ui/                     # shadcn/ui generated components
│   ├── theme/                  # ThemeProvider, ThemeToggle (CC)
│   ├── layout/                 # Sidebar (RSC), SidebarLink (CC), Header, MobileNav (CC)
│   ├── rsc/                    # ServerDataCard (RSC), ClientIsland (CC), ArchitectureDiagram
│   ├── cart/                   # CartPanel (CC), ProductGrid (CC), RerenderDemo (CC)
│   ├── forms/                  # ProjectForm (CC), SchemaDisplay (RSC)
│   └── hydration/              # HydrationDemo (CC)
├── lib/
│   ├── validations/
│   │   └── project-schema.ts   # Shared Zod schema
│   ├── actions/
│   │   └── project-action.ts   # Server Action ("use server")
│   └── utils.ts                # cn() utility
├── store/
│   └── use-cart-store.ts       # Zustand store with persist middleware (CC)
├── docs/
│   ├── assignment-1-report.md  # Technical report
│   └── DEMO-CHECKLIST.md       # Evaluation checklist
└── README.md                   # This file
```

---

## Demonstration Checklist

| Feature | Page | How to demo |
|---------|------|-------------|
| RSC data fetching | `/demo/rsc` | Show server timestamp, Node.js version |
| Client island | `/demo/rsc` | Click counter, live clock |
| Architecture diagram | `/demo/rsc` | Visual RSC→Client tree |
| Zustand cart | `/demo/zustand` | Add items, change qty, refresh (persists) |
| Selector optimization | `/demo/zustand` | Watch render counters flash |
| localStorage persist | `/demo/zustand` | Add item, refresh, item still there |
| Form validation | `/demo/forms` | Submit empty form — inline errors |
| Server Action | `/demo/forms` | Submit valid form — loading state → success toast |
| Server-side validation | `/demo/forms` | Explains server never trusts client |
| Hydration demo | `/demo/hydration` | See server vs client timestamps |
| Core Web Vitals | `/demo/performance` | LCP, CLS, INP explained |
| Lighthouse guide | `/demo/lighthouse` | Audit instructions + report template |
| Theme switching | Any page | Click theme button (sun/moon/monitor) |
| Mobile responsive | Any page | Resize browser or use DevTools mobile |
| Accessibility | Any page | Tab through page, check labels |
