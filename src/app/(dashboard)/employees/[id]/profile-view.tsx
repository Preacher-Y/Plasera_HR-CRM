"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { StatusBadge, employmentStatusToVariant } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmploymentHistoryFeed } from "@/components/employees/employment-history-feed";
import { EmployeeLeaveList } from "@/components/employees/employee-leave-list";
import { formatDate } from "@/lib/utils";
import { Edit, UserMinus, Mail, Phone, MapPin, Briefcase, Building2, Calendar } from "lucide-react";

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string;
  location: string | null;
  employmentStatus: string;
  dateJoined: Date;
  departmentId: string;
  managerId: string | null;
  department: { id: string; name: string };
  manager: { id: string; firstName: string; lastName: string; jobTitle: string } | null;
  leaveRequests: {
    id: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    status: string;
    reason: string;
  }[];
  history: {
    id: string;
    eventType: string;
    title: string;
    description: string | null;
    effectiveDate: Date;
  }[];
}

interface ProfileViewProps {
  employee: Employee;
  onLeave: boolean;
}

export function ProfileView({ employee: emp, onLeave }: ProfileViewProps) {
  const router = useRouter();
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  async function handleDeactivate() {
    setIsDeactivating(true);
    const res  = await fetch(`/api/employees/${emp.id}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ employmentStatus: "INACTIVE" }),
    });
    const json = await res.json();
    setIsDeactivating(false);
    setDeactivateOpen(false);

    if (json.success) {
      toast.success("Employee deactivated.");
      router.refresh();
    } else {
      toast.error(json.error.message);
    }
  }

  const infoItems = [
    { label: "Employee Number", value: emp.employeeNumber, icon: Briefcase },
    { label: "Department",      value: emp.department.name, icon: Building2 },
    { label: "Job Title",       value: emp.jobTitle, icon: Briefcase },
    {
      label: "Manager",
      value: emp.manager
        ? `${emp.manager.firstName} ${emp.manager.lastName}`
        : "—",
      icon: Briefcase,
    },
    { label: "Date Joined", value: formatDate(emp.dateJoined), icon: Calendar },
    { label: "Location",    value: emp.location ?? "—", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${emp.firstName} ${emp.lastName}`}
        description={emp.employeeNumber}
        actions={
          <div className="flex gap-2">
            <Link href={`/employees/${emp.id}/edit`} className={buttonVariants({ variant: "outline" })}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
            {emp.employmentStatus === "ACTIVE" && (
              <Button variant="destructive" onClick={() => setDeactivateOpen(true)}>
                <UserMinus className="mr-2 h-4 w-4" />
                Deactivate
              </Button>
            )}
          </div>
        }
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <EmployeeAvatar
            firstName={emp.firstName}
            lastName={emp.lastName}
            size="xl"
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {emp.firstName} {emp.lastName}
              </h2>
              <StatusBadge variant={employmentStatusToVariant(emp.employmentStatus, onLeave)} />
            </div>
            <p className="text-slate-500">
              {emp.jobTitle} · {emp.department.name}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {emp.email}
              </span>
              {emp.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {emp.phone}
                </span>
              )}
              {emp.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {emp.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-white border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {infoItems.map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leave">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Leave Requests</h3>
            <EmployeeLeaveList leaveRequests={emp.leaveRequests} />
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-semibold text-slate-700">Employment History</h3>
            <EmploymentHistoryFeed history={emp.history} />
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate employee?"
        description={`${emp.firstName} ${emp.lastName} will be marked as inactive. Their records will be preserved.`}
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleDeactivate}
        isLoading={isDeactivating}
      />
    </div>
  );
}
