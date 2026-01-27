"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Avatar, Modal } from "@/components/ui";
import {
  Building2,
  Users,
  Bell,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Plus,
  MoreHorizontal,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock partner data
const MOCK_PARTNER = {
  id: "1",
  name: "Wellness Clinic Marina",
  logo: null,
  contactPerson: "Dr. Ahmed Al-Rashid",
  email: "admin@wellnessmarina.ae",
  phone: "+971 4 555 1234",
  location: {
    address: "Marina Plaza, Tower B, Suite 1201",
    area: "Dubai Marina",
    city: "Dubai",
  },
  commercialTerms: {
    ivDripCommission: 0.25,
    bloodTestCommission: 0.20,
    supplementCommission: 0.15,
  },
  bankDetails: {
    bankName: "Emirates NBD",
    accountName: "Wellness Clinic Marina LLC",
    iban: "AE•••• •••• •••• ••4521",
  },
};

// Mock team members
const MOCK_TEAM = [
  {
    id: "1",
    name: "Dr. Ahmed Al-Rashid",
    email: "ahmed@wellnessmarina.ae",
    role: "owner",
    status: "active",
  },
  {
    id: "2",
    name: "Sara Mohammed",
    email: "sara@wellnessmarina.ae",
    role: "manager",
    status: "active",
  },
  {
    id: "3",
    name: "Fatima Hassan",
    email: "fatima@wellnessmarina.ae",
    role: "staff",
    status: "active",
  },
  {
    id: "4",
    name: "Omar Khalid",
    email: "omar@wellnessmarina.ae",
    role: "staff",
    status: "invited",
  },
];

// Notification settings
const NOTIFICATION_SETTINGS = [
  {
    id: "new_booking",
    label: "New booking created",
    description: "Get notified when a new booking is created",
    enabled: true,
  },
  {
    id: "payment_received",
    label: "Payment received",
    description: "Get notified when a customer completes payment",
    enabled: true,
  },
  {
    id: "booking_cancelled",
    label: "Booking cancelled",
    description: "Get notified when a booking is cancelled",
    enabled: true,
  },
  {
    id: "daily_summary",
    label: "Daily summary",
    description: "Receive a daily summary of bookings and revenue",
    enabled: false,
  },
  {
    id: "weekly_report",
    label: "Weekly report",
    description: "Receive a weekly performance report",
    enabled: true,
  },
];

const TABS = [
  { id: "profile", label: "Profile", icon: <Building2 className="h-4 w-4" /> },
  { id: "team", label: "Team", icon: <Users className="h-4 w-4" /> },
  { id: "billing", label: "Billing", icon: <CreditCard className="h-4 w-4" /> },
  { id: "notifications", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabId>("profile");
  const [notifications, setNotifications] = React.useState(
    NOTIFICATION_SETTINGS.reduce((acc, n) => ({ ...acc, [n.id]: n.enabled }), {} as Record<string, boolean>)
  );

  // Edit Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: MOCK_PARTNER.name,
    contactPerson: MOCK_PARTNER.contactPerson,
    email: MOCK_PARTNER.email,
    phone: MOCK_PARTNER.phone,
    address: MOCK_PARTNER.location.address,
    area: MOCK_PARTNER.location.area,
    city: MOCK_PARTNER.location.city,
  });

  const partner = MOCK_PARTNER;
  const team = MOCK_TEAM;

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate total earnings
  const totalEarnings = 25602.15;
  const pendingPayout = 9912.70;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pt-6 pb-20 relative">
      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-0 h-10 w-10 rounded-full flex items-center justify-center text-[#666666] hover:bg-white hover:text-black transition-all"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Tab Navigation */}
      <div className="flex items-center p-1 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-light transition-all",
              activeTab === tab.id
                ? "bg-white text-black"
                : "text-[#666666] hover:text-white"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-12">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            {/* Business Header - Hero style */}
            <div className="flex items-start gap-8">
              {/* Logo with accent glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#E07A3C]/20 blur-2xl rounded-full" />
                <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center">
                  <span className="text-3xl font-light text-[#E07A3C]">
                    {partner.name.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-extralight text-white tracking-tight mb-2">
                  {partner.name}
                </h1>
                <p className="text-[#666666] font-light mb-6">
                  Managed by {partner.contactPerson}
                </p>

                {/* Contact Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-[#1F1F1F]">
                    <Mail className="h-4 w-4 text-[#555555]" />
                    <span className="text-sm text-[#A0A0A0] font-light">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-[#1F1F1F]">
                    <Phone className="h-4 w-4 text-[#555555]" />
                    <span className="text-sm text-[#A0A0A0] font-light">{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-[#1F1F1F]">
                    <MapPin className="h-4 w-4 text-[#555555]" />
                    <span className="text-sm text-[#A0A0A0] font-light">{partner.location.area}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2A2A2A] text-[#666666] text-sm hover:bg-white hover:text-black hover:border-white transition-all"
              >
                Edit Profile
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1F1F1F]" />

            {/* Commission Rates - Premium display */}
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-light text-white mb-1">Your Commission Rates</h3>
                <p className="text-sm text-[#555555]">Earn on every booking you create</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* IV Drips */}
                <div className="p-6 rounded-2xl bg-[#111111] border border-[#1F1F1F]">
                  <p className="text-xs text-[#555555] uppercase tracking-wider mb-3">IV Drips</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extralight text-white tabular-nums">
                      {(partner.commercialTerms.ivDripCommission * 100).toFixed(0)}
                    </span>
                    <span className="text-xl text-[#555555]">%</span>
                  </div>
                </div>

                {/* Blood Tests */}
                <div className="p-6 rounded-2xl bg-[#111111] border border-[#1F1F1F]">
                  <p className="text-xs text-[#555555] uppercase tracking-wider mb-3">Blood Tests</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extralight text-white tabular-nums">
                      {(partner.commercialTerms.bloodTestCommission * 100).toFixed(0)}
                    </span>
                    <span className="text-xl text-[#555555]">%</span>
                  </div>
                </div>

                {/* Supplements */}
                <div className="p-6 rounded-2xl bg-[#111111] border border-[#1F1F1F]">
                  <p className="text-xs text-[#555555] uppercase tracking-wider mb-3">Supplements</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extralight text-white tabular-nums">
                      {(partner.commercialTerms.supplementCommission * 100).toFixed(0)}
                    </span>
                    <span className="text-xl text-[#555555]">%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <>
            {/* Team Header with count */}
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-extralight text-white tabular-nums">{team.length}</span>
                  <span className="text-lg text-[#555555] font-light">team members</span>
                </div>
                <p className="text-sm text-[#555555]">
                  Owners have full access · Managers create bookings · Staff view only
                </p>
              </div>
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Invite Member
              </Button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1F1F1F]" />

            {/* Team List */}
            <div className="space-y-2">
              {team.map((member, index) => {
                const isOwner = member.role === "owner";
                const isInvited = member.status === "invited";

                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-5 p-5 rounded-2xl border transition-all",
                      isOwner
                        ? "bg-[#E07A3C]/5 border-[#E07A3C]/20"
                        : "border-transparent hover:bg-[#111111] hover:border-[#1F1F1F]"
                    )}
                  >
                    <Avatar name={member.name} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-light text-white">{member.name}</h4>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs capitalize",
                          isOwner ? "bg-[#E07A3C]/20 text-[#E07A3C]" :
                          member.role === "manager" ? "bg-[#3B82F6]/10 text-[#3B82F6]" :
                          "bg-[#666666]/10 text-[#A0A0A0]"
                        )}>
                          {member.role}
                        </span>
                        {isInvited && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#FBBF24]/10 text-[#FBBF24]">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#555555]">{member.email}</p>
                    </div>

                    {!isOwner && (
                      <button className="h-10 w-10 rounded-full border border-[#2A2A2A] flex items-center justify-center text-[#666666] hover:bg-white hover:text-black hover:border-white transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <>
            {/* Earnings Overview */}
            <div className="flex items-center gap-20">
              <div>
                <p className="text-sm text-[#555555] mb-2">Total Earned</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extralight text-white tabular-nums">
                    {totalEarnings.toLocaleString()}
                  </span>
                  <span className="text-lg text-[#555555]">AED</span>
                </div>
              </div>
              <div className="h-16 w-px bg-[#1F1F1F]" />
              <div>
                <p className="text-sm text-[#E07A3C] mb-2">Pending Payout</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extralight text-[#E07A3C] tabular-nums">
                    {pendingPayout.toLocaleString()}
                  </span>
                  <span className="text-lg text-[#555555]">AED</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1F1F1F]" />

            {/* Bank Account */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs text-[#555555] uppercase tracking-wider">
                  Payout Account
                </h3>
                <button className="text-xs text-[#666666] hover:text-white transition-colors">
                  Change
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#111111] border border-[#2A2A2A]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-light text-white mb-1">{partner.bankDetails.bankName}</p>
                    <p className="text-[#555555] font-light">{partner.bankDetails.accountName}</p>
                    <p className="text-[#666666] font-mono mt-4 text-sm tracking-wider">
                      {partner.bankDetails.iban}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4ADE80]/10 text-[#4ADE80] text-xs">
                    <Check className="h-3.5 w-3.5" />
                    Verified
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#555555] mt-4">
                Payouts are processed by the 10th of each month
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1F1F1F]" />

            {/* Payment History */}
            <div>
              <h3 className="text-xs text-[#555555] uppercase tracking-wider mb-6">
                Recent Payouts
              </h3>

              <div className="space-y-3">
                {[
                  { month: "January 2025", amount: 9912.70, status: "pending" },
                  { month: "December 2024", amount: 8455.30, status: "paid" },
                  { month: "November 2024", amount: 7234.15, status: "paid" },
                ].map((payment, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-2xl border transition-all",
                      payment.status === "pending"
                        ? "bg-[#E07A3C]/5 border-[#E07A3C]/20"
                        : "border-transparent hover:bg-[#111111] hover:border-[#1F1F1F]"
                    )}
                  >
                    <div>
                      <p className="text-white font-light text-lg">{payment.month}</p>
                      <p className="text-sm text-[#555555]">Commission payout</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extralight text-white tabular-nums">
                        {payment.amount.toLocaleString()}
                        <span className="text-sm text-[#555555] ml-2">AED</span>
                      </p>
                      <p className={cn(
                        "text-xs mt-1",
                        payment.status === "paid" ? "text-[#4ADE80]" : "text-[#E07A3C]"
                      )}>
                        {payment.status === "paid" ? "Completed" : "Processing"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3.5 rounded-full border border-[#2A2A2A] text-[#666666] text-sm font-light hover:bg-white hover:text-black hover:border-white transition-all">
                View All History
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <>
            {/* Header */}
            <div>
              <h2 className="text-2xl font-extralight text-white mb-2">
                Email Notifications
              </h2>
              <p className="text-[#555555]">
                Choose what you want to be notified about
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1F1F1F]" />

            {/* Notification List */}
            <div className="space-y-4">
              {NOTIFICATION_SETTINGS.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-5 rounded-2xl border border-transparent hover:bg-[#111111] hover:border-[#1F1F1F] transition-all"
                >
                  <div className="flex-1 pr-8">
                    <p className="text-white font-light text-lg mb-1">{setting.label}</p>
                    <p className="text-sm text-[#555555]">
                      {setting.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleNotification(setting.id)}
                    className={cn(
                      "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                      notifications[setting.id]
                        ? "bg-[#E07A3C]"
                        : "bg-[#2A2A2A]"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                        notifications[setting.id]
                          ? "translate-x-6"
                          : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#555555]">
              Notifications are sent to {partner.email}
            </p>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        description="Update your business information"
        size="lg"
        footer={
          <>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-[#2A2A2A] text-[#666666] text-sm font-light hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // In a real app, save changes here
                setIsEditModalOpen(false);
              }}
              className="px-5 py-2.5 rounded-full bg-[#E07A3C] text-white text-sm font-light hover:bg-[#C96A32] transition-all"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={editForm.contactPerson}
              onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
            />
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="pt-4 border-t border-[#1F1F1F]">
            <p className="text-xs text-[#555555] uppercase tracking-wider mb-4">Location</p>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
                Address
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
              />
            </div>

            {/* Area & City Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
                  Area
                </label>
                <input
                  type="text"
                  value={editForm.area}
                  onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#555555] uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white font-light placeholder:text-[#555555] focus:outline-none focus:border-[#E07A3C] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
