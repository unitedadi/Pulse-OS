// ============================================
// PULSE OS TYPE DEFINITIONS
// ============================================

// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = "owner" | "manager" | "staff" | "dardoc_admin";

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  role: UserRole;
  partnerId?: string;
  status: "active" | "invited" | "revoked";
  createdAt: Date;
  updatedAt: Date;
}

export interface DarDocAdmin {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  role: "dardoc_admin";
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PARTNER TYPES
// ============================================

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: {
    address: string;
    area: string;
    city: "Dubai" | "Abu Dhabi";
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  commercialTerms: {
    ivDripCommission: number;
    bloodTestCommission: number;
    supplementCommission: number;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    iban: string;
  };
  xeroContactId?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PRODUCT TYPES
// ============================================

export type ProductCategory = "iv_drip" | "blood_test" | "supplement";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  priceExVat: number;
  vatAmount: number;
  commissionRate: number;
  image: string;
  status: "active" | "inactive";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// CUSTOMER TYPES
// ============================================

export interface CustomerAddress {
  label: string;
  address: string;
  area: string;
  city: "Dubai" | "Abu Dhabi";
}

export interface Customer {
  id: string;
  partnerId: string;
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
  addresses: CustomerAddress[];
  bookingCount: number;
  lastBookingAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// BOOKING TYPES
// ============================================

export type BookingStatus =
  | "draft"
  | "pending_payment"
  | "expired"
  | "paid"
  | "active"
  | "upcoming"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded"
  | "no_show"
  | "failed";

export type PaymentStatus = "pending" | "paid" | "refunded";

export type CommissionStatus = "pending" | "earned" | "clawedback";

export type LocationType = "partner_location" | "customer_home";

export interface BookingProduct {
  name: string;
  category: ProductCategory;
  price: number;
  priceExVat: number;
  vatAmount: number;
  commissionRate: number;
}

export interface BookingLocation {
  type: LocationType;
  address: string;
  area: string;
  city: "Dubai" | "Abu Dhabi";
}

export interface BookingCommission {
  rate: number;
  amount: number;
  status: CommissionStatus;
}

export interface BookingNurse {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  partnerId: string;
  customerId: string;
  productId: string;
  createdByUserId: string;

  // Embedded data
  product: BookingProduct;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };

  // Location
  serviceLocation: BookingLocation;

  // Scheduling
  scheduledDate: Date;
  scheduledTimeSlot: string;

  // Payment
  paymentLinkUrl?: string;
  paymentLinkExpiresAt?: Date;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
  paidAmount?: number;

  // Commission
  commission: BookingCommission;

  // Status
  status: BookingStatus;

  // Nurse (after assignment)
  nurse?: BookingNurse;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}

// ============================================
// API TYPES
// ============================================

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

export interface CreateBookingInput {
  productId: string;
  customer: {
    id?: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  location: BookingLocation;
  scheduledDate: string;
  scheduledTime: string;
}

export interface UpdateBookingInput {
  productId?: string;
  location?: BookingLocation;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface CancelBookingInput {
  reason: string;
  refund: boolean;
}

// ============================================
// REVENUE TYPES
// ============================================

export interface RevenueSummary {
  totalBookings: number;
  grossRevenue: number;
  vatAmount: number;
  netRevenue: number;
  commissionEarned: number;
  pendingPayments: number;
  refunds: number;
  clawbacks: number;
  estimatedPayout: number;
}

export interface RevenueTransaction {
  bookingId: string;
  date: Date;
  customer: string;
  product: string;
  grossAmount: number;
  vat: number;
  netAmount: number;
  commission: number;
  status: BookingStatus;
}

// ============================================
// UI HELPER TYPES
// ============================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface FilterState {
  search?: string;
  status?: BookingStatus[];
  category?: ProductCategory[];
  dateFrom?: Date;
  dateTo?: Date;
}
