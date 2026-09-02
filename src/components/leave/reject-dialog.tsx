"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  onReject: (comment: string) => void;
  isLoading: boolean;
}

export function RejectDialog({
  open,
  onOpenChange,
  employeeName,
  onReject,
  isLoading,
}: RejectDialogProps) {
  const [comment, setComment] = useState("");
  const [error,   setError]   = useState("");

  function handleSubmit() {
    if (comment.trim().length < 5) {
      setError("Please provide a reason (at least 5 characters).");
      return;
    }
    setError("");
    onReject(comment.trim());
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setComment("");
      setError("");
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject leave request?</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting {employeeName}&apos;s leave request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reject-reason">Reason for rejection *</Label>
          <Textarea
            id="reject-reason"
            placeholder="e.g. Insufficient staffing during that period..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError("");
            }}
            rows={3}
            maxLength={300}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <p className="text-xs text-slate-400 text-right">{comment.length}/300</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reject Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
