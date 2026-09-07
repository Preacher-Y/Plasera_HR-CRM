import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function LeavePageBanner() {
  return (
    <div className="relative pt-6 lg:pt-8">
      {/* Card */}
      <div className="relative rounded-2xl bg-login-panel overflow-hidden px-8 py-7 lg:py-12 min-h-33">
        <div className="relative z-10 max-w-[55%]">
          <h1 className="text-2xl lg:text-4xl font-bold text-white font-asul">Leave Requests</h1>
          <p className="mt-1.5 mb-4 text-sm text-blue-100 max-sm:font-semibold font-montserrat">
            Review and manage employee time-off requests
          </p>
          <Link
            href="/leave/new"
            className={buttonVariants({ variant: "secondary", size: "lg" }) + " mt-4 bg-white hover:bg-white/90 text-blue-600 border-0 font-asul font-bold"}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Submit Leave
          </Link>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-16 -bottom-16 h-52 w-52 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Illustration */}
      <div className="absolute top-0 -right-2 lg:-top-5 lg:right-4 bottom-0 w-65 sm:w-75 lg:w-96 pointer-events-none select-none">
        <Image
          src="/leaveRequestIllustration.svg"
          alt=""
          fill
          className="object-contain object-right-bottom"
          priority
          loading="eager"
        />
      </div>
    </div>
  );
}
