import { formatDate } from "@/lib/utils";
import { UserPlus, Briefcase, Building2, Users, UserMinus, RefreshCw } from "lucide-react";

type HistoryEventType =
  | "JOINED"
  | "JOB_TITLE_CHANGED"
  | "DEPARTMENT_CHANGED"
  | "MANAGER_CHANGED"
  | "DEACTIVATED"
  | "REACTIVATED";

const eventIcons: Record<HistoryEventType, React.ElementType> = {
  JOINED:             UserPlus,
  JOB_TITLE_CHANGED:  Briefcase,
  DEPARTMENT_CHANGED: Building2,
  MANAGER_CHANGED:    Users,
  DEACTIVATED:        UserMinus,
  REACTIVATED:        RefreshCw,
};

interface HistoryEntry {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  effectiveDate: Date;
}

export function EmploymentHistoryFeed({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No history recorded yet</p>;
  }

  return (
    <ol className="relative border-l border-slate-200 space-y-6 pl-6">
      {history.map((event) => {
        const Icon = eventIcons[event.eventType as HistoryEventType] ?? Briefcase;
        return (
          <li key={event.id} className="relative">
            <div className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-white">
              <Icon className="h-3 w-3 text-emerald-600" />
            </div>
            <p className="font-medium text-sm text-slate-800">{event.title}</p>
            {event.description && (
              <p className="text-xs text-slate-500">{event.description}</p>
            )}
            <time className="text-xs text-slate-400">{formatDate(event.effectiveDate)}</time>
          </li>
        );
      })}
    </ol>
  );
}
