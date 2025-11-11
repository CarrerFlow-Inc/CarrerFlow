import React from "react";
import StatsCard from "../components/dashboard/statscard";
import PerformanceChart from "../components/dashboard/performancechart";
import ConversionDonutChart from "../components/dashboard/conversionchart";
import CandidaturasRecentesTable from "../components/dashboard/candidaturasrecentestable";
import StatusSummary from "../components/dashboard/statussummary";
import Button from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Clock, Calendar, TrendingUp, AlertTriangle, Bell } from "lucide-react";

export default function Dashboard() {
  // pseudo dados
  const recent = [
    { id: "1", title: "Desenvolvedor Back-End", date: "2025-09-19", company: "CarrerFlow Inc", location: "Manaus, AM", status: "Em Análise" },
    { id: "2", title: "Desenvolvedor Java", date: "2025-08-18", company: "Startup Inovadora", location: "São Paulo, SP", status: "Entrevista Técnica" },
    { id: "3", title: ".NET Mid Level", date: "2025-09-20", company: "Banco Laranjinha", location: "Remoto", status: "Aplicada" }
  ];
  // mock lembretes futuros (substituir por origem real depois)
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
  const isUrgent = diffHours !== null && diffHours <= 48; // 48h
  const navigate = useNavigate();

  // resumo por status (mock a partir de recent)
  const byStatusMap = recent.reduce((acc, it) => {
    const key = it.status;
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map());
  const statusSummary = Array.from(byStatusMap.entries()).map(([label, count]) => ({ label, count }));

  // escuta por atualizações (estrutura p/ tempo real)
  React.useEffect(() => {
    const onUpdate = () => {
      // aqui poderíamos reconsultar a API ou invalidar cache
      // mantendo como no-op por ora, apenas re-render
      // setState de um contador, se necessário
    };
    window.addEventListener('candidatura:updated', onUpdate);
    window.addEventListener('candidatura:deleted', onUpdate);
    return () => {
      window.removeEventListener('candidatura:updated', onUpdate);
      window.removeEventListener('candidatura:deleted', onUpdate);
    };
  }, []);

  // espaço para futuras chamadas assíncronas -> exemplo de tratamento de erro
  // try/catch ilustrativo (substituir por fetch real depois)
  React.useEffect(() => {
    try {
      // fake ok scenario
    } catch {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'error', message: 'Não foi possível carregar o dashboard. Tente novamente.' } }));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
          <Button variant="primary" onClick={() => navigate('/candidaturas?new=1')} title="Adicionar nova candidatura">
            Adicionar Nova Candidatura
          </Button>
          <Link to="/candidaturas" className="hidden sm:inline-block">
            <Button variant="outline" title="Ver lista completa">Ver todas</Button>
          </Link>
          <a href="#recentes" className="hidden sm:inline-block" title="Ir para candidaturas recentes">
            <Button variant="ghost">Recentes</Button>
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total de Candidaturas" 
          value="21" 
          icon={Briefcase}
          trend="up"
          trendValue="12%"
          highlight
        />
        <StatsCard 
          title="Em Andamento" 
          value="4" 
          icon={Clock}
          trend="up"
          trendValue="8%"
        />
        <StatsCard 
          title="Entrevistas Agendadas" 
          value="2" 
          icon={Calendar}
        />
        <StatsCard 
          title="Taxa de Conversão" 
          value="12.8%" 
          icon={TrendingUp}
          trend="up"
          trendValue="3.2%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <ConversionDonutChart />
        </div>
      </div>

      {/* Recent Applications */}
      <StatusSummary summary={statusSummary} />
      <div id="recentes">
        {recent.length === 0 ? (
          <div className="mt-4 bg-white border rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Comece sua jornada</h3>
            <p className="mt-1 type-body-sm text-gray-600">Voc ainda n tem candidaturas. Adicione a primeira para ver insights e progresso.</p>
            <div className="mt-4">
              <Button variant="primary" onClick={() => navigate('/candidaturas?new=1')} aria-label="Adicionar primeira candidatura">Adicionar primeira candidatura</Button>
            </div>
          </div>
        ) : (
          <CandidaturasRecentesTable items={recent} />
        )}
      </div>
    </div>
  );
}
