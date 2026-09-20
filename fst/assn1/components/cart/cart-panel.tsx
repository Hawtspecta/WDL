"use client";

/**
 * CartPanel — CLIENT COMPONENT
 * Shows current cart contents, quantities, total.
 * Uses selector hooks to minimise re-renders.
 */
import { useCartItems, useCartTotalPrice, useCartActions, useCartTotalItems } from "@/store/use-cart-store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export function CartPanel() {
  // Fine-grained selectors — each re-renders only when its slice changes
  const items = useCartItems();
  const totalPrice = useCartTotalPrice();
  const totalItems = useCartTotalItems();
  const { increaseQty, decreaseQty, removeItem, clearCart } = useCartActions();

  const handleRemove = (name: string, id: string) => {
    removeItem(id);
    toast.info(`Removed "${name}" from cart`);
  };

  const handleClear = () => {
    clearCart();
    toast.info("Cart cleared");
  };

  if (items.length === 0) {
    return (
      <Card className="sticky top-20">
        <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
          <ShoppingCart
            className="h-10 w-10 text-muted-foreground/40"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">Your cart is empty</p>
          <p className="text-xs text-muted-foreground">
            Add products from the catalogue
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-20" aria-label="Shopping cart">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Cart
          </CardTitle>
          <Badge variant="secondary">{totalItems} items</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-1 shrink-0" role="group" aria-label={`Quantity for ${item.name}`}>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={() => decreaseQty(item.id)}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-mono w-4 text-center tabular-nums" aria-label={`Quantity: ${item.quantity}`}>
                {item.quantity}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={() => increaseQty(item.id)}
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Subtotal + remove */}
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 text-destructive hover:text-destructive mt-0.5"
                onClick={() => handleRemove(item.name, item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Separator />

      <CardFooter className="flex-col gap-3 pt-4">
        <div className="flex justify-between w-full text-sm font-semibold">
          <span>Total</span>
          <span className="tabular-nums">${totalPrice.toFixed(2)}</span>
        </div>
        <Button className="w-full" size="sm">
          Proceed to Checkout
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-destructive hover:text-destructive text-xs"
          onClick={handleClear}
        >
          <Trash2 className="h-3 w-3 mr-1" aria-hidden="true" />
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
