"use client";

/**
 * RerenderDemo — CLIENT COMPONENT
 * 
 * Demonstrates WHY selector-based subscriptions are better than
 * subscribing to the whole store in every component.
 */
import { useState, useEffect, useRef } from "react";
import { useCartItems, useCartTotalPrice, useCartTotalItems } from "@/store/use-cart-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Custom hook to count component renders safely without hydration mismatches.
 * Ensures initial SSR output and initial client hydration match (render 1),
 * then increments on subsequent re-renders.
 */
function useRenderCount() {
  const count = useRef(1);
  const isMounted = useRef(false);

  if (isMounted.current) {
    count.current += 1;
  } else {
    isMounted.current = true;
  }

  return count.current;
}

/**
 * This component ONLY re-renders when totalItems changes.
 * It won't re-render when individual items change if total count stays the same.
 */
function TotalItemsDisplay() {
  const totalItems = useCartTotalItems();
  const renderCount = useRenderCount();

  return (
    <ComponentBox
      label="useCartTotalItems()"
      value={String(totalItems)}
      renders={renderCount}
      color="purple"
    />
  );
}

/**
 * This component ONLY re-renders when the total price changes.
 */
function TotalPriceDisplay() {
  const totalPrice = useCartTotalPrice();
  const renderCount = useRenderCount();

  return (
    <ComponentBox
      label="useCartTotalPrice()"
      value={`$${totalPrice.toFixed(2)}`}
      renders={renderCount}
      color="green"
    />
  );
}

/**
 * This component subscribes to ALL items — it re-renders whenever ANY
 * item changes. More expensive than targeted selectors above.
 */
function AllItemsDisplay() {
  const items = useCartItems();
  const renderCount = useRenderCount();

  return (
    <ComponentBox
      label="useCartItems()"
      value={`${items.length} products`}
      renders={renderCount}
      color="orange"
    />
  );
}

interface ComponentBoxProps {
  label: string;
  value: string;
  renders: number;
  color: "purple" | "green" | "orange";
}

function ComponentBox({ label, value, renders, color }: ComponentBoxProps) {
  const [flash, setFlash] = useState(false);
  const prevRenders = useRef(renders);

  useEffect(() => {
    if (renders !== prevRenders.current) {
      prevRenders.current = renders;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [renders]);

  const styles = {
    purple: "border-purple-200 dark:border-purple-800",
    green: "border-green-200 dark:border-green-800",
    orange: "border-orange-200 dark:border-orange-800",
  };

  const flashStyles = {
    purple: "bg-purple-100 dark:bg-purple-900/40",
    green: "bg-green-100 dark:bg-green-900/40",
    orange: "bg-orange-100 dark:bg-orange-900/40",
  };

  return (
    <div
      className={`rounded-lg border p-3 transition-colors duration-300 ${styles[color]} ${flash ? flashStyles[color] : ""}`}
      aria-live="polite"
      aria-label={`${label}: ${value}, rendered ${renders} times`}
    >
      <code className="text-xs font-mono block mb-1 text-muted-foreground">{label}</code>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tabular-nums">{value}</span>
        <Badge variant="outline" className="text-xs tabular-nums">
          {renders} renders
        </Badge>
      </div>
    </div>
  );
}

export function RerenderDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Re-render Optimisation</CardTitle>
        <CardDescription>
          Each component below uses a different selector. Add items or change quantities to watch which components re-render (they flash when they update).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <TotalItemsDisplay />
          <TotalPriceDisplay />
          <AllItemsDisplay />
        </div>
        <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Why selectors matter:</strong> If every component subscribed to the entire store
            (<code className="font-mono">useCartStore()</code>), they would ALL re-render on every
            single state change — even for changes they don&apos;t care about.
          </p>
          <p>
            With selectors (<code className="font-mono">useCartStore(state =&gt; state.items)</code>),
            React only re-renders a component when the specific slice it subscribes to changes.
            This is especially important for large, complex stores.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
