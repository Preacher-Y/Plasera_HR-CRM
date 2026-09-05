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
        "flex flex-col shrink-0 bg-login-button-hover h-dvh overflow-hidden",
        "transition-[width] duration-300 ease-in-out",
        mobileOpen ? "w-[240px]" : "w-0",
        collapsed ? "lg:w-16" : "lg:w-[240px]",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-white/15 shrink-0",
          collapsed ? "lg:justify-center lg:px-0 px-5 gap-3" : "gap-3 px-5"
        )}
      >
        <HrmLogo className="h-[18px] w-auto shrink-0" />
        <div
          className={cn(
            "flex flex-col leading-tight whitespace-nowrap transition-[opacity] duration-200",
            collapsed
              ? "lg:opacity-0 lg:pointer-events-none lg:w-0 lg:overflow-hidden opacity-100"
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
        className="flex-1 flex flex-col justify-center overflow-hidden px-2 py-4 space-y-0.5"
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-montserrat transition-colors",
                active
                  ? "bg-login-panel text-white"
                  : "text-blue-100 hover:bg-login-button hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-[opacity] duration-200",
                  collapsed
                    ? "lg:opacity-0 lg:pointer-events-none lg:w-0 lg:overflow-hidden opacity-100"
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
      <div className="shrink-0 border-t border-white/15 px-2 py-4">
        <button
          onClick={handleSignOut}
          title={collapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-montserrat text-blue-100 hover:bg-login-button hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-[opacity] duration-200",
              collapsed
                ? "lg:opacity-0 lg:pointer-events-none lg:w-0 lg:overflow-hidden opacity-100"
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
