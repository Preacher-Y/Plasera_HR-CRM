"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-5xl">⚠️</p>
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-slate-500 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="bg-emerald-600 hover:bg-emerald-700">
        Try again
      </Button>
    </div>
  );
}
