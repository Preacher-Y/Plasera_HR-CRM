"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-login-panel px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-14 flex flex-col items-center text-center max-w-md w-full">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <ShieldOff className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-asul mb-3">
          Access Denied
        </h1>
        <p className="text-gray-500 text-sm sm:text-base font-montserrat mb-8 leading-relaxed">
          You don&apos;t have permission to access this portal. Only administrators
          are allowed to log in here.
        </p>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            w-full py-3.5 rounded-full text-white text-sm sm:text-base font-semibold
            flex items-center justify-center gap-2
            bg-login-button hover:bg-login-button-hover
            transition-colors active:scale-[0.98]
            disabled:opacity-70 disabled:cursor-not-allowed
            font-montserrat
          "
        >
          {loggingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing out…
            </>
          ) : (
            "Sign Out"
          )}
        </button>
      </div>
    </div>
  );
}
