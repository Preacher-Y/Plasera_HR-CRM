"use client";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createEmployeeSchema, CreateEmployeeInput } from "@/lib/validations/employee";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface EmployeeFormProps {
  departments: { id: string; name: string }[];
  managers: { id: string; firstName: string; lastName: string }[];
  defaultValues?: Partial<CreateEmployeeInput>;
  employeeId?: string;
  mode: "create" | "edit";
}

export function EmployeeForm({
  departments,
  managers,
  defaultValues,
  employeeId,
  mode,
}: EmployeeFormProps) {
  const router = useRouter();
  const form = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema) as Resolver<CreateEmployeeInput>,
    defaultValues: {
      firstName:        "",
      lastName:         "",
      email:            "",
      phone:            "",
      jobTitle:         "",
      departmentId:     "",
      managerId:        "",
      location:         "",
      dateJoined:       new Date().toISOString().split("T")[0],
      employmentStatus: "ACTIVE",
      ...defaultValues,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: CreateEmployeeInput) {
    const url    = mode === "create" ? "/api/employees" : `/api/employees/${employeeId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res  = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();

    if (!json.success) {
      toast.error(json.error.message);
      return;
    }

    toast.success(
      mode === "create" ? "Employee created successfully." : "Employee information updated."
    );
    router.push(mode === "create" ? `/employees/${json.data.id}` : `/employees/${employeeId}`);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Alice" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Johnson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="alice@company.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+1 555 000 0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Software Engineer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New York" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => {
              const label = departments.find(d => d.id === field.value)?.name;
              return (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {label
                          ? <span className="flex flex-1 text-sm text-left">{label}</span>
                          : <span className="flex flex-1 text-sm text-left text-muted-foreground">Select department</span>
                        }
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="managerId"
            render={({ field }) => {
              const manager = managers.find(m => m.id === field.value);
              const label = manager ? `${manager.firstName} ${manager.lastName}` : null;
              return (
                <FormItem>
                  <FormLabel>Manager</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v === "_none" ? "" : v)}
                    value={field.value || "_none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {label
                          ? <span className="flex flex-1 text-sm text-left">{label}</span>
                          : <span className="flex flex-1 text-sm text-left text-muted-foreground">No manager</span>
                        }
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="_none">No manager</SelectItem>
                      {managers
                        .filter((m) => m.id !== employeeId)
                        .map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.firstName} {m.lastName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dateJoined"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Joined *</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Employee" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
