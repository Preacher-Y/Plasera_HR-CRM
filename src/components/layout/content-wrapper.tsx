"use client";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "./sidebar-context";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { mobileOpen } = useSidebarContext();

  return (
    <div
      className={cn(
        // Full width on mobile so content keeps its original size
        "flex flex-col w-full overflow-hidden bg-slate-50 rounded-tl-4xl",
        // Translate right when mobile sidebar is open
        "transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-[240px]" : "translate-x-0",
        // Desktop: back in flex flow, no translation ever
        "lg:translate-x-0 lg:flex-1 lg:w-auto lg:transition-none",
      )}
    >
      {children}
    </div>
  );
}
