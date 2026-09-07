import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { EmployeeForm } from "@/components/employees/employee-form";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewEmployeePage() {
  const [departments, managers] = await Promise.all([
    db.department.findMany({
      select:  { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.employee.findMany({
      where:   { employmentStatus: "ACTIVE" },
      select:  { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center gap-3">
        <Link href="/employees" className={buttonVariants({ variant: "ghost", size: "sm" })+" items-center"}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hover:underline underline-offset-2 font-asul text-[14px]">
            Back to employee
          </span>
        </Link>
      </div>
      <div className="w-full justify-items-center text-center -mt-2 lg:-mt-10">
        <PageHeader title="Add Employee" description="Create a new employee record" />
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm mx-auto max-w-2xl">
        <EmployeeForm departments={departments} managers={managers} mode="create" />
      </div>
    </div>
  );
}
