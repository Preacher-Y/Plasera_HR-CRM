"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RejectDialog } from "./reject-dialog";
import { formatDate } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ApproveRejectActionsProps {
  leaveId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  onAction: () => void;
}

export function ApproveRejectActions({
  leaveId,
  employeeName,
  startDate,
  endDate,
  onAction,
}: ApproveRejectActionsProps) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen,  setRejectOpen]  = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);

  async function handleApprove() {
    setIsLoading(true);
    const res  = await fetch(`/api/leave/${leaveId}/approve`, { method: "POST" });
    const json = await res.json();
    setIsLoading(false);
    setApproveOpen(false);

    if (json.success) {
      toast.success("Leave request approved.");
      onAction();
    } else {
      toast.error(json.error.message);
    }
  }

  async function handleReject(comment: string) {
    setIsLoading(true);
    const res  = await fetch(`/api/leave/${leaveId}/reject`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ reviewComment: comment }),
    });
    const json = await res.json();
    setIsLoading(false);
    setRejectOpen(false);

    if (json.success) {
      toast.success("Leave request rejected.");
      onAction();
    } else {
      toast.error(json.error.message);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          size="sm"
          variant="outline"
          className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
          onClick={() => setApproveOpen(true)}
          aria-label="Approve leave"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-50 hover:border-red-300"
          onClick={() => setRejectOpen(true)}
          aria-label="Reject leave"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ConfirmDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve leave request?"
        description={`${employeeName} will be on approved leave from ${formatDate(startDate)} to ${formatDate(endDate)}.`}
        confirmLabel="Approve"
        onConfirm={handleApprove}
        isLoading={isLoading}
      />

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        employeeName={employeeName}
        onReject={handleReject}
        isLoading={isLoading}
      />
    </>
  );
}
