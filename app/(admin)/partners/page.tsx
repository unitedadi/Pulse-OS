"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  SearchInput,
  Pagination,
  MetricCard,
  MetricGrid,
} from "@/components/ui";
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock partners data
const MOCK_PARTNERS = [
  {
    id: "1",
    name: "Wellness Clinic Marina",
    contactPerson: "Dr. Ahmed Al-Rashid",
    email: "admin@wellnessmarina.ae",
    phone: "+971 4 555 1234",
    location: {
      area: "Dubai Marina",
      city: "Dubai",
    },
    status: "active",
    totalBookings: 47,
    monthlyRevenue: 42350,
    commissionRate: 0.25,
  },
  {
    id: "2",
    name: "Health Hub JBR",
    contactPerson: "Sara Mohammed",
    email: "contact@healthhubjbr.ae",
    phone: "+971 4 555 5678",
    location: {
      area: "Jumeirah Beach Residence",
      city: "Dubai",
    },
    status: "active",
    totalBookings: 32,
    monthlyRevenue: 28500,
    commissionRate: 0.22,
  },
  {
    id: "3",
    name: "Vitality Center Downtown",
    contactPerson: "Omar Khalid",
    email: "info@vitalitydowntown.ae",
    phone: "+971 4 555 9012",
    location: {
      area: "Downtown Dubai",
      city: "Dubai",
    },
    status: "active",
    totalBookings: 58,
    monthlyRevenue: 51200,
    commissionRate: 0.25,
  },
  {
    id: "4",
    name: "Pure Health Abu Dhabi",
    contactPerson: "Fatima Hassan",
    email: "info@purehealth.ae",
    phone: "+971 2 555 3456",
    location: {
      area: "Al Reem Island",
      city: "Abu Dhabi",
    },
    status: "active",
    totalBookings: 23,
    monthlyRevenue: 19800,
    commissionRate: 0.20,
  },
  {
    id: "5",
    name: "Serenity Spa DIFC",
    contactPerson: "Lisa Park",
    email: "hello@serenitydifc.ae",
    phone: "+971 4 555 7890",
    location: {
      area: "DIFC",
      city: "Dubai",
    },
    status: "inactive",
    totalBookings: 0,
    monthlyRevenue: 0,
    commissionRate: 0.23,
  },
];

export default function PartnersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");

  // Filter partners
  const filteredPartners = MOCK_PARTNERS.filter((partner) => {
    // Status filter
    if (statusFilter !== "all" && partner.status !== statusFilter) return false;

    // Search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      partner.name.toLowerCase().includes(query) ||
      partner.contactPerson.toLowerCase().includes(query) ||
      partner.location.area.toLowerCase().includes(query) ||
      partner.location.city.toLowerCase().includes(query)
    );
  });

  // Sort by monthly revenue
  const sortedPartners = [...filteredPartners].sort(
    (a, b) => b.monthlyRevenue - a.monthlyRevenue
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedPartners.length / itemsPerPage);
  const paginatedPartners = sortedPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const activePartners = MOCK_PARTNERS.filter((p) => p.status === "active").length;
  const totalMonthlyRevenue = MOCK_PARTNERS.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const totalBookings = MOCK_PARTNERS.reduce((sum, p) => sum + p.totalBookings, 0);
  const avgCommission = MOCK_PARTNERS.reduce((sum, p) => sum + p.commissionRate, 0) / MOCK_PARTNERS.length;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extralight text-white tracking-tight">
            Partners
          </h1>
          <p className="text-[#666666] mt-2 font-light">
            Manage partner clinics and wellness centers
          </p>
        </div>

        <Button variant="accent">
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats */}
      <MetricGrid columns={4}>
        <MetricCard
          label="Active Partners"
          value={activePartners}
          icon={<Building2 className="h-5 w-5 text-[#4ADE80]" />}
        />
        <MetricCard
          label="Total Bookings"
          value={totalBookings}
          subtitle="This month"
          icon={<Users className="h-5 w-5 text-[#3B82F6]" />}
        />
        <MetricCard
          label="Monthly Revenue"
          value={totalMonthlyRevenue.toLocaleString()}
          prefix="AED"
          icon={<DollarSign className="h-5 w-5 text-[#E07A3C]" />}
        />
        <MetricCard
          label="Avg Commission"
          value={`${(avgCommission * 100).toFixed(0)}%`}
          icon={<TrendingUp className="h-5 w-5 text-[#A855F7]" />}
        />
      </MetricGrid>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search partners..."
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 p-1 bg-[#111111] rounded-xl border border-[#1F1F1F]">
          {(["all", "active", "inactive"] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-light transition-all capitalize",
                statusFilter === status
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#666666] hover:text-white"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Partners List */}
      {paginatedPartners.length === 0 ? (
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-[#444444] mx-auto mb-4" />
            <h3 className="text-white font-light text-lg mb-2">No partners found</h3>
            <p className="text-[#666666] text-sm">
              {searchQuery ? "Try adjusting your search" : "Add a partner to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedPartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => router.push(`/partners/${partner.id}`)}
                className="w-full text-left p-5 rounded-2xl bg-[#111111] border border-[#1F1F1F] hover:border-[#2A2A2A] transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-[#666666]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-light text-lg">
                        {partner.name}
                      </h3>
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
                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {partner.location.area}, {partner.location.city}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {partner.phone}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right hidden sm:block">
                    <p className="text-white font-light">
                      AED {partner.monthlyRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-[#666666]">
                      {partner.totalBookings} bookings · {(partner.commissionRate * 100).toFixed(0)}% commission
                    </p>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-5 w-5 text-[#444444] group-hover:text-[#666666] transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Summary */}
      <div className="pt-6 border-t border-[#1F1F1F]">
        <p className="text-sm text-[#666666]">
          Showing {paginatedPartners.length} of {filteredPartners.length} partners
        </p>
      </div>
    </div>
  );
}
