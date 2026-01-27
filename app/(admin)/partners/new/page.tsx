"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, PhoneInput } from "@/components/ui";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  User,
  Percent,
  CreditCard,
  Loader2,
} from "lucide-react";

// UAE Areas
const AREAS = [
  { value: "dubai-marina", label: "Dubai Marina" },
  { value: "downtown-dubai", label: "Downtown Dubai" },
  { value: "jbr", label: "Jumeirah Beach Residence" },
  { value: "difc", label: "DIFC" },
  { value: "business-bay", label: "Business Bay" },
  { value: "al-barsha", label: "Al Barsha" },
  { value: "palm-jumeirah", label: "Palm Jumeirah" },
  { value: "al-reem", label: "Al Reem Island" },
  { value: "al-maryah", label: "Al Maryah Island" },
  { value: "yas-island", label: "Yas Island" },
];

const CITIES = [
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
];

export default function NewPartnerPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    // Business Info
    businessName: "",
    tradeLicense: "",

    // Contact Person
    contactName: "",
    contactEmail: "",
    contactPhone: "",

    // Location
    address: "",
    area: "",
    city: "dubai",

    // Commission Terms
    defaultCommissionRate: "25",
    ivDripCommission: "25",
    bloodTestCommission: "20",
    supplementCommission: "15",

    // Bank Details
    bankName: "",
    accountNumber: "",
    iban: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.area) {
      newErrors.area = "Area is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    router.push("/partners");
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
          <span className="text-sm">Back to Partners</span>
        </button>

        <h1 className="text-3xl font-extralight text-white tracking-tight">
          Add Partner
        </h1>
        <p className="text-[#666666] mt-2 font-light">
          Create a new partner clinic or wellness center
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#E07A3C]/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-[#E07A3C]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Business Information</h2>
              <p className="text-xs text-[#666666]">Basic details about the partner</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Business Name"
              placeholder="e.g., Wellness Clinic Marina"
              value={formData.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              error={errors.businessName}
              required
            />

            <Input
              label="Trade License Number"
              placeholder="e.g., 123456"
              value={formData.tradeLicense}
              onChange={(e) => updateField("tradeLicense", e.target.value)}
              hint="Optional - for verification"
            />
          </div>
        </Card>

        {/* Contact Person */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <User className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Contact Person</h2>
              <p className="text-xs text-[#666666]">Primary contact for this partner</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g., Dr. Ahmed Al-Rashid"
              value={formData.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
              error={errors.contactName}
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@clinic.ae"
                value={formData.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                error={errors.contactEmail}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <PhoneInput
                label="Phone"
                value={formData.contactPhone}
                onChange={(value) => updateField("contactPhone", value)}
                error={errors.contactPhone}
              />
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Location</h2>
              <p className="text-xs text-[#666666]">Where services will be provided</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Address"
              placeholder="Building name, floor, unit"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              error={errors.address}
              leftIcon={<MapPin className="h-4 w-4" />}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Area"
                options={AREAS}
                value={formData.area}
                onChange={(value) => updateField("area", value)}
                placeholder="Select area"
                error={errors.area}
              />

              <Select
                label="City"
                options={CITIES}
                value={formData.city}
                onChange={(value) => updateField("city", value)}
              />
            </div>
          </div>
        </Card>

        {/* Commission Terms */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center">
              <Percent className="h-5 w-5 text-[#A855F7]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Commission Terms</h2>
              <p className="text-xs text-[#666666]">Partner commission rates by category</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
                  IV Drips
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ivDripCommission}
                    onChange={(e) => updateField("ivDripCommission", e.target.value)}
                    className="w-full px-4 py-3 pr-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl text-white font-light focus:border-[#E07A3C] focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
                  Blood Tests
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.bloodTestCommission}
                    onChange={(e) => updateField("bloodTestCommission", e.target.value)}
                    className="w-full px-4 py-3 pr-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl text-white font-light focus:border-[#E07A3C] focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
                  Supplements
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.supplementCommission}
                    onChange={(e) => updateField("supplementCommission", e.target.value)}
                    className="w-full px-4 py-3 pr-8 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl text-white font-light focus:border-[#E07A3C] focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">%</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#666666]">
              Commission is calculated on the net price (excluding VAT)
            </p>
          </div>
        </Card>

        {/* Bank Details */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-[#FBBF24]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Bank Details</h2>
              <p className="text-xs text-[#666666]">For commission payouts</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Bank Name"
              placeholder="e.g., Emirates NBD"
              value={formData.bankName}
              onChange={(e) => updateField("bankName", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Account Number"
                placeholder="Account number"
                value={formData.accountNumber}
                onChange={(e) => updateField("accountNumber", e.target.value)}
              />

              <Input
                label="IBAN"
                placeholder="AE12 3456 7890 1234 5678 901"
                value={formData.iban}
                onChange={(e) => updateField("iban", e.target.value)}
              />
            </div>
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
                Creating Partner...
              </>
            ) : (
              "Create Partner"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
