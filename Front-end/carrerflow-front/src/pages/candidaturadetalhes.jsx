import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';
import AnotacoesSection from '../components/candidaturas/anotacoessection';
import LembreteSection from '../components/candidaturas/lembretesection';
import ContatosSection from '../components/candidaturas/contatossection';
const CandidaturaForm = React.lazy(() => import('../components/candidaturas/candidaturaform'));
import Badge from '../components/ui/badge';
import { getStatusLabel, getStatusTone } from '../utils/statusColors';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import SectionHeader from '../components/ui/sectionheader';
import Button from '../components/ui/button';
import Card from '../components/ui/card';
import Modal from '../components/ui/modal';
import Skeleton from '../components/ui/skeleton';

const CandidaturaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [candidatura, setCandidatura] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    const item = api.getCandidatura(id);
    if (!item || item.userId !== user.id) {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'error', message: 'Candidatura não encontrada. Você foi redirecionado.' } }));
      navigate('/candidaturas');
      return;
    }
    const normalized = {
      id: item.id,
      empresa: item.company || item.empresa || '',
      vaga: item.title || item.vaga || '',
      data: item.createdAt || item.data || '',
      fonte: item.source || item.fonte || '',
      status: item.status || 'Aplicada',
      link: item.link || '',
      anotacoes: item.anotacoes || [],
      lembrete: item.lembrete || null,
      contatos: item.contatos || [],
    };
    setCandidatura(normalized);
  }, [id, user, navigate]);

  if (!candidatura) {
    return (
      <div className="space-y-6" aria-live="polite">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><Skeleton className="h-40 w-full" /></Card>
          <Card><Skeleton className="h-40 w-full" /></Card>
        </div>
        <Card><Skeleton className="h-24 w-full" /></Card>
      </div>
    );
  }

  const handleAddAnotacao = (texto) => {
    const novaAnotacao = {
      texto,
      data: new Date().toISOString(),
    };
    setCandidatura((prev) => {
      const updated = {
        ...prev,
        anotacoes: [...(prev.anotacoes || []), novaAnotacao],
      };
      try { api.updateCandidatura(prev.id, { anotacoes: updated.anotacoes }); } catch {}
      return updated;
    });
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Anotação adicionada' } }));
  };

  const handleDeleteAnotacao = (idx) => {
    setCandidatura((prev) => {
      const nextNotes = prev.anotacoes.filter((_, i) => i !== idx);
      try { api.updateCandidatura(prev.id, { anotacoes: nextNotes }); } catch {}
      return { ...prev, anotacoes: nextNotes };
    });
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'info', message: 'Anotação removida' } }));
  };

  const handleEditAnotacao = (idx, texto) => {
    setCandidatura((prev) => {
      const nextNotes = prev.anotacoes.map((a,i) => i===idx ? { ...a, texto } : a);
      try { api.updateCandidatura(prev.id, { anotacoes: nextNotes }); } catch {}
      return { ...prev, anotacoes: nextNotes };
    });
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Anotação atualizada' } }));
  };

  const handleSetLembrete = (data) => {
    setCandidatura((prev) => {
      const updated = { ...prev, lembrete: data };
      try { api.updateCandidatura(prev.id, { lembrete: data }); } catch {}
      return updated;
    });
  };

  const handleAddContato = (contato) => {
    setCandidatura((prev) => {
      const nextContatos = [...(prev.contatos || []), contato];
      try { api.updateCandidatura(prev.id, { contatos: nextContatos }); } catch {}
      return { ...prev, contatos: nextContatos };
    });
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 btn-hover" aria-label="Voltar">
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      <SectionHeader
        title={candidatura.vaga || 'Vaga'}
        subtitle={`${candidatura.empresa || 'Empresa'} • Aplicado em ${candidatura.data ? new Date(candidatura.data).toLocaleDateString('pt-BR') : '—'}`}
        actions={(
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={getStatusTone(candidatura.status)}>{getStatusLabel(candidatura.status)}</Badge>
            <Button variant="outline" onClick={() => setEditOpen(true)} aria-label="Editar candidatura">
              <Edit size={14} /> Editar
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)} aria-label="Excluir candidatura">
              <Trash2 size={14} /> Excluir
            </Button>
          </div>
        )}
      />

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="type-subtle">Fonte</span>: {candidatura.fonte || '—'}
          </div>
          {candidatura.link && (
            <div>
              <span className="type-subtle">Link da vaga</span>{' '}
              <a href={candidatura.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                {candidatura.link}
                <ExternalLink size={12} className="ml-1" aria-hidden="true" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnotacoesSection
          anotacoes={candidatura.anotacoes}
          onAddAnotacao={handleAddAnotacao}
          onDeleteAnotacao={handleDeleteAnotacao}
          onEditAnotacao={handleEditAnotacao}
          containerId="anotacoes-section"
          textAreaId="anotacoes-input"
        />
        <LembreteSection
          lembrete={candidatura.lembrete}
          onSetLembrete={handleSetLembrete}
        />
      </div>

      <ContatosSection
        contatos={candidatura.contatos}
        onAddContato={handleAddContato}
      />

      <button
        type="button"
        onClick={() => {
          const container = document.getElementById('anotacoes-section');
          if (container && container.scrollIntoView) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setTimeout(() => {
            const ta = document.getElementById('anotacoes-input');
            ta && ta.focus && ta.focus();
          }, 350);
        }}
        className="md:hidden fixed bottom-5 right-5 z-40 bg-gray-900 text-white w-14 h-14 sm:h-12 sm:px-4 sm:w-auto rounded-full flex items-center justify-center shadow-2xl btn-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
        aria-label="Adicionar anotação"
        title="Adicionar anotação"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden sm:inline ml-2 text-sm font-medium">Anotação</span>
        <span className="sr-only">Adicionar anotação</span>
      </button>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} ariaLabel="Confirmar exclusão">
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold mb-2">Excluir candidatura?</h3>
          <p className="type-body-sm text-gray-600 mb-4">Essa ação não poderá ser desfeita. Confirme para remover <strong>{candidatura.vaga}</strong>{candidatura.empresa ? ` • ${candidatura.empresa}` : ''}.</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)} aria-label="Cancelar exclusão">Cancelar</Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                api.deleteCandidatura(candidatura.id);
                window.dispatchEvent(new Event('candidatura:deleted'));
                window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Candidatura excluída com sucesso' } }));
                navigate('/candidaturas');
              }}
              aria-label="Confirmar exclusão"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
      <Modal open={editOpen} onClose={() => setEditOpen(false)} ariaLabel="Editar candidatura">
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold mb-4">Editar Candidatura</h3>
          <Suspense fallback={<div className="p-4 text-sm text-gray-500">Carregando…</div>}>
            <CandidaturaForm
              initial={{
                id: candidatura.id,
                title: candidatura.vaga,
                company: candidatura.empresa,
                createdAt: candidatura.data,
                source: candidatura.fonte,
                status: candidatura.status,
                link: candidatura.link || ''
              }}
              onCancel={() => setEditOpen(false)}
              onSave={(payload) => {
                api.updateCandidatura(candidatura.id, payload);
                setCandidatura(prev => ({
                  ...prev,
                  vaga: payload.title,
                  empresa: payload.company,
                  data: payload.createdAt,
                  fonte: payload.source,
                  status: payload.status,
                  link: payload.link || ''
                }));
                window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Candidatura atualizada' } }));
                setEditOpen(false);
              }}
            />
          </Suspense>
        </div>
      </Modal>
    </div>
  );
};

export default CandidaturaDetalhes;