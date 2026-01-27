"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: Horizontal steps */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex items-center gap-3">
                {/* Step number/check */}
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    "text-sm font-light transition-all duration-300",
                    isCompleted && "bg-[#E07A3C] text-white",
                    isCurrent && "bg-white text-[#0A0A0A]",
                    isUpcoming && "bg-[#1A1A1A] text-[#666666] border border-[#2A2A2A]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-light transition-colors",
                      isCompleted && "text-[#E07A3C]",
                      isCurrent && "text-white",
                      isUpcoming && "text-[#666666]"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-xs text-[#666666]">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-4 transition-colors",
                    index < currentStep ? "bg-[#E07A3C]" : "bg-[#2A2A2A]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: Compact progress */}
      <div className="md:hidden">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index <= currentStep ? "bg-[#E07A3C]" : "bg-[#2A2A2A]"
              )}
            />
          ))}
        </div>

        {/* Current step info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-light">
              {steps[currentStep]?.label}
            </p>
            {steps[currentStep]?.description && (
              <p className="text-xs text-[#666666]">
                {steps[currentStep].description}
              </p>
            )}
          </div>
          <span className="text-sm text-[#666666]">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
