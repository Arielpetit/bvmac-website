"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Sequential gold-to-brown ramp from the brand guide (magnitude, not category order).
const COLORS = ["#5a3412", "#8a6614", "#c9a23a", "#ead18a", "#3a2414"];

export function ShareholdingChart({ parts }: { parts: { label: string; value: number }[] }) {
  return (
    <div className="h-72" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={parts} dataKey="value" nameKey="label" innerRadius="55%" outerRadius="90%" stroke="var(--surface)" strokeWidth={2} isAnimationActive={false}>
            {parts.map((p, i) => (
              <Cell key={p.label} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, name) => [`${v} %`, String(name)]}
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--text)", fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


