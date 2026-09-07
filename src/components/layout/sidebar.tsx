"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Users, Building2, CalendarDays, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "./sidebar-context";
import { HrmLogo } from "@/components/ui/hrm-logo";

const navItems = [
  { href: "/dashboard",   label: "Dashboard",      icon: LayoutDashboard },
  { href: "/employees",   label: "Employees",      icon: Users },
  { href: "/departments", label: "Departments",    icon: Building2 },
  { href: "/leave",       label: "Leave Requests", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, mobileOpen, closeMobile } = useSidebarContext();

  useEffect(() => {
    closeMobile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "flex flex-col bg-login-button-hover overflow-hidden",
        // Mobile/tablet: absolute so it doesn't affect content width
        "absolute inset-y-0 left-0 z-20 w-60 h-full",
        "transition-all duration-500 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: back in flex flow, width-based collapse, no translation
        "lg:relative lg:translate-x-0 lg:transition-all",
        collapsed ? "lg:w-16 px-0" : "lg:w-60 px-2",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-18 items-center border-b border-white/15 shrink-0 transition-all duration-500",
          collapsed ? "lg:px-3.5 gap-3" : "gap-3 px-5"
        )}
      >
        <HrmLogo className={cn("w-auto shrink-0", collapsed?"h-5":"h-4.5")} />
        <div
          className={cn(
            "flex flex-col leading-tight whitespace-nowrap transition-all duration-500",
            collapsed
              ? "lg:pointer-events-none lg:truncate opacity-100"
              : "opacity-100"
          )}
        >
          <span className="text-[13px] font-bold text-white font-asul leading-snug">
            HR Management
          </span>
          <span className="text-[13px] font-bold text-white font-asul leading-snug">
            System
          </span>
        </div>
      </div>

      {/* Nav — centered vertically, no scroll */}
      <nav
        className="flex-1 flex flex-col justify-center overflow-hidden px-2 py-4 space-y-2 transition-all duration-500"
        aria-label="Main navigation"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 rounded-t-sm py-4 text-sm font-montserrat transition-all",
                active
                  ? "border-b-2 bg-login-panel/30 text-white font-semibold tracking-wider"
                  : "text-blue-100/80 hover:bg-login-panel/40 hover:text-white"
              )}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-500",
                  collapsed
                    ? "lg:pointer-events-none lg:truncate opacity-100"
                    : "opacity-100"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="shrink-0 border-t border-white/15 px-2 py-4 transition-all duration-500">
        <button
          onClick={handleSignOut}
          title={collapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 rounded-sm px-3 py-4 text-sm  font-montserrat text-blue-100 hover:bg-login-button/40 hover:text-white transition-colors"
        >
          <LogOut className="h-6 w-6 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-500",
              collapsed
                ? "lg:pointer-events-none lg:truncate opacity-100"
                : "opacity-100"
            )}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
