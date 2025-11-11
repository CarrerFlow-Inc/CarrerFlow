import React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../ui/card";

const data = [
  { name: "Jan", Aplicada: 20, "Em Análise": 12, "Entrevista Técnica": 5, Proposta: 2 },
  { name: "Fev", Aplicada: 40, "Em Análise": 28, "Entrevista Técnica": 8, Proposta: 4 },
  { name: "Mar", Aplicada: 30, "Em Análise": 15, "Entrevista Técnica": 9, Proposta: 3 },
  { name: "Abr", Aplicada: 35, "Em Análise": 18, "Entrevista Técnica": 11, Proposta: 6 },
  { name: "Mai", Aplicada: 18, "Em Análise": 10, "Entrevista Técnica": 3, Proposta: 1 }
];

export default function PerformanceChart() {
  return (
    <Card hoverable>
      <div className="text-sm font-medium mb-3">Performance de Candidaturas</div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Line type="monotone" dataKey="Aplicada" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Em Análise" stroke="#6b7280" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Entrevista Técnica" stroke="#9CA3AF" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
