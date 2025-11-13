import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Horizontal bar chart showing distribution of statuses
export default function StatusDistributionChart({ data = [] }) {
  const chartData = data.map(item => ({ name: item.label, value: item.count }));
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="value" fill="#111827" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
