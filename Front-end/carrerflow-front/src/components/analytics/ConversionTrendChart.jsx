import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Expects timeline: [{ label, total, ofertas, conversionRate }]
export default function ConversionTrendChart({ timeline = [] }) {
  const data = timeline.map(t => ({ label: t.label, conversao: t.conversionRate }));
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis width={40} tick={{ fontSize: 12 }} domain={[0, 'dataMax + 5']} />
          <Tooltip cursor={{ stroke: '#374151' }} formatter={(v) => [`${v}%`, 'Conversão']} />
          <Line type="monotone" dataKey="conversao" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
