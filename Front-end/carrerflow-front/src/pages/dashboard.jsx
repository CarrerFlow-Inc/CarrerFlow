import React from "react";
import StatsCard from "../components/dashboard/statscard";
import PerformanceChart from "../components/dashboard/performancechart";
import ConversionDonutChart from "../components/dashboard/conversionchart";
import CandidaturasRecentesTable from "../components/dashboard/candidaturasrecentestable";
import StatusSummary from "../components/dashboard/statussummary";
import Button from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Clock, Calendar, TrendingUp, AlertTriangle, Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [recent, setRecent] = React.useState([]);
  const [analytics, setAnalytics] = React.useState({ totals: { total:0, emAnalise:0, entrevistas:0, ofertas:0, conversionRate:0 }, deltas: {}, summary: [], companies: [], timeline: [] });
  const [range, setRange] = React.useState("30d");
  const [recentPage, setRecentPage] = React.useState(1);
  const [recentMeta, setRecentMeta] = React.useState({ total: 0, page: 1, perPage: 6, totalPages: 1 });
  const mockLembretes = [
    { id: 101, label: 'Follow-up entrevista técnica', date: '2025-09-21T10:00:00Z' },
    { id: 102, label: 'Enviar teste técnico', date: '2025-09-22T12:00:00Z' }
  ];
  const now = new Date();
  const upcoming = mockLembretes
    .map(l => ({ ...l, d: new Date(l.date) }))
    .filter(l => l.d >= now)
    .sort((a,b) => a.d - b.d);
  const nextLembrete = upcoming[0];
  const diffMs = nextLembrete ? (nextLembrete.d - now) : null;
  const diffHours = diffMs ? diffMs / (1000*60*60) : null;
  const isUrgent = diffHours !== null && diffHours <= 48;
  const navigate = useNavigate();

  const statusSummary = analytics.summary;

  const refresh = React.useCallback(() => {
    if (!user) return;
    const list = api.getCandidaturas(user.id, { page: recentPage, perPage: 6, sort:'recent' });
    setRecent(list.items.map(i => ({ ...i, date: i.createdAt })));
    setRecentMeta(list.meta);
    if (recentPage > list.meta.totalPages && list.meta.totalPages > 0) {
      setRecentPage(list.meta.totalPages);
    }
    const a = api.getAnalytics(user.id, { range });
    setAnalytics(a);
  }, [user, range, recentPage]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    const onChange = () => {
      refresh();
    };
  window.addEventListener('candidaturas:changed', onChange);
    window.addEventListener('candidatura:updated', onChange);
    window.addEventListener('candidatura:deleted', onChange);
    return () => {
      window.removeEventListener('candidaturas:changed', onChange);
      window.removeEventListener('candidatura:updated', onChange);
      window.removeEventListener('candidatura:deleted', onChange);
    };
  }, [refresh]);

  React.useEffect(() => {}, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="type-body-sm text-gray-600 mt-1">Visão geral das suas candidaturas</p>
          {nextLembrete && (
            <div
              className={`mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border ${isUrgent ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
              aria-live="polite"
            >
              {isUrgent ? <AlertTriangle size={14} className="text-orange-500" /> : <Bell size={14} className="text-gray-500" />}
              <span className="truncate max-w-[200px]" title={nextLembrete.label}>{nextLembrete.label}</span>
              <span className="type-caption ml-1">
                {nextLembrete.d.toLocaleDateString('pt-BR')} ({isUrgent ? 'em breve' : 'agendado'})
              </span>
              <span className="sr-only">Próximo lembrete {isUrgent ? 'urgente' : ''} para {nextLembrete.label} em {nextLembrete.d.toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            aria-label="Selecionar período"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="12m">Últimos 12 meses</option>
          </select>
          <Button variant="charcoal" onClick={() => navigate('/candidaturas?new=1')} title="Nova candidatura" aria-label="Nova candidatura">
            Nova Candidatura
          </Button>
          <Link to="/candidaturas" className="hidden sm:inline-block">
            <Button variant="outline" title="Ver lista completa">Ver todas</Button>
          </Link>
          <a href="#recentes" className="hidden sm:inline-block" title="Ir para candidaturas recentes">
            <Button variant="ghost">Recentes</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total de Candidaturas" 
          value={String(analytics.totals.total)} 
          icon={Briefcase}
          trend={typeof analytics.deltas.total === 'number' ? (analytics.deltas.total >= 0 ? 'up' : 'down') : undefined}
          trendValue={typeof analytics.deltas.total === 'number' ? `${Math.abs(analytics.deltas.total)}%` : undefined}
          highlight
        />
        <StatsCard 
          title="Em Análise" 
          value={String(analytics.totals.emAnalise)} 
          icon={Clock}
          trend={typeof analytics.deltas.emAnalise === 'number' ? (analytics.deltas.emAnalise >= 0 ? 'up' : 'down') : undefined}
          trendValue={typeof analytics.deltas.emAnalise === 'number' ? `${Math.abs(analytics.deltas.emAnalise)}%` : undefined}
        />
        <StatsCard 
          title="Entrevistas" 
          value={String(analytics.totals.entrevistas)} 
          icon={Calendar}
        />
        <StatsCard 
          title="Taxa de Conversão" 
          value={`${analytics.totals.conversionRate}%`} 
          icon={TrendingUp}
          trend={typeof analytics.deltas.conversionRate === 'number' ? (analytics.deltas.conversionRate >= 0 ? 'up' : 'down') : undefined}
          trendValue={typeof analytics.deltas.conversionRate === 'number' ? `${Math.abs(analytics.deltas.conversionRate)}%` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart timeline={analytics.timeline} />
        </div>
        <div>
          <ConversionDonutChart companies={analytics.companies} />
        </div>
      </div>

      <StatusSummary summary={statusSummary} />
      <div id="recentes">
        {recent.length === 0 ? (
          <div className="mt-4 bg-white border rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Comece sua jornada</h3>
            <p className="mt-1 type-body-sm text-gray-600">Você ainda não tem candidaturas. Adicione a primeira para ver insights e progresso.</p>
            <div className="mt-4">
              <Button variant="charcoal" onClick={() => navigate('/candidaturas?new=1')} aria-label="Nova candidatura">Nova Candidatura</Button>
            </div>
          </div>
        ) : (
          <CandidaturasRecentesTable items={recent} meta={recentMeta} onPageChange={(p) => setRecentPage(p)} />
        )}
      </div>
    </div>
  );
}
