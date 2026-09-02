import { db } from "@/lib/db";
import { CreateDepartmentInput, UpdateDepartmentInput } from "@/lib/validations/department";
import { ActivityAction } from "@prisma/client";

export async function getDepartments() {
  return db.department.findMany({
    orderBy: { name: "asc" },
    include: {
      head:   { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      _count: { select: { employees: true } },
    },
  });
}

export async function getDepartmentById(id: string) {
  return db.department.findUnique({
    where: { id },
    include: {
      head: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
          employmentStatus: true,
        },
        orderBy: { firstName: "asc" },
      },
      _count: { select: { employees: true } },
    },
  });
}

export async function createDepartment(data: CreateDepartmentInput) {
  const department = await db.department.create({
    data: {
      name:        data.name,
      code:        data.code        || null,
      description: data.description || null,
      headId:      data.headId      || null,
    },
  });

  await db.activityLog.create({
    data: {
      action:      ActivityAction.DEPARTMENT_CREATED,
      entityType:  "Department",
      entityId:    department.id,
      description: `${data.name} department was created`,
    },
  });

  return department;
}

export async function updateDepartment(id: string, data: UpdateDepartmentInput) {
  const updated = await db.department.update({
    where: { id },
    data: {
      name:        data.name,
      code:        data.code        || null,
      description: data.description || null,
      headId:      data.headId      || null,
    },
  });

  await db.activityLog.create({
    data: {
      action:      ActivityAction.DEPARTMENT_UPDATED,
      entityType:  "Department",
      entityId:    id,
      description: `${updated.name} department was updated`,
    },
  });

  return updated;
}

export async function deleteDepartment(id: string) {
  const employeeCount = await db.employee.count({
    where: { departmentId: id },
  });

  if (employeeCount > 0) {
    throw new Error(`DEPARTMENT_HAS_EMPLOYEES:${employeeCount}`);
  }

  const department = await db.department.findUniqueOrThrow({ where: { id } });
  await db.department.delete({ where: { id } });

  await db.activityLog.create({
    data: {
      action:      ActivityAction.DEPARTMENT_DELETED,
      entityType:  "Department",
      entityId:    id,
      description: `${department.name} department was deleted`,
    },
  });

  return department;
}
