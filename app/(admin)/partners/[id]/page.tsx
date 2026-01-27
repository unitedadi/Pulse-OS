"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Button,
  MetricCard,
  MetricGrid,
  StatusBadge,
  Table,
} from "@/components/ui";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Percent,
  Edit,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock partner data
const MOCK_PARTNER = {
  id: "1",
  name: "Wellness Clinic Marina",
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
    iban: "AE07 0330 0000 1234 5678 901",
  },
  xeroContactId: "XC-12345",
  status: "active",
  createdAt: new Date(2024, 5, 15),
  updatedAt: new Date(2025, 0, 20),
};

// Mock stats
const MOCK_STATS = {
  totalBookings: 156,
  monthlyBookings: 47,
  lifetimeRevenue: 142350,
  monthlyRevenue: 42350,
  totalCommission: 32450,
  monthlyCommission: 10287,
  teamMembers: 4,
  avgBookingsPerDay: 1.5,
};

// Mock recent bookings
const MOCK_RECENT_BOOKINGS = [
  {
    id: "BK-156",
    customer: "Sarah Chen",
    product: "IV Therapy",
    date: new Date(2025, 0, 25),
    amount: 450,
    status: "completed" as const,
  },
  {
    id: "BK-155",
    customer: "Mohammed Al-Hassan",
    product: "Blood Test Panel",
    date: new Date(2025, 0, 24),
    amount: 350,
    status: "completed" as const,
  },
  {
    id: "BK-154",
    customer: "Emma Wilson",
    product: "Vitamin Infusion",
    date: new Date(2025, 0, 24),
    amount: 550,
    status: "upcoming" as const,
  },
  {
    id: "BK-153",
    customer: "Ahmed Khalid",
    product: "IV Therapy",
    date: new Date(2025, 0, 23),
    amount: 450,
    status: "completed" as const,
  },
  {
    id: "BK-152",
    customer: "Lisa Park",
    product: "Health Checkup",
    date: new Date(2025, 0, 22),
    amount: 600,
    status: "cancelled" as const,
  },
];

export default function PartnerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;

  const partner = MOCK_PARTNER;
  const stats = MOCK_STATS;
  const recentBookings = MOCK_RECENT_BOOKINGS;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Table columns for recent bookings
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (row: typeof recentBookings[0]) => (
        <span className="text-[#A0A0A0] font-mono text-sm">{row.id}</span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row: typeof recentBookings[0]) => (
        <span className="text-white font-light">{row.customer}</span>
      ),
    },
    {
      key: "product",
      header: "Service",
      hideOnMobile: true,
      render: (row: typeof recentBookings[0]) => (
        <span className="text-[#A0A0A0]">{row.product}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      hideOnMobile: true,
      render: (row: typeof recentBookings[0]) => (
        <span className="text-[#A0A0A0]">{formatDate(row.date)}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right" as const,
      render: (row: typeof recentBookings[0]) => (
        <span className="text-white font-light">AED {row.amount}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "right" as const,
      render: (row: typeof recentBookings[0]) => (
        <StatusBadge status={row.status} size="sm" />
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Partners</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
              <Building2 className="h-8 w-8 text-[#666666]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extralight text-white tracking-tight">
                  {partner.name}
                </h1>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    partner.status === "active"
                      ? "bg-[#4ADE80]/10 text-[#4ADE80]"
                      : "bg-[#666666]/10 text-[#666666]"
                  )}
                >
                  {partner.status}
                </span>
              </div>
              <p className="text-[#666666] font-light">
                Partner since {formatDate(partner.createdAt)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push(`/partners/${partnerId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Portal
            </Button>
            <Button variant="ghost">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <MetricGrid columns={4} className="mb-8">
        <MetricCard
          label="Monthly Bookings"
          value={stats.monthlyBookings}
          subtitle={`${stats.totalBookings} lifetime`}
          icon={<Calendar className="h-5 w-5 text-[#3B82F6]" />}
        />
        <MetricCard
          label="Monthly Revenue"
          value={stats.monthlyRevenue.toLocaleString()}
          prefix="AED"
          subtitle={`AED ${stats.lifetimeRevenue.toLocaleString()} lifetime`}
          icon={<DollarSign className="h-5 w-5 text-[#4ADE80]" />}
        />
        <MetricCard
          label="Monthly Commission"
          value={stats.monthlyCommission.toLocaleString()}
          prefix="AED"
          variant="highlight"
          subtitle={`AED ${stats.totalCommission.toLocaleString()} lifetime`}
          icon={<TrendingUp className="h-5 w-5 text-[#E07A3C]" />}
        />
        <MetricCard
          label="Team Members"
          value={stats.teamMembers}
          icon={<Users className="h-5 w-5 text-[#A855F7]" />}
        />
      </MetricGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
            <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-6">
              Contact Information
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[#666666] mt-0.5" />
                <div>
                  <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">
                    Contact Person
                  </p>
                  <p className="text-white font-light">{partner.contactPerson}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#666666] mt-0.5" />
                <div>
                  <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-white font-light">{partner.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#666666] mt-0.5" />
                <div>
                  <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-white font-light">{partner.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#666666] mt-0.5" />
                <div>
                  <p className="text-xs text-[#666666] uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-white font-light">{partner.location.address}</p>
                  <p className="text-[#666666] text-sm">
                    {partner.location.area}, {partner.location.city}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-light text-white">Recent Bookings</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <Table
              columns={columns}
              data={recentBookings}
              keyExtractor={(row) => row.id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Commission Rates */}
          <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
            <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
              Commission Rates
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]">
                <span className="text-[#A0A0A0] font-light">IV Drips</span>
                <span className="text-[#E07A3C] font-light">
                  {(partner.commercialTerms.ivDripCommission * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]">
                <span className="text-[#A0A0A0] font-light">Blood Tests</span>
                <span className="text-[#E07A3C] font-light">
                  {(partner.commercialTerms.bloodTestCommission * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]">
                <span className="text-[#A0A0A0] font-light">Supplements</span>
                <span className="text-[#E07A3C] font-light">
                  {(partner.commercialTerms.supplementCommission * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Bank Details */}
          <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
            <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
              Bank Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#666666] mb-1">Bank</p>
                <p className="text-white font-light">{partner.bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-xs text-[#666666] mb-1">Account Name</p>
                <p className="text-white font-light">{partner.bankDetails.accountName}</p>
              </div>
              <div>
                <p className="text-xs text-[#666666] mb-1">IBAN</p>
                <p className="text-white font-light font-mono text-sm">
                  {partner.bankDetails.iban}
                </p>
              </div>
            </div>
          </Card>

          {/* Integration */}
          <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
            <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
              Integrations
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]">
              <span className="text-[#A0A0A0] font-light">Xero Contact</span>
              <span className="text-white font-mono text-sm">
                {partner.xeroContactId || "Not linked"}
              </span>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card padding="md" className="bg-[#111111] border-[#1F1F1F]">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-3" />
                Send Statement
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-3" />
                Manage Team
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[#F87171]">
                Deactivate Partner
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
