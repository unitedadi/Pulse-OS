"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
  hideOnMobile?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  keyExtractor?: (row: T) => string;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyState,
  keyExtractor,
  className,
}: TableProps<T>) {
  const getKey = (row: T, index: number) => {
    if (keyExtractor) return keyExtractor(row);
    if ("id" in row) return String(row.id);
    return String(index);
  };

  const getCellValue = (row: T, column: Column<T>, index: number) => {
    if (column.render) return column.render(row, index);
    const value = row[column.key];
    return value !== undefined && value !== null ? String(value) : "-";
  };

  if (loading) {
    return (
      <div className={cn("rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)] overflow-hidden", className)}>
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[var(--color-bg-secondary)] animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 rounded-full bg-[var(--color-bg-secondary)] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)] p-12", className)}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={cn("rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)] overflow-hidden", className)}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    !column.align && "text-left"
                  )}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {data.map((row, index) => (
              <tr
                key={getKey(row, index)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-[var(--color-bg-secondary)]"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-6 py-5 text-sm text-[var(--color-text-primary)]",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {getCellValue(row, column, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[var(--color-border-subtle)]">
        {data.map((row, index) => (
          <div
            key={getKey(row, index)}
            onClick={() => onRowClick?.(row)}
            className={cn(
              "p-5 transition-colors",
              onRowClick && "cursor-pointer active:bg-[var(--color-bg-secondary)]"
            )}
          >
            <div className="space-y-3">
              {columns
                .filter((col) => !col.hideOnMobile)
                .map((column, colIndex) => (
                  <div
                    key={column.key}
                    className={cn(
                      "flex items-center justify-between gap-4",
                      colIndex === 0 && "mb-2"
                    )}
                  >
                    {colIndex !== 0 && (
                      <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                        {column.header}
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-sm font-light",
                        colIndex === 0 ? "text-[var(--color-text-primary)] text-base" : "text-[var(--color-text-secondary)]"
                      )}
                    >
                      {getCellValue(row, column, index)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
