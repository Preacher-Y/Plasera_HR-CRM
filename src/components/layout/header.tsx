"use client";

import { Bell, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useSidebarContext } from "./sidebar-context";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const { collapsed, toggle, mobileOpen, toggleMobile } = useSidebarContext();

  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-white px-4">
      {/* Desktop sidebar toggle */}
      <button
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        {collapsed
          ? <ChevronRight className="h-5 w-5" />
          : <ChevronLeft className="h-5 w-5" />
        }
      </button>

      {/* Mobile/tablet push sidebar toggle */}
      <button
        onClick={toggleMobile}
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        {mobileOpen
          ? <X className="h-5 w-5" />
          : <Menu className="h-5 w-5" />
        }
      </button>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2 mr-4 sm:mr-8 lg:mr-20">
        <div className="h-6 w-px bg-slate-200 mx-1" />
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-login-button text-sm font-semibold text-white select-none">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[140px] truncate font-montserrat">
          {userName}
        </span>
      </div>
    </header>
  );
}
