import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Card from "../ui/card";

const COLORS = ["#111827", "#374151", "#6B7280", "#D1D5DB", "#9CA3AF", "#4B5563"];

export default function ConversionDonutChart({ companies = [] }) {
  const data = React.useMemo(() => {
    if (!Array.isArray(companies)) return [];
    return companies.map((c) => ({ name: c.company, value: c.count }));
  }, [companies]);

  return (
    <Card hoverable>
      <div className="text-sm font-medium mb-3">Candidaturas por empresa</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={50} outerRadius={80} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
