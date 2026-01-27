"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, DollarSign } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  duration?: string;
  category?: string;
  imageUrl?: string;
}

export interface ProductCardProps {
  product: Product;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function ProductCard({
  product,
  selected = false,
  onSelect,
  className,
}: ProductCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-2xl p-5 transition-all duration-200",
        "bg-[#111111] border",
        selected
          ? "border-[#E07A3C] ring-1 ring-[#E07A3C]/30"
          : "border-[#1F1F1F] hover:border-[#2A2A2A]",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Product image or placeholder */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#E07A3C]/20 to-[#E07A3C]/5 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl text-[#E07A3C]">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              {product.category && (
                <span className="text-xs text-[#E07A3C] uppercase tracking-wider">
                  {product.category}
                </span>
              )}
              <h3 className="text-white font-light text-lg mt-0.5">
                {product.name}
              </h3>
            </div>

            {/* Selection indicator */}
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                selected
                  ? "bg-[#E07A3C] text-white"
                  : "bg-[#1A1A1A] border border-[#2A2A2A]"
              )}
            >
              {selected && <Check className="h-4 w-4" />}
            </div>
          </div>

          <p className="text-[#666666] text-sm mt-1 line-clamp-2">
            {product.description}
          </p>

          {/* Price and duration */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-white">
              <span className="text-sm text-[#666666]">
                {product.currency || "AED"}
              </span>
              <span className="text-lg font-light">{product.price}</span>
            </div>

            {product.duration && (
              <div className="flex items-center gap-1.5 text-[#666666]">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{product.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// Grid variant for displaying multiple products
export interface ProductGridProps {
  products: Product[];
  selectedId?: string;
  onSelect?: (product: Product) => void;
  className?: string;
}

export function ProductGrid({
  products,
  selectedId,
  onSelect,
  className,
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selected={selectedId === product.id}
          onSelect={() => onSelect?.(product)}
        />
      ))}
    </div>
  );
}
