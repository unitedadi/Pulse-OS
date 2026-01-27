"use client";

import * as React from "react";
import {
  DateSelector,
  HeroBookingCard,
  BookingCard,
} from "@/components/ui";
import { useLayoutContext } from "@/components/layouts/layout-context";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { setHeaderContent } = useLayoutContext();
  const dateRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  // Selected date state
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Handle date selection with scroll to that date's section
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateKey = date.toDateString();
    const element = dateRefs.current.get(dateKey);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Inject DateSelector into the sticky header
  React.useEffect(() => {
    setHeaderContent(
      <DateSelector
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
    );
    return () => setHeaderContent(null);
  }, [selectedDate, setHeaderContent]);

  // Generate date from days offset
  const generateDate = (daysFromToday: number) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + daysFromToday);
    return date;
  };

  // Format date for section headers
  const formatDateHeader = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Mock bookings database with dates
  const allBookings = [
    // Today - 8 bookings
    { id: "1", service: "IV Therapy", customer: "Sarah Chen", time: "8:00 - 9:00 AM", daysFromToday: 0 },
    { id: "2", service: "Vitamin Infusion", customer: "Mohammed Al-Hassan", time: "9:30 - 10:30 AM", daysFromToday: 0 },
    { id: "3", service: "Blood Test", customer: "Emma Wilson", time: "11:00 - 11:30 AM", daysFromToday: 0 },
    { id: "4", service: "NAD+ Therapy", customer: "James Rodriguez", time: "12:00 - 1:00 PM", daysFromToday: 0 },
    { id: "5", service: "Hydration Boost", customer: "Aisha Patel", time: "2:00 - 3:00 PM", daysFromToday: 0 },
    { id: "6", service: "Glutathione IV", customer: "David Kim", time: "3:30 - 4:30 PM", daysFromToday: 0 },
    { id: "7", service: "Immunity Drip", customer: "Fatima Hassan", time: "5:00 - 6:00 PM", daysFromToday: 0 },
    { id: "8", service: "Energy Boost", customer: "Michael Brown", time: "6:30 - 7:30 PM", daysFromToday: 0 },

    // Tomorrow - 5 bookings
    { id: "9", service: "Detox Infusion", customer: "Lisa Wang", time: "9:00 - 10:00 AM", daysFromToday: 1 },
    { id: "10", service: "Anti-Aging IV", customer: "Omar Sheikh", time: "10:30 - 11:30 AM", daysFromToday: 1 },
    { id: "11", service: "Migraine Relief", customer: "Sophie Martin", time: "1:00 - 1:30 PM", daysFromToday: 1 },
    { id: "12", service: "Athletic Recovery", customer: "Ahmed Khalid", time: "3:00 - 4:00 PM", daysFromToday: 1 },
    { id: "13", service: "IV Therapy", customer: "Priya Sharma", time: "5:00 - 6:00 PM", daysFromToday: 1 },

    // Day +2 - 3 bookings
    { id: "14", service: "Vitamin Infusion", customer: "John Smith", time: "10:00 - 11:00 AM", daysFromToday: 2 },
    { id: "15", service: "Blood Test", customer: "Maria Garcia", time: "2:00 - 2:30 PM", daysFromToday: 2 },
    { id: "16", service: "Hydration Boost", customer: "Wei Zhang", time: "4:00 - 5:00 PM", daysFromToday: 2 },

    // Day +3 - 6 bookings
    { id: "17", service: "NAD+ Therapy", customer: "Anna Petrova", time: "8:00 - 9:00 AM", daysFromToday: 3 },
    { id: "18", service: "Glutathione IV", customer: "Carlos Mendez", time: "9:30 - 10:30 AM", daysFromToday: 3 },
    { id: "19", service: "Immunity Drip", customer: "Yuki Tanaka", time: "11:00 AM - 12:00 PM", daysFromToday: 3 },
    { id: "20", service: "Energy Boost", customer: "Hassan Ali", time: "1:00 - 2:00 PM", daysFromToday: 3 },
    { id: "21", service: "Detox Infusion", customer: "Rachel Green", time: "3:30 - 4:30 PM", daysFromToday: 3 },
    { id: "22", service: "Anti-Aging IV", customer: "Ibrahim Osman", time: "5:00 - 6:00 PM", daysFromToday: 3 },

    // Day +4 - 2 bookings
    { id: "23", service: "Athletic Recovery", customer: "Nina Volkov", time: "10:00 - 11:00 AM", daysFromToday: 4 },
    { id: "24", service: "IV Therapy", customer: "Tom Wilson", time: "3:00 - 4:00 PM", daysFromToday: 4 },

    // Day +5 - 4 bookings
    { id: "25", service: "Migraine Relief", customer: "Leila Ahmadi", time: "9:00 - 9:30 AM", daysFromToday: 5 },
    { id: "26", service: "Vitamin Infusion", customer: "Ben Taylor", time: "11:00 AM - 12:00 PM", daysFromToday: 5 },
    { id: "27", service: "Blood Test", customer: "Samira Khan", time: "2:00 - 2:30 PM", daysFromToday: 5 },
    { id: "28", service: "Hydration Boost", customer: "Alex Johnson", time: "4:30 - 5:30 PM", daysFromToday: 5 },

    // Day +6 - 7 bookings
    { id: "29", service: "NAD+ Therapy", customer: "Elena Kozlov", time: "8:30 - 9:30 AM", daysFromToday: 6 },
    { id: "30", service: "Glutathione IV", customer: "Mark Davis", time: "10:00 - 11:00 AM", daysFromToday: 6 },
    { id: "31", service: "Immunity Drip", customer: "Noor Al-Rashid", time: "11:30 AM - 12:30 PM", daysFromToday: 6 },
    { id: "32", service: "Energy Boost", customer: "Julia Chen", time: "1:00 - 2:00 PM", daysFromToday: 6 },
    { id: "33", service: "Detox Infusion", customer: "Ryan Murphy", time: "3:00 - 4:00 PM", daysFromToday: 6 },
    { id: "34", service: "Anti-Aging IV", customer: "Amina Yusuf", time: "5:00 - 6:00 PM", daysFromToday: 6 },
    { id: "35", service: "Athletic Recovery", customer: "Chris Lee", time: "7:00 - 8:00 PM", daysFromToday: 6 },

    // Day +8 - 9 bookings
    { id: "36", service: "IV Therapy", customer: "Diana Ross", time: "8:00 - 9:00 AM", daysFromToday: 8 },
    { id: "37", service: "Vitamin Infusion", customer: "Tariq Hassan", time: "9:30 - 10:30 AM", daysFromToday: 8 },
    { id: "38", service: "Blood Test", customer: "Emily Clark", time: "11:00 - 11:30 AM", daysFromToday: 8 },
    { id: "39", service: "NAD+ Therapy", customer: "Raj Patel", time: "12:00 - 1:00 PM", daysFromToday: 8 },
    { id: "40", service: "Hydration Boost", customer: "Megan Fox", time: "2:00 - 3:00 PM", daysFromToday: 8 },
    { id: "41", service: "Glutathione IV", customer: "Omar Farooq", time: "3:30 - 4:30 PM", daysFromToday: 8 },
    { id: "42", service: "Immunity Drip", customer: "Sara Anderson", time: "5:00 - 6:00 PM", daysFromToday: 8 },
    { id: "43", service: "Energy Boost", customer: "Khalid Mansour", time: "6:30 - 7:30 PM", daysFromToday: 8 },
    { id: "44", service: "Detox Infusion", customer: "Amy Wong", time: "8:00 - 9:00 PM", daysFromToday: 8 },

    // Day +9 - 5 bookings
    { id: "45", service: "Anti-Aging IV", customer: "Lucy Chen", time: "9:00 - 10:00 AM", daysFromToday: 9 },
    { id: "46", service: "Athletic Recovery", customer: "Mohammed Saleh", time: "11:00 AM - 12:00 PM", daysFromToday: 9 },
    { id: "47", service: "IV Therapy", customer: "Sophie Anderson", time: "2:00 - 3:00 PM", daysFromToday: 9 },
    { id: "48", service: "Migraine Relief", customer: "David Park", time: "4:00 - 4:30 PM", daysFromToday: 9 },
    { id: "49", service: "Vitamin Infusion", customer: "Aisha Mahmoud", time: "6:00 - 7:00 PM", daysFromToday: 9 },

    // Day +10 - 3 bookings
    { id: "50", service: "Blood Test", customer: "James Wilson", time: "10:00 - 10:30 AM", daysFromToday: 10 },
    { id: "51", service: "Hydration Boost", customer: "Fatima Al-Said", time: "1:00 - 2:00 PM", daysFromToday: 10 },
    { id: "52", service: "NAD+ Therapy", customer: "Kevin Brown", time: "4:00 - 5:00 PM", daysFromToday: 10 },
  ];

  // Group bookings by date
  const bookingsByDate = React.useMemo(() => {
    const grouped = new Map<string, typeof allBookings>();

    allBookings.forEach((booking) => {
      const date = generateDate(booking.daysFromToday);
      const dateKey = date.toDateString();

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(booking);
    });

    // Sort by date
    return Array.from(grouped.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([dateString, bookings]) => ({
        date: new Date(dateString),
        dateString,
        bookings,
      }));
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero CTA Card - Full width */}
      <HeroBookingCard
        title="Create a booking"
        subtitle="Schedule wellness services in seconds"
        imageUrl="/services/create-booking.avif"
        onClick={() => router.push("/bookings/new")}
      />

      {/* All Bookings - Infinite Scroll by Date */}
      <div className="space-y-12">
        {bookingsByDate.map(({ date, dateString, bookings }) => (
          <div
            key={dateString}
            ref={(el) => {
              if (el) dateRefs.current.set(dateString, el);
            }}
            className="space-y-6 scroll-mt-52"
          >
            <h2 className="font-extrabold text-white" style={{ fontSize: '48px' }}>
              {formatDateHeader(date)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  service={booking.service}
                  customer={booking.customer}
                  date={date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  time={booking.time}
                  status="upcoming"
                  imageUrl="/services/skin-therapy.png"
                  onClick={() => router.push(`/bookings/${booking.id}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
