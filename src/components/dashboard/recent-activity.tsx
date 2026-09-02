import { formatRelativeTime } from "@/lib/utils";
import { RecentActivity } from "@/types";
import { ActivitySquare } from "lucide-react";

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ActivitySquare className="mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-500">No recent activity</p>
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {activities.map((activity) => (
        <li key={activity.id} className="flex gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <ActivitySquare className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-700">{activity.description}</p>
            <p className="mt-0.5 text-xs text-slate-400">{formatRelativeTime(activity.createdAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
