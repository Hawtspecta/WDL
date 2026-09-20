/**
 * Zustand Cart Demo Page — SERVER COMPONENT (page itself)
 * The interactive cart widgets are Client Components.
 */
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartPanel } from "@/components/cart/cart-panel";
import { ProductGrid } from "@/components/cart/product-grid";
import { RerenderDemo } from "@/components/cart/rerender-demo";
import { ShoppingCart, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Zustand Cart",
  description: "Zustand client state management with localStorage persistence",
};

// Product catalogue — server-side data (static in this demo)
const PRODUCTS = [
  { id: "p1", name: "Next.js Handbook", price: 29.99, category: "Books" },
  { id: "p2", name: "TypeScript Mastery", price: 24.99, category: "Books" },
  { id: "p3", name: "React Patterns", price: 19.99, category: "Books" },
  { id: "p4", name: "Mechanical Keyboard", price: 89.99, category: "Hardware" },
  { id: "p5", name: "USB-C Hub", price: 39.99, category: "Hardware" },
  { id: "p6", name: "Standing Desk Mat", price: 34.99, category: "Hardware" },
];

export default function ZustandPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20">
            <Database className="h-3 w-3 mr-1" />
            Part B — Zustand Client State
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Zustand Client State</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          A shopping cart powered by Zustand with localStorage persistence.
          Demonstrates selector-based optimisation, add/remove/quantity controls,
          and isolated client state that doesn&apos;t pollute Server Components.
        </p>
      </div>

      {/* Main content — two columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product grid — CLIENT COMPONENT (needs addItem action) */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Product Catalogue
          </h2>
          {/*
           * Products are fetched on the SERVER (here, static data).
           * We pass them as serializable props to the Client Component.
           */}
          <ProductGrid products={PRODUCTS} />
        </div>

        {/* Cart panel — CLIENT COMPONENT */}
        <div>
          <h2 className="text-base font-semibold mb-3">Cart</h2>
          <CartPanel />
        </div>
      </div>

      <Separator />

      {/* Re-render optimisation explanation */}
      <RerenderDemo />

      {/* Zustand Architecture Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Zustand Architecture</CardTitle>
          <CardDescription>How the store is structured in this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Store shape</h3>
              <pre className="text-xs font-mono bg-muted rounded p-3 overflow-auto">
{`CartState {
  items: CartItem[]
  // Actions
  addItem(item)
  removeItem(id)
  increaseQty(id)
  decreaseQty(id)
  clearCart()
  // Derived
  totalItems()
  totalPrice()
}`}
              </pre>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Selector hooks</h3>
              <pre className="text-xs font-mono bg-muted rounded p-3 overflow-auto">
{`// Only re-renders when items change
useCartItems()
  → state.items

// Only re-renders when total changes
useCartTotalPrice()
  → state.totalPrice()

// Never re-renders on state change
// (stable action references)
useCartActions()
  → { addItem, removeItem, ... }`}
              </pre>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <h3 className="text-sm font-semibold">Persistence</h3>
              <p className="text-xs text-muted-foreground">
                Zustand&apos;s <code className="font-mono text-xs bg-muted px-1 rounded">persist</code> middleware
                serializes the store to <code className="font-mono text-xs bg-muted px-1 rounded">localStorage</code>
                under the key <code className="font-mono text-xs bg-muted px-1 rounded">&quot;nextjs-lab-cart&quot;</code>.
                Cart state survives page refresh. Only the <code className="font-mono text-xs bg-muted px-1 rounded">items</code> array is persisted,
                not the action functions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
