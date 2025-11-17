import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/ui/card";
import Button from "../components/ui/button";
import Badge from "../components/ui/badge";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/ui/modal";
import CandidaturaForm from "../components/candidaturas/candidaturaform";
import Pagination from "../components/ui/pagination";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import SectionHeader from "../components/ui/sectionheader";
import Skeleton from "../components/ui/skeleton";
import { STATUS_LABELS, getStatusTone, getStatusLabel } from "../utils/statusColors";
import KanbanBoard from "../components/candidaturas/kanbanboard";

export default function Candidaturas() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, perPage: 6, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [sort, setSort] = useState('recent');

  // Tracks whether we should show an informational toast after data reload
  // null = none, 'status' = status column move, 'edit' = form edit
  const [pendingInfoToast, setPendingInfoToast] = useState(null);

  async function fetchList(opts = {}) {
    if (!user) return;
    setLoading(true);
    try {
      const effectivePage = viewMode === 'kanban' ? 1 : (opts.page || page);
      const effectivePerPage = viewMode === 'kanban' ? 1000 : (opts.perPage || meta.perPage);
      const res = api.getCandidaturas(user.id, { page: effectivePage, perPage: effectivePerPage, status: statusFilter || null, q: (opts.q ?? query) || null, sort: opts.sort || sort });
      setItems(res.items);
      setMeta(res.meta);
      if (pendingInfoToast) {
        const msg = pendingInfoToast === 'status'
          ? 'Status atualizado'
          : pendingInfoToast === 'edit'
            ? 'Candidatura atualizada'
            : 'Dados atualizados';
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'info', message: msg } }));
        setPendingInfoToast(null);
      }
    } catch {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'error', message: 'Falha ao carregar. Verifique sua conexão e tente novamente.' } }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchList({ page: 1, q: query });
    }, 250);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Refetch on status filter change (no info toast)
  useEffect(() => {
    setPage(1);
    fetchList({ page: 1 });
    // eslint-disable-next-line
  }, [statusFilter]);

  useEffect(() => {
    fetchList({ page });
    // eslint-disable-next-line
  }, [page]);

  // Refetch switching view mode; reset to first page
  useEffect(() => {
    setPage(1);
    fetchList({ page: 1 });
    // eslint-disable-next-line
  }, [viewMode]);

  useEffect(() => {
    const v = localStorage.getItem('cf_view_mode');
    if (v === 'list' || v === 'kanban') setViewMode(v);
  }, []);
  useEffect(() => {
    localStorage.setItem('cf_view_mode', viewMode);
  }, [viewMode]);

  function handleOpenCreate() {
    setEditing(null);
    setOpenModal(true);
  }

  function handleEdit(item) {
    setEditing(item);
    setOpenModal(true);
  }

  const [deleteItem, setDeleteItem] = useState(null);
  const [undoData, setUndoData] = useState({ item: null, timer: null });
  function handleDelete(itemId) {
    setDeleteItem(items.find(i => i.id === itemId) || { id: itemId });
  }
  function confirmDelete() {
    if (!deleteItem) return;
    const deleted = items.find(i => i.id === deleteItem.id) || null;
    api.deleteCandidatura(deleteItem.id);
    window.dispatchEvent(new Event('candidatura:deleted'));
    setDeleteItem(null);
    fetchList({ page });
    if (undoData.timer) clearTimeout(undoData.timer);
    const t = setTimeout(() => setUndoData({ item: null, timer: null }), 5000);
    setUndoData({ item: deleted, timer: t });
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'info', message: 'Candidatura excluída. Desfazer?' } }));
  }
  function cancelDelete() { setDeleteItem(null); }

  function handleUndo() {
    if (!undoData.item || !user) return;
    const { title, company, location, status, source, link } = undoData.item;
    api.createCandidatura(user.id, { title, company, location, status, source, link });
    window.dispatchEvent(new Event('candidatura:updated'));
    if (undoData.timer) clearTimeout(undoData.timer);
    setUndoData({ item: null, timer: null });
    fetchList({ page: 1 });
    setPage(1);
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Candidatura restaurada' } }));
  }

  function handleSave(payload) {
    try {
      if (editing && editing.id) {
        api.updateCandidatura(editing.id, payload);
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Candidatura atualizada com sucesso' } }));
        setPendingInfoToast('edit');
      } else {
        api.createCandidatura(user.id, payload);
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Candidatura salva com sucesso' } }));
      }
      window.dispatchEvent(new Event('candidatura:updated'));
      setOpenModal(false);
      setEditing(null);
      setPage(1);
      fetchList({ page: 1 });
  } catch {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'error', message: 'Não foi possível salvar. Tente novamente' } }));
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchList({ page: 1, q: query });
  }

  function handleMove(id, newStatus) {
    const target = items.find(i => i.id === id);
    if (!target) return;
    try {
      api.updateCandidatura(id, { status: newStatus });
      window.dispatchEvent(new Event('candidatura:updated'));
      setPendingInfoToast('status');
      fetchList({ page });
    } catch {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'error', message: 'Não foi possível mover. Tente novamente.' } }));
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new')) {
      setEditing(null);
      setOpenModal(true);
      params.delete('new');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col gap-4 xl:gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Candidaturas</h1>
              <p className="type-body-sm text-gray-600 mt-1">{meta.total} registros • modo {viewMode === 'list' ? 'lista' : 'kanban'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md overflow-hidden">
                <button type="button" onClick={() => setViewMode('list')} aria-pressed={viewMode==='list'} className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode==='list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Lista</button>
                <button type="button" onClick={() => setViewMode('kanban')} aria-pressed={viewMode==='kanban'} className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode==='kanban' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Kanban</button>
              </div>
              <div className="hidden md:block">
                <Button onClick={handleOpenCreate} variant="charcoal" aria-label="Nova candidatura" title="Nova candidatura">Nova Candidatura</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-3">
              <div className="flex flex-1 items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500/40">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por empresa ou vaga..."
                  className="flex-1 outline-none text-sm"
                  aria-label="Buscar candidaturas"
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); }} className="text-xs text-gray-500 hover:text-gray-700">Limpar</button>
                )}
              </div>
              <button
                type="submit"
                className="btn-hover touch-target inline-flex items-center justify-center h-10 px-4 border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Executar busca"
                title="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white w-full sm:w-auto">
                <option value="">Todos os status</option>
                {STATUS_LABELS.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); fetchList({ page:1, sort:e.target.value, triggerInfoToast: true }); }} className="border rounded-md px-3 py-2 text-sm bg-white w-full sm:w-auto">
                <option value="recent">Mais Recentes</option>
                <option value="oldest">Mais Antigas</option>
                <option value="company">Empresa (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2" />
      <Card>
  <div className="type-body-sm text-gray-600 mb-3">Lista de candidaturas</div>

        {loading ? (
          viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_,i) => (
                <div key={i} className="rounded-2xl border bg-white p-4 space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((__,j) => (
                      <div key={j} className="border rounded-xl p-3 space-y-2">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: meta.perPage }).map((_,i) => (
                <div key={i} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : items.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Nada encontrado</h3>
            <p className="type-body-sm text-gray-600 max-w-sm">Tente remover filtros ou ajustar sua busca. Se voc9 ainda n9 adicionou nenhuma candidatura, comece agora.</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                aria-label="Limpar filtros"
                onClick={() => { setStatusFilter(''); setQuery(''); setSort('recent'); setPage(1); fetchList({ page:1, q:'', sort:'recent' }); }}
                className="text-sm"
              >Limpar filtros</Button>
              <div className="hidden md:block">
                <Button onClick={handleOpenCreate} variant="charcoal" aria-label="Nova candidatura" title="Nova candidatura">Nova Candidatura</Button>
              </div>
            </div>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard items={items} onMove={handleMove} onCardClick={(i) => navigate(`/candidaturas/${i.id}`)} />
        ) : (
          <div className="space-y-3">
            {items.map(i => (
              <div key={i.id} className="flex items-center justify-between border rounded-md p-3">
                <button
                  type="button"
                  onClick={() => navigate(`/candidaturas/${i.id}`)}
                  className="text-left"
                  aria-label={`Ver detalhes da candidatura ${i.title}`}
                >
                  <div className="font-medium underline decoration-transparent hover:decoration-gray-400 transition-colors">{i.title}</div>
                  <div className="type-body-sm text-gray-600">{i.company} • {i.location || "Remoto"}</div>
                </button>
                <div className="flex items-center gap-3">
                  <div className="type-caption">{new Date(i.createdAt).toLocaleDateString()}</div>
                  <Badge tone={getStatusTone(i.status)}>
                    {getStatusLabel(i.status)}
                  </Badge>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="btn-hover touch-target inline-flex items-center justify-center w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                      aria-label="Editar candidatura"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="btn-hover touch-target inline-flex items-center justify-center w-9 h-9 border border-gray-200 rounded-md bg-white text-red-600 hover:bg-gray-50"
                      aria-label="Excluir candidatura"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Excluir</span>
                    </button>
                    <button
                      onClick={() => navigate(`/candidaturas/${i.id}`)}
                      className="btn-hover touch-target inline-flex items-center justify-center w-9 h-9 border border-gray-200 rounded-md bg-white text-blue-600 hover:bg-gray-50"
                      aria-label="Ver detalhes da candidatura"
                      title="Detalhes"
                    >
                      <span className="text-xs font-medium">Ver</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode !== 'kanban' && (
          <Pagination meta={meta} onChange={(p) => setPage(p)} />
        )}
      </Card>

      <Modal open={openModal} onClose={() => { setOpenModal(false); setEditing(null); }} ariaLabel={editing ? "Editar candidatura" : "Nova candidatura"}>
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold mb-4">{editing ? "Editar Candidatura" : "Nova Candidatura"}</h3>
          <CandidaturaForm initial={editing || {}} onCancel={() => { setOpenModal(false); setEditing(null); }} onSave={handleSave} />
        </div>
      </Modal>

      <Modal open={!!deleteItem} onClose={cancelDelete} ariaLabel="Confirmar exclusão">
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold mb-2">Tem certeza que deseja excluir esta candidatura?</h3>
          {deleteItem && (
            <p className="type-body-sm text-gray-600 mb-4">
              {deleteItem.title ? (<>
                <strong>{deleteItem.title}</strong>{deleteItem.company ? ` • ${deleteItem.company}` : ''}
              </>) : 'Esta candidatura'}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={cancelDelete} aria-label="Cancelar exclusão">Cancelar</Button>
            <Button type="button" variant="danger" onClick={confirmDelete} aria-label="Confirmar exclusão">Excluir</Button>
          </div>
        </div>
      </Modal>
      {undoData.item && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 bg-gray-900 text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
          <span className="type-body-sm">Candidatura excluída</span>
          <button onClick={handleUndo} className="underline">Desfazer</button>
        </div>
      )}
      <button
        type="button"
        onClick={handleOpenCreate}
        className="md:hidden fixed bottom-5 right-5 z-40 bg-gray-900 text-white w-14 h-14 sm:h-12 sm:px-4 sm:w-auto rounded-full flex items-center justify-center shadow-2xl btn-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
        aria-label="Adicionar candidatura"
        title="Adicionar candidatura"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden sm:inline ml-2 text-sm font-medium">Nova</span>
        <span className="sr-only">Adicionar candidatura</span>
      </button>
    </div>
  );
}