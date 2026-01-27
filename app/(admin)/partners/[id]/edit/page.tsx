"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
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
  Trash2,
  Power,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock partner data
const MOCK_PARTNER = {
  id: "1",
  businessName: "Wellness Clinic Marina",
  tradeLicense: "TL-789456",
  contactName: "Dr. Ahmed Al-Rashid",
  contactEmail: "admin@wellnessmarina.ae",
  contactPhone: "+971 50 123 4567",
  address: "Marina Plaza Tower, Floor 12, Unit 1205",
  area: "dubai-marina",
  city: "dubai",
  status: "active",
  ivDripCommission: "25",
  bloodTestCommission: "20",
  supplementCommission: "15",
  bankName: "Emirates NBD",
  accountNumber: "1234567890",
  iban: "AE12 3456 7890 1234 5678 901",
};

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

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;

  const [saving, setSaving] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Form state initialized with mock data
  const [formData, setFormData] = React.useState({
    businessName: MOCK_PARTNER.businessName,
    tradeLicense: MOCK_PARTNER.tradeLicense,
    contactName: MOCK_PARTNER.contactName,
    contactEmail: MOCK_PARTNER.contactEmail,
    contactPhone: MOCK_PARTNER.contactPhone,
    address: MOCK_PARTNER.address,
    area: MOCK_PARTNER.area,
    city: MOCK_PARTNER.city,
    status: MOCK_PARTNER.status,
    ivDripCommission: MOCK_PARTNER.ivDripCommission,
    bloodTestCommission: MOCK_PARTNER.bloodTestCommission,
    supplementCommission: MOCK_PARTNER.supplementCommission,
    bankName: MOCK_PARTNER.bankName,
    accountNumber: MOCK_PARTNER.accountNumber,
    iban: MOCK_PARTNER.iban,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    router.push(`/partners/${partnerId}`);
  };

  const handleToggleStatus = async () => {
    const newStatus = formData.status === "active" ? "inactive" : "active";
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleDelete = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
          <span className="text-sm">Back to Partner</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extralight text-white tracking-tight">
              Edit Partner
            </h1>
            <p className="text-[#666666] mt-2 font-light">
              Update partner information
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                formData.status === "active"
                  ? "border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/10"
                  : "border-[#666666]/30 text-[#666666] hover:bg-[#666666]/10"
              )}
            >
              <Power className="h-4 w-4" />
              <span className="text-sm capitalize">{formData.status}</span>
            </button>
          </div>
        </div>
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

        {/* Danger Zone */}
        <Card padding="lg" className="bg-[#111111] border-[#F87171]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#F87171]/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-[#F87171]" />
            </div>
            <div>
              <h2 className="text-white font-light text-lg">Danger Zone</h2>
              <p className="text-xs text-[#666666]">Irreversible actions</p>
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="p-4 rounded-xl bg-[#F87171]/10 border border-[#F87171]/20">
              <p className="text-white font-light mb-4">
                Are you sure you want to delete this partner? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete Partner"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-[#F87171] hover:text-[#F87171] hover:bg-[#F87171]/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Partner
            </Button>
          )}
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
