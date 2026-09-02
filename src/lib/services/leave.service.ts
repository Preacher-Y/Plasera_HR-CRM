import { db } from "@/lib/db";
import { CreateLeaveInput, LeaveQuery } from "@/lib/validations/leave";
import { ActivityAction } from "@prisma/client";

const leaveInclude = {
  employee:   { select: { id: true, firstName: true, lastName: true, jobTitle: true, employmentStatus: true } },
  reviewedBy: { select: { id: true, firstName: true, lastName: true } },
};

export async function getLeaveRequests(query: LeaveQuery) {
  const { status, leaveType, employeeId, page, limit } = query;
  const skip  = (page - 1) * limit;
  const where: Record<string, unknown> = {};

  if (status)     where.status     = status;
  if (leaveType)  where.leaveType  = leaveType;
  if (employeeId) where.employeeId = employeeId;

  const [leaveRequests, total] = await Promise.all([
    db.leaveRequest.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
      include: leaveInclude,
    }),
    db.leaveRequest.count({ where }),
  ]);

  return {
    leaveRequests,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getLeaveRequestById(id: string) {
  return db.leaveRequest.findUnique({ where: { id }, include: leaveInclude });
}

export async function createLeaveRequest(data: CreateLeaveInput) {
  const employee = await db.employee.findUniqueOrThrow({
    where: { id: data.employeeId },
  });

  if (employee.employmentStatus !== "ACTIVE") {
    throw new Error("EMPLOYEE_INACTIVE");
  }

  const overlap = await db.leaveRequest.findFirst({
    where: {
      employeeId: data.employeeId,
      status:     "APPROVED",
      startDate:  { lte: new Date(data.endDate) },
      endDate:    { gte: new Date(data.startDate) },
    },
  });
  if (overlap) throw new Error("OVERLAPPING_LEAVE");

  const leave = await db.leaveRequest.create({
    data: {
      employeeId: data.employeeId,
      leaveType:  data.leaveType,
      startDate:  new Date(data.startDate),
      endDate:    new Date(data.endDate),
      reason:     data.reason,
      status:     "PENDING",
    },
  });

  await db.activityLog.create({
    data: {
      action:      ActivityAction.LEAVE_SUBMITTED,
      entityType:  "LeaveRequest",
      entityId:    leave.id,
      employeeId:  data.employeeId,
      description: `${employee.firstName} ${employee.lastName} submitted a ${data.leaveType.toLowerCase()} leave request`,
    },
  });

  return leave;
}

export async function approveLeaveRequest(id: string) {
  const leave = await db.leaveRequest.findUniqueOrThrow({
    where:   { id },
    include: { employee: { select: { firstName: true, lastName: true } } },
  });

  if (leave.status !== "PENDING") throw new Error("ALREADY_REVIEWED");

  const updated = await db.leaveRequest.update({
    where: { id },
    data:  { status: "APPROVED", reviewedAt: new Date() },
  });

  await db.activityLog.create({
    data: {
      action:      ActivityAction.LEAVE_APPROVED,
      entityType:  "LeaveRequest",
      entityId:    id,
      employeeId:  leave.employeeId,
      description: `${leave.employee.firstName} ${leave.employee.lastName}'s leave request was approved`,
    },
  });

  return updated;
}

export async function rejectLeaveRequest(id: string, reviewComment: string) {
  const leave = await db.leaveRequest.findUniqueOrThrow({
    where:   { id },
    include: { employee: { select: { firstName: true, lastName: true } } },
  });

  if (leave.status !== "PENDING") throw new Error("ALREADY_REVIEWED");

  const updated = await db.leaveRequest.update({
    where: { id },
    data:  { status: "REJECTED", reviewComment, reviewedAt: new Date() },
  });

  await db.activityLog.create({
    data: {
      action:      ActivityAction.LEAVE_REJECTED,
      entityType:  "LeaveRequest",
      entityId:    id,
      employeeId:  leave.employeeId,
      description: `${leave.employee.firstName} ${leave.employee.lastName}'s leave request was rejected`,
    },
  });

  return updated;
}
