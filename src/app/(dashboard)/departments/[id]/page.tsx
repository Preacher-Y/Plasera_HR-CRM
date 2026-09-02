import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getDepartmentById } from "@/lib/services/department.service";
import { PageHeader } from "@/components/ui/page-header";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { StatusBadge, employmentStatusToVariant } from "@/components/ui/status-badge";
import { DepartmentForm } from "@/components/departments/department-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Users } from "lucide-react";

export default async function DepartmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id }       = await params;
  const { edit }     = await searchParams;
  const isEditing    = edit === "true";

  const [department, employees] = await Promise.all([
    getDepartmentById(id),
    db.employee.findMany({
      where:   { employmentStatus: "ACTIVE" },
      select:  { id: true, firstName: true, lastName: true, jobTitle: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

  if (!department) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/departments" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <PageHeader
          title={department.name}
          description={`${department._count.employees} ${
            department._count.employees === 1 ? "employee" : "employees"
          }`}
        />
      </div>

      {isEditing ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm mx-auto max-w-xl">
          <h2 className="mb-4 font-semibold text-slate-800">Edit Department</h2>
          <DepartmentForm
            employees={employees}
            departmentId={id}
            mode="edit"
            defaultValues={{
              name:        department.name,
              code:        department.code ?? "",
              description: department.description ?? "",
              headId:      department.headId ?? "",
            }}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4 lg:col-span-1">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Department Code</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                {department.code ?? "—"}
              </p>
            </div>
            {department.description && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-600">{department.description}</p>
              </div>
            )}
            {department.head && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Department Head</p>
                <div className="mt-2 flex items-center gap-2">
                  <EmployeeAvatar
                    firstName={department.head.firstName}
                    lastName={department.head.lastName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {department.head.firstName} {department.head.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{department.head.jobTitle}</p>
                  </div>
                </div>
              </div>
            )}
            <Link
              href={`/departments/${id}?edit=true`}
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Edit Department
            </Link>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">
                Employees ({department._count.employees})
              </h2>
            </div>

            {department.employees.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No employees in this department
              </p>
            ) : (
              <div className="divide-y">
                {department.employees.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 py-3">
                    <EmployeeAvatar
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/employees/${emp.id}`}
                        className="text-sm font-medium text-slate-800 hover:text-emerald-600"
                      >
                        {emp.firstName} {emp.lastName}
                      </Link>
                      <p className="text-xs text-slate-400">{emp.jobTitle}</p>
                    </div>
                    <StatusBadge variant={employmentStatusToVariant(emp.employmentStatus)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
