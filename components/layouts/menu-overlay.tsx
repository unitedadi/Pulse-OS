"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import {
  X,
  LayoutDashboard,
  TrendingUp,
  Building2,
  Package,
  LogOut,
  ArrowRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <TrendingUp className="h-5 w-5" />,
    roles: ["owner", "manager", "dardoc_admin"],
  },
];

const adminNavItems: NavItem[] = [
  {
    label: "Partners",
    href: "/admin/partners",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
];

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  partner?: {
    name: string;
    logo?: string;
    sellerId?: string;
    customerId?: string;
  };
  userRole?: string;
}

export function MenuOverlay({
  isOpen,
  onClose,
  partner,
  userRole = "staff",
}: MenuOverlayProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const userName = user?.fullName || user?.firstName || "User";

  const filterByRole = (items: NavItem[]) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  };

  // Close menu on route change (but not on initial mount)
  const previousPathname = React.useRef(pathname);
  React.useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const NavLink = ({ item, index }: { item: NavItem; index: number }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "group flex items-center gap-2 py-4 transition-all duration-300",
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
        )}
        style={{
          transitionDelay: isOpen ? `${150 + index * 50}ms` : "0ms",
        }}
      >
        <span
          className={cn(
            "text-4xl md:text-5xl font-extralight tracking-tight leading-none transition-colors duration-200",
            isActive ? "text-[var(--color-text-inverse)]" : "text-white/45 group-hover:text-[var(--color-text-inverse)]"
          )}
        >
          {item.label}
        </span>
        <ArrowRight
          className={cn(
            "h-10 w-10 md:h-12 md:w-12 translate-y-1 transition-all duration-200 group-hover:translate-x-1",
            isActive ? "text-[var(--color-accent-light)]" : "text-white/30 group-hover:text-[var(--color-text-inverse)]"
          )}
        />
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[var(--color-bg-accent)] transition-all duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      {/* Close button - aligned with header hamburger */}
      <div className="pt-6 px-6 lg:px-10">
        <button
          onClick={onClose}
          className={cn(
            "p-2.5 -ml-2 rounded-full text-white/70 hover:bg-white hover:text-[var(--color-accent-primary)] transition-all duration-300 active:scale-[0.98]",
            isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
          )}
          style={{ transitionDelay: isOpen ? "100ms" : "0ms" }}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Menu Content */}
      <div className="h-[calc(100%-80px)] flex flex-col justify-between px-6 lg:px-10 pt-12 pb-8">
        {/* Main Navigation */}
        <nav className="space-y-4">
          {filterByRole(mainNavItems).map((item, index) => (
            <NavLink key={item.href} item={item} index={index} />
          ))}

          {/* Admin Section */}
          {filterByRole(adminNavItems).length > 0 && userRole === "dardoc_admin" && (
            <>
              <div
                className={cn(
                  "pt-8 pb-2 transition-all duration-300",
                  isOpen ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: isOpen ? "450ms" : "0ms" }}
              >
                <span className="text-xs text-white/35 uppercase tracking-widest">
                  Admin
                </span>
              </div>
              {filterByRole(adminNavItems).map((item, index) => (
                <NavLink
                  key={item.href}
                  item={item}
                  index={mainNavItems.length + 2 + index}
                />
              ))}
            </>
          )}
        </nav>

        {/* User Section - Bottom */}
        <div
          className={cn(
            "pt-8 transition-all duration-500",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={userName} size="lg" src={user?.imageUrl} />
              <div>
                <p className="text-white font-normal text-lg">{userName}</p>
                <p className="text-sm text-white/45">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-3 rounded-full text-white/45 hover:text-white hover:bg-white/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
