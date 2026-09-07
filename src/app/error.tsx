"use client";
import { useEffect } from "react";
import Image from "next/image";

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl mb-8 lg:mb-10">
        <Image
          src="/internalServerErrorIllustration.svg"
          alt="Internal server error illustration"
          width={5718}
          height={3642}
          priority
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight font-asul">
        Something went wrong
      </h1>
      <p className="mt-4 text-gray-400 text-sm lg:text-base max-w-sm font-montserrat">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center px-8 py-3 rounded-full text-white text-sm lg:text-base font-semibold bg-login-button hover:bg-login-button-hover transition-colors font-montserrat"
      >
        Try again
      </button>
    </div>
  );
}
