import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/data-skeleton";
import { LeaveContent } from "./leave-content";

export default function LeavePage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} cols={5} />}>
      <LeaveContent />
    </Suspense>
  );
}
