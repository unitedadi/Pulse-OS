# Pulse OS — Implementation Plan

## Technical Blueprint for Frontend Development

**Version:** 1.0
**Date:** January 24, 2026
**Companion to:** pulse-os-spec.md

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Component Library](#2-component-library)
3. [Page Structure & Routes](#3-page-structure--routes)
4. [Layouts & Navigation](#4-layouts--navigation)
5. [Data Flow & State](#5-data-flow--state)
6. [Build Phases](#6-build-phases)
7. [File Structure](#7-file-structure)

---

## 1. Design Tokens

All design values as CSS custom properties. Import once, use everywhere.

### 1.1 Colors

```css
:root {
  /* Brand Colors */
  --color-brand-primary: #119098;      /* Deep teal - buttons, links, active states */
  --color-brand-secondary: #30CBD6;    /* Bright cyan - hover, gradients */
  --color-brand-gradient: linear-gradient(135deg, #119098 0%, #30CBD6 100%);

  /* Warm Neutral Backgrounds */
  --color-bg-primary: #FDFBF8;         /* Main app background */
  --color-bg-secondary: #F7F4F0;       /* Section backgrounds, hover states */
  --color-bg-tertiary: #EFEBE6;        /* Subtle dividers, disabled backgrounds */
  --color-bg-card: #FFFFFF;            /* Card surfaces */
  --color-bg-elevated: #FFFFFF;        /* Modals, dropdowns */

  /* Text Colors (Warm) */
  --color-text-primary: #2D2A26;       /* Headings, primary text */
  --color-text-secondary: #6B6560;     /* Body text, descriptions */
  --color-text-muted: #9C9691;         /* Placeholders, metadata */
  --color-text-inverse: #FFFFFF;       /* Text on brand backgrounds */

  /* Border Colors */
  --color-border-default: #E8E4DF;     /* Card borders, dividers */
  --color-border-subtle: #F0EDE8;      /* Subtle separators */
  --color-border-focus: #119098;       /* Focus rings */

  /* Semantic Colors */
  --color-success: #119098;            /* Using brand teal */
  --color-success-light: #E6F4F5;      /* Success backgrounds */
  --color-warning: #E6A23C;            /* Warm amber */
  --color-warning-light: #FDF6E9;      /* Warning backgrounds */
  --color-error: #D94452;              /* Warm red */
  --color-error-light: #FCEAEC;        /* Error backgrounds */
  --color-info: #30CBD6;               /* Using brand cyan */
  --color-info-light: #E8F9FB;         /* Info backgrounds */

  /* Special: Commission/Earnings */
  --color-commission: #B8963E;         /* Subtle gold */
  --color-commission-light: #FAF6EE;   /* Commission backgrounds */

  /* Status Badge Colors */
  --color-status-draft: #9C9691;
  --color-status-pending: #E6A23C;
  --color-status-paid: #3B82F6;
  --color-status-in-progress: #8B5CF6;
  --color-status-completed: #119098;
  --color-status-cancelled: #9C9691;
  --color-status-refunded: #F59E0B;
  --color-status-no-show: #D94452;
  --color-status-failed: #D94452;
}
```

### 1.2 Typography

```css
:root {
  /* Font Family */
  --font-family: 'Sofia Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px - Labels, metadata */
  --text-sm: 0.875rem;     /* 14px - Secondary text, table cells */
  --text-base: 1rem;       /* 16px - Body text */
  --text-lg: 1.125rem;     /* 18px - Subheadings */
  --text-xl: 1.25rem;      /* 20px - Card titles */
  --text-2xl: 1.5rem;      /* 24px - Section headings */
  --text-3xl: 1.875rem;    /* 30px - Page titles */
  --text-4xl: 2.25rem;     /* 36px - Large metrics */
  --text-5xl: 3rem;        /* 48px - Hero metrics */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Letter Spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### 1.3 Spacing

```css
:root {
  /* Base unit: 4px */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### 1.4 Border Radius

```css
:root {
  --radius-sm: 6px;      /* Small buttons, tags */
  --radius-md: 8px;      /* Inputs, small cards */
  --radius-lg: 12px;     /* Cards, modals */
  --radius-xl: 16px;     /* Large cards, featured elements */
  --radius-2xl: 24px;    /* Pills, special elements */
  --radius-full: 9999px; /* Circles, avatars */
}
```

### 1.5 Shadows

```css
:root {
  /* Warm-tinted shadows */
  --shadow-sm: 0 1px 2px rgba(45, 42, 38, 0.05);
  --shadow-md: 0 4px 6px rgba(45, 42, 38, 0.07), 0 2px 4px rgba(45, 42, 38, 0.05);
  --shadow-lg: 0 10px 15px rgba(45, 42, 38, 0.1), 0 4px 6px rgba(45, 42, 38, 0.05);
  --shadow-xl: 0 20px 25px rgba(45, 42, 38, 0.1), 0 10px 10px rgba(45, 42, 38, 0.04);

  /* Elevation for cards on hover */
  --shadow-card: 0 2px 8px rgba(45, 42, 38, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(45, 42, 38, 0.12);

  /* Focus ring */
  --shadow-focus: 0 0 0 3px rgba(17, 144, 152, 0.2);
}
```

### 1.6 Transitions

```css
:root {
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  --transition-bounce: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 1.7 Z-Index Scale

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}
```

---

## 2. Component Library

### 2.1 Primitive Components

These are the atomic building blocks. Build these first.

#### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| primary | brand-primary | white | none | Main actions (Create Booking, Confirm) |
| secondary | transparent | brand-primary | brand-primary | Secondary actions (Edit, Cancel) |
| ghost | transparent | text-secondary | none | Tertiary actions (Back, Close) |
| destructive | error | white | none | Dangerous actions (Delete, Cancel Booking) |

#### Input

```typescript
interface InputProps {
  type: 'text' | 'email' | 'tel' | 'number' | 'password';
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

#### Select

```typescript
interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
}
```

#### PhoneInput

```typescript
interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  countryCode?: string; // Default: +971
}
```

UAE format validation: +971 5X XXX XXXX

#### Textarea

```typescript
interface TextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  error?: string;
  hint?: string;
}
```

#### Checkbox

```typescript
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
```

#### Radio Group

```typescript
interface RadioGroupProps {
  label: string;
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
}
```

#### Toggle

```typescript
interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}
```

#### Badge

```typescript
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  size: 'sm' | 'md';
  children: ReactNode;
}
```

#### StatusBadge

```typescript
interface StatusBadgeProps {
  status:
    | 'draft'
    | 'pending_payment'
    | 'expired'
    | 'paid'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'refunded'
    | 'no_show'
    | 'failed';
}
```

Pre-styled with colors from design tokens.

#### Card

```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

#### Avatar

```typescript
interface AvatarProps {
  src?: string;
  name: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}
```

Shows initials if no image.

#### Modal

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size: 'sm' | 'md' | 'lg';
  children: ReactNode;
  footer?: ReactNode;
}
```

#### ConfirmDialog

```typescript
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}
```

#### Toast

```typescript
interface ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number; // ms, default 5000
  action?: { label: string; onClick: () => void };
}

// Usage via hook
const { toast } = useToast();
toast({ variant: 'success', title: 'Booking created' });
```

#### Tooltip

```typescript
interface TooltipProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactNode;
}
```

#### Tabs

```typescript
interface TabsProps {
  tabs: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
}
```

#### Table

```typescript
interface TableProps<T> {
  columns: {
    key: string;
    header: string;
    width?: string;
    render?: (row: T) => ReactNode;
  }[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: ReactNode;
}
```

#### Pagination

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

#### SearchInput

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number; // Default 300ms
}
```

#### DatePicker

```typescript
interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
}
```

#### TimeSlotPicker

```typescript
interface TimeSlotPickerProps {
  slots: { time: string; available: boolean }[];
  value: string | null;
  onChange: (time: string) => void;
  loading?: boolean;
}
```

Grid of time slot buttons. Unavailable slots are disabled.

#### Skeleton

```typescript
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}
```

#### EmptyState

```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

#### LoadingState

```typescript
interface LoadingStateProps {
  message?: string;
}
```

Centered spinner with optional message.

#### ErrorState

```typescript
interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
}
```

---

### 2.2 Composite Components

Built from primitives. These are Pulse OS-specific.

#### ProductCard

```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: 'iv_drip' | 'blood_test' | 'supplement';
    price: number;
    image: string;
    commissionRate: number;
  };
  selected?: boolean;
  onClick: () => void;
  showCommission?: boolean; // Show "You earn AED X"
}
```

**Layout:**
- Product image (left, 80x80)
- Name + price (right)
- Expandable description on tap
- Commission shown if `showCommission` is true

#### BookingCard

```typescript
interface BookingCardProps {
  booking: {
    id: string;
    customer: { firstName: string; lastName: string; phone: string };
    product: { name: string; category: string };
    scheduledDate: Date;
    scheduledTimeSlot: string;
    status: BookingStatus;
    paidAmount?: number;
    commission?: { amount: number };
  };
  onClick: () => void;
  showCommission?: boolean;
}
```

For booking list. Compact card showing key info.

#### CustomerCard

```typescript
interface CustomerCardProps {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    bookingCount: number;
    lastBookingAt?: Date;
  };
  onClick: () => void;
}
```

#### MetricCard

```typescript
interface MetricCardProps {
  label: string;
  value: string | number;
  prefix?: string;        // e.g., "AED"
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  subtitle?: string;
}
```

For dashboard metrics.

#### PaymentLinkCard

```typescript
interface PaymentLinkCardProps {
  url: string;
  expiresAt: Date;
  onCopy: () => void;
  onRegenerate?: () => void;
}
```

Shows payment link with copy button, expiry countdown.

#### CommissionDisplay

```typescript
interface CommissionDisplayProps {
  rate: number;           // e.g., 0.25
  amount: number;         // AED amount
  status: 'pending' | 'earned' | 'clawedback';
  variant?: 'inline' | 'card';
}
```

#### PartnerSwitcher

```typescript
interface PartnerSwitcherProps {
  partners: { id: string; name: string; logo?: string }[];
  currentPartnerId: string;
  onSwitch: (partnerId: string) => void;
}
```

Dropdown for DarDoc admins to switch partner context.

#### UserMenu

```typescript
interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onSignOut: () => void;
}
```

Avatar dropdown with sign out.

#### PageHeader

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
}
```

Consistent page headers across the app.

#### StepIndicator

```typescript
interface StepIndicatorProps {
  steps: { label: string; completed: boolean; current: boolean }[];
}
```

For multi-step booking flow.

---

### 2.3 Component Dependencies

Build order based on dependencies:

```
Level 1 (No dependencies):
  Button, Badge, Skeleton, Avatar, Tooltip

Level 2 (Depends on Level 1):
  Input, Select, Checkbox, Radio, Toggle, Textarea, PhoneInput
  Card, StatusBadge, EmptyState, LoadingState, ErrorState

Level 3 (Depends on Level 2):
  Modal, ConfirmDialog, Toast, Tabs, Table, Pagination
  SearchInput, DatePicker, TimeSlotPicker

Level 4 (Composite - depends on multiple):
  ProductCard, BookingCard, CustomerCard, MetricCard
  PaymentLinkCard, CommissionDisplay, PartnerSwitcher
  UserMenu, PageHeader, StepIndicator
```

---

## 3. Page Structure & Routes

### 3.1 Route Map

```
/                           → Redirect to /dashboard (if auth) or /sign-in
├── /sign-in                → Clerk sign-in page
├── /sign-up                → Clerk sign-up (invite only)
│
├── /dashboard              → Main dashboard
│
├── /bookings               → Booking list
├── /bookings/new           → New booking flow (multi-step)
├── /bookings/[id]          → Booking detail
├── /bookings/[id]/edit     → Edit booking
│
├── /customers              → Customer list
├── /customers/[id]         → Customer detail
│
├── /revenue                → Revenue dashboard (Owner/Manager only)
│
├── /settings               → Settings overview
├── /settings/team          → Team management (Owner/Manager only)
├── /settings/export        → Data export (Owner/Manager only)
│
├── /admin                  → DarDoc Admin section
│   ├── /admin/partners           → Partner list
│   ├── /admin/partners/new       → Create partner
│   ├── /admin/partners/[id]      → Partner detail
│   ├── /admin/partners/[id]/edit → Edit partner
│   ├── /admin/products           → Product catalog
│   ├── /admin/products/new       → Create product
│   └── /admin/products/[id]/edit → Edit product
│
└── /api                    → API routes
    ├── /api/webhooks/payment        → Payment webhook
    ├── /api/webhooks/booking-status → Booking status webhook
    ├── /api/webhooks/refund         → Refund webhook
    ├── /api/email/[template]        → Email sending (Resend)
    └── /api/billing/statement       → Statement generation (Xero)
```

### 3.2 Page Specifications

#### Dashboard (`/dashboard`)

**Purpose:** Home screen. Quick overview + fast access to booking.

**Sections:**
1. Greeting + Quick Action ("Good morning, Ahmed" + "New Booking" button)
2. Today's Summary (bookings today, pending payments)
3. Recent Bookings (last 5)
4. Revenue snapshot (Owner/Manager only)

**Data Required:**
- Current user
- Partner info
- Today's bookings
- Recent bookings (limit 5)
- Revenue summary (if owner/manager)

#### Booking List (`/bookings`)

**Purpose:** View and manage all bookings.

**Sections:**
1. Search bar
2. Filters (status, date range, category)
3. Booking table/cards
4. Pagination

**Data Required:**
- Bookings (paginated, filtered)
- Filter options

**Responsive:**
- Desktop: Table view
- Mobile: Card list

#### New Booking (`/bookings/new`)

**Purpose:** Create a new booking. The hero flow.

**Steps:**
1. Product Selection
2. Customer Entry
3. Location Selection
4. Time Slot Selection
5. Confirmation

**Implementation:** Multi-step wizard with URL state (`?step=1`)

**Data Required:**
- Products (active)
- Customer search results
- Partner location
- Availability slots

#### Booking Detail (`/bookings/[id]`)

**Purpose:** View complete booking information.

**Sections:**
1. Header (ID, status, created by)
2. Customer info
3. Service info
4. Payment info (with copy link)
5. Commission (Owner/Manager)
6. Nurse info (if assigned)
7. Actions (based on status)

**Data Required:**
- Full booking object
- User role (for commission visibility)

#### Revenue Dashboard (`/revenue`)

**Purpose:** Financial overview for partners.

**Access:** Owner/Manager only

**Sections:**
1. Summary cards (bookings, gross revenue, commission, pending payout)
2. Metrics table
3. Month selector
4. Transaction table
5. Export buttons

**Data Required:**
- Revenue summary (current month)
- Transaction list
- Historical data

#### Admin: Partner List (`/admin/partners`)

**Purpose:** DarDoc admin partner management.

**Access:** DarDoc Admin only

**Sections:**
1. Search
2. Partner table
3. "Add Partner" button

**Data Required:**
- All partners with summary stats

---

## 4. Layouts & Navigation

### 4.1 Layout Components

#### RootLayout

```typescript
// app/layout.tsx
- Clerk Provider
- Toast Provider
- Global CSS
- Font loading (Sofia Pro)
```

#### AuthLayout

```typescript
// app/(auth)/layout.tsx
- Centered card layout
- Subtle wave background
- DarDoc logo
- No navigation
```

Used for: `/sign-in`, `/sign-up`

#### AppLayout

```typescript
// app/(app)/layout.tsx
- Sidebar navigation (desktop)
- Bottom navigation (mobile)
- Header with user menu
- Main content area
```

Used for: All authenticated pages

### 4.2 Navigation Structure

#### Sidebar Navigation (Desktop)

```
┌─────────────────────────────────┐
│  [Partner Logo]                 │
│  Partner Name                   │
├─────────────────────────────────┤
│                                 │
│  Dashboard                      │
│  Bookings                       │
│  Customers                      │
│  Revenue        (if manager)    │
│                                 │
├─────────────────────────────────┤
│  Settings                       │
├─────────────────────────────────┤
│  [Admin Section] (if admin)     │
│    Partners                     │
│    Products                     │
├─────────────────────────────────┤
│                                 │
│  [User Avatar]                  │
│  User Name                      │
│  Sign Out                       │
│                                 │
│  Powered by DarDoc              │
└─────────────────────────────────┘
```

Width: 256px (collapsible to 64px icons-only)

#### Bottom Navigation (Mobile)

```
┌─────────────────────────────────────────────────┐
│   Home    Bookings    [+]    Customers    More  │
└─────────────────────────────────────────────────┘
```

- `[+]` is the primary "New Booking" action (prominent)
- "More" opens a sheet with Revenue, Settings, Admin

#### Header (Mobile)

```
┌─────────────────────────────────────────────────┐
│  [Partner Logo]  Partner Name      [User Avatar]│
└─────────────────────────────────────────────────┘
```

Plus Partner Switcher dropdown for DarDoc admins.

### 4.3 Auth Guards

```typescript
// middleware.ts

// Public routes (no auth required)
const publicRoutes = ['/sign-in', '/sign-up', '/api/webhooks/*'];

// Role-based access
const roleAccess = {
  '/revenue': ['owner', 'manager', 'dardoc_admin'],
  '/settings/team': ['owner', 'manager', 'dardoc_admin'],
  '/settings/export': ['owner', 'manager', 'dardoc_admin'],
  '/admin/*': ['dardoc_admin'],
};
```

---

## 5. Data Flow & State

### 5.1 State Management Strategy

**Server State (API data):** React Query (TanStack Query)
- Caching
- Background refetching
- Optimistic updates
- Infinite scroll pagination

**Client State:** React Context (minimal)
- Current user context
- Partner context (for DarDoc admins switching)
- Toast notifications

**Form State:** React Hook Form + Zod
- Validation
- Multi-step form persistence

**URL State:** Next.js searchParams
- Filters
- Pagination
- Booking flow step

### 5.2 API Integration Patterns

#### API Client Setup

```typescript
// lib/api.ts
const api = {
  // DarDoc Backend
  dardoc: {
    availability: {
      get: (date: string, serviceType: string, area: string) =>
        fetch(`${DARDOC_API}/availability?...`)
    },
    bookings: {
      create: (data: CreateBookingInput) =>
        fetch(`${DARDOC_API}/bookings`, { method: 'POST', ... }),
      update: (id: string, data: UpdateBookingInput) =>
        fetch(`${DARDOC_API}/bookings/${id}`, { method: 'PATCH', ... }),
      cancel: (id: string, data: CancelBookingInput) =>
        fetch(`${DARDOC_API}/bookings/${id}/cancel`, { method: 'POST', ... }),
    }
  },

  // Internal Pulse OS API
  pulse: {
    partners: { ... },
    customers: { ... },
    products: { ... },
    revenue: { ... },
  }
};
```

#### Query Keys

```typescript
// lib/queryKeys.ts
export const queryKeys = {
  bookings: {
    all: ['bookings'] as const,
    list: (filters: BookingFilters) => ['bookings', 'list', filters] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (partnerId: string) => ['customers', 'list', partnerId] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
    search: (query: string) => ['customers', 'search', query] as const,
  },
  products: {
    all: ['products'] as const,
    list: (category?: string) => ['products', 'list', category] as const,
  },
  availability: {
    slots: (date: string, serviceType: string, area: string) =>
      ['availability', date, serviceType, area] as const,
  },
  revenue: {
    summary: (partnerId: string, month: string) =>
      ['revenue', 'summary', partnerId, month] as const,
    transactions: (partnerId: string, month: string) =>
      ['revenue', 'transactions', partnerId, month] as const,
  },
};
```

### 5.3 Contexts

#### UserContext

```typescript
interface UserContext {
  user: {
    id: string;
    clerkUserId: string;
    email: string;
    name: string;
    role: 'owner' | 'manager' | 'staff' | 'dardoc_admin';
    partnerId?: string;
  } | null;
  isLoading: boolean;
}
```

#### PartnerContext

```typescript
interface PartnerContext {
  partner: {
    id: string;
    name: string;
    logo?: string;
    location: { address: string; area: string; city: string };
    commercialTerms: { ... };
  } | null;
  // For DarDoc admins
  availablePartners?: Partner[];
  switchPartner: (partnerId: string) => void;
}
```

### 5.4 Booking Flow State

Multi-step form with persistence:

```typescript
interface BookingFlowState {
  step: 1 | 2 | 3 | 4 | 5;
  product: Product | null;
  customer: Customer | null;
  isNewCustomer: boolean;
  newCustomerData: { firstName: string; lastName: string; phone: string; email?: string } | null;
  location: {
    type: 'partner_location' | 'customer_home';
    address: string;
    area: string;
    city: string;
  } | null;
  scheduledDate: Date | null;
  scheduledTimeSlot: string | null;
}
```

Persist to sessionStorage to survive accidental navigation.

---

## 6. Build Phases

### Phase 1: Foundation (Week 1)

**Goal:** Authenticated user can log in and see an empty shell.

#### Days 1-2: Project Setup

- [ ] Initialize Next.js 14 project (App Router)
- [ ] Configure TypeScript
- [ ] Set up Tailwind CSS with design tokens
- [ ] Install and configure Clerk
- [ ] Set up project structure (folders)
- [ ] Configure ESLint + Prettier
- [ ] Set up Vercel deployment (staging)

#### Days 3-4: Design System Foundation

- [ ] Create CSS variables file (design tokens)
- [ ] Build primitive components:
  - [ ] Button (all variants)
  - [ ] Input
  - [ ] Select
  - [ ] Card
  - [ ] Badge
  - [ ] Avatar
  - [ ] Skeleton
  - [ ] LoadingState
  - [ ] EmptyState

#### Day 5: Auth + Shell

- [ ] Configure Clerk middleware
- [ ] Build AuthLayout (sign-in page)
- [ ] Build AppLayout (sidebar + header)
- [ ] Create placeholder pages (dashboard, bookings, etc.)
- [ ] Set up UserContext
- [ ] Basic navigation working

**Deliverable:** User can sign in, see their name, navigate between empty pages.

---

### Phase 2: Booking Flow (Week 2)

**Goal:** Complete booking creation flow — the hero experience.

#### Days 1-2: Product Selection

- [ ] Build ProductCard component
- [ ] Build product grid layout
- [ ] Implement category tabs
- [ ] Implement search with debounce
- [ ] "Recently Booked" section
- [ ] API integration: Fetch products

#### Day 3: Customer Entry

- [ ] Build PhoneInput component
- [ ] Customer search (existing customers)
- [ ] New customer form
- [ ] Customer selection UI
- [ ] API integration: Customer search/create

#### Day 4: Location + Time

- [ ] Build location selection (partner vs customer)
- [ ] Build DatePicker component
- [ ] Build TimeSlotPicker component
- [ ] API integration: Fetch availability
- [ ] Handle unavailable slots gracefully

#### Day 5: Confirmation + Create

- [ ] Build booking summary view
- [ ] Build StepIndicator component
- [ ] Implement booking creation
- [ ] Generate payment link
- [ ] Redirect to booking detail
- [ ] API integration: Create booking

**Deliverable:** Staff can create a complete booking and see the payment link.

---

### Phase 3: Booking Management (Week 3)

**Goal:** View, search, edit, and cancel bookings.

#### Days 1-2: Booking List

- [ ] Build BookingCard component
- [ ] Build Table component
- [ ] Build booking list page (responsive)
- [ ] Implement filters (status, date, category)
- [ ] Implement search
- [ ] Implement pagination
- [ ] API integration: Fetch bookings

#### Day 3: Booking Detail

- [ ] Build booking detail page
- [ ] Build PaymentLinkCard (copy functionality)
- [ ] Build StatusBadge component
- [ ] Build CommissionDisplay component
- [ ] Show nurse info when assigned
- [ ] Conditional action buttons

#### Day 4: Edit + Cancel

- [ ] Build edit booking flow
- [ ] Reschedule functionality
- [ ] Build ConfirmDialog component
- [ ] Cancel before payment flow
- [ ] Cancel after payment flow (refund warning)
- [ ] API integration: Update/cancel booking

#### Day 5: Customer Management

- [ ] Build customer list page
- [ ] Build CustomerCard component
- [ ] Build customer detail page
- [ ] Show booking history per customer
- [ ] API integration: Fetch customers

**Deliverable:** Full CRUD for bookings, customer directory.

---

### Phase 4: Payment & Integration (Week 4)

**Goal:** Payment flow complete, status updates working, emails sending.

#### Days 1-2: Webhooks

- [ ] Build webhook endpoint: payment completed
- [ ] Build webhook endpoint: booking status changed
- [ ] Build webhook endpoint: refund processed
- [ ] Implement signature verification
- [ ] Update booking status on webhook
- [ ] Add webhook logging

#### Day 3: Real-time Updates

- [ ] Build Toast component
- [ ] Implement toast notifications
- [ ] Optimistic UI updates
- [ ] Background refetching for booking detail
- [ ] Status badge animations

#### Day 4: Emails

- [ ] Configure Resend
- [ ] Build email templates:
  - [ ] Booking confirmation
  - [ ] Reminder (2 hours before)
  - [ ] Completion
  - [ ] Cancellation
- [ ] Trigger emails on status changes

#### Day 5: Payment Link Polish

- [ ] Expiry countdown on payment link
- [ ] Regenerate expired link
- [ ] Copy feedback animation
- [ ] Expired booking handling

**Deliverable:** Complete payment flow, status webhooks working, emails sending.

---

### Phase 5: Revenue & Admin (Week 5)

**Goal:** Revenue dashboard, admin features, polish, first partner.

#### Days 1-2: Revenue Dashboard

- [ ] Build MetricCard component
- [ ] Build revenue summary cards
- [ ] Build metrics table
- [ ] Month selector
- [ ] Transaction list
- [ ] Export to CSV
- [ ] PDF statement download

#### Day 3: Team Management

- [ ] Team member list
- [ ] Invite team member (Clerk integration)
- [ ] Remove team member
- [ ] Role display

#### Day 4: Admin Features (DarDoc)

- [ ] Build PartnerSwitcher component
- [ ] Partner list page
- [ ] Partner creation form
- [ ] Partner detail page
- [ ] Product catalog page
- [ ] Product create/edit forms

#### Day 5: Polish + Launch

- [ ] Error boundaries
- [ ] Loading states everywhere
- [ ] Empty states everywhere
- [ ] Mobile responsiveness QA
- [ ] Performance optimization
- [ ] First partner onboarding
- [ ] Production deployment

**Deliverable:** Complete MVP, first partner using the system.

---

## 7. File Structure

```
pulse-os/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── revenue/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── team/
│   │   │   │   └── page.tsx
│   │   │   └── export/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── partners/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   └── products/
│   │   │       ├── page.tsx
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── payment/
│   │   │   │   └── route.ts
│   │   │   ├── booking-status/
│   │   │   │   └── route.ts
│   │   │   └── refund/
│   │   │       └── route.ts
│   │   ├── email/
│   │   │   └── [template]/
│   │   │       └── route.ts
│   │   └── billing/
│   │       └── statement/
│   │           └── route.ts
│   │
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
│
├── components/
│   ├── ui/                    # Primitive components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── phone-input.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── toggle.tsx
│   │   ├── badge.tsx
│   │   ├── status-badge.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── modal.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── pagination.tsx
│   │   ├── search-input.tsx
│   │   ├── date-picker.tsx
│   │   ├── time-slot-picker.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading-state.tsx
│   │   ├── error-state.tsx
│   │   └── index.ts           # Barrel export
│   │
│   ├── composite/             # Business components
│   │   ├── product-card.tsx
│   │   ├── booking-card.tsx
│   │   ├── customer-card.tsx
│   │   ├── metric-card.tsx
│   │   ├── payment-link-card.tsx
│   │   ├── commission-display.tsx
│   │   ├── partner-switcher.tsx
│   │   ├── user-menu.tsx
│   │   ├── page-header.tsx
│   │   ├── step-indicator.tsx
│   │   └── index.ts
│   │
│   └── layouts/
│       ├── auth-layout.tsx
│       ├── app-layout.tsx
│       ├── sidebar.tsx
│       ├── mobile-nav.tsx
│       └── header.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts          # API client setup
│   │   ├── dardoc.ts          # DarDoc backend API
│   │   └── pulse.ts           # Internal API
│   ├── hooks/
│   │   ├── use-bookings.ts
│   │   ├── use-customers.ts
│   │   ├── use-products.ts
│   │   ├── use-availability.ts
│   │   ├── use-revenue.ts
│   │   ├── use-user.ts
│   │   ├── use-partner.ts
│   │   ├── use-toast.ts
│   │   └── use-debounce.ts
│   ├── contexts/
│   │   ├── user-context.tsx
│   │   ├── partner-context.tsx
│   │   └── toast-context.tsx
│   ├── utils/
│   │   ├── format.ts          # Date, currency, phone formatting
│   │   ├── validation.ts      # Zod schemas
│   │   └── cn.ts              # className utility
│   ├── query-keys.ts
│   └── constants.ts
│
├── types/
│   ├── booking.ts
│   ├── customer.ts
│   ├── product.ts
│   ├── partner.ts
│   ├── user.ts
│   └── index.ts
│
├── styles/
│   └── tokens.css             # CSS custom properties
│
├── public/
│   ├── fonts/
│   │   └── sofia-pro/
│   └── images/
│       └── wave-pattern.svg
│
├── middleware.ts
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── .env.local
├── .env.example
├── IMPLEMENTATION_PLAN.md
└── pulse-os-spec.md
```

---

## Summary Checklist

### Before Starting

- [ ] Review this plan with team
- [ ] Confirm API contracts with backend team
- [ ] Obtain Sofia Pro font files
- [ ] Set up Clerk organization
- [ ] Set up Resend account
- [ ] Set up Vercel project

### Week 1: Foundation
- [ ] Project scaffold
- [ ] Design tokens
- [ ] Primitive components
- [ ] Auth flow
- [ ] App shell

### Week 2: Booking Flow
- [ ] Product selection
- [ ] Customer entry
- [ ] Location selection
- [ ] Time slot selection
- [ ] Booking confirmation

### Week 3: Booking Management
- [ ] Booking list
- [ ] Booking detail
- [ ] Edit/cancel
- [ ] Customer management

### Week 4: Integration
- [ ] Webhooks
- [ ] Real-time updates
- [ ] Emails
- [ ] Payment polish

### Week 5: Revenue & Launch
- [ ] Revenue dashboard
- [ ] Team management
- [ ] Admin features
- [ ] Polish
- [ ] First partner

---

*This plan is the technical companion to pulse-os-spec.md. Follow it sequentially for optimal results.*
