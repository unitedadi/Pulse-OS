"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (showEllipsisStart) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
          currentPage === 1
            ? "text-[#444444] cursor-not-allowed"
            : "text-[#666666] hover:text-white hover:bg-[#1A1A1A]"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-[#666666]"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "h-10 min-w-[2.5rem] px-3 rounded-xl text-sm font-light transition-all",
                currentPage === page
                  ? "bg-white text-[#0A0A0A]"
                  : "text-[#666666] hover:text-white hover:bg-[#1A1A1A]"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
          currentPage === totalPages
            ? "text-[#444444] cursor-not-allowed"
            : "text-[#666666] hover:text-white hover:bg-[#1A1A1A]"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// Compact variant for mobile
export function PaginationCompact({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-light transition-all",
          currentPage === 1
            ? "text-[#444444] cursor-not-allowed"
            : "text-[#666666] hover:text-white bg-[#1A1A1A]"
        )}
      >
        Previous
      </button>

      <span className="text-sm text-[#666666]">
        {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-light transition-all",
          currentPage === totalPages
            ? "text-[#444444] cursor-not-allowed"
            : "text-[#666666] hover:text-white bg-[#1A1A1A]"
        )}
      >
        Next
      </button>
    </div>
  );
}
