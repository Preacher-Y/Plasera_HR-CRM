import Image from "next/image";

interface WelcomeBannerProps {
  name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  return (
    /* Outer wrapper creates headroom for the illustration to overflow above the card */
    <div className="relative pt-14 sm:pt-16">
      {/* Card */}
      <div className="relative rounded-2xl bg-login-panel overflow-hidden px-8 py-7 lg:py-12 min-h-33">
        <div className="relative z-10 max-w-[55%]">
          <h1 className="text-2xl lg:text-4xl font-bold text-white font-asul">Hi, {name}</h1>
          <p className="mt-1.5 text-sm text-blue-100 font-montserrat">
            Welcome to HR Management System
          </p>
        </div>

        {/* Subtle decorative circle inside card for depth */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-16 -bottom-16 h-52 w-52 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Illustration — positioned relative to wrapper so it overflows above the card */}
      <div className="absolute top-0 lg:-top-5 right-4 bottom-0 w-65 sm:w-75 lg:w-96 pointer-events-none select-none">
        <Image
          src="/dashboardIllustration.svg"
          alt=""
          fill
          className="object-contain object-right-bottom"
          loading="eager"
          priority
        />
      </div>
    </div>
  );
}
