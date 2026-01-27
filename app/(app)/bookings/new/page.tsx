"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useImmersiveMode } from "@/components/layouts";
import {
  X,
  Check,
  MapPin,
  Clock,
  User,
  Calendar,
  ChevronRight,
  Home,
  Building2,
  Search,
  UserPlus,
  Users,
  Lock,
} from "lucide-react";
import { Button, Input, PhoneInput } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock products data with images
const PRODUCTS = [
  {
    id: "1",
    name: "IV Therapy",
    description: "Vitamin-infused IV drip for hydration and wellness",
    price: 450,
    duration: "45-60 min",
    category: "Wellness",
    image: "/services/skin-therapy.png",
  },
  {
    id: "2",
    name: "Vitamin Infusion",
    description: "High-dose vitamin C and B12 for energy",
    price: 350,
    duration: "30-45 min",
    category: "Wellness",
    image: "/services/skin-therapy.png",
  },
  {
    id: "3",
    name: "Blood Test",
    description: "Comprehensive blood panel including CBC",
    price: 200,
    duration: "15-20 min",
    category: "Diagnostics",
    image: "/services/skin-therapy.png",
  },
  {
    id: "4",
    name: "Health Checkup",
    description: "Full body health assessment with vital signs",
    price: 600,
    duration: "60-90 min",
    category: "Checkup",
    image: "/services/skin-therapy.png",
  },
  {
    id: "5",
    name: "NAD+ Therapy",
    description: "Cellular regeneration and anti-aging infusion",
    price: 850,
    duration: "90-120 min",
    category: "Wellness",
    image: "/services/skin-therapy.png",
  },
  {
    id: "6",
    name: "Glutathione IV",
    description: "Antioxidant boost for detox and skin glow",
    price: 400,
    duration: "30-45 min",
    category: "Wellness",
    image: "/services/skin-therapy.png",
  },
];

// Service-based gradient backgrounds
const getServiceGradient = (service: string) => {
  const gradients: Record<string, string> = {
    "IV Therapy": "from-amber-900/80 via-orange-950/60 to-black",
    "Vitamin Infusion": "from-emerald-900/80 via-teal-950/60 to-black",
    "Blood Test": "from-rose-900/80 via-red-950/60 to-black",
    "Health Checkup": "from-sky-900/80 via-blue-950/60 to-black",
    "NAD+ Therapy": "from-violet-900/80 via-purple-950/60 to-black",
    "Glutathione IV": "from-pink-900/80 via-fuchsia-950/60 to-black",
  };
  return gradients[service] || "from-amber-900/80 via-orange-950/60 to-black";
};

// Location options
const LOCATIONS = [
  { id: "home", name: "Home Visit", icon: Home, description: "We come to the customer" },
  { id: "clinic", name: "Clinic Visit", icon: Building2, description: "Customer visits clinic" },
];

// Mock existing customers with multiple addresses
const EXISTING_CUSTOMERS = [
  {
    id: "1",
    name: "Sarah Chen",
    phone: "+971 50 123 4567",
    email: "sarah.chen@email.com",
    addresses: [
      { label: "Home", address: "Marina Residence Tower A, Apt 2301, Dubai Marina" },
      { label: "Office", address: "DIFC Gate Building, Level 14, Office 1402" },
    ]
  },
  {
    id: "2",
    name: "Mohammed Al-Hassan",
    phone: "+971 55 234 5678",
    email: "m.alhassan@email.com",
    addresses: [
      { label: "Home", address: "Emaar Beachfront, Beach Vista Tower 1, Apt 1502" },
    ]
  },
  {
    id: "3",
    name: "Emma Wilson",
    phone: "+971 52 345 6789",
    email: "emma.w@email.com",
    addresses: [
      { label: "Home", address: "Downtown Dubai, Burj Vista 2, Apt 3401" },
      { label: "Office", address: "Business Bay, Aspect Tower, Suite 2305" },
      { label: "Parents", address: "Al Barsha 1, Villa 42, Street 12" },
    ]
  },
  {
    id: "4",
    name: "Ahmed Khalid",
    phone: "+971 50 456 7890",
    email: "ahmed.k@email.com",
    addresses: []
  },
  {
    id: "5",
    name: "Lisa Park",
    phone: "+971 56 567 8901",
    email: "lisa.park@email.com",
    addresses: [
      { label: "Home", address: "JBR, Sadaf 4, Apt 1205" },
    ]
  },
  {
    id: "6",
    name: "Omar Farouk",
    phone: "+971 54 678 9012",
    email: "omar.f@email.com",
    addresses: [
      { label: "Home", address: "Business Bay, Executive Towers, Tower H, Apt 2104" },
      { label: "Office", address: "Dubai Media City, CNN Building, Floor 3" },
    ]
  },
  {
    id: "7",
    name: "Priya Sharma",
    phone: "+971 50 789 0123",
    email: "priya.s@email.com",
    addresses: []
  },
  {
    id: "8",
    name: "David Kim",
    phone: "+971 55 890 1234",
    email: "david.kim@email.com",
    addresses: [
      { label: "Home", address: "Palm Jumeirah, Golden Mile 9, Apt 302" },
    ]
  },
];

// Mock bookings data for edit mode
const MOCK_BOOKINGS = [
  {
    id: "BK-001",
    productId: "1", // IV Therapy
    customerId: "1", // Sarah Chen
    locationType: "home",
    address: "Marina Residence Tower A, Apt 2301, Dubai Marina",
    scheduledDate: new Date(2025, 0, 28),
    scheduledTime: "10:00",
  },
  {
    id: "BK-002",
    productId: "2", // Vitamin Infusion
    customerId: "2", // Mohammed Al-Hassan
    locationType: "home",
    address: "Emaar Beachfront, Beach Vista Tower 1, Apt 1502",
    scheduledDate: new Date(2025, 0, 28),
    scheduledTime: "14:00",
  },
  {
    id: "BK-003",
    productId: "3", // Blood Test
    customerId: "3", // Emma Wilson
    locationType: "clinic",
    address: "",
    scheduledDate: new Date(2025, 0, 27),
    scheduledTime: "16:30",
  },
];

// Generate time slots
const generateTimeSlots = () => {
  const slots: { time: string; available: boolean }[] = [];
  const times = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00",
  ];
  times.forEach((time) => {
    slots.push({
      time,
      available: Math.random() > 0.25,
    });
  });
  return slots;
};

// Generate next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

function NewBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useImmersiveMode();

  // Edit mode detection
  const editBookingId = searchParams.get("edit");
  const isEditMode = !!editBookingId;
  const editingBooking = isEditMode ? MOCK_BOOKINGS.find(b => b.id === editBookingId) : null;

  // Form state
  const [selectedProduct, setSelectedProduct] = React.useState<typeof PRODUCTS[0] | null>(null);
  const [customerMode, setCustomerMode] = React.useState<"new" | "existing">("existing");
  const [selectedCustomer, setSelectedCustomer] = React.useState<typeof EXISTING_CUSTOMERS[0] | null>(null);
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerCountry, setCustomerCountry] = React.useState("AE");
  const [locationType, setLocationType] = React.useState<string | null>(null);
  const [address, setAddress] = React.useState("");
  const [initialized, setInitialized] = React.useState(false);

  // Pre-populate form when editing
  React.useEffect(() => {
    if (isEditMode && editingBooking && !initialized) {
      // Find and set product
      const product = PRODUCTS.find(p => p.id === editingBooking.productId);
      if (product) setSelectedProduct(product);

      // Find and set customer
      const customer = EXISTING_CUSTOMERS.find(c => c.id === editingBooking.customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setCustomerMode("existing");
      }

      // Set location
      setLocationType(editingBooking.locationType);
      setAddress(editingBooking.address);

      // Set date and time
      setSelectedDate(editingBooking.scheduledDate);
      setSelectedTime(editingBooking.scheduledTime);

      setInitialized(true);
    }
  }, [isEditMode, editingBooking, initialized]);
  const [selectedAddressIndex, setSelectedAddressIndex] = React.useState<number | "manual" | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  // Filter existing customers based on search
  const filteredCustomers = React.useMemo(() => {
    if (!customerSearch.trim()) return EXISTING_CUSTOMERS;
    const query = customerSearch.toLowerCase();
    return EXISTING_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        c.email.toLowerCase().includes(query)
    );
  }, [customerSearch]);

  // Get effective customer name/phone based on mode
  const effectiveCustomerName = customerMode === "existing" ? selectedCustomer?.name || "" : customerName;
  const effectiveCustomerPhone = customerMode === "existing" ? selectedCustomer?.phone || "" : customerPhone;

  // Auto-fill address when selecting existing customer with saved address
  React.useEffect(() => {
    if (customerMode === "existing" && selectedCustomer?.addresses?.length && locationType === "home") {
      // Auto-select first address if customer has addresses and nothing selected yet
      if (selectedAddressIndex === null) {
        setSelectedAddressIndex(0);
        setAddress(selectedCustomer.addresses[0].address);
      }
    }
  }, [selectedCustomer, customerMode, locationType, selectedAddressIndex]);

  // Update address when selected address index changes (only for saved addresses)
  React.useEffect(() => {
    if (customerMode === "existing" && selectedCustomer?.addresses?.length && typeof selectedAddressIndex === "number") {
      setAddress(selectedCustomer.addresses[selectedAddressIndex].address);
    }
  }, [selectedAddressIndex, selectedCustomer, customerMode]);

  // Reset address selection when customer changes (skip during edit mode initialization)
  React.useEffect(() => {
    if (!isEditMode || initialized) {
      setSelectedAddressIndex(null);
      setAddress("");
    }
  }, [selectedCustomer]);

  const timeSlots = React.useMemo(() => generateTimeSlots(), [selectedDate]);
  const dates = React.useMemo(() => generateDates(), []);

  // Calculate commission (25%)
  const commission = selectedProduct ? Math.round(selectedProduct.price * 0.25) : 0;

  // Step completion checks
  const isServiceComplete = !!selectedProduct;
  const isCustomerComplete = customerMode === "existing" ? !!selectedCustomer : (customerName.trim() && customerPhone.trim());
  const isLocationComplete = !!locationType && (locationType !== "home" || address.trim());
  const isDateTimeComplete = !!selectedDate && !!selectedTime;

  // Section unlock states (all unlocked in edit mode)
  const canAccessCustomer = isEditMode || isServiceComplete;
  const canAccessLocation = isEditMode || (isServiceComplete && isCustomerComplete);
  const canAccessDateTime = isEditMode || (isServiceComplete && isCustomerComplete && isLocationComplete);

  // Check if booking is complete
  const isComplete = isServiceComplete && isCustomerComplete && isLocationComplete && isDateTimeComplete;

  const handleConfirm = () => {
    console.log(isEditMode ? "Updating booking:" : "Creating booking:", {
      bookingId: editBookingId,
      product: selectedProduct,
      customer: customerMode === "existing"
        ? selectedCustomer
        : { name: customerName, phone: customerPhone },
      location: { type: locationType, address },
      date: selectedDate,
      time: selectedTime,
    });
    // Navigate back to the booking detail if editing, otherwise to bookings list
    router.push(isEditMode ? `/bookings/${editBookingId}` : "/bookings");
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0A0A0A] relative">
      {/* Close Button - Fixed top left */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 h-10 w-10 rounded-full flex items-center justify-center text-[#666666] hover:bg-white hover:text-black transition-all"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex h-full">
        {/* Left Panel - Selection Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8 space-y-12">
            {/* Section 1: Service Selection */}
            <section>
              <div className="mb-6">
                <h2 className="text-3xl font-extralight text-white mb-2">Select a service</h2>
                <p className="text-[#666666] text-sm">What wellness experience are you booking?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group text-left"
                  >
                    <div
                      className={cn(
                        "relative rounded-2xl overflow-hidden h-[160px] transition-all",
                        selectedProduct?.id === product.id
                          ? "ring-2 ring-[#E07A3C] ring-offset-2 ring-offset-[#0A0A0A]"
                          : "hover:ring-1 hover:ring-white/20"
                      )}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={cn("absolute inset-0 bg-gradient-to-br", getServiceGradient(product.name))} />

                      {/* Selection indicator */}
                      {selectedProduct?.id === product.id && (
                        <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-[#E07A3C] flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className="absolute inset-0 p-4 flex flex-col justify-end">
                        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-lg font-light text-white">{product.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/60 text-xs">{product.duration}</span>
                          <span className="text-white text-sm">AED {product.price}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 2: Customer Details */}
            <section className={cn("relative", !canAccessCustomer && "pointer-events-none")}>
              {/* Locked Overlay */}
              {!canAccessCustomer && (
                <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Select a service first</span>
                  </div>
                </div>
              )}
              <div className={cn("mb-6", !canAccessCustomer && "opacity-30")}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-extralight text-white">Customer</h2>
                  {isCustomerComplete && (
                    <div className="h-6 w-6 rounded-full bg-[#E07A3C] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[#666666] text-sm">
                  {isEditMode ? "Booking for this customer" : "Select an existing customer or add a new one"}
                </p>
              </div>

              {/* Edit Mode: Read-only customer display */}
              {isEditMode && selectedCustomer && (
                <div className="p-4 rounded-xl bg-[#111111] border border-[#1F1F1F] flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#E07A3C] flex items-center justify-center text-white font-medium">
                    {selectedCustomer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-light">{selectedCustomer.name}</p>
                    <p className="text-[#666666] text-sm">{selectedCustomer.phone}</p>
                    {selectedCustomer.email && (
                      <p className="text-[#555555] text-xs">{selectedCustomer.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Create Mode: Full customer selection */}
              {!isEditMode && (
                <>
                  {/* Toggle: Existing / New */}
                  <div className={cn("flex gap-2 mb-6", !canAccessCustomer && "opacity-30")}>
                    <button
                      onClick={() => setCustomerMode("existing")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-full border transition-all text-sm",
                        customerMode === "existing"
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-[#666666] border-[#2A2A2A] hover:border-[#3A3A3A] hover:text-white"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      Existing
                    </button>
                    <button
                      onClick={() => setCustomerMode("new")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-full border transition-all text-sm",
                        customerMode === "new"
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-[#666666] border-[#2A2A2A] hover:border-[#3A3A3A] hover:text-white"
                      )}
                    >
                      <UserPlus className="h-4 w-4" />
                      New
                    </button>
                  </div>

                  {/* Existing Customer Search */}
                  {customerMode === "existing" && (
                    <div className={cn("space-y-4", !canAccessCustomer && "opacity-30")}>
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                        <input
                          type="text"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search by name, phone, or email..."
                          className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#1F1F1F] rounded-xl text-white placeholder:text-[#555555] transition-colors text-sm focus:border-[#2A2A2A]"
                          style={{ outline: "none", boxShadow: "none" }}
                        />
                      </div>

                      {/* Customer List */}
                      <div className="space-y-2 max-h-[280px] overflow-y-auto">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            onClick={() => setSelectedCustomer(customer)}
                            className={cn(
                              "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4",
                              selectedCustomer?.id === customer.id
                                ? "bg-[#1A1A1A] border-[#E07A3C]"
                                : "bg-[#111111] border-[#1F1F1F] hover:border-[#2A2A2A]"
                            )}
                          >
                            <div
                              className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium",
                                selectedCustomer?.id === customer.id
                                  ? "bg-[#E07A3C] text-white"
                                  : "bg-[#1A1A1A] text-[#666666]"
                              )}
                            >
                              {customer.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-white text-sm font-light truncate">{customer.name}</p>
                                {customer.addresses.length > 0 && (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <MapPin className="h-3 w-3 text-[#E07A3C]" />
                                    {customer.addresses.length > 1 && (
                                      <span className="text-[#E07A3C] text-xs">{customer.addresses.length}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-[#666666] text-xs truncate">{customer.phone}</p>
                            </div>
                            {selectedCustomer?.id === customer.id && (
                              <div className="h-5 w-5 rounded-full bg-[#E07A3C] flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                        {filteredCustomers.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-[#555555] text-sm">No customers found</p>
                            <button
                              onClick={() => setCustomerMode("new")}
                              className="text-[#E07A3C] text-sm mt-2 hover:underline"
                            >
                              Add a new customer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* New Customer Form */}
                  {customerMode === "new" && (
                    <div className={cn("space-y-4", !canAccessCustomer && "opacity-30")}>
                      <div>
                        <label className="block text-sm text-[#A0A0A0] mb-2">Full name</label>
                        <Input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Enter customer's full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#A0A0A0] mb-2">Phone number</label>
                        <PhoneInput
                          value={customerPhone}
                          countryCode={customerCountry}
                          onChange={(phone, country) => {
                            setCustomerPhone(phone);
                            if (country) setCustomerCountry(country);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Section 3: Location */}
            <section className={cn("relative", !canAccessLocation && "pointer-events-none")}>
              {/* Locked Overlay */}
              {!canAccessLocation && (
                <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">{!isServiceComplete ? "Select a service first" : "Enter customer details first"}</span>
                  </div>
                </div>
              )}
              <div className={cn("mb-6", !canAccessLocation && "opacity-30")}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-extralight text-white">Service location</h2>
                  {isLocationComplete && (
                    <div className="h-6 w-6 rounded-full bg-[#E07A3C] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[#666666] text-sm">Where should we provide the service?</p>
              </div>

              <div className={cn("space-y-3", !canAccessLocation && "opacity-30")}>
                {LOCATIONS.map((location) => {
                  const Icon = location.icon;
                  return (
                    <button
                      key={location.id}
                      onClick={() => setLocationType(location.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4",
                        locationType === location.id
                          ? "bg-[#1A1A1A] border-[#E07A3C]"
                          : "bg-[#111111] border-[#1F1F1F] hover:border-[#2A2A2A]"
                      )}
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center",
                          locationType === location.id
                            ? "bg-[#E07A3C]/20 text-[#E07A3C]"
                            : "bg-[#1A1A1A] text-[#666666]"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-light">{location.name}</h3>
                        <p className="text-[#666666] text-sm">{location.description}</p>
                      </div>
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center",
                          locationType === location.id
                            ? "bg-[#E07A3C] text-white"
                            : "border border-[#2A2A2A]"
                        )}
                      >
                        {locationType === location.id && <Check className="h-4 w-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Address input for home visits */}
              {locationType === "home" && (
                <div className={cn("mt-4 space-y-3", !canAccessLocation && "opacity-30")}>
                  <label className="text-sm text-[#A0A0A0]">Customer's address</label>

                  {/* Show saved addresses if customer has any */}
                  {customerMode === "existing" && selectedCustomer?.addresses && selectedCustomer.addresses.length > 0 && (
                    <div className="space-y-2">
                      {selectedCustomer.addresses.map((addr, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAddressIndex(index);
                            setAddress(addr.address);
                          }}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                            selectedAddressIndex === index
                              ? "bg-[#1A1A1A] border-[#E07A3C]"
                              : "bg-[#111111] border-[#1F1F1F] hover:border-[#2A2A2A]"
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                              selectedAddressIndex === index
                                ? "bg-[#E07A3C]/20 text-[#E07A3C]"
                                : "bg-[#1A1A1A] text-[#666666]"
                            )}
                          >
                            {addr.label === "Home" ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-light">{addr.label}</p>
                            <p className="text-[#666666] text-xs truncate">{addr.address}</p>
                          </div>
                          {selectedAddressIndex === index && (
                            <div className="h-5 w-5 rounded-full bg-[#E07A3C] flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}

                      {/* Option to use different address */}
                      <button
                        onClick={() => {
                          setSelectedAddressIndex("manual");
                          setAddress("");
                        }}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                          selectedAddressIndex === "manual"
                            ? "bg-[#1A1A1A] border-[#E07A3C]"
                            : "bg-[#111111] border-[#1F1F1F] hover:border-[#2A2A2A]"
                        )}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            selectedAddressIndex === "manual"
                              ? "bg-[#E07A3C]/20 text-[#E07A3C]"
                              : "bg-[#1A1A1A] text-[#666666]"
                          )}
                        >
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-light">Different address</p>
                          <p className="text-[#666666] text-xs">Enter a new location</p>
                        </div>
                        {selectedAddressIndex === "manual" && (
                          <div className="h-5 w-5 rounded-full bg-[#E07A3C] flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Manual input - show if new customer, no saved addresses, or "Different address" selected */}
                  {(customerMode === "new" ||
                    !selectedCustomer?.addresses?.length ||
                    selectedAddressIndex === "manual") && (
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Building name, street, area, city"
                    />
                  )}
                </div>
              )}
            </section>

            {/* Section 4: Date & Time */}
            <section className={cn("pb-12 relative", !canAccessDateTime && "pointer-events-none")}>
              {/* Locked Overlay */}
              {!canAccessDateTime && (
                <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">
                      {!isServiceComplete ? "Select a service first" : !isCustomerComplete ? "Enter customer details first" : "Select a location first"}
                    </span>
                  </div>
                </div>
              )}
              <div className={cn("mb-6", !canAccessDateTime && "opacity-30")}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-extralight text-white">Date & time</h2>
                  {isDateTimeComplete && (
                    <div className="h-6 w-6 rounded-full bg-[#E07A3C] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[#666666] text-sm">When should we schedule the appointment?</p>
              </div>

              {/* Date Selection - Horizontal scroll */}
              <div className={cn("mb-8", !canAccessDateTime && "opacity-30")}>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex-shrink-0 px-4 py-3 rounded-2xl border transition-all text-center min-w-[90px]",
                        selectedDate?.toDateString() === date.toDateString()
                          ? "bg-white text-black border-white"
                          : "bg-[#111111] border-[#1F1F1F] text-white hover:border-[#2A2A2A]"
                      )}
                    >
                      <p className="text-xs opacity-60">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-lg font-light">{date.getDate()}</p>
                      <p className="text-xs opacity-60">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className={cn(!canAccessDateTime && "opacity-30")}>
                  <p className="text-sm text-[#666666] mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Available times for {formatDate(selectedDate)}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={cn(
                          "py-3 rounded-xl text-sm transition-all",
                          !slot.available
                            ? "bg-[#111111] text-[#333333] cursor-not-allowed"
                            : selectedTime === slot.time
                            ? "bg-[#E07A3C] text-white"
                            : "bg-[#111111] text-white border border-[#1F1F1F] hover:border-[#2A2A2A]"
                        )}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Right Panel - Sticky Summary */}
        <div className="w-[400px] flex-shrink-0 border-l border-[#1A1A1A] flex flex-col h-full">
          {/* Summary Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Selected Service */}
            {selectedProduct ? (
              <div className="mb-6">
                <div className="relative rounded-2xl overflow-hidden h-32">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-br", getServiceGradient(selectedProduct.name))} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <p className="text-white/60 text-xs uppercase tracking-widest">{selectedProduct.category}</p>
                    <h3 className="text-xl font-light text-white">{selectedProduct.name}</h3>
                    <p className="text-white/60 text-sm">{selectedProduct.duration}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 rounded-2xl border border-dashed border-[#2A2A2A] h-32 flex items-center justify-center">
                <p className="text-[#555555] text-sm">Select a service</p>
              </div>
            )}

            {/* Summary Items */}
            <div className="space-y-4">
              {/* Customer */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-[#555555]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#555555] text-xs uppercase tracking-wider mb-0.5">Customer</p>
                  {effectiveCustomerName ? (
                    <>
                      <p className="text-white text-sm font-light truncate">{effectiveCustomerName}</p>
                      {effectiveCustomerPhone && <p className="text-[#666666] text-xs">{effectiveCustomerPhone}</p>}
                    </>
                  ) : (
                    <p className="text-[#555555] text-sm">Not selected</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-[#555555]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#555555] text-xs uppercase tracking-wider mb-0.5">Location</p>
                  {locationType ? (
                    <>
                      <p className="text-white text-sm font-light">
                        {LOCATIONS.find(l => l.id === locationType)?.name}
                      </p>
                      {address && <p className="text-[#666666] text-xs truncate">{address}</p>}
                    </>
                  ) : (
                    <p className="text-[#555555] text-sm">Not selected</p>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-[#555555]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#555555] text-xs uppercase tracking-wider mb-0.5">Date & Time</p>
                  {selectedDate && selectedTime ? (
                    <>
                      <p className="text-white text-sm font-light">{formatFullDate(selectedDate)}</p>
                      <p className="text-[#E07A3C] text-xs">{selectedTime}</p>
                    </>
                  ) : (
                    <p className="text-[#555555] text-sm">Not selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Price & Confirm */}
          <div className="p-6 border-t border-[#1A1A1A] space-y-4">
            {/* Price Breakdown */}
            {selectedProduct && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Service price</span>
                  <span className="text-white font-light">AED {selectedProduct.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#E07A3C]">Your commission</span>
                  <span className="text-[#E07A3C]">+AED {commission}</span>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <Button
              variant="accent"
              fullWidth
              disabled={!isComplete}
              onClick={handleConfirm}
              leftIcon={<Check className="h-4 w-4" />}
            >
              {isEditMode ? "Save Changes" : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <NewBookingPageContent />
    </Suspense>
  );
}
