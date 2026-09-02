import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { getEmployees } from "@/lib/services/employee.service";
import { employeeQuerySchema } from "@/lib/validations/employee";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/data-skeleton";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeCard } from "@/components/employees/employee-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Users } from "lucide-react";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function EmployeeList({ searchParams }: PageProps) {
  const sp = await searchParams;
  const params = Object.fromEntries(
    Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v ?? ""])
  );
  const query = employeeQuerySchema.parse(params);
  const { employees, total, page, limit, totalPages } = await getEmployees(query);

  if (employees.length === 0) {
    const hasFilters = query.search || query.department || query.status;
    return (
      <EmptyState
        icon={Users}
        title={hasFilters ? "No employees match your filters" : "No employees yet"}
        description={
          hasFilters
            ? "Try changing your search or clearing the filters."
            : "Start building your organization by adding your first employee."
        }
      />
    );
  }

  const start = (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <EmployeeTable employees={employees} />
      </div>
      <div className="grid gap-3 md:hidden">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {start}–{end} of {total} employees
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function EmployeesPage({ searchParams }: PageProps) {
  const departments = await db.department.findMany({
    select:  { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your organization's workforce"
        actions={
          <Link
            href="/employees/new"
            className={cn(buttonVariants(), "bg-emerald-600 hover:bg-emerald-700")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        }
      />
      <Suspense fallback={<div className="h-9 rounded-lg bg-slate-100 animate-pulse w-full" />}>
        <EmployeeFilters departments={departments} />
      </Suspense>
      <Suspense fallback={<TableSkeleton rows={10} cols={5} />}>
        <EmployeeList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
