import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 text-center">

      {/* Illustration */}
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl mb-8 lg:mb-10">
        <Image
          src="/errorIllustration.svg"
          alt="404 - Page not found"
          width={702}
          height={427}
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Heading */}
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight font-asul">
        Page Not Found
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-gray-400 text-sm lg:text-base max-w-sm font-montserrat">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Button */}
      <Link
        href="/dashboard"
        className="
          mt-8 inline-flex items-center justify-center
          px-8 py-3 rounded-full
          text-white text-sm lg:text-base font-semibold
          bg-login-button hover:bg-login-button-hover
          transition-colors font-montserrat
        "
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
