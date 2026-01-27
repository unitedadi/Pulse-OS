"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

// Toast Types
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface ToastProps extends Toast {
  onDismiss: (id: string) => void;
}

// Toast Component
export function ToastItem({
  id,
  variant,
  title,
  description,
  action,
  onDismiss,
}: ToastProps) {
  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles: Record<ToastVariant, { bg: string; border: string; icon: string }> = {
    success: {
      bg: "bg-[#111111]",
      border: "border-[#4ADE80]/30",
      icon: "text-[#4ADE80]",
    },
    error: {
      bg: "bg-[#111111]",
      border: "border-[#F87171]/30",
      icon: "text-[#F87171]",
    },
    warning: {
      bg: "bg-[#111111]",
      border: "border-[#FBBF24]/30",
      icon: "text-[#FBBF24]",
    },
    info: {
      bg: "bg-[#111111]",
      border: "border-[#3B82F6]/30",
      icon: "text-[#3B82F6]",
    },
  };

  const style = styles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg",
        "animate-in slide-in-from-right-full fade-in duration-300",
        style.bg,
        style.border
      )}
      role="alert"
    >
      <div className={cn("shrink-0 mt-0.5", style.icon)}>
        {icons[variant]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-light">{title}</p>
        {description && (
          <p className="text-sm text-[#666666] mt-0.5">{description}</p>
        )}
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onDismiss(id);
            }}
            className="text-sm text-[#E07A3C] hover:text-[#F5A66A] mt-2 font-medium transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 p-1 rounded-lg text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast Container
export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Toast Context
interface ToastContextValue {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

// Toast Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = newToast.duration ?? 5000;

    setToasts((prev) => [...prev, { ...newToast, id }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
