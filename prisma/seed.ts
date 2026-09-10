import { PrismaClient, EmploymentStatus, LeaveType, LeaveStatus, HistoryEventType, ActivityAction } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in dependency order
  await prisma.activityLog.deleteMany();
  await prisma.employmentHistory.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.department.updateMany({ data: { headId: null } });
  await prisma.employee.updateMany({ data: { managerId: null } });
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  // Create departments
  const engineering = await prisma.department.create({ data: { name: "Engineering", code: "ENG", description: "Builds and maintains technology products." } });
  const product     = await prisma.department.create({ data: { name: "Product", code: "PRD", description: "Defines and shapes product direction." } });
  const sales       = await prisma.department.create({ data: { name: "Sales", code: "SLS", description: "Grows company revenue." } });
  const finance     = await prisma.department.create({ data: { name: "Finance", code: "FIN", description: "Manages financial operations." } });
  const hr          = await prisma.department.create({ data: { name: "Human Resources", code: "HR", description: "Manages people and culture." } });
  const ops         = await prisma.department.create({ data: { name: "Operations", code: "OPS", description: "Keeps the organization running." } });
  const cs          = await prisma.department.create({ data: { name: "Customer Success", code: "CS", description: "Ensures customer satisfaction." } });

  // Create 40 employees
  const empData = [
    { firstName: "Alice",     lastName: "Johnson",   email: "alice.johnson@peoplecore.io",   jobTitle: "Senior Engineer",              departmentId: engineering.id, location: "New York",    dateJoined: new Date("2022-03-15") },
    { firstName: "Patrick",   lastName: "Kimani",    email: "patrick.kimani@peoplecore.io",   jobTitle: "Backend Engineer",             departmentId: engineering.id, location: "Nairobi",     dateJoined: new Date("2023-01-10") },
    { firstName: "Sarah",     lastName: "Williams",  email: "sarah.williams@peoplecore.io",   jobTitle: "UX Designer",                  departmentId: product.id,     location: "London",      dateJoined: new Date("2022-07-01") },
    { firstName: "Marcus",    lastName: "Chen",      email: "marcus.chen@peoplecore.io",      jobTitle: "Product Manager",              departmentId: product.id,     location: "Singapore",   dateJoined: new Date("2021-11-20") },
    { firstName: "Grace",     lastName: "Okonkwo",   email: "grace.okonkwo@peoplecore.io",    jobTitle: "Sales Lead",                   departmentId: sales.id,       location: "Lagos",       dateJoined: new Date("2022-05-03") },
    { firstName: "James",     lastName: "Miller",    email: "james.miller@peoplecore.io",     jobTitle: "Account Executive",            departmentId: sales.id,       location: "Chicago",     dateJoined: new Date("2023-02-14") },
    { firstName: "Fatima",    lastName: "Hassan",    email: "fatima.hassan@peoplecore.io",    jobTitle: "Financial Analyst",            departmentId: finance.id,     location: "Dubai",       dateJoined: new Date("2022-09-01") },
    { firstName: "David",     lastName: "Park",      email: "david.park@peoplecore.io",       jobTitle: "HR Specialist",                departmentId: hr.id,          location: "Seoul",       dateJoined: new Date("2023-03-20") },
    { firstName: "Amara",     lastName: "Diallo",    email: "amara.diallo@peoplecore.io",     jobTitle: "Operations Manager",           departmentId: ops.id,         location: "Dakar",       dateJoined: new Date("2021-08-15") },
    { firstName: "Lena",      lastName: "Schmidt",   email: "lena.schmidt@peoplecore.io",     jobTitle: "Customer Success Manager",     departmentId: cs.id,          location: "Berlin",      dateJoined: new Date("2022-12-05") },
    { firstName: "Omar",      lastName: "Farooq",    email: "omar.farooq@peoplecore.io",      jobTitle: "DevOps Engineer",              departmentId: engineering.id, location: "Karachi",     dateJoined: new Date("2023-04-01") },
    { firstName: "Priya",     lastName: "Sharma",    email: "priya.sharma@peoplecore.io",     jobTitle: "Frontend Engineer",            departmentId: engineering.id, location: "Mumbai",      dateJoined: new Date("2023-05-15") },
    { firstName: "Lucas",     lastName: "Oliveira",  email: "lucas.oliveira@peoplecore.io",   jobTitle: "Data Engineer",                departmentId: engineering.id, location: "São Paulo",   dateJoined: new Date("2022-10-10") },
    { firstName: "Mei",       lastName: "Lin",       email: "mei.lin@peoplecore.io",          jobTitle: "Product Designer",             departmentId: product.id,     location: "Taipei",      dateJoined: new Date("2022-06-20") },
    { firstName: "Tom",       lastName: "Bradley",   email: "tom.bradley@peoplecore.io",      jobTitle: "Sales Representative",         departmentId: sales.id,       location: "Manchester",  dateJoined: new Date("2023-01-25") },
    { firstName: "Aisha",     lastName: "Nkosi",     email: "aisha.nkosi@peoplecore.io",      jobTitle: "Accountant",                   departmentId: finance.id,     location: "Cape Town",   dateJoined: new Date("2022-08-08") },
    { firstName: "Ryan",      lastName: "Torres",    email: "ryan.torres@peoplecore.io",      jobTitle: "HR Manager",                   departmentId: hr.id,          location: "Miami",       dateJoined: new Date("2021-06-01") },
    { firstName: "Zara",      lastName: "Ahmed",     email: "zara.ahmed@peoplecore.io",       jobTitle: "Operations Analyst",           departmentId: ops.id,         location: "Lahore",      dateJoined: new Date("2023-02-28") },
    { firstName: "Kevin",     lastName: "Nakamura",  email: "kevin.nakamura@peoplecore.io",   jobTitle: "Customer Success Specialist",  departmentId: cs.id,          location: "Tokyo",       dateJoined: new Date("2022-11-14") },
    { firstName: "Sofia",     lastName: "Rossi",     email: "sofia.rossi@peoplecore.io",      jobTitle: "Full Stack Engineer",          departmentId: engineering.id, location: "Rome",        dateJoined: new Date("2023-06-01") },
    { firstName: "Emmanuel",  lastName: "Mensah",    email: "emmanuel.mensah@peoplecore.io",  jobTitle: "QA Engineer",                  departmentId: engineering.id, location: "Accra",       dateJoined: new Date("2022-04-18") },
    { firstName: "Hannah",    lastName: "Berg",      email: "hannah.berg@peoplecore.io",      jobTitle: "Scrum Master",                 departmentId: product.id,     location: "Oslo",        dateJoined: new Date("2022-02-07") },
    { firstName: "Carlos",    lastName: "Mendez",    email: "carlos.mendez@peoplecore.io",    jobTitle: "Regional Sales Manager",       departmentId: sales.id,       location: "Mexico City", dateJoined: new Date("2021-09-30") },
    { firstName: "Ingrid",    lastName: "Johansson", email: "ingrid.johansson@peoplecore.io", jobTitle: "CFO",                          departmentId: finance.id,     location: "Stockholm",   dateJoined: new Date("2020-01-15") },
    { firstName: "Abdul",     lastName: "Rahman",    email: "abdul.rahman@peoplecore.io",     jobTitle: "Logistics Coordinator",        departmentId: ops.id,         location: "Riyadh",      dateJoined: new Date("2023-07-10") },
    { firstName: "Claire",    lastName: "Dubois",    email: "claire.dubois@peoplecore.io",    jobTitle: "Technical Support Lead",       departmentId: cs.id,          location: "Paris",       dateJoined: new Date("2022-03-22") },
    { firstName: "Tariq",     lastName: "Hussain",   email: "tariq.hussain@peoplecore.io",    jobTitle: "Security Engineer",            departmentId: engineering.id, location: "Islamabad",   dateJoined: new Date("2023-08-01") },
    { firstName: "Nadia",     lastName: "Volkov",    email: "nadia.volkov@peoplecore.io",     jobTitle: "Business Analyst",             departmentId: product.id,     location: "Moscow",      dateJoined: new Date("2022-01-17") },
    { firstName: "Felix",     lastName: "Müller",    email: "felix.muller@peoplecore.io",     jobTitle: "Sales Engineer",               departmentId: sales.id,       location: "Hamburg",     dateJoined: new Date("2023-03-05") },
    { firstName: "Yuki",      lastName: "Tanaka",    email: "yuki.tanaka@peoplecore.io",      jobTitle: "Payroll Specialist",           departmentId: finance.id,     location: "Osaka",       dateJoined: new Date("2022-07-25") },
    { firstName: "Nina",      lastName: "Petrov",    email: "nina.petrov@peoplecore.io",      jobTitle: "Talent Acquisition",           departmentId: hr.id,          location: "Prague",      dateJoined: new Date("2023-04-12") },
    { firstName: "Jerome",    lastName: "Osei",      email: "jerome.osei@peoplecore.io",      jobTitle: "Supply Chain Analyst",         departmentId: ops.id,         location: "Kumasi",      dateJoined: new Date("2022-10-30") },
    { firstName: "Maya",      lastName: "Singh",     email: "maya.singh@peoplecore.io",       jobTitle: "Onboarding Specialist",        departmentId: cs.id,          location: "Delhi",       dateJoined: new Date("2023-05-22") },
    { firstName: "Aaron",     lastName: "Wells",     email: "aaron.wells@peoplecore.io",      jobTitle: "Platform Engineer",            departmentId: engineering.id, location: "Austin",      dateJoined: new Date("2021-12-01") },
    { firstName: "Chioma",    lastName: "Eze",       email: "chioma.eze@peoplecore.io",       jobTitle: "Growth Analyst",               departmentId: sales.id,       location: "Abuja",       dateJoined: new Date("2023-06-15") },
    { firstName: "Lars",      lastName: "Eriksson",  email: "lars.eriksson@peoplecore.io",    jobTitle: "Infrastructure Lead",          departmentId: engineering.id, location: "Gothenburg",  dateJoined: new Date("2020-06-01") },
    { firstName: "Amelia",    lastName: "Foster",    email: "amelia.foster@peoplecore.io",    jobTitle: "Finance Manager",              departmentId: finance.id,     location: "Sydney",      dateJoined: new Date("2021-04-20") },
    { firstName: "Ibrahim",   lastName: "Al-Amin",   email: "ibrahim.alamin@peoplecore.io",   jobTitle: "HR Coordinator",               departmentId: hr.id,          location: "Cairo",       dateJoined: new Date("2023-09-01") },
    { firstName: "Valentina", lastName: "Cruz",      email: "valentina.cruz@peoplecore.io",   jobTitle: "Product Analyst",              departmentId: product.id,     location: "Bogotá",      dateJoined: new Date("2022-08-30") },
    { firstName: "Benjamin",  lastName: "Carter",    email: "benjamin.carter@peoplecore.io",  jobTitle: "Customer Support Agent",       departmentId: cs.id,          location: "Toronto",     dateJoined: new Date("2023-01-08"), employmentStatus: EmploymentStatus.INACTIVE },
  ];

  const employees: Awaited<ReturnType<typeof prisma.employee.create>>[] = [];
  for (let i = 0; i < empData.length; i++) {
    const emp = await prisma.employee.create({
      data: {
        ...empData[i],
        employeeNumber:   `EMP-${String(i + 1).padStart(4, "0")}`,
        employmentStatus: empData[i].employmentStatus ?? EmploymentStatus.ACTIVE,
      },
    });
    employees.push(emp);
  }

  // Set managers
  await prisma.employee.update({ where: { id: employees[1].id },  data: { managerId: employees[0].id } });
  await prisma.employee.update({ where: { id: employees[10].id }, data: { managerId: employees[0].id } });
  await prisma.employee.update({ where: { id: employees[11].id }, data: { managerId: employees[0].id } });
  await prisma.employee.update({ where: { id: employees[3].id },  data: { managerId: employees[2].id } });
  await prisma.employee.update({ where: { id: employees[5].id },  data: { managerId: employees[4].id } });

  // Set department heads
  await prisma.department.update({ where: { id: engineering.id }, data: { headId: employees[35].id } });
  await prisma.department.update({ where: { id: product.id },     data: { headId: employees[3].id }  });
  await prisma.department.update({ where: { id: sales.id },       data: { headId: employees[22].id } });
  await prisma.department.update({ where: { id: finance.id },     data: { headId: employees[23].id } });
  await prisma.department.update({ where: { id: hr.id },          data: { headId: employees[16].id } });
  await prisma.department.update({ where: { id: ops.id },         data: { headId: employees[8].id }  });

  // Leave requests
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = (offset: number) => { const dt = new Date(today); dt.setDate(dt.getDate() + offset); return dt; };

  const leaveData = [
    { employeeId: employees[2].id,  leaveType: LeaveType.ANNUAL,   startDate: d(-1), endDate: d(3),  reason: "Family vacation",        status: LeaveStatus.APPROVED, reviewedById: employees[16].id, reviewedAt: d(-2) },
    { employeeId: employees[5].id,  leaveType: LeaveType.SICK,     startDate: d(0),  endDate: d(2),  reason: "Flu recovery",           status: LeaveStatus.APPROVED, reviewedById: employees[16].id, reviewedAt: d(-1) },
    { employeeId: employees[10].id, leaveType: LeaveType.PERSONAL, startDate: d(7),  endDate: d(9),  reason: "Personal matters",       status: LeaveStatus.PENDING  },
    { employeeId: employees[13].id, leaveType: LeaveType.ANNUAL,   startDate: d(14), endDate: d(21), reason: "Summer holiday",         status: LeaveStatus.PENDING  },
    { employeeId: employees[19].id, leaveType: LeaveType.ANNUAL,   startDate: d(3),  endDate: d(5),  reason: "Weekend trip extension", status: LeaveStatus.PENDING  },
    { employeeId: employees[22].id, leaveType: LeaveType.SICK,     startDate: d(-35),endDate: d(-33),reason: "Medical procedure",      status: LeaveStatus.APPROVED, reviewedById: employees[16].id, reviewedAt: d(-36) },
    { employeeId: employees[25].id, leaveType: LeaveType.PERSONAL, startDate: d(1),  endDate: d(1),  reason: "Moving apartments",      status: LeaveStatus.PENDING  },
    { employeeId: employees[30].id, leaveType: LeaveType.ANNUAL,   startDate: d(-90),endDate: d(-80),reason: "Annual leave",           status: LeaveStatus.REJECTED, reviewComment: "Staffing conflicts during that period.", reviewedById: employees[16].id, reviewedAt: d(-91) },
    { employeeId: employees[1].id,  leaveType: LeaveType.UNPAID,   startDate: d(20), endDate: d(25), reason: "Extended travel",        status: LeaveStatus.PENDING  },
    { employeeId: employees[7].id,  leaveType: LeaveType.MATERNITY,startDate: d(-60),endDate: d(30), reason: "Maternity leave",        status: LeaveStatus.APPROVED, reviewedById: employees[16].id, reviewedAt: d(-61) },
  ];

  for (const leave of leaveData) {
    await prisma.leaveRequest.create({ data: leave });
  }

  // Employment history
  for (const emp of employees.slice(0, 20)) {
    await prisma.employmentHistory.create({
      data: {
        employeeId:   emp.id,
        eventType:    HistoryEventType.JOINED,
        title:        "Joined the company",
        description:  `Started as ${emp.jobTitle}`,
        effectiveDate: emp.dateJoined,
      },
    });
  }

  // Activity logs
  const activityData = [
    { action: ActivityAction.EMPLOYEE_CREATED,  entityType: "Employee",    entityId: employees[38].id, employeeId: employees[38].id, description: "Ibrahim Al-Amin joined Human Resources",                 createdAt: d(0) },
    { action: ActivityAction.LEAVE_SUBMITTED,   entityType: "LeaveRequest",entityId: employees[10].id, employeeId: employees[10].id, description: "Omar Farooq submitted a personal leave request",          createdAt: new Date(Date.now() - 4 * 3600000) },
    { action: ActivityAction.LEAVE_APPROVED,    entityType: "LeaveRequest",entityId: employees[5].id,  employeeId: employees[5].id,  description: "James Miller's sick leave was approved",                  createdAt: new Date(Date.now() - 24 * 3600000) },
    { action: ActivityAction.DEPARTMENT_CREATED,entityType: "Department",  entityId: cs.id,            employeeId: null,             description: "Customer Success department was created",                  createdAt: new Date(Date.now() - 48 * 3600000) },
    { action: ActivityAction.EMPLOYEE_UPDATED,  entityType: "Employee",    entityId: employees[3].id,  employeeId: employees[3].id,  description: "Marcus Chen was promoted to Product Manager",             createdAt: new Date(Date.now() - 72 * 3600000) },
    { action: ActivityAction.LEAVE_REJECTED,    entityType: "LeaveRequest",entityId: employees[30].id, employeeId: employees[30].id, description: "Yuki Tanaka's annual leave was rejected",                 createdAt: new Date(Date.now() - 7 * 24 * 3600000) },
    { action: ActivityAction.EMPLOYEE_CREATED,  entityType: "Employee",    entityId: employees[27].id, employeeId: employees[27].id, description: "Nadia Volkov joined Product",                             createdAt: new Date(Date.now() - 10 * 24 * 3600000) },
  ];

  for (const activity of activityData) {
    await prisma.activityLog.create({ data: activity });
  }

  // Create User accounts for all employees with default password
  await prisma.user.deleteMany();
  const pepper = process.env.BCRYPT_PEPPER ?? "";
  const hashedPassword = await bcrypt.hash("ChangeMe123!" + pepper, 10);
  for (const emp of employees) {
    const isAdmin = emp.email === "alice.johnson@peoplecore.io";
    await prisma.user.create({
      data: {
        email:    emp.email,
        password: hashedPassword,
        name:     `${emp.firstName} ${emp.lastName}`,
        role:     isAdmin ? "ADMIN" : "VIEWER",
      },
    });
  }

  console.log("✅ Seed complete: 40 employees, 40 users, 7 departments, 10 leave requests, activity logs");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
