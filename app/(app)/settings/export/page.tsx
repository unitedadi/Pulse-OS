"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, Button, DatePicker } from "@/components/ui";
import {
  ArrowLeft,
  Download,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ExportType = "bookings" | "customers" | "revenue";

interface ExportOption {
  id: ExportType;
  label: string;
  description: string;
  icon: React.ElementType;
  formats: string[];
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "bookings",
    label: "Bookings",
    description: "Export all booking records with status, payments, and customer details",
    icon: Calendar,
    formats: ["CSV", "Excel"],
  },
  {
    id: "customers",
    label: "Customers",
    description: "Export customer list with contact info and booking history summary",
    icon: Users,
    formats: ["CSV", "Excel"],
  },
  {
    id: "revenue",
    label: "Revenue Report",
    description: "Export revenue summary with commission breakdown by period",
    icon: DollarSign,
    formats: ["CSV", "Excel", "PDF"],
  },
];

export default function ExportSettingsPage() {
  const router = useRouter();
  const [selectedExport, setSelectedExport] = React.useState<ExportType | null>(null);
  const [dateFrom, setDateFrom] = React.useState<Date | null>(null);
  const [dateTo, setDateTo] = React.useState<Date | null>(null);
  const [selectedFormat, setSelectedFormat] = React.useState<string>("CSV");
  const [exporting, setExporting] = React.useState(false);
  const [exportComplete, setExportComplete] = React.useState(false);

  const handleExport = async () => {
    if (!selectedExport) return;

    setExporting(true);
    setExportComplete(false);

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setExporting(false);
    setExportComplete(true);

    // Reset after showing success
    setTimeout(() => {
      setExportComplete(false);
    }, 3000);
  };

  const selectedOption = EXPORT_OPTIONS.find((o) => o.id === selectedExport);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Settings</span>
        </button>

        <div>
          <h1 className="text-4xl font-extralight text-white tracking-tight">
            Data Export
          </h1>
          <p className="text-[#666666] mt-2 font-light">
            Export your data in various formats for reporting and analysis
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs text-[#666666] uppercase tracking-wider">
            Select Data Type
          </h2>

          {EXPORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedExport === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedExport(option.id)}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border transition-all",
                  isSelected
                    ? "bg-[#E07A3C]/10 border-[#E07A3C]/30"
                    : "bg-[#111111] border-[#1F1F1F] hover:border-[#2A2A2A]"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                      isSelected ? "bg-[#E07A3C]/20" : "bg-[#1A1A1A]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isSelected ? "text-[#E07A3C]" : "text-[#666666]"
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-light text-lg">{option.label}</h3>
                      {isSelected && <Check className="h-5 w-5 text-[#E07A3C]" />}
                    </div>
                    <p className="text-sm text-[#666666]">{option.description}</p>
                    <div className="flex gap-2 mt-3">
                      {option.formats.map((format) => (
                        <span
                          key={format}
                          className="px-2 py-0.5 rounded text-xs bg-[#1A1A1A] text-[#A0A0A0]"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Export Configuration */}
        <div className="space-y-6">
          {selectedExport && (
            <>
              {/* Date Range */}
              <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
                <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
                  Date Range
                </h3>

                <div className="space-y-4">
                  <DatePicker
                    label="From"
                    value={dateFrom}
                    onChange={setDateFrom}
                    placeholder="Start date"
                  />
                  <DatePicker
                    label="To"
                    value={dateTo}
                    onChange={setDateTo}
                    minDate={dateFrom || undefined}
                    placeholder="End date"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      const now = new Date();
                      setDateFrom(new Date(now.getFullYear(), now.getMonth(), 1));
                      setDateTo(now);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      setDateFrom(new Date(now.getFullYear(), now.getMonth() - 1, 1));
                      setDateTo(new Date(now.getFullYear(), now.getMonth(), 0));
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    Last Month
                  </button>
                  <button
                    onClick={() => {
                      const now = new Date();
                      setDateFrom(new Date(now.getFullYear(), 0, 1));
                      setDateTo(now);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                  >
                    YTD
                  </button>
                </div>
              </Card>

              {/* Format Selection */}
              <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
                <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
                  Export Format
                </h3>

                <div className="space-y-2">
                  {selectedOption?.formats.map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                        selectedFormat === format
                          ? "bg-[#E07A3C]/10 border-[#E07A3C]/30"
                          : "bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-[#666666]" />
                        <span className="text-white font-light">{format}</span>
                      </div>
                      {selectedFormat === format && (
                        <Check className="h-4 w-4 text-[#E07A3C]" />
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Export Button */}
              <Button
                variant="accent"
                className="w-full"
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : exportComplete ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Download Ready
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export {selectedOption?.label}
                  </>
                )}
              </Button>
            </>
          )}

          {!selectedExport && (
            <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-[#444444] mx-auto mb-3" />
                <p className="text-[#666666] font-light">
                  Select a data type to configure your export
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Export History */}
      <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
        <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
          Recent Exports
        </h3>

        <div className="space-y-3">
          {[
            { type: "Bookings", format: "CSV", date: new Date(2025, 0, 20), size: "245 KB" },
            { type: "Revenue Report", format: "PDF", date: new Date(2025, 0, 15), size: "1.2 MB" },
            { type: "Customers", format: "Excel", date: new Date(2025, 0, 10), size: "128 KB" },
          ].map((export_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]"
            >
              <div className="flex items-center gap-4">
                <FileText className="h-5 w-5 text-[#666666]" />
                <div>
                  <p className="text-white font-light">{export_.type}</p>
                  <p className="text-xs text-[#666666]">
                    {export_.format} · {export_.size} ·{" "}
                    {export_.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
