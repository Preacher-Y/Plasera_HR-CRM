import { db } from "@/lib/db";
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQuery } from "@/lib/validations/employee";
import { HistoryEventType, ActivityAction } from "@prisma/client";

function buildOrderBy(sort: string) {
  if (sort === "name_asc")  return [{ firstName: "asc" as const }];
  if (sort === "name_desc") return [{ firstName: "desc" as const }];
  if (sort === "newest")    return [{ dateJoined: "desc" as const }];
  return [{ dateJoined: "asc" as const }];
}

async function generateEmployeeNumber(): Promise<string> {
  const count = await db.employee.count();
  return `EMP-${String(count + 1).padStart(4, "0")}`;
}

export async function getEmployees(query: EmployeeQuery) {
  const { search, department, status, page, limit, sort } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status)     where.employmentStatus = status;
  if (department) where.department = { name: { equals: department, mode: "insensitive" } };
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName:  { contains: search, mode: "insensitive" } },
      { email:     { contains: search, mode: "insensitive" } },
      { jobTitle:  { contains: search, mode: "insensitive" } },
    ];
  }

  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where,
      skip,
      take:    limit,
      orderBy: buildOrderBy(sort),
      include: {
        department:    { select: { id: true, name: true } },
        manager:       { select: { id: true, firstName: true, lastName: true } },
        leaveRequests: {
          where:  { status: "APPROVED" },
          select: { startDate: true, endDate: true, status: true },
        },
      },
    }),
    db.employee.count({ where }),
  ]);

  return { employees, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getEmployeeById(id: string) {
  return db.employee.findUnique({
    where: { id },
    include: {
      department:   { select: { id: true, name: true, code: true } },
      manager:      { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      subordinates: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      leaveRequests: { orderBy: { createdAt: "desc" } },
      history:       { orderBy: { effectiveDate: "desc" } },
    },
  });
}

export async function createEmployee(data: CreateEmployeeInput) {
  const employeeNumber = await generateEmployeeNumber();

  const employee = await db.employee.create({
    data: {
      ...data,
      employeeNumber,
      phone:        data.phone        || null,
      managerId:    data.managerId    || null,
      location:     data.location     || null,
      profileImage: data.profileImage || null,
      dateJoined:   new Date(data.dateJoined),
    },
  });

  await Promise.all([
    db.employmentHistory.create({
      data: {
        employeeId:    employee.id,
        eventType:     HistoryEventType.JOINED,
        title:         "Joined the company",
        description:   `Started as ${data.jobTitle}`,
        effectiveDate: new Date(data.dateJoined),
      },
    }),
    db.activityLog.create({
      data: {
        action:      ActivityAction.EMPLOYEE_CREATED,
        entityType:  "Employee",
        entityId:    employee.id,
        employeeId:  employee.id,
        description: `${data.firstName} ${data.lastName} joined the organization`,
      },
    }),
  ]);

  return employee;
}

export async function updateEmployee(id: string, data: UpdateEmployeeInput) {
  const existing = await db.employee.findUniqueOrThrow({ where: { id } });

  if (data.managerId && data.managerId === id) throw new Error("SELF_MANAGER");

  const updated = await db.employee.update({
    where: { id },
    data: {
      ...data,
      phone:        data.phone        !== undefined ? (data.phone || null) : existing.phone,
      managerId:    data.managerId    !== undefined ? (data.managerId || null) : existing.managerId,
      location:     data.location     !== undefined ? (data.location || null) : existing.location,
      profileImage: data.profileImage !== undefined ? (data.profileImage || null) : existing.profileImage,
      dateJoined:   data.dateJoined ? new Date(data.dateJoined) : existing.dateJoined,
    },
  });

  const historyEvents: { eventType: HistoryEventType; title: string; description: string }[] = [];

  if (data.departmentId && data.departmentId !== existing.departmentId) {
    const [oldDept, newDept] = await Promise.all([
      db.department.findUnique({ where: { id: existing.departmentId }, select: { name: true } }),
      db.department.findUnique({ where: { id: data.departmentId }, select: { name: true } }),
    ]);
    historyEvents.push({
      eventType:   HistoryEventType.DEPARTMENT_CHANGED,
      title:       "Department changed",
      description: `Moved from ${oldDept?.name} to ${newDept?.name}`,
    });
  }
  if (data.jobTitle && data.jobTitle !== existing.jobTitle) {
    historyEvents.push({
      eventType:   HistoryEventType.JOB_TITLE_CHANGED,
      title:       "Job title updated",
      description: `Changed from ${existing.jobTitle} to ${data.jobTitle}`,
    });
  }

  await Promise.all([
    ...historyEvents.map((e) =>
      db.employmentHistory.create({
        data: { employeeId: id, ...e, effectiveDate: new Date() },
      })
    ),
    db.activityLog.create({
      data: {
        action:      ActivityAction.EMPLOYEE_UPDATED,
        entityType:  "Employee",
        entityId:    id,
        employeeId:  id,
        description: `${updated.firstName} ${updated.lastName}'s profile was updated`,
      },
    }),
  ]);

  return updated;
}

export async function updateEmployeeStatus(
  id: string,
  employmentStatus: "ACTIVE" | "INACTIVE" | "TERMINATED"
) {
  const employee = await db.employee.findUniqueOrThrow({ where: { id } });

  const updated = await db.employee.update({
    where: { id },
    data: {
      employmentStatus,
      deactivatedAt: employmentStatus === "INACTIVE" ? new Date() : null,
    },
  });

  await Promise.all([
    db.employmentHistory.create({
      data: {
        employeeId:    id,
        eventType:     employmentStatus === "ACTIVE" ? HistoryEventType.REACTIVATED : HistoryEventType.DEACTIVATED,
        title:         employmentStatus === "ACTIVE" ? "Employee reactivated" : "Employee deactivated",
        effectiveDate: new Date(),
      },
    }),
    db.activityLog.create({
      data: {
        action:      ActivityAction.EMPLOYEE_DEACTIVATED,
        entityType:  "Employee",
        entityId:    id,
        employeeId:  id,
        description: `${employee.firstName} ${employee.lastName} was ${employmentStatus.toLowerCase()}`,
      },
    }),
  ]);

  return updated;
}

export async function deleteEmployee(id: string) {
  const subordinates = await db.employee.count({ where: { managerId: id } });
  if (subordinates > 0) throw new Error("HAS_SUBORDINATES");

  const employee = await db.employee.findUniqueOrThrow({ where: { id } });
  await db.employee.delete({ where: { id } });
  return employee;
}
