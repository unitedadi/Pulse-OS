"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive" | "warning" | "success";
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantIcons = {
  default: <Info className="h-6 w-6" />,
  destructive: <AlertCircle className="h-6 w-6" />,
  warning: <AlertTriangle className="h-6 w-6" />,
  success: <CheckCircle className="h-6 w-6" />,
};

const variantColors = {
  default: {
    iconBg: "bg-[#1A1A1A]",
    iconColor: "text-[#A0A0A0]",
  },
  destructive: {
    iconBg: "bg-[#F87171]/10",
    iconColor: "text-[#F87171]",
  },
  warning: {
    iconBg: "bg-[#FBBF24]/10",
    iconColor: "text-[#FBBF24]",
  },
  success: {
    iconBg: "bg-[#4ADE80]/10",
    iconColor: "text-[#4ADE80]",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  icon,
}: ConfirmDialogProps) {
  // Close on Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, loading]);

  // Prevent body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const colors = variantColors[variant];
  const displayIcon = icon || variantIcons[variant];

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={!loading ? onClose : undefined}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className={cn(
          "relative w-full max-w-md rounded-2xl bg-[#111111] border border-[#1F1F1F]",
          "shadow-2xl shadow-black/50",
          "animate-in fade-in zoom-in-95 duration-200",
          "p-6"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4",
            colors.iconBg,
            colors.iconColor
          )}
        >
          {displayIcon}
        </div>

        {/* Title */}
        <h2
          id="confirm-title"
          className="text-xl font-light text-white text-center"
        >
          {title}
        </h2>

        {/* Description */}
        <p
          id="confirm-description"
          className="text-sm text-[#666666] text-center mt-2 leading-relaxed"
        >
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "primary"}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
