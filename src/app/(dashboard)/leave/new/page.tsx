"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createLeaveSchema, CreateLeaveInput } from "@/lib/validations/leave";
import { LEAVE_TYPE_LABELS } from "@/lib/constants";
import { calculateLeaveDays } from "@/lib/utils";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarRange, ArrowLeft } from "lucide-react";

export default function NewLeavePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/employees?status=ACTIVE&limit=50")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setEmployees(json.data.employees);
      });
  }, []);

  const form = useForm<CreateLeaveInput>({
    resolver: zodResolver(createLeaveSchema),
    defaultValues: {
      employeeId: "",
      leaveType:  undefined,
      startDate:  "",
      endDate:    "",
      reason:     "",
    },
  });

  const { isSubmitting } = form.formState;
  const startDate = form.watch("startDate");
  const endDate   = form.watch("endDate");
  const duration =
    startDate && endDate && new Date(endDate) >= new Date(startDate)
      ? calculateLeaveDays(startDate, endDate)
      : null;

  async function onSubmit(values: CreateLeaveInput) {
    const res  = await fetch("/api/leave", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(values),
    });
    const json = await res.json();

    if (!json.success) {
      toast.error(json.error.message);
      return;
    }

    toast.success("Leave request submitted.");
    router.push("/leave");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/leave" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <PageHeader
          title="Submit Leave Request"
          description="Create a time-off request for an employee"
        />
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.firstName} {e.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" min={startDate} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {duration !== null && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <CalendarRange className="h-4 w-4" />
                <span>
                  {duration} calendar {duration === 1 ? "day" : "days"}
                </span>
              </div>
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Briefly explain the reason for this leave..."
                      rows={3}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-slate-400 text-right">{field.value.length}/500</p>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
