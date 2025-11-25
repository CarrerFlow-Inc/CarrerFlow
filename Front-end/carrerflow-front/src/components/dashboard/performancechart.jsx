import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis, Legend } from "recharts";
import Card from "../ui/card";

export default function PerformanceChart({ timeline = [] }) {
  // Normalize analytics timeline into chart-friendly data
  const data = React.useMemo(() => {
    if (!Array.isArray(timeline) || timeline.length === 0) return [];
    return timeline.map((t) => ({ name: t.label, Total: t.total ?? 0, Ofertas: t.ofertas ?? 0 }));
  }, [timeline]);

  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="text-sm font-medium mb-3">Performance de Candidaturas</div>
      <div className="flex-1 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Total" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Ofertas" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
