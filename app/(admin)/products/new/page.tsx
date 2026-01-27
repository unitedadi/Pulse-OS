"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Textarea } from "@/components/ui";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Percent,
  Droplet,
  TestTube,
  Pill,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProductCategory = "iv_drip" | "blood_test" | "supplement";

const CATEGORY_OPTIONS: { value: ProductCategory; label: string; icon: React.ElementType; color: string; description: string }[] = [
  {
    value: "iv_drip",
    label: "IV Drips",
    icon: Droplet,
    color: "#3B82F6",
    description: "Intravenous therapy treatments"
  },
  {
    value: "blood_test",
    label: "Blood Tests",
    icon: TestTube,
    color: "#EF4444",
    description: "Laboratory diagnostic tests"
  },
  {
    value: "supplement",
    label: "Supplements",
    icon: Pill,
    color: "#22C55E",
    description: "Vitamins and health supplements"
  },
];

const DEFAULT_COMMISSIONS: Record<ProductCategory, string> = {
  iv_drip: "25",
  blood_test: "20",
  supplement: "15",
};

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    category: "" as ProductCategory | "",
    priceExVat: "",
    commissionRate: "",
    sku: "",
    duration: "30",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Calculate VAT and total price
  const priceExVat = parseFloat(formData.priceExVat) || 0;
  const vatRate = 0.05; // 5% UAE VAT
  const vatAmount = priceExVat * vatRate;
  const totalPrice = priceExVat + vatAmount;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategorySelect = (category: ProductCategory) => {
    setFormData((prev) => ({
      ...prev,
      category,
      commissionRate: DEFAULT_COMMISSIONS[category],
    }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.priceExVat || parseFloat(formData.priceExVat) <= 0) {
      newErrors.priceExVat = "Valid price is required";
    }
    if (!formData.commissionRate || parseFloat(formData.commissionRate) < 0 || parseFloat(formData.commissionRate) > 100) {
      newErrors.commissionRate = "Commission must be between 0-100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    router.push("/products");
  };

  return (
    <div className="max-w-3xl pb-20">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Products</span>
        </button>

        <h1 className="text-3xl font-extralight text-white tracking-tight">
          Add Product
        </h1>
        <p className="text-[#666666] mt-2 font-light">
          Create a new service or product
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <h2 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
            Product Category
          </h2>

          {errors.category && (
            <p className="text-sm text-[#F87171] mb-4">{errors.category}</p>
          )}

          <div className="grid grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.category === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCategorySelect(option.value)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    isSelected
                      ? "border-[#E07A3C]/30 bg-[#E07A3C]/10"
                      : "border-[#1F1F1F] bg-[#0A0A0A] hover:border-[#2A2A2A]"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: option.color }} />
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-[#E07A3C]" />
                    )}
                  </div>
                  <h3 className="text-white font-light">{option.label}</h3>
                  <p className="text-xs text-[#666666] mt-1">{option.description}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Product Details */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#E07A3C]/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-[#E07A3C]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Product Details</h2>
              <p className="text-xs text-[#666666]">Basic information about the product</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g., Hydration Boost IV"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              error={errors.name}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe what this product includes and its benefits..."
              value={formData.description}
              onChange={(value) => updateField("description", value)}
              error={errors.description}
              rows={3}
              maxLength={500}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="SKU (Optional)"
                placeholder="e.g., IV-HYD-001"
                value={formData.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                hint="Internal reference code"
              />

              {formData.category === "iv_drip" && (
                <Select
                  label="Duration (minutes)"
                  options={[
                    { value: "30", label: "30 minutes" },
                    { value: "45", label: "45 minutes" },
                    { value: "60", label: "60 minutes" },
                    { value: "90", label: "90 minutes" },
                  ]}
                  value={formData.duration}
                  onChange={(value) => updateField("duration", value)}
                />
              )}
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Pricing</h2>
              <p className="text-xs text-[#666666]">Set the price for this product</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
                Price (excl. VAT) <span className="text-[#F87171]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]">AED</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceExVat}
                  onChange={(e) => updateField("priceExVat", e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "w-full pl-14 pr-4 py-3 bg-[#0A0A0A] border rounded-xl text-white font-light focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20",
                    errors.priceExVat
                      ? "border-[#F87171] focus:border-[#F87171]"
                      : "border-[#1F1F1F] focus:border-[#E07A3C]"
                  )}
                />
              </div>
              {errors.priceExVat && (
                <p className="text-sm text-[#F87171] mt-1">{errors.priceExVat}</p>
              )}
            </div>

            {/* Price Breakdown */}
            {priceExVat > 0 && (
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]">
                <h4 className="text-xs text-[#666666] uppercase tracking-wider mb-3">
                  Price Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0A0]">Price (excl. VAT)</span>
                    <span className="text-white font-light">AED {priceExVat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A0A0A0]">VAT (5%)</span>
                    <span className="text-white font-light">AED {vatAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-[#1F1F1F]">
                    <span className="text-white">Total Price</span>
                    <span className="text-white font-medium">AED {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Commission */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center">
              <Percent className="h-5 w-5 text-[#A855F7]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Commission</h2>
              <p className="text-xs text-[#666666]">Partner commission rate for this product</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
                Commission Rate <span className="text-[#F87171]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commissionRate}
                  onChange={(e) => updateField("commissionRate", e.target.value)}
                  placeholder="0"
                  className={cn(
                    "w-full px-4 py-3 pr-8 bg-[#0A0A0A] border rounded-xl text-white font-light focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20",
                    errors.commissionRate
                      ? "border-[#F87171] focus:border-[#F87171]"
                      : "border-[#1F1F1F] focus:border-[#E07A3C]"
                  )}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">%</span>
              </div>
              {errors.commissionRate && (
                <p className="text-sm text-[#F87171] mt-1">{errors.commissionRate}</p>
              )}
            </div>

            {/* Commission Calculation */}
            {priceExVat > 0 && formData.commissionRate && (
              <div className="p-4 rounded-xl bg-[#E07A3C]/5 border border-[#E07A3C]/20">
                <p className="text-sm text-[#A0A0A0]">
                  Partner earns{" "}
                  <span className="text-[#E07A3C] font-medium">
                    AED {(priceExVat * (parseFloat(formData.commissionRate) / 100)).toFixed(2)}
                  </span>{" "}
                  per booking
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="flex-1"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
