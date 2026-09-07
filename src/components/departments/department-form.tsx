"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDepartmentSchema, CreateDepartmentInput } from "@/lib/validations/department";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface DepartmentFormProps {
  employees: { id: string; firstName: string; lastName: string; jobTitle: string }[];
  defaultValues?: Partial<CreateDepartmentInput>;
  departmentId?: string;
  mode: "create" | "edit";
}

export function DepartmentForm({
  employees,
  defaultValues,
  departmentId,
  mode,
}: DepartmentFormProps) {
  const router = useRouter();
  const form = useForm<CreateDepartmentInput>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: { name: "", code: "", description: "", headId: "", ...defaultValues },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: CreateDepartmentInput) {
    const url    = mode === "create" ? "/api/departments" : `/api/departments/${departmentId}`;
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

    toast.success(mode === "create" ? "Department created." : "Department updated.");
    router.push("/departments");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Engineering" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ENG" maxLength={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="What does this department do?" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headId"
          render={({ field }) => {
            const head = employees.find(e => e.id === field.value);
            const label = head ? `${head.firstName} ${head.lastName}` : null;
            return (
              <FormItem>
                <FormLabel>Department Head</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(v === "_none" ? "" : v)}
                  value={field.value || "_none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      {label
                        ? <span className="flex flex-1 text-sm text-left">{label}</span>
                        : <span className="flex flex-1 text-sm text-left text-muted-foreground">No head assigned</span>
                      }
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="_none">No head assigned</SelectItem>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.firstName} {e.lastName} — {e.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-login-button hover:bg-login-button-hover"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Department" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
