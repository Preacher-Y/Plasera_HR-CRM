"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LeaveOverviewStat } from "@/types";

interface LeaveOverviewChartProps {
  data: LeaveOverviewStat;
}

const COLORS = { pending: "#f59e0b", approved: "#3B84C4", rejected: "#ef4444" };

export function LeaveOverviewChart({ data }: LeaveOverviewChartProps) {
  const chartData = [
    { name: "Pending", value: data.pending, color: COLORS.pending },
    { name: "Approved", value: data.approved, color: COLORS.approved },
    { name: "Rejected", value: data.rejected, color: COLORS.rejected },
  ].filter((d) => d.value > 0);

  const total = data.pending + data.approved + data.rejected;

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        No leave requests yet
      </p>
    );
  }

  return (
    <div
      onPointerDownCapture={(e) => {
        e.stopPropagation();
      }}
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value) => [`${String(value)} requests`]}
          />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
