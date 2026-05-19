"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface CountryCode {
  code: string;
  dial: string;
  flag: string;
  name: string;
}

const countryCodes: CountryCode[] = [
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "QA", dial: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "KW", dial: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "BH", dial: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "OM", dial: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
  { code: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "PH", dial: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "UK" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "USA" },
];

export interface PhoneInputProps {
  value?: string;
  countryCode?: string;
  onChange?: (value: string, countryCode?: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export function PhoneInput({
  value = "",
  countryCode = "AE",
  onChange,
  placeholder = "50 123 4567",
  error,
  className,
  disabled = false,
  label,
  required = false,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(
    countryCodes.find((c) => c.code === countryCode) || countryCodes[0]
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    onChange?.(value, country.code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and spaces
    const formatted = e.target.value.replace(/[^\d\s]/g, "");
    onChange?.(formatted, selectedCountry.code);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-[var(--color-error)] ml-1">*</span>}
        </label>
      )}
      <div
        className={cn(
          "flex items-center rounded-[var(--radius-md)] bg-[var(--color-bg-card)] border shadow-[var(--shadow-xs)] transition-colors",
          error ? "border-[var(--color-error)]" : "border-[var(--color-border-default)] focus-within:border-[var(--color-border-focus)]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Country selector */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-3.5 border-r border-[var(--color-border-subtle)]",
              "text-[var(--color-text-primary)] transition-colors rounded-l-[var(--radius-md)]",
              disabled && "cursor-not-allowed"
            )}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-[var(--color-text-secondary)]">{selectedCountry.dial}</span>
            <ChevronDown className={cn(
              "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
              isOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] z-50 py-2 max-h-64 overflow-y-auto">
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left",
                    "hover:bg-[var(--color-bg-secondary)] transition-colors",
                    selectedCountry.code === country.code && "bg-[var(--color-bg-secondary)]"
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-[var(--color-text-primary)] text-sm flex-1">{country.name}</span>
                  <span className="text-[var(--color-text-muted)] text-sm">{country.dial}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent px-4 py-3.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
            "focus:outline-none text-base font-normal",
            disabled && "cursor-not-allowed"
          )}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
