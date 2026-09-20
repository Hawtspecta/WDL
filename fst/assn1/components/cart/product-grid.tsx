"use client";

/**
 * ProductGrid — CLIENT COMPONENT
 * Needs access to cart actions (addItem) so must be a Client Component.
 * Product DATA is received as serializable props from the server.
 */
import { useCartActions, useCartItems } from "@/store/use-cart-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  // Selector: only subscribes to items — not the whole store
  const items = useCartItems();
  const { addItem } = useCartActions();

  const isInCart = (id: string) => items.some((i) => i.id === id);

  const handleAdd = (product: Product) => {
    addItem(product);
    toast.success(`Added "${product.name}" to cart`, {
      description: `$${product.price.toFixed(2)}`,
    });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {products.map((product) => {
        const inCart = isInCart(product.id);
        return (
          <Card key={product.id} className="group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {product.category}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                  <p className="text-base font-bold text-primary mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={inCart ? "secondary" : "default"}
                  onClick={() => handleAdd(product)}
                  className="shrink-0"
                  aria-label={inCart ? `${product.name} already in cart` : `Add ${product.name} to cart`}
                >
                  {inCart ? (
                    <>
                      <Check className="h-3 w-3 mr-1" aria-hidden="true" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
