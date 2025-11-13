import React from "react";
import StatusDistributionChart from "../components/analytics/StatusDistributionChart";
import ConversionTrendChart from "../components/analytics/ConversionTrendChart";
import SectionHeader from "../components/ui/sectionheader";
import StatusSummary from "../components/dashboard/statussummary";
import HeatmapActivityChart from "../components/analytics/HeatmapActivityChart";
import Card from "../components/ui/card";
import Skeleton from "../components/ui/skeleton";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Analytics() {
  const { user } = useAuth();
  const [range, setRange] = React.useState("30d");
  const [loading, setLoading] = React.useState(true);
  const [companyFilter, setCompanyFilter] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("");
  const [data, setData] = React.useState({ totals: { total: 0, emAnalise: 0, entrevistas: 0, ofertas: 0, conversionRate: 0 }, previousTotals: { total:0, emAnalise:0, entrevistas:0, ofertas:0, conversionRate:0 }, deltas: {}, summary: [], companies: [], timeline: [], heatmap: [], filters: { availableCompanies: [], availableLocations: [] } });

  React.useEffect(() => {
    if (!user) return;
    setLoading(true);
    setTimeout(() => {
      const result = api.getAnalytics(user.id, { range, company: companyFilter || null, location: locationFilter || null });
      setData(result);
      setLoading(false);
    }, 0);
  }, [user, range, companyFilter, locationFilter]);

  function pct(part, total) { return total ? Math.round((part / total) * 100) : 0; }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics"
        subtitle="Métricas e insights aprofundados sobre suas candidaturas"
        actions={(
          <div className="flex items-center gap-2">
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              aria-label="Intervalo"
            >
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="12m">Últimos 12 meses</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              aria-label="Filtrar por empresa"
            >
              <option value="">Todas empresas</option>
              {data.filters.availableCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              aria-label="Filtrar por localidade"
            >
              <option value="">Todas localidades</option>
              {data.filters.availableLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}
      />

      {/* Metric strip */}
      {!loading && <StatusSummary summary={data.summary} />}

      {/* Funil de Conversão */}
      <Card title="Funil de Conversão">
        {loading ? (
          <Skeleton className="h-36" />
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Aplicadas', value: data.totals.total, color: 'bg-gray-900' },
              { label: 'Em análise', value: data.totals.emAnalise, color: 'bg-gray-700' },
              { label: 'Entrevistas', value: data.totals.entrevistas, color: 'bg-gray-500' },
              { label: 'Ofertas/Propostas', value: data.totals.ofertas, color: 'bg-emerald-600' },
            ].map((step) => (
              <div key={step.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="type-body-sm text-gray-700">{step.label}</span>
                  <span className="type-body-sm text-gray-500">{step.value} ({pct(step.value, data.totals.total)}%)</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color}`} style={{ width: `${pct(step.value, data.totals.total)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Distribuição por status" className="lg:col-span-1">
          {loading ? <Skeleton className="h-60" /> : <StatusDistributionChart data={data.summary} />}
        </Card>
        <Card title="Tendência de conversão" className="lg:col-span-2">
          {loading ? <Skeleton className="h-60" /> : <ConversionTrendChart timeline={data.timeline} />}
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Atividade no período" className="lg:col-span-2">
          {loading ? <Skeleton className="h-56" /> : <HeatmapActivityChart data={data.heatmap} />}
        </Card>
        <Card title="Top empresas" className="lg:col-span-1">
          {loading ? (
            <Skeleton className="h-40" />
          ) : data.companies.length === 0 ? (
            <div className="type-body-sm text-gray-500">Sem dados suficientes para este período.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left type-subtle text-gray-600">
                    <th className="py-2 pr-4">Empresa</th>
                    <th className="py-2 pr-4">Candidaturas</th>
                    <th className="py-2">Participação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.companies.map((c) => (
                    <tr key={c.company}>
                      <td className="py-2 pr-4">{c.company}</td>
                      <td className="py-2 pr-4">{c.count}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-gray-900 rounded" style={{ width: `${c.share}%` }} />
                          <span className="type-caption text-gray-700">{c.share}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
