# Pulse OS — Product Specification

## MVP Specification for DarDoc B2B Partner Platform

**Version:** 1.0
**Date:** January 23, 2026
**Owner:** Keswin, CEO, DarDoc Health
**Status:** Ready for Development

---

## 1. Executive Summary

### 1.1 Problem

DarDoc Health has validated demand for B2B partnerships with boutique fitness studios, gyms, and wellness centers. Partners want to white-label DarDoc's clinical services (IV drips, blood tests, supplements) under their own brand and earn commission on every sale.

Currently, there is no system to:
- Allow partner staff to book services on behalf of their customers
- Track partner revenue and commissions
- Manage the booking-to-fulfillment handoff
- Reconcile monthly partner payouts

### 1.2 Solution

**Pulse OS** — a web-based admin portal that enables partner staff to create bookings, collect payments, and track revenue. DarDoc handles all clinical fulfillment. Partners earn commission on every completed service.

### 1.3 MVP Scope

Build an admin-only booking tool where partner staff book on behalf of customers. No customer self-serve booking. Payment via manually-sent payment links. Focus on proving the model with 2-5 initial partners before building self-serve infrastructure.

### 1.4 Success Criteria

- Onboard first partner within 2 weeks of launch
- Process 50 bookings through the system in first month
- Partner staff can complete a booking in under 60 seconds
- Zero manual intervention from DarDoc ops for standard bookings

---

## 2. User Roles & Permissions

### 2.1 Role Definitions

| Role | Scope | Description |
|------|-------|-------------|
| **DarDoc Admin** | Global | Keswin, Shaivi, Dima. Can create partners, view all data, manage product catalog, access all partner dashboards |
| **Partner Owner/Manager** | Single Partner | Full access within their partner org. Can view revenue, export data, invite/remove users |
| **Partner Staff** | Single Partner | Booking access only. Cannot view financial data, cannot export, cannot manage users |

### 2.2 Permission Matrix

| Action | DarDoc Admin | Owner/Manager | Staff |
|--------|--------------|---------------|-------|
| Create partner account | ✅ | ❌ | ❌ |
| Edit partner details | ✅ | ❌ | ❌ |
| Manage product catalog | ✅ | ❌ | ❌ |
| View all partners | ✅ | ❌ | ❌ |
| Switch between partners | ✅ | ❌ | ❌ |
| Create bookings | ✅ | ✅ | ✅ |
| Edit/cancel bookings | ✅ | ✅ | ✅ |
| View booking list | ✅ | ✅ | ✅ |
| View revenue dashboard | ✅ | ✅ | ❌ |
| View commission reports | ✅ | ✅ | ❌ |
| Download statements | ✅ | ✅ | ❌ |
| Export customer data | ✅ | ✅ | ❌ |
| Invite users | ✅ | ✅ | ❌ |
| Remove users | ✅ | ✅ | ❌ |

### 2.3 Multi-Tenancy Rules

- One user belongs to one organization only (no multi-org users in MVP)
- Partner users see only their own partner's data
- DarDoc admins see a "Switch Partner" dropdown to navigate between partners
- If a user leaves Partner A and joins Partner B, they need a new account

---

## 3. Technical Architecture

### 3.1 Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) |
| Hosting | Vercel (frontend only) |
| Database | Existing DarDoc MongoDB (UAE-hosted) |
| Authentication | Clerk |
| Email | Resend |
| Accounting | Xero API |
| Payments | Existing DarDoc unified payment layer |

### 3.2 Architecture Principles

- **Frontend-heavy:** Next.js frontend calls DarDoc backend APIs directly
- **No separate B2B backend:** All booking/availability/fulfillment logic lives in existing DarDoc backend
- **Minimal API routes:** Next.js API routes only for Resend (email) and Xero (billing) where API keys must be secured
- **Data residency:** All patient/booking/payment data stored in UAE-hosted MongoDB. Vercel serves static assets and SSR only — no sensitive data stored on Vercel.

### 3.3 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Pulse OS                                 │
│                    (Next.js on Vercel)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Clerk     │  │   Resend    │  │        Xero             │  │
│  │   (Auth)    │  │  (Email)    │  │   (Monthly Bills)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DarDoc Backend                                │
│                   (Existing System)                              │
├─────────────────────────────────────────────────────────────────┤
│  • Availability API (time slots)                                 │
│  • Booking API (create, update, cancel)                         │
│  • Unified Payment Layer (generates checkout URL)               │
│  • Webhooks (payment status, booking status, nurse assignment)  │
│  • MongoDB (UAE-hosted)                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                DarDoc Internal Admin Panel                       │
│              (Existing Ops Dashboard)                            │
├─────────────────────────────────────────────────────────────────┤
│  • Receives bookings from Pulse OS via API                      │
│  • Nurse assignment                                              │
│  • Fulfillment tracking                                          │
│  • Status updates (triggers webhooks back to Pulse OS)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### 4.1 Entities

#### Partner

```
{
  _id: ObjectId,
  name: String,                    // "Barry's Bootcamp Dubai"
  logo: String,                    // URL to logo image
  contactPerson: String,           // "Ahmed Al Rashid"
  email: String,                   // "ahmed@barrys.ae"
  phone: String,                   // "+971501234567"
  location: {
    address: String,               // Full address
    area: String,                  // "DIFC"
    city: String,                  // "Dubai"
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  commercialTerms: {
    ivDripCommission: Number,      // 0.25 (25%)
    bloodTestCommission: Number,   // 0.25 (25%)
    supplementCommission: Number   // 0.30 (30%)
  },
  bankDetails: {
    bankName: String,
    accountName: String,
    iban: String
  },
  xeroContactId: String,           // Manually created in Xero
  status: String,                  // "active" | "inactive"
  createdAt: Date,
  updatedAt: Date
}
```

#### Partner User

```
{
  _id: ObjectId,
  partnerId: ObjectId,             // Reference to Partner
  clerkUserId: String,             // Clerk user ID
  email: String,
  name: String,
  role: String,                    // "owner" | "manager" | "staff"
  status: String,                  // "active" | "invited" | "revoked"
  invitedAt: Date,
  acceptedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### DarDoc Admin User

```
{
  _id: ObjectId,
  clerkUserId: String,
  email: String,
  name: String,
  role: String,                    // "dardoc_admin"
  createdAt: Date,
  updatedAt: Date
}
```

#### Product (SKU)

```
{
  _id: ObjectId,
  name: String,                    // "NAD+ 250mg IV Drip"
  description: String,             // Full product description
  category: String,                // "iv_drip" | "blood_test" | "supplement"
  price: Number,                   // 1499 (AED, inclusive of VAT)
  priceExVat: Number,              // 1427.62 (auto-calculated)
  vatAmount: Number,               // 71.38 (auto-calculated, 5%)
  commissionRate: Number,          // 0.25 or 0.30 (based on category)
  image: String,                   // URL to product image
  status: String,                  // "active" | "inactive"
  sortOrder: Number,               // For display ordering
  createdAt: Date,
  updatedAt: Date
}
```

#### Customer

```
{
  _id: ObjectId,
  partnerId: ObjectId,             // Scoped to partner (separate records per partner)
  phone: String,                   // "+971501234567" (unique per partner)
  firstName: String,
  lastName: String,
  email: String,                   // Optional
  addresses: [{
    label: String,                 // "Home" | "Office"
    address: String,
    area: String,
    city: String
  }],
  bookingCount: Number,            // For quick reference
  lastBookingAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Booking

```
{
  _id: ObjectId,
  partnerId: ObjectId,
  customerId: ObjectId,
  productId: ObjectId,
  createdByUserId: ObjectId,       // Partner user who created booking
  
  // Service details
  product: {
    name: String,
    category: String,
    price: Number,
    priceExVat: Number,
    vatAmount: Number,
    commissionRate: Number
  },
  
  // Location
  serviceLocation: {
    type: String,                  // "partner_location" | "customer_home"
    address: String,
    area: String,
    city: String
  },
  
  // Scheduling
  scheduledDate: Date,
  scheduledTimeSlot: String,       // "14:00-15:00"
  
  // Payment
  paymentLinkUrl: String,
  paymentLinkExpiresAt: Date,      // 2 hours from generation
  paymentStatus: String,           // "pending" | "paid" | "refunded"
  paidAt: Date,
  paidAmount: Number,
  
  // Commission tracking
  commission: {
    rate: Number,                  // 0.25 or 0.30
    amount: Number,                // Calculated: priceExVat * rate
    status: String                 // "pending" | "earned" | "clawedback"
  },
  
  // Booking status
  status: String,                  // See 4.2 for full list
  
  // Fulfillment (populated via webhook from DarDoc backend)
  nurseId: String,
  nurseName: String,
  nursePhone: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  cancelledAt: Date,
  completedAt: Date
}
```

### 4.2 Booking Status Lifecycle

| Status | Meaning | Triggered By |
|--------|---------|--------------|
| `draft` | Booking created, payment link not yet copied | Booking creation |
| `pending_payment` | Payment link copied, awaiting customer payment | Partner staff copies link |
| `expired` | Payment link expired (2 hours), booking auto-cancelled | System (cron job) |
| `paid` | Customer completed payment, awaiting fulfillment | Stripe/Ziina webhook |
| `in_progress` | Nurse dispatched, service in progress | DarDoc backend webhook |
| `completed` | Service delivered successfully | DarDoc backend webhook |
| `cancelled` | Cancelled before payment | Partner staff action |
| `refunded` | Payment returned to customer | Partner staff action (post-payment cancel) |
| `no_show` | Customer not present, nurse waited 30 mins, no refund | DarDoc backend webhook |
| `failed` | Contraindication on-site, full refund issued | DarDoc backend webhook |

### 4.3 Status Transition Diagram

```
                    ┌──────────┐
                    │  draft   │
                    └────┬─────┘
                         │ copy link
                         ▼
                ┌────────────────┐
                │ pending_payment│
                └───┬───────┬────┘
           expires  │       │ payment received
           (2 hrs)  │       │
              ▼     │       ▼
        ┌─────────┐ │  ┌─────────┐
        │ expired │ │  │  paid   │
        └─────────┘ │  └────┬────┘
                    │       │ nurse dispatched
        ┌───────────┘       ▼
        │             ┌─────────────┐
        │             │ in_progress │
        │             └──────┬──────┘
        │                    │
        │    ┌───────────────┼───────────────┐
        │    │               │               │
        │    ▼               ▼               ▼
        │ ┌─────────┐  ┌──────────┐   ┌──────────┐
        │ │completed│  │ no_show  │   │  failed  │
        │ └─────────┘  └──────────┘   └──────────┘
        │
        │ (cancel before payment)
        ▼
  ┌───────────┐
  │ cancelled │
  └───────────┘

  (cancel after payment)
        │
        ▼
  ┌───────────┐
  │ refunded  │
  └───────────┘
```

---

## 5. Features Specification

### 5.1 Authentication (Clerk)

#### 5.1.1 Login Flow

1. User navigates to `pulse.dardoc.com`
2. Clerk login screen (email + password)
3. On success, Clerk returns user ID
4. System checks user role and partner association
5. Redirect to appropriate dashboard:
   - DarDoc Admin → Admin dashboard with partner switcher
   - Partner Owner/Manager → Partner dashboard with full access
   - Partner Staff → Partner dashboard with limited access

#### 5.1.2 User Invitation Flow

1. Owner/Manager clicks "Invite Team Member"
2. Enters email address and selects role (Manager or Staff)
3. System creates user record with status "invited"
4. Clerk sends invitation email
5. Invite expires in 7 days
6. On acceptance, user sets password and status changes to "active"

#### 5.1.3 User Revocation

1. Owner/Manager clicks "Remove" on a team member
2. Confirmation dialog
3. User status set to "revoked"
4. Clerk session immediately terminated
5. User cannot log back in

---

### 5.2 Partner Management (DarDoc Admin Only)

#### 5.2.1 Create Partner

**Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Business Name | Text | Yes | |
| Logo | Image Upload | No | |
| Contact Person | Text | Yes | Primary contact name |
| Email | Email | Yes | |
| Phone | Phone | Yes | UAE format (+971) |
| Address | Text | Yes | Full street address |
| Area | Dropdown | Yes | Dubai areas list |
| City | Dropdown | Yes | Dubai / Abu Dhabi |
| Bank Name | Text | Yes | |
| Account Name | Text | Yes | |
| IBAN | Text | Yes | UAE IBAN format validation |
| IV Drip Commission | Percentage | Yes | Default: 25% |
| Blood Test Commission | Percentage | Yes | Default: 25% |
| Supplement Commission | Percentage | Yes | Default: 30% |

**On Submit:**
1. Create Partner record
2. Prompt to create first Owner/Manager user

#### 5.2.2 Create First User

After partner creation:

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Email | Email | Yes |
| Role | Dropdown | Yes (Owner or Manager) |

Triggers Clerk invitation email.

#### 5.2.3 Partner List View

Table with columns:
- Logo + Name
- Contact Person
- Email
- Phone
- Status (Active/Inactive)
- Users Count
- Total Bookings
- Total Revenue
- Actions (View, Edit, Deactivate)

Search and filter by status.

---

### 5.3 Product Catalog (DarDoc Admin Only)

#### 5.3.1 Create/Edit Product

**Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | Yes | e.g., "NAD+ 250mg IV Drip" |
| Description | Textarea | Yes | Full product description |
| Category | Dropdown | Yes | IV Drip / Blood Test / Supplement |
| Price (incl. VAT) | Number | Yes | AED |
| Product Image | Image Upload | Yes | |
| Status | Toggle | Yes | Active / Inactive |
| Sort Order | Number | No | For display ordering |

**Auto-calculated (display only):**
- Price (excl. VAT): Price ÷ 1.05
- VAT Amount: Price - Price (excl. VAT)
- Commission Rate: Based on category (25% for IV/Blood, 30% for Supplements)
- Commission Amount: Price (excl. VAT) × Commission Rate

#### 5.3.2 Product List View

Table with columns:
- Image
- Name
- Category
- Price (incl. VAT)
- Commission Rate
- Status
- Actions (Edit, Deactivate)

Filter by category, status.

---

### 5.4 Booking Flow

#### 5.4.1 Product Selection

**Layout:**
- Top: Search bar (searches name + description, fuzzy matching)
- Below search: Category tabs (All | IV Drips | Blood Tests | Supplements)
- Below tabs: "Recently Booked" section (last 5 products booked by this partner)
- Main area: Product cards grid

**Product Card:**
- Product image
- Product name
- Price (AED XXX)
- Tap to expand: Full description, commission earned ("You earn AED XX")

**Behavior:**
- Default view: "All" tab with recently booked at top
- Search updates results in real-time (debounced 300ms)
- Category tabs filter instantly
- Clicking card selects product and proceeds to next step

#### 5.4.2 Customer Entry

**Phone Number Field:**
- UAE format input (+971 5X XXX XXXX)
- As user types, system searches existing customers for this partner
- Shows dropdown of matches: "Ahmed Ali — +971 50 123 4567 — 3 previous bookings"
- Selecting match auto-populates all fields

**If new customer, show fields:**

| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Phone | Phone | Yes (pre-filled) |
| Email | Email | No |

**On submit:** Customer record created/selected, proceed to next step.

#### 5.4.3 Location Selection

**Options:**
1. **At Partner Location** (radio button)
   - Auto-fills partner's address
   - Display: "Service will be at [Partner Name], [Address]"

2. **At Customer's Home** (radio button)
   - If returning customer with saved address, show dropdown of saved addresses
   - "Add New Address" option
   - New address fields: Address, Area (dropdown), City (dropdown)

#### 5.4.4 Time Slot Selection

**API Call:** Fetch availability from DarDoc backend

**Display:**
- Calendar date picker (shows next 30 days)
- Selecting date shows available time slots for that date
- Time slots displayed as buttons: "10:00 AM", "11:00 AM", etc.
- Unavailable slots shown greyed out
- Slot duration determined by backend based on service type

#### 5.4.5 Booking Confirmation

**Summary Screen:**
- Product: [Name] — AED [Price]
- Customer: [Name] — [Phone]
- Location: [Full Address]
- Date & Time: [Date] at [Time]
- Your Commission: AED [Amount]

**Actions:**
- "Create Booking" button
- "Go Back" link

**On Create Booking:**
1. API call to DarDoc backend to create booking
2. Backend returns booking ID and generates payment link URL
3. Booking saved with status "draft"
4. Redirect to Booking Detail page

#### 5.4.6 Booking Detail Page

**Header:**
- Booking ID
- Status badge (color-coded)
- Created by [User Name] on [Date]

**Customer Section:**
- Name, Phone, Email
- Location

**Service Section:**
- Product name, description
- Scheduled date/time
- Price breakdown (Price, VAT, Total)

**Payment Section:**
- Payment status
- Payment link (with "Copy Link" button)
- Link expires: [Countdown timer or expiry time]
- If paid: Payment date, amount

**Commission Section (Owner/Manager only):**
- Commission rate
- Commission amount
- Commission status (Pending / Earned / Clawed Back)

**Nurse Section (after assignment):**
- Nurse name
- Nurse phone

**Actions (based on status):**

| Status | Available Actions |
|--------|-------------------|
| draft | Copy Payment Link, Edit, Cancel |
| pending_payment | Copy Payment Link (regenerate), Edit, Cancel |
| paid | Reschedule, Cancel (triggers refund) |
| in_progress | None |
| completed | None |
| cancelled | None |
| refunded | None |
| no_show | None |
| failed | None |

---

### 5.5 Edit Booking

Available for statuses: `draft`, `pending_payment`, `paid`

**Editable fields:**
- Product (can upgrade/downgrade)
- Location
- Date/Time (reschedule)

**If product changes:**
- Calculate price difference
- If upgrade: Generate new payment link for difference amount
- If downgrade and status is `paid`: Process partial refund (manual for MVP — flag for DarDoc admin)

**If date/time changes (reschedule):**
- Check availability for new slot
- Update booking
- If status is `paid`, send updated confirmation email to customer

---

### 5.6 Cancel Booking

**Before Payment (status: draft, pending_payment):**
1. Confirmation dialog: "Are you sure you want to cancel this booking?"
2. Update status to `cancelled`
3. Payment link invalidated
4. No refund needed
5. Time slot released

**After Payment (status: paid):**
1. Confirmation dialog: "This booking has been paid. Cancelling will trigger a full refund of AED [Amount]. Customer will receive refund in 5-7 business days. Continue?"
2. API call to DarDoc backend to trigger refund
3. Update status to `refunded`
4. Commission status set to `clawedback`
5. Time slot released
6. Send cancellation email to customer

---

### 5.7 Booking List

**Layout:**
- Search bar (search by customer name, phone, booking ID)
- Filters: Status (multi-select), Date range, Product category
- Table view

**Table Columns:**
- Booking ID
- Customer (Name + Phone)
- Product
- Date/Time
- Status (badge)
- Amount (AED)
- Commission (Owner/Manager only)
- Actions

**Default Sort:** Most recent first

**Pagination:** 20 per page

---

### 5.8 Revenue Dashboard (Owner/Manager Only)

#### 5.8.1 Summary Cards (Top Row)

| Card | Value | Subtext |
|------|-------|---------|
| Total Bookings | [Count] | This month |
| Gross Revenue | AED [Amount] | Before VAT |
| Your Commission | AED [Amount] | Estimated this month |
| Pending Payout | AED [Amount] | From completed bookings |

#### 5.8.2 Real-Time Metrics Table

| Metric | Value |
|--------|-------|
| Total Bookings (This Month) | [Count] |
| Gross Revenue (incl. VAT) | AED [Amount] |
| VAT Amount | AED [Amount] |
| Net Revenue (excl. VAT) | AED [Amount] |
| Commission Rate (Avg) | [X]% |
| Commission Earned | AED [Amount] |
| Pending Payments | AED [Amount] (bookings not yet paid) |
| Refunds/Cancellations | AED [Amount] |
| Clawbacks | AED [Amount] |
| **Estimated Net Payout** | AED [Amount] |

**Disclaimer below table:**
> "Estimated earnings. Final payout confirmed via monthly statement. Payouts processed by the 10th of each month."

#### 5.8.3 Historical View

- Dropdown: Select month/year
- Shows same metrics for selected period
- "Download Statement" button (PDF + CSV)

#### 5.8.4 Transaction Detail

Table of all bookings with:
- Date
- Booking ID
- Customer
- Product
- Gross Amount
- VAT
- Net Amount
- Commission
- Status

Export to CSV.

---

### 5.9 Monthly Statement Generation

**Trigger:** 1st of each month at 00:01 UAE time (automated cron job)

**Process:**
1. For each active partner:
2. Calculate all completed bookings from prior month
3. Sum: Gross revenue, VAT, Net revenue, Commission earned
4. Subtract: Refunds and clawbacks
5. Generate PDF statement
6. Generate Xero Bill (summary line + PDF attachment)

**Statement Contents (PDF):**

```
===================================================
              PULSE OS PARTNER STATEMENT
===================================================

Partner: Barry's Bootcamp Dubai
Period: January 2026
Generated: February 1, 2026

---------------------------------------------------
SUMMARY
---------------------------------------------------
Total Bookings:                              47
Gross Revenue (incl. VAT):          AED 42,353.00
VAT (5%):                            AED 2,016.81
Net Revenue (excl. VAT):            AED 40,336.19

Commission Rate:                           25-30%
Commission Earned:                  AED 10,287.45

Refunds:                             AED 1,499.00
Clawbacks:                             AED 374.75

---------------------------------------------------
NET PAYOUT:                         AED  9,912.70
---------------------------------------------------

Payment will be processed by: February 10, 2026
Payment Method: Bank Transfer to [Bank Name] IBAN ending [XXXX]

---------------------------------------------------
TRANSACTION DETAIL
---------------------------------------------------
[Table of all bookings]

===================================================
              Powered by DarDoc Health
===================================================
```

**Xero Integration:**
1. Create Bill in Xero
2. Payee: Partner (must exist as Contact in Xero — created manually during onboarding)
3. Description: "Partner commission for [Month Year] — AED [Amount]"
4. Account Code: Configurable in Pulse OS settings
5. Attach: PDF statement
6. Status: Draft (for DarDoc finance to review and approve)

---

### 5.10 Customer Data Export (Owner/Manager Only)

**Location:** Settings or dedicated "Customers" page

**Action:** "Export Customer Data" button

**Output:** CSV file containing:
- First Name
- Last Name
- Phone
- Email
- Total Bookings
- Last Booking Date

**Scope:** Only customers who booked through this partner (not all DarDoc customers)

**No medical or payment data included.**

---

### 5.11 Customer Emails

**Sender:** `noreply@dardoc.com` via Resend

**Template Style:** Plain text, professional

#### 5.11.1 Booking Confirmation (on payment)

```
Subject: Your booking is confirmed — [Product Name]

Hi [First Name],

Your booking has been confirmed.

Service: [Product Name]
Date: [Day, Month Date, Year]
Time: [HH:MM AM/PM]
Location: [Full Address]

Price Paid: AED [Amount]

Booked via: [Partner Name]

---

What to expect:
- Our nurse will arrive at your location at the scheduled time
- Please ensure someone is available to receive them
- The service typically takes [X] minutes

Cancellation Policy:
- Cancellations must be made at least [X] hours before your appointment
- No refunds for no-shows

If you have any questions, contact us at [support email/phone].

Thank you for choosing DarDoc Health.

---
Powered by DarDoc Health
```

#### 5.11.2 Reminder (2 hours before)

```
Subject: Reminder: Your appointment is in 2 hours

Hi [First Name],

This is a reminder that your appointment is coming up.

Service: [Product Name]
Time: [HH:MM AM/PM] today
Location: [Full Address]

Your nurse: [Nurse Name]
Nurse contact: [Nurse Phone]

Please ensure you're available at the location. Our nurse will arrive on time.

---
Powered by DarDoc Health
```

#### 5.11.3 Completion

```
Subject: Thank you — Your service is complete

Hi [First Name],

Your [Product Name] service has been completed.

Service Date: [Date]
Location: [Address]
Amount Paid: AED [Amount]

We hope you had a great experience.

To book again, contact [Partner Name] or visit dardoc.com.

---
Powered by DarDoc Health
```

---

## 6. UI/UX Specifications

### 6.1 Design Principles

- **Speed:** Staff must complete a booking in under 60 seconds
- **Clarity:** No ambiguity — every action has clear feedback
- **Mobile-first:** Designed for phone use at front desk, scales up to desktop
- **Stripe/Linear quality:** Clean, minimal, professional

### 6.2 Navigation

**Partner Users:**
- Dashboard (home)
- Bookings (list + create)
- Customers (list + view)
- Revenue (Owner/Manager only)
- Settings (team, export)

**DarDoc Admin:**
- All of above, plus:
- Partner switcher (top bar)
- Partners (list + create)
- Products (catalog management)

### 6.3 Component Guidelines

**Buttons:**
- Primary: Solid fill, used for main actions
- Secondary: Outline, used for secondary actions
- Destructive: Red, used for cancel/delete

**Status Badges:**
- draft: Grey
- pending_payment: Yellow
- paid: Blue
- in_progress: Purple
- completed: Green
- cancelled: Grey (strikethrough)
- refunded: Orange
- no_show: Red
- failed: Red

**Cards:**
- Product cards: Image left, details right, subtle shadow
- Metric cards: Large number, small label below

**Forms:**
- Labels above inputs
- Inline validation
- Clear error messages

**Tables:**
- Hover highlight
- Clickable rows (navigate to detail)
- Sticky header on scroll

### 6.4 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 7. API Contracts

### 7.1 APIs Pulse OS Calls (DarDoc Backend)

#### 7.1.1 Get Availability

```
GET /api/v1/availability
Query params:
  - date: YYYY-MM-DD
  - serviceType: string (maps to product category)
  - area: string
  
Response:
{
  "date": "2026-01-25",
  "slots": [
    { "time": "10:00", "available": true },
    { "time": "11:00", "available": true },
    { "time": "12:00", "available": false },
    ...
  ]
}
```

#### 7.1.2 Create Booking

```
POST /api/v1/bookings
Body:
{
  "source": "pulse_os",
  "partnerId": "xxx",
  "customer": {
    "firstName": "Ahmed",
    "lastName": "Ali",
    "phone": "+971501234567",
    "email": "ahmed@email.com"
  },
  "product": {
    "id": "xxx",
    "name": "NAD+ 250mg IV Drip",
    "category": "iv_drip",
    "price": 1499,
    "priceExVat": 1427.62,
    "vatAmount": 71.38
  },
  "location": {
    "type": "customer_home",
    "address": "123 Main St",
    "area": "DIFC",
    "city": "Dubai"
  },
  "scheduledDate": "2026-01-25",
  "scheduledTime": "10:00"
}

Response:
{
  "bookingId": "xxx",
  "paymentLinkUrl": "https://pay.dardoc.com/xxx",
  "paymentLinkExpiresAt": "2026-01-24T14:00:00Z",
  "status": "draft"
}
```

#### 7.1.3 Update Booking

```
PATCH /api/v1/bookings/{bookingId}
Body:
{
  "product": { ... },        // Optional: if changing service
  "location": { ... },       // Optional: if changing location
  "scheduledDate": "...",    // Optional: if rescheduling
  "scheduledTime": "..."     // Optional: if rescheduling
}

Response:
{
  "bookingId": "xxx",
  "paymentLinkUrl": "...",   // New link if product upgraded
  "status": "..."
}
```

#### 7.1.4 Cancel Booking

```
POST /api/v1/bookings/{bookingId}/cancel
Body:
{
  "reason": "customer_request",
  "refund": true             // true if status was 'paid'
}

Response:
{
  "bookingId": "xxx",
  "status": "cancelled" | "refunded",
  "refundAmount": 1499       // if refund: true
}
```

### 7.2 Webhooks DarDoc Backend Sends to Pulse OS

#### 7.2.1 Payment Completed

```
POST /api/webhooks/payment
{
  "event": "payment.completed",
  "bookingId": "xxx",
  "paidAt": "2026-01-24T12:30:00Z",
  "paidAmount": 1499
}
```

#### 7.2.2 Booking Status Update

```
POST /api/webhooks/booking-status
{
  "event": "booking.status_changed",
  "bookingId": "xxx",
  "status": "in_progress" | "completed" | "no_show" | "failed",
  "updatedAt": "2026-01-25T10:15:00Z",
  "nurse": {                 // Included when status changes to in_progress
    "id": "xxx",
    "name": "Nurse Sarah",
    "phone": "+971501234567"
  }
}
```

#### 7.2.3 Refund Processed

```
POST /api/webhooks/refund
{
  "event": "refund.processed",
  "bookingId": "xxx",
  "refundAmount": 1499,
  "refundedAt": "2026-01-24T15:00:00Z"
}
```

---

## 8. Authentication & Authorization

### 8.1 Overview

Pulse OS uses a layered authentication approach:
- **Clerk** handles user identity and session management
- **API Keys** secure communication between Pulse OS and DarDoc backend
- **Webhook Signatures** verify incoming webhooks from DarDoc backend

### 8.2 User Authentication Flow (Clerk)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Browser   │────▶│    Clerk    │────▶│   Pulse OS      │
│             │◀────│   (Auth)    │◀────│   (Next.js)     │
└─────────────┘     └─────────────┘     └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │  DarDoc Backend │
                                        └─────────────────┘
```

**Login Flow:**
1. User navigates to `pulse.dardoc.com`
2. Clerk middleware checks for valid session
3. If no session, redirect to Clerk login page
4. User authenticates (email + password)
5. Clerk issues session token (stored in httpOnly cookie)
6. Pulse OS backend validates Clerk token and fetches user role
7. User redirected to appropriate dashboard

**Session Management:**
- Session lifetime: 7 days (configurable in Clerk)
- Refresh token rotation: Enabled
- Multi-device sessions: Allowed

### 8.3 API Authentication (Pulse OS → DarDoc Backend)

All API calls from Pulse OS to DarDoc backend include:

| Header | Value | Description |
|--------|-------|-------------|
| `X-API-Key` | `{DARDOC_API_KEY}` | Static API key for service authentication |
| `X-Partner-ID` | `{partnerId}` | Partner context for the request |
| `X-Request-ID` | `{uuid}` | Unique request identifier for tracing |
| `Authorization` | `Bearer {clerkToken}` | User's Clerk session token |

**API Key Management:**
- Keys stored in Vercel environment variables (encrypted at rest)
- Separate keys for staging and production
- Key rotation: Quarterly, or immediately if compromised
- Keys have partner-scoped permissions (cannot access other partners' data)

**Request Example:**
```javascript
const response = await fetch(`${DARDOC_API_URL}/api/v1/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.DARDOC_API_KEY,
    'X-Partner-ID': partnerId,
    'X-Request-ID': crypto.randomUUID(),
    'Authorization': `Bearer ${clerkToken}`
  },
  body: JSON.stringify(bookingData)
});
```

### 8.4 Webhook Authentication (DarDoc Backend → Pulse OS)

All webhooks from DarDoc include HMAC-SHA256 signature:

| Header | Description |
|--------|-------------|
| `X-Webhook-Signature` | HMAC-SHA256 signature of request body |
| `X-Webhook-Timestamp` | Unix timestamp when webhook was sent |
| `X-Webhook-ID` | Unique webhook delivery ID |

**Signature Verification:**
```javascript
function verifyWebhookSignature(payload, signature, timestamp) {
  const WEBHOOK_SECRET = process.env.DARDOC_WEBHOOK_SECRET;

  // Reject if timestamp is > 5 minutes old (replay attack prevention)
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  if (parseInt(timestamp) < fiveMinutesAgo) {
    throw new Error('Webhook timestamp too old');
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  // Constant-time comparison
  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    throw new Error('Invalid webhook signature');
  }

  return true;
}
```

### 8.5 Authorization Rules

| User Type | Can Access | Cannot Access |
|-----------|------------|---------------|
| DarDoc Admin | All partners, all data | N/A |
| Partner Owner/Manager | Own partner's data, revenue, team | Other partners' data |
| Partner Staff | Own partner's bookings, customers | Revenue, team management |

**Enforcement Points:**
1. **Middleware** — Verify Clerk session on every request
2. **API Routes** — Check user role and partner membership
3. **Database Queries** — Always filter by `partnerId` for partner users
4. **Frontend** — Hide UI elements based on role (defense in depth, not sole protection)

---

## 9. Error Handling

### 9.1 Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {},
    "requestId": "uuid"
  }
}
```

### 9.2 Error Codes

#### Authentication Errors (4xx)

| Code | HTTP Status | Message | Action |
|------|-------------|---------|--------|
| `AUTH_INVALID_TOKEN` | 401 | Session expired or invalid | Redirect to login |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permission | Show permission error |
| `AUTH_PARTNER_MISMATCH` | 403 | User cannot access this partner's data | Redirect to own dashboard |
| `AUTH_RATE_LIMITED` | 429 | Too many requests | Retry after `Retry-After` header |

#### Validation Errors (400)

| Code | HTTP Status | Message | Details |
|------|-------------|---------|---------|
| `VALIDATION_FAILED` | 400 | Input validation failed | `{ "fields": { "phone": "Invalid UAE phone format" } }` |
| `CUSTOMER_PHONE_EXISTS` | 400 | Customer with this phone already exists | `{ "existingCustomerId": "xxx" }` |
| `INVALID_DATE_FORMAT` | 400 | Date must be YYYY-MM-DD | `{ "field": "scheduledDate" }` |

#### Booking Errors (4xx)

| Code | HTTP Status | Message | Details |
|------|-------------|---------|---------|
| `SLOT_UNAVAILABLE` | 409 | Selected time slot is no longer available | `{ "suggestedSlots": ["11:00", "14:00"] }` |
| `BOOKING_NOT_FOUND` | 404 | Booking not found | |
| `BOOKING_CANNOT_CANCEL` | 400 | Booking cannot be cancelled in current status | `{ "currentStatus": "completed" }` |
| `BOOKING_CANNOT_EDIT` | 400 | Booking cannot be edited in current status | `{ "currentStatus": "in_progress" }` |
| `PAYMENT_LINK_EXPIRED` | 400 | Payment link has expired | `{ "expiredAt": "2026-01-24T14:00:00Z" }` |

#### Payment Errors (4xx/5xx)

| Code | HTTP Status | Message | Details |
|------|-------------|---------|---------|
| `PAYMENT_LINK_GENERATION_FAILED` | 502 | Could not generate payment link | Retry or contact support |
| `REFUND_FAILED` | 502 | Refund processing failed | `{ "reason": "Payment provider error" }` |
| `PAYMENT_ALREADY_PROCESSED` | 409 | Payment already completed | |

#### System Errors (5xx)

| Code | HTTP Status | Message | Action |
|------|-------------|---------|--------|
| `INTERNAL_ERROR` | 500 | An unexpected error occurred | Log and alert, show generic message |
| `DARDOC_API_UNAVAILABLE` | 503 | DarDoc service temporarily unavailable | Retry with backoff |
| `DATABASE_ERROR` | 500 | Database operation failed | Log and alert |

### 9.3 Error Handling by Layer

#### Frontend (Next.js)

```typescript
// Global error handler
async function apiCall(url: string, options: RequestInit) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();

    switch (error.error.code) {
      case 'AUTH_INVALID_TOKEN':
        // Redirect to login
        window.location.href = '/sign-in';
        break;
      case 'SLOT_UNAVAILABLE':
        // Show slot picker with suggestions
        showSlotPicker(error.error.details.suggestedSlots);
        break;
      case 'VALIDATION_FAILED':
        // Show field-level errors
        setFieldErrors(error.error.details.fields);
        break;
      default:
        // Show generic toast
        toast.error(error.error.message);
    }

    throw new ApiError(error);
  }

  return response.json();
}
```

#### API Routes (Next.js)

```typescript
// Standardized error response
function errorResponse(code: string, message: string, status: number, details?: object) {
  return NextResponse.json({
    error: {
      code,
      message,
      details,
      requestId: headers().get('X-Request-ID')
    }
  }, { status });
}

// Usage in API route
export async function POST(request: Request) {
  try {
    // ... business logic
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse('VALIDATION_FAILED', error.message, 400, error.fields);
    }
    if (error instanceof SlotUnavailableError) {
      return errorResponse('SLOT_UNAVAILABLE', 'Time slot unavailable', 409, {
        suggestedSlots: error.alternatives
      });
    }
    // Log unexpected errors
    console.error('Unexpected error:', error);
    return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
}
```

### 9.4 Retry Logic

| Scenario | Retry Strategy |
|----------|----------------|
| Network timeout | 3 retries with exponential backoff (1s, 2s, 4s) |
| 5xx errors | 3 retries with exponential backoff |
| 429 rate limited | Wait for `Retry-After` header duration |
| 4xx client errors | No retry (user must fix input) |
| Webhook delivery | DarDoc retries 5 times over 24 hours |

---

## 10. Entity Relationship Diagram

### 10.1 Core Entities

```mermaid
erDiagram
    Partner ||--o{ PartnerUser : "has users"
    Partner ||--o{ Customer : "owns customers"
    Partner ||--o{ Booking : "has bookings"

    PartnerUser ||--o{ Booking : "creates"

    Customer ||--o{ Booking : "makes"
    Customer ||--o{ CustomerAddress : "has addresses"

    Product ||--o{ Booking : "booked as"

    DarDocAdmin }o--|| Partner : "manages"

    Partner {
        ObjectId _id PK
        String name
        String logo
        String contactPerson
        String email
        String phone
        Object location
        Object commercialTerms
        Object bankDetails
        String xeroContactId
        String status
        Date createdAt
        Date updatedAt
    }

    PartnerUser {
        ObjectId _id PK
        ObjectId partnerId FK
        String clerkUserId UK
        String email
        String name
        String role
        String status
        Date invitedAt
        Date acceptedAt
        Date createdAt
        Date updatedAt
    }

    DarDocAdmin {
        ObjectId _id PK
        String clerkUserId UK
        String email
        String name
        String role
        Date createdAt
        Date updatedAt
    }

    Customer {
        ObjectId _id PK
        ObjectId partnerId FK
        String phone UK
        String firstName
        String lastName
        String email
        Number bookingCount
        Date lastBookingAt
        Date createdAt
        Date updatedAt
    }

    CustomerAddress {
        ObjectId _id PK
        ObjectId customerId FK
        String label
        String address
        String area
        String city
    }

    Product {
        ObjectId _id PK
        String name
        String description
        String category
        Number price
        Number priceExVat
        Number vatAmount
        Number commissionRate
        String image
        String status
        Number sortOrder
        Date createdAt
        Date updatedAt
    }

    Booking {
        ObjectId _id PK
        ObjectId partnerId FK
        ObjectId customerId FK
        ObjectId productId FK
        ObjectId createdByUserId FK
        Object product
        Object serviceLocation
        Date scheduledDate
        String scheduledTimeSlot
        String paymentLinkUrl
        Date paymentLinkExpiresAt
        String paymentStatus
        Date paidAt
        Number paidAmount
        Object commission
        String status
        String nurseId
        String nurseName
        String nursePhone
        Date createdAt
        Date updatedAt
        Date cancelledAt
        Date completedAt
    }
```

### 10.2 Key Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| Partner → PartnerUser | 1:N | Partner has many users (owner, managers, staff) |
| Partner → Customer | 1:N | Customers scoped to partner (same person = separate records per partner) |
| Partner → Booking | 1:N | All bookings belong to a partner |
| Customer → Booking | 1:N | Customer can have multiple bookings |
| PartnerUser → Booking | 1:N | Tracks who created each booking |
| Product → Booking | 1:N | Product data embedded in booking at creation time |

### 10.3 Notes

- **Phone uniqueness**: Customer phone is unique per partner (`partnerId` + `phone` compound unique)
- **Product embedding**: Product details copied into booking to preserve pricing at time of booking
- **Multi-tenancy**: All partner data queries must filter by `partnerId`

---

## 11. Environment Configuration

### 11.1 Environment Variables

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CLERK_SECRET_KEY` | Clerk API secret key | `sk_live_xxx` |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend key | `pk_live_xxx` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key (client-side) | `pk_live_xxx` |
| `DARDOC_API_URL` | DarDoc backend base URL | `https://api.dardoc.com` |
| `DARDOC_API_KEY` | API key for DarDoc backend | `dardoc_xxx` |
| `DARDOC_WEBHOOK_SECRET` | Secret for webhook signature verification | `whsec_xxx` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `RESEND_API_KEY` | Resend email API key | `re_xxx` |
| `XERO_CLIENT_ID` | Xero OAuth client ID | `xxx` |
| `XERO_CLIENT_SECRET` | Xero OAuth client secret | `xxx` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment name | `development` |
| `LOG_LEVEL` | Logging verbosity | `info` |
| `RATE_LIMIT_REQUESTS` | Max requests per minute per user | `100` |
| `PAYMENT_LINK_EXPIRY_HOURS` | Hours until payment link expires | `2` |

### 11.2 Environment Setup

#### Development (Local)

```bash
# .env.local
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
DARDOC_API_URL=https://api-staging.dardoc.com
DARDOC_API_KEY=dardoc_test_xxx
DARDOC_WEBHOOK_SECRET=whsec_test_xxx
MONGODB_URI=mongodb://localhost:27017/pulse_os_dev
RESEND_API_KEY=re_test_xxx
NODE_ENV=development
LOG_LEVEL=debug
```

#### Staging

```bash
# Vercel Environment Variables (Staging)
CLERK_SECRET_KEY=sk_test_xxx
DARDOC_API_URL=https://api-staging.dardoc.com
DARDOC_API_KEY=dardoc_staging_xxx
MONGODB_URI=mongodb+srv://staging:xxx@cluster.mongodb.net/pulse_os_staging
NODE_ENV=staging
```

#### Production

```bash
# Vercel Environment Variables (Production)
CLERK_SECRET_KEY=sk_live_xxx
DARDOC_API_URL=https://api.dardoc.com
DARDOC_API_KEY=dardoc_prod_xxx
MONGODB_URI=mongodb+srv://prod:xxx@cluster.mongodb.net/pulse_os_prod
NODE_ENV=production
LOG_LEVEL=info
```

### 11.3 Secrets Management

| Secret | Storage | Rotation |
|--------|---------|----------|
| Clerk keys | Vercel encrypted env vars | Annually |
| DarDoc API key | Vercel encrypted env vars | Quarterly |
| Webhook secret | Vercel encrypted env vars | Quarterly |
| MongoDB credentials | Vercel encrypted env vars | Annually |
| Xero credentials | Vercel encrypted env vars | Per OAuth refresh |

**Never commit secrets to git.** Use `.env.local` for local development (in `.gitignore`).

---

## 12. Security Requirements

### 12.1 Authentication Security

| Requirement | Implementation |
|-------------|----------------|
| Password policy | Clerk enforces: 8+ chars, mixed case, numbers |
| Session security | httpOnly cookies, secure flag, SameSite=Strict |
| Multi-factor auth | Optional via Clerk (TOTP, SMS) |
| Account lockout | 5 failed attempts → 15 minute lockout |
| Session timeout | 7 days inactive |

### 12.2 API Security

| Requirement | Implementation |
|-------------|----------------|
| Transport security | HTTPS only (TLS 1.3) |
| API authentication | API key + Clerk token |
| Rate limiting | 100 requests/minute per user |
| Request validation | Zod schema validation on all inputs |
| SQL/NoSQL injection | Parameterized queries only |

### 12.3 Data Security

| Requirement | Implementation |
|-------------|----------------|
| Encryption at rest | MongoDB Atlas encryption |
| Encryption in transit | TLS 1.3 |
| PII handling | Minimal collection, no medical data stored |
| Data residency | UAE-hosted MongoDB (compliance) |
| Backup encryption | AES-256 |

### 12.4 Input Validation

All inputs validated using Zod schemas:

```typescript
const CreateBookingSchema = z.object({
  customerId: z.string().regex(/^[a-f\d]{24}$/i),
  productId: z.string().regex(/^[a-f\d]{24}$/i),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.object({
    type: z.enum(['partner_location', 'customer_home']),
    address: z.string().min(5).max(500),
    area: z.string().min(2).max(100),
    city: z.enum(['Dubai', 'Abu Dhabi'])
  })
});
```

### 12.5 CORS Configuration

```typescript
// next.config.js
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? 'https://pulse.dardoc.com'
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
  'Access-Control-Max-Age': '86400'
};
```

### 12.6 Security Headers

```typescript
// middleware.ts
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' clerk.com; style-src 'self' 'unsafe-inline';"
};
```

### 12.7 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/*` | 10 requests | 1 minute |
| `/api/bookings` (POST) | 30 requests | 1 minute |
| `/api/bookings` (GET) | 100 requests | 1 minute |
| `/api/webhooks/*` | 1000 requests | 1 minute |
| All other endpoints | 100 requests | 1 minute |

---

## 13. Observability & Monitoring

### 13.1 Structured Logging

All logs follow JSON format for easy parsing:

```json
{
  "timestamp": "2026-01-24T12:30:00.000Z",
  "level": "info",
  "message": "Booking created",
  "service": "pulse-os",
  "requestId": "uuid",
  "userId": "user_xxx",
  "partnerId": "partner_xxx",
  "bookingId": "booking_xxx",
  "duration_ms": 234
}
```

**Log Levels:**
- `error`: Unrecoverable errors, requires immediate attention
- `warn`: Recoverable issues, potential problems
- `info`: Key business events (booking created, payment received)
- `debug`: Detailed debugging information (dev only)

### 13.2 Key Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `booking.created` | Counter | Number of bookings created |
| `booking.paid` | Counter | Number of successful payments |
| `booking.cancelled` | Counter | Number of cancellations |
| `api.latency_ms` | Histogram | API response time |
| `api.error_rate` | Gauge | Percentage of 5xx responses |
| `payment_link.generated` | Counter | Payment links created |
| `payment_link.conversion_rate` | Gauge | Paid / Generated ratio |
| `webhook.received` | Counter | Webhooks received by type |
| `webhook.processing_time_ms` | Histogram | Webhook processing duration |

### 13.3 Health Checks

**Endpoint:** `GET /api/health`

```json
{
  "status": "healthy",
  "timestamp": "2026-01-24T12:30:00.000Z",
  "checks": {
    "database": "ok",
    "clerk": "ok",
    "dardoc_api": "ok"
  },
  "version": "1.0.0"
}
```

**Liveness:** `/api/health/live` — Returns 200 if process is running
**Readiness:** `/api/health/ready` — Returns 200 if all dependencies connected

### 13.4 Alerting Thresholds

| Alert | Condition | Severity |
|-------|-----------|----------|
| High error rate | 5xx rate > 5% for 5 minutes | Critical |
| API latency | P95 > 2s for 5 minutes | Warning |
| Webhook failures | > 10 failures in 5 minutes | Warning |
| Payment link failures | > 3 consecutive failures | Critical |
| Database connection | Connection pool exhausted | Critical |
| Auth failures | > 50 failures in 5 minutes | Warning |

### 13.5 Dashboards

**Operational Dashboard:**
- Request rate (requests/minute)
- Error rate by endpoint
- P50, P95, P99 latency
- Active users count
- Webhook processing queue depth

**Business Dashboard:**
- Bookings created today
- Payment conversion rate
- Revenue by partner
- Top products booked
- Cancellation rate

### 13.6 Recommended Tools

| Purpose | Tool | Notes |
|---------|------|-------|
| Logging | Vercel Logs / Axiom | Built-in with Vercel |
| Metrics | Vercel Analytics | Built-in with Vercel |
| Error tracking | Sentry | Captures stack traces, user context |
| Uptime monitoring | Better Uptime / Checkly | External monitoring |
| Alerting | PagerDuty / Slack | Alert routing |

---

## 14. Database Indexes

### 14.1 Collection: `partners`

```javascript
// Primary queries: lookup by ID, list all active
db.partners.createIndex({ "status": 1 });
db.partners.createIndex({ "email": 1 }, { unique: true });
```

### 14.2 Collection: `partnerUsers`

```javascript
// Primary queries: lookup by Clerk ID, list by partner
db.partnerUsers.createIndex({ "clerkUserId": 1 }, { unique: true });
db.partnerUsers.createIndex({ "partnerId": 1, "status": 1 });
db.partnerUsers.createIndex({ "email": 1 });
```

### 14.3 Collection: `dardocAdmins`

```javascript
// Primary queries: lookup by Clerk ID
db.dardocAdmins.createIndex({ "clerkUserId": 1 }, { unique: true });
```

### 14.4 Collection: `products`

```javascript
// Primary queries: list active by category, sorted
db.products.createIndex({ "status": 1, "category": 1, "sortOrder": 1 });
```

### 14.5 Collection: `customers`

```javascript
// Primary queries: lookup by phone within partner, search by name
db.customers.createIndex({ "partnerId": 1, "phone": 1 }, { unique: true });
db.customers.createIndex({ "partnerId": 1, "lastName": 1, "firstName": 1 });
db.customers.createIndex({ "partnerId": 1, "lastBookingAt": -1 });
```

### 14.6 Collection: `bookings`

```javascript
// Primary queries: list by partner + status, customer history, date range
db.bookings.createIndex({ "partnerId": 1, "status": 1, "createdAt": -1 });
db.bookings.createIndex({ "partnerId": 1, "scheduledDate": 1 });
db.bookings.createIndex({ "customerId": 1, "createdAt": -1 });
db.bookings.createIndex({ "createdByUserId": 1, "createdAt": -1 });
db.bookings.createIndex({ "paymentStatus": 1, "paymentLinkExpiresAt": 1 }); // For expiry cron
db.bookings.createIndex({ "status": 1, "completedAt": 1 }); // For monthly statements
```

### 14.7 Index Strategy Notes

| Consideration | Approach |
|---------------|----------|
| Compound indexes | Lead with `partnerId` for multi-tenant queries |
| Sort order | Include `-1` (descending) for recent-first queries |
| Covered queries | Include commonly selected fields to avoid document fetch |
| Write performance | Limit to essential indexes (each index slows writes) |
| TTL indexes | Not used — bookings retained indefinitely for audit |

### 14.8 Query Examples with Index Usage

```javascript
// List recent bookings for partner (uses: partnerId + status + createdAt index)
db.bookings.find({
  partnerId: ObjectId("xxx"),
  status: { $in: ["paid", "in_progress"] }
}).sort({ createdAt: -1 }).limit(20);

// Find customer by phone (uses: partnerId + phone unique index)
db.customers.findOne({
  partnerId: ObjectId("xxx"),
  phone: "+971501234567"
});

// Monthly statement query (uses: status + completedAt index)
db.bookings.find({
  partnerId: ObjectId("xxx"),
  status: "completed",
  completedAt: {
    $gte: ISODate("2026-01-01"),
    $lt: ISODate("2026-02-01")
  }
});
```

---

## 15. Out of Scope (MVP)

The following are explicitly **NOT** included in MVP:

| Feature | Reason | Revisit When |
|---------|--------|--------------|
| Customer self-booking / landing pages | Need to prove model first | 5+ active partners |
| White-label product naming | Adds complexity | Post-launch feedback |
| Partner-branded portal | Cross-branding sufficient for now | Post-launch feedback |
| Multi-location per partner | No partners need this yet | Partner requests it |
| Partner notifications (email/push) | Dashboard is sufficient | Volume increases |
| In-app training / tooltips | Personal onboarding works | 10+ partners |
| Audit logging | Trust-based for now | Compliance requirement |
| Inventory / stockout management | All products always available | Operational need |
| Partner-specific product restrictions | All partners get all products | Commercial need |
| Feedback collection | Manual for now | Scale |
| Multi-org users | Rare edge case | Demand |
| Sandbox / test mode | Personal onboarding works | 10+ partners |

---

## 16. Open Questions for Backend Team

The following items require input from Aditya's backend team:

### 16.1 API Readiness

- [ ] Does the availability API exist in the current format, or does it need to be built/modified?
- [ ] Does the booking creation API support the `source: "pulse_os"` and `partnerId` fields?
- [ ] Is the unified payment layer ready to accept booking data and return a checkout URL?

### 16.2 Webhook Implementation

- [ ] Can the backend emit webhooks for: payment.completed, booking.status_changed, refund.processed?
- [ ] What is the webhook signing/verification mechanism for security?
- [ ] Is there retry logic for failed webhook deliveries?

### 16.3 Data Model

- [ ] Should Pulse OS store its own copy of bookings, or query the backend for booking data?
- [ ] How do we ensure booking IDs are unique and consistent between systems?
- [ ] Does the backend already have a concept of "partner" or does it need to be added?

### 16.4 Nurse Assignment

- [ ] How quickly after a booking is paid does nurse assignment typically happen?
- [ ] Will the backend proactively push nurse details, or does Pulse OS need to poll?

---

## 17. Launch Checklist

### 17.1 Pre-Development

- [ ] Backend team confirms API contracts
- [ ] Webhook endpoints agreed
- [ ] Clerk organization created
- [ ] Resend account set up, domain verified
- [ ] Xero API credentials obtained

### 17.2 Development Milestones

- [ ] **Week 1:** Auth + Partner management + Product catalog
- [ ] **Week 2:** Booking flow (create, view, list)
- [ ] **Week 3:** Payment integration + Status webhooks + Emails
- [ ] **Week 4:** Revenue dashboard + Statements + Xero integration
- [ ] **Week 5:** Testing + Bug fixes + First partner onboarding

### 17.3 Launch

- [ ] First partner account created
- [ ] First user invited and onboarded
- [ ] First test booking created and paid
- [ ] Webhook flow verified end-to-end
- [ ] Revenue dashboard showing accurate data
- [ ] Statement generation tested

---

## 18. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first booking | < 2 weeks from launch | Date of first partner booking |
| Booking completion rate | > 80% | Bookings paid / Bookings created |
| Partner satisfaction | Qualitative | Feedback from first 3 partners |
| Booking speed | < 60 seconds | Observed during onboarding |
| System uptime | > 99.5% | Vercel + monitoring |

---

## 19. Ownership

| Area | Owner |
|------|-------|
| Product decisions | Keswin |
| Development | Keswin (with backend support from Aditya's team) |
| Partner onboarding | Shaivi, Dima, Keswin |
| Partner support | Keswin |
| Bug fixes | Keswin |
| Feature prioritization | Keswin |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 23, 2026 | Claude (with Keswin) | Initial MVP specification |

---

*This document is the source of truth for Pulse OS MVP. All development decisions should reference this spec. Changes require Keswin's approval.*
