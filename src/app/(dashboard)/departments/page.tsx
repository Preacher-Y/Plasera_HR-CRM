"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/components/ui/data-skeleton";
import { DepartmentPageBanner } from "@/components/departments/department-page-banner";
import { Building2, Pencil, Trash2, Users } from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  head: { id: string; firstName: string; lastName: string; jobTitle: string } | null;
  _count: { employees: number };
}

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments,  setDepartments]  = useState<Department[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [deleteError,  setDeleteError]  = useState<string | null>(null);

  async function fetchDepartments() {
    const res  = await fetch("/api/departments");
    const json = await res.json();
    if (json.success) setDepartments(json.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res  = await fetch(`/api/departments/${deleteTarget.id}`, { method: "DELETE" });
    const json = await res.json();
    setIsDeleting(false);

    if (!json.success) {
      setDeleteError(json.error.message);
      return;
    }

    toast.success(`${deleteTarget.name} department deleted.`);
    setDeleteTarget(null);
    fetchDepartments();
  }

  return (
    <div className="space-y-6 max-md:mb-10">
      <DepartmentPageBanner />

      {loading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments yet"
          description="Create your first department to start organizing employees."
          action={{ label: "New Department", onClick: () => router.push("/departments/new") }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">{dept.name}</h3>
                    {dept.code && (
                      <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-500">
                        {dept.code}
                      </span>
                    )}
                  </div>
                  {dept.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{dept.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{dept._count.employees}</span>
                <span className="text-slate-400">
                  {dept._count.employees === 1 ? "employee" : "employees"}
                </span>
              </div>

              {dept.head ? (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <EmployeeAvatar
                    firstName={dept.head.firstName}
                    lastName={dept.head.lastName}
                    size="sm"
                  />
                  <span>
                    {dept.head.firstName} {dept.head.lastName}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No head assigned</p>
              )}

              <div className="flex gap-2 border-t pt-3">
                <Link
                  href={`/departments/${dept.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
                >
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  View
                </Link>
                <Link
                  href={`/departments/${dept.id}?edit=true`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:border-red-200"
                  onClick={() => {
                    setDeleteTarget(dept);
                    setDeleteError(null);
                  }}
                  aria-label={`Delete ${dept.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title={`Delete ${deleteTarget?.name ?? "department"}?`}
        description={
          deleteError
            ? deleteError
            : "This action permanently removes the department. This cannot be undone."
        }
        confirmLabel={deleteError ? "OK" : "Delete Department"}
        variant="destructive"
        onConfirm={
          deleteError
            ? () => {
                setDeleteTarget(null);
                setDeleteError(null);
              }
            : handleDelete
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
