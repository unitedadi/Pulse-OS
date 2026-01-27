"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import {
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Building2,
  Package,
  ChevronLeft,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
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

// User Profile Component
function UserProfile({ collapsed }: { collapsed: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const userName = user?.fullName || user?.firstName || "User";

  return (
    <div className={cn(
      "px-3 py-4 border-t border-[#1A1A1A]",
      collapsed ? "flex justify-center" : ""
    )}>
      {!collapsed ? (
        <div className="flex items-center gap-3 px-2">
          <Avatar name={userName} size="sm" src={user?.imageUrl} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate font-light">{userName}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-lg text-[#666666] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => signOut()}
          className="p-2 rounded-lg text-[#666666] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

interface SidebarProps {
  partner?: {
    name: string;
    logo?: string;
  };
  userRole?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  partner,
  userRole = "staff",
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  const filterByRole = (items: NavItem[]) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 px-4 py-3 rounded-xl",
          "transition-all duration-200 ease-out",
          "text-[#666666] hover:text-white",
          "hover:bg-[#1A1A1A]",
          isActive && "text-white bg-[#1A1A1A]",
          collapsed && "justify-center px-3"
        )}
      >
        <span className={cn(
          "transition-colors duration-200",
          isActive ? "text-white" : "text-[#666666] group-hover:text-white"
        )}>
          {item.icon}
        </span>
        {!collapsed && <span className="text-[15px] font-light">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#0A0A0A]",
        "flex flex-col transition-all duration-300 z-[var(--z-sticky)]",
        "border-r border-[#1A1A1A]",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "h-20 flex items-center",
        collapsed ? "justify-center px-3" : "justify-between px-5"
      )}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            {partner?.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-9 w-9 rounded-lg object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-[#E07A3C] flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {partner?.name?.charAt(0) || "P"}
                </span>
              </div>
            )}
            <span className="font-normal text-white tracking-tight truncate">
              {partner?.name || "Pulse OS"}
            </span>
          </Link>
        )}

        {collapsed && (
          <Link href="/dashboard">
            <div className="h-9 w-9 rounded-lg bg-[#E07A3C] flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {partner?.name?.charAt(0) || "P"}
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {filterByRole(mainNavItems).map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Admin Section */}
        {filterByRole(adminNavItems).length > 0 && userRole === "dardoc_admin" && (
          <>
            {!collapsed && (
              <div className="pt-8 pb-2 px-4">
                <span className="text-xs text-[#666666] uppercase tracking-wider">
                  Admin
                </span>
              </div>
            )}
            {collapsed && <div className="h-px bg-[#1A1A1A] my-6 mx-2" />}
            {filterByRole(adminNavItems).map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 space-y-1 border-t border-[#1A1A1A]">
        <NavLink item={{ label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> }} />

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-[15px] font-light">Collapse</span>
          </button>
        )}
      </div>

      {/* User Profile */}
      <UserProfile collapsed={collapsed} />
    </aside>
  );
}
