"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DepartmentStat } from "@/types";

interface DepartmentChartProps {
  data: DepartmentStat[];
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">No department data</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
        <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip
          cursor={{ fill: "rgba(59,132,196,0.08)" }}
          contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
          formatter={(value) => [`${String(value)} employees`, "Count"]}
        />
        <Bar dataKey="employeeCount" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#3B84C4" : "#93c5fd"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
