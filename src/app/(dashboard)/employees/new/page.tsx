import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { EmployeeForm } from "@/components/employees/employee-form";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Add Employee" description="Create a new employee record" />
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <EmployeeForm departments={departments} managers={managers} mode="create" />
      </div>
    </div>
  );
}
