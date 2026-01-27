"use client";

import * as React from "react";
import { Card, Button, SearchInput } from "@/components/ui";
import {
  Package,
  Plus,
  Edit,
  MoreHorizontal,
  GripVertical,
  Droplet,
  TestTube,
  Pill,
  DollarSign,
  Percent,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProductCategory = "iv_drip" | "blood_test" | "supplement";

interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  priceExVat: number;
  vatAmount: number;
  commissionRate: number;
  status: "active" | "inactive";
  sortOrder: number;
}

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Hydration Boost IV",
    description: "Replenish fluids and essential electrolytes for optimal hydration",
    category: "iv_drip",
    price: 450,
    priceExVat: 428.57,
    vatAmount: 21.43,
    commissionRate: 0.25,
    status: "active",
    sortOrder: 1,
  },
  {
    id: "2",
    name: "Vitamin C Infusion",
    description: "High-dose vitamin C to support immune function",
    category: "iv_drip",
    price: 550,
    priceExVat: 523.81,
    vatAmount: 26.19,
    commissionRate: 0.25,
    status: "active",
    sortOrder: 2,
  },
  {
    id: "3",
    name: "Energy Boost Drip",
    description: "B-vitamins and amino acids for sustained energy",
    category: "iv_drip",
    price: 600,
    priceExVat: 571.43,
    vatAmount: 28.57,
    commissionRate: 0.25,
    status: "active",
    sortOrder: 3,
  },
  {
    id: "4",
    name: "Complete Blood Panel",
    description: "Comprehensive blood analysis covering 40+ markers",
    category: "blood_test",
    price: 350,
    priceExVat: 333.33,
    vatAmount: 16.67,
    commissionRate: 0.20,
    status: "active",
    sortOrder: 4,
  },
  {
    id: "5",
    name: "Hormone Panel",
    description: "Full hormone assessment including thyroid markers",
    category: "blood_test",
    price: 500,
    priceExVat: 476.19,
    vatAmount: 23.81,
    commissionRate: 0.20,
    status: "active",
    sortOrder: 5,
  },
  {
    id: "6",
    name: "Vitamin D Test",
    description: "Check your vitamin D levels",
    category: "blood_test",
    price: 150,
    priceExVat: 142.86,
    vatAmount: 7.14,
    commissionRate: 0.20,
    status: "inactive",
    sortOrder: 6,
  },
  {
    id: "7",
    name: "Wellness Multivitamin",
    description: "Daily multivitamin supplement pack (30 days)",
    category: "supplement",
    price: 120,
    priceExVat: 114.29,
    vatAmount: 5.71,
    commissionRate: 0.15,
    status: "active",
    sortOrder: 7,
  },
  {
    id: "8",
    name: "Omega-3 Fish Oil",
    description: "Premium fish oil capsules (60 count)",
    category: "supplement",
    price: 95,
    priceExVat: 90.48,
    vatAmount: 4.52,
    commissionRate: 0.15,
    status: "active",
    sortOrder: 8,
  },
];

const CATEGORY_CONFIG: Record<ProductCategory, { label: string; icon: React.ElementType; color: string }> = {
  iv_drip: { label: "IV Drips", icon: Droplet, color: "#3B82F6" },
  blood_test: { label: "Blood Tests", icon: TestTube, color: "#EF4444" },
  supplement: { label: "Supplements", icon: Pill, color: "#22C55E" },
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<ProductCategory | "all">("all");
  const [products, setProducts] = React.useState(MOCK_PRODUCTS);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false;

    // Search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  // Group by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<ProductCategory, Product[]>);

  // Stats
  const activeProducts = products.filter((p) => p.status === "active").length;
  const categories = Object.keys(CATEGORY_CONFIG) as ProductCategory[];

  const toggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extralight text-white tracking-tight">
            Products
          </h1>
          <p className="text-[#666666] mt-2 font-light">
            Manage services and products available on Pulse OS
          </p>
        </div>

        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card padding="md" className="bg-[#111111] border-[#1F1F1F]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">
            Total Products
          </p>
          <p className="text-3xl font-extralight text-white mt-1">
            {products.length}
          </p>
        </Card>

        <Card padding="md" className="bg-[#111111] border-[#1F1F1F]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">
            Active
          </p>
          <p className="text-3xl font-extralight text-[#4ADE80] mt-1">
            {activeProducts}
          </p>
        </Card>

        <Card padding="md" className="bg-[#111111] border-[#1F1F1F]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">
            Categories
          </p>
          <p className="text-3xl font-extralight text-white mt-1">
            {categories.length}
          </p>
        </Card>

        <Card padding="md" className="bg-[#111111] border-[#1F1F1F]">
          <p className="text-xs text-[#666666] uppercase tracking-wider">
            Avg Commission
          </p>
          <p className="text-3xl font-extralight text-[#E07A3C] mt-1">
            {Math.round(
              (products.reduce((sum, p) => sum + p.commissionRate, 0) / products.length) * 100
            )}%
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 p-1 bg-[#111111] rounded-xl border border-[#1F1F1F]">
          <button
            onClick={() => setCategoryFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-light transition-all",
              categoryFilter === "all"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#666666] hover:text-white"
            )}
          >
            All
          </button>
          {categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-all",
                  categoryFilter === cat
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#666666] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" style={{ color: config.color }} />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products by Category */}
      {categoryFilter === "all" ? (
        // Show grouped by category
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryProducts = groupedProducts[category] || [];
            if (categoryProducts.length === 0) return null;

            const config = CATEGORY_CONFIG[category];
            const Icon = config.icon;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  <h2 className="text-lg font-light text-white">{config.label}</h2>
                  <span className="text-sm text-[#666666]">
                    ({categoryProducts.length})
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onToggleStatus={() => toggleProductStatus(product.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Show flat list for single category
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onToggleStatus={() => toggleProductStatus(product.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-[#444444] mx-auto mb-4" />
            <h3 className="text-white font-light text-lg mb-2">No products found</h3>
            <p className="text-[#666666] text-sm">
              {searchQuery ? "Try adjusting your search" : "Add a product to get started"}
            </p>
          </div>
        </Card>
      )}

      {/* Summary */}
      <div className="pt-6 border-t border-[#1F1F1F]">
        <p className="text-sm text-[#666666]">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}

// Product Row Component
function ProductRow({
  product,
  onToggleStatus,
}: {
  product: Product;
  onToggleStatus: () => void;
}) {
  const config = CATEGORY_CONFIG[product.category];

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-[#1F1F1F] group",
        product.status === "inactive" && "opacity-60"
      )}
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-[#444444] hover:text-[#666666]">
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-white font-light">{product.name}</h3>
          {product.status === "inactive" && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-[#666666]/10 text-[#666666]">
              Inactive
            </span>
          )}
        </div>
        <p className="text-sm text-[#666666] truncate">{product.description}</p>
      </div>

      {/* Price */}
      <div className="text-right hidden sm:block">
        <div className="flex items-center gap-1 text-white font-light">
          <DollarSign className="h-4 w-4 text-[#666666]" />
          AED {product.price}
        </div>
        <p className="text-xs text-[#666666]">
          excl. VAT: {product.priceExVat.toFixed(2)}
        </p>
      </div>

      {/* Commission */}
      <div className="text-right hidden md:block">
        <div className="flex items-center gap-1 text-[#E07A3C] font-light">
          <Percent className="h-4 w-4" />
          {(product.commissionRate * 100).toFixed(0)}%
        </div>
        <p className="text-xs text-[#666666]">commission</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStatus}
          className={cn(
            "p-2 rounded-lg transition-colors",
            product.status === "active"
              ? "text-[#4ADE80] hover:bg-[#4ADE80]/10"
              : "text-[#666666] hover:bg-[#666666]/10"
          )}
          title={product.status === "active" ? "Deactivate" : "Activate"}
        >
          {product.status === "active" ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
        <button className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-colors">
          <Edit className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
