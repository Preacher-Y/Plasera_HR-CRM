import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { EmployeeForm } from "@/components/employees/employee-form";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [employee, departments, managers] = await Promise.all([
    db.employee.findUnique({ where: { id } }),
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

  if (!employee) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/employees/${id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <PageHeader title="Edit Employee" description={`${employee.firstName} ${employee.lastName}`} />
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <EmployeeForm
          departments={departments}
          managers={managers}
          employeeId={id}
          mode="edit"
          defaultValues={{
            firstName:        employee.firstName,
            lastName:         employee.lastName,
            email:            employee.email,
            phone:            employee.phone ?? "",
            jobTitle:         employee.jobTitle,
            departmentId:     employee.departmentId,
            managerId:        employee.managerId ?? "",
            location:         employee.location ?? "",
            dateJoined:       employee.dateJoined.toISOString().split("T")[0],
            employmentStatus: employee.employmentStatus,
          }}
        />
      </div>
    </div>
  );
}
