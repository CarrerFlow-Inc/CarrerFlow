import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Card from "../ui/card";

const data = [
  { name: "Empresa A", value: 400 },
  { name: "Empresa B", value: 300 },
  { name: "Startup", value: 300 },
  { name: "Outro", value: 200 }
];

const COLORS = ["#111827", "#374151", "#6B7280", "#D1D5DB"];

export default function ConversionDonutChart() {
  return (
    <Card hoverable>
      <div className="text-sm font-medium mb-3">Candidaturas mais aderentes</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={50} outerRadius={80} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
