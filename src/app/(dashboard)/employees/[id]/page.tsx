import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { isCurrentlyOnLeave } from "@/lib/utils";
import { ProfileView } from "./profile-view";

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const employee = await db.employee.findUnique({
    where: { id },
    include: {
      department:    { select: { id: true, name: true } },
      manager:       { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      subordinates:  { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      leaveRequests: { orderBy: { createdAt: "desc" } },
      history:       { orderBy: { effectiveDate: "desc" } },
    },
  });

  if (!employee) notFound();

  const onLeave = isCurrentlyOnLeave(
    employee.leaveRequests.map((l) => ({
      status:    l.status,
      startDate: l.startDate,
      endDate:   l.endDate,
    }))
  );

  return <ProfileView employee={employee} onLeave={onLeave} />;
}
