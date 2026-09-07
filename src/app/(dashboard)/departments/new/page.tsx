import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { DepartmentForm } from "@/components/departments/department-form";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewDepartmentPage() {
  const employees = await db.employee.findMany({
    where:   { employmentStatus: "ACTIVE" },
    select:  { id: true, firstName: true, lastName: true, jobTitle: true },
    orderBy: { firstName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/departments" className={buttonVariants({ variant: "ghost", size: "sm" })+" items-center"}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hover:underline underline-offset-2 font-asul text-[14px]">
            Back to Department
          </span>
        </Link>
      </div>
      <div className="w-full justify-items-center text-center -mt-2 lg:-mt-10">
        <PageHeader title="New Department" description="Create a team in your organization" />
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm mx-auto max-w-xl">
        <DepartmentForm employees={employees} mode="create" />
      </div>
    </div>
  );
}
