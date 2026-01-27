"use client";

import * as React from "react";
import { Button } from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock data
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PERIODS = [
  { id: "wtd", label: "WTD", fullLabel: "Week to Date" },
  { id: "mtd", label: "MTD", fullLabel: "Month to Date" },
  { id: "qtd", label: "QTD", fullLabel: "Quarter to Date" },
  { id: "ytd", label: "YTD", fullLabel: "Year to Date" },
  { id: "custom", label: "Custom", fullLabel: "Custom Range" },
] as const;

type PeriodId = typeof PERIODS[number]["id"];

const MOCK_SUMMARY = {
  totalBookings: 47,
  grossRevenue: 42353,
  commissionEarned: 10287,
  estimatedPayout: 9912,
  pendingPayments: 4500,
  refunds: 1499,
  clawbacks: 374,
};

const MOCK_TRANSACTIONS = [
  {
    id: "TXN-001",
    date: new Date(2025, 0, 25),
    customer: "Sarah Chen",
    product: "IV Therapy",
    gross: 450,
    commission: 112,
    status: "completed" as const,
  },
  {
    id: "TXN-002",
    date: new Date(2025, 0, 24),
    customer: "Mohammed Al-Hassan",
    product: "Vitamin Infusion",
    gross: 350,
    commission: 87,
    status: "completed" as const,
  },
  {
    id: "TXN-003",
    date: new Date(2025, 0, 23),
    customer: "Emma Wilson",
    product: "Blood Test",
    gross: 200,
    commission: 50,
    status: "completed" as const,
  },
  {
    id: "TXN-004",
    date: new Date(2025, 0, 22),
    customer: "Ahmed Khalid",
    product: "Health Checkup",
    gross: 600,
    commission: 150,
    status: "completed" as const,
  },
  {
    id: "TXN-005",
    date: new Date(2025, 0, 21),
    customer: "Lisa Park",
    product: "IV Therapy",
    gross: 450,
    commission: 0,
    status: "refunded" as const,
  },
  {
    id: "TXN-006",
    date: new Date(2025, 0, 20),
    customer: "Omar Sheikh",
    product: "NAD+ Therapy",
    gross: 800,
    commission: 200,
    status: "completed" as const,
  },
  {
    id: "TXN-007",
    date: new Date(2025, 0, 19),
    customer: "Priya Sharma",
    product: "Hydration Boost",
    gross: 300,
    commission: 75,
    status: "completed" as const,
  },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodId>("mtd");
  const [selectedMonth, setSelectedMonth] = React.useState(0);
  const [selectedYear, setSelectedYear] = React.useState(2025);

  const summary = MOCK_SUMMARY;
  const transactions = MOCK_TRANSACTIONS;

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get period label for display
  const getPeriodLabel = () => {
    const period = PERIODS.find(p => p.id === selectedPeriod);
    if (selectedPeriod === "custom") {
      return `${MONTHS[selectedMonth]} ${selectedYear}`;
    }
    return period?.fullLabel || "";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pt-6 relative">
      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-0 h-10 w-10 rounded-full flex items-center justify-center text-[#666666] hover:bg-white hover:text-black transition-all"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-start">
        {/* Period Filter Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-full border border-[#2A2A2A] bg-[#0A0A0A]">
            {PERIODS.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-light transition-all",
                  selectedPeriod === period.id
                    ? "bg-white text-black"
                    : "text-[#666666] hover:text-white"
                )}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Month Navigator - only visible when Custom is selected */}
          {selectedPeriod === "custom" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="h-10 w-10 rounded-full flex items-center justify-center text-[#666666] hover:text-white hover:bg-white/5 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2A2A2A]">
                <Calendar className="h-4 w-4 text-[#555555]" />
                <span className="text-white font-light">
                  {MONTHS[selectedMonth]} {selectedYear}
                </span>
              </div>

              <button
                onClick={() => navigateMonth("next")}
                className="h-10 w-10 rounded-full flex items-center justify-center text-[#666666] hover:text-white hover:bg-white/5 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-16">
        <div>
          <p className="text-5xl font-extralight text-white tabular-nums">
            {summary.totalBookings}
          </p>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-2">Bookings</p>
        </div>
        <div className="h-12 w-px bg-[#1F1F1F]" />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extralight text-white tabular-nums">
              {summary.grossRevenue.toLocaleString()}
            </span>
            <span className="text-sm text-[#555555]">AED</span>
          </div>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-2">Gross Revenue</p>
        </div>
        <div className="h-12 w-px bg-[#1F1F1F]" />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extralight text-[#E07A3C] tabular-nums">
              {summary.commissionEarned.toLocaleString()}
            </span>
            <span className="text-sm text-[#555555]">AED</span>
          </div>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-2">Commission</p>
        </div>
        <div className="h-12 w-px bg-[#1F1F1F]" />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extralight text-white tabular-nums">
              {summary.estimatedPayout.toLocaleString()}
            </span>
            <span className="text-sm text-[#555555]">AED</span>
          </div>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-2">Est. Payout</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1F1F1F]" />

      {/* Breakdown Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs text-[#555555] uppercase tracking-wider">
            {selectedPeriod === "custom"
              ? `${MONTHS[selectedMonth]} Breakdown`
              : `${getPeriodLabel()} Breakdown`}
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2A2A2A] text-[#555555] text-xs font-medium hover:bg-white hover:text-black hover:border-white transition-all">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#111111] transition-all">
            <span className="text-[#A0A0A0] font-light">Gross Revenue</span>
            <span className="text-white font-light tabular-nums">AED {summary.grossRevenue.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#E07A3C]/5">
            <span className="text-[#E07A3C] font-light">Commission Earned (25%)</span>
            <span className="text-[#E07A3C] font-light tabular-nums flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              AED {summary.commissionEarned.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#111111] transition-all">
            <span className="text-[#A0A0A0] font-light">Pending Payments</span>
            <span className="text-[#FBBF24] font-light tabular-nums">AED {summary.pendingPayments.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#111111] transition-all">
            <span className="text-[#A0A0A0] font-light">Refunds</span>
            <span className="text-[#F87171] font-light tabular-nums flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              AED {summary.refunds.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#111111] transition-all">
            <span className="text-[#A0A0A0] font-light">Commission Clawbacks</span>
            <span className="text-[#F87171] font-light tabular-nums flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              AED {summary.clawbacks.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-[#111111] mt-2">
            <span className="text-white font-light text-lg">Estimated Payout</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-light text-2xl tabular-nums">
                {summary.estimatedPayout.toLocaleString()}
              </span>
              <span className="text-[#555555] text-sm">AED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1F1F1F]" />

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs text-[#555555] uppercase tracking-wider">
            Recent Transactions
          </h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-2">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-[#111111] hover:border-[#1F1F1F] transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-white font-light">{txn.customer}</h4>
                  {txn.status === "refunded" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#F87171]/10 text-[#F87171]">
                      Refunded
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-[#555555]">
                  <span>{txn.product}</span>
                  <span>·</span>
                  <span>{formatDate(txn.date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-white font-light tabular-nums">AED {txn.gross}</p>
                  <p className="text-xs text-[#555555]">Amount</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-light tabular-nums",
                    txn.commission > 0 ? "text-[#E07A3C]" : "text-[#555555]"
                  )}>
                    {txn.commission > 0 ? `+${txn.commission}` : "—"}
                  </p>
                  <p className="text-xs text-[#555555]">Commission</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-6 border-t border-[#1F1F1F]">
        <p className="text-xs text-[#555555]">
          Estimated earnings. Final payout confirmed via monthly statement.
          Payouts are processed by the 10th of each month.
        </p>
      </div>
    </div>
  );
}
