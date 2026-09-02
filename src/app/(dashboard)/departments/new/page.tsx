import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { DepartmentForm } from "@/components/departments/department-form";

export default async function NewDepartmentPage() {
  const employees = await db.employee.findMany({
    where:   { employmentStatus: "ACTIVE" },
    select:  { id: true, firstName: true, lastName: true, jobTitle: true },
    orderBy: { firstName: "asc" },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="New Department" description="Create a team in your organization" />
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <DepartmentForm employees={employees} mode="create" />
      </div>
    </div>
  );
}
