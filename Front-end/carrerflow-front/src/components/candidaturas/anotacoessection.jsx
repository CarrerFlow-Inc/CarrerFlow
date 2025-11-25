import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Pencil, StickyNote } from 'lucide-react';
import { formatRelative } from '../../utils/time';
import Button from '../ui/button';

const MAX_NOTES = 5;
const AnotacoesSection = ({ anotacoes = [], onAddAnotacao, onDeleteAnotacao, onEditAnotacao, containerId = "anotacoes-section", textAreaId = "nova-anotacao" }) => {
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novaAnotacao.trim()) return;
    if (anotacoes.length >= MAX_NOTES) {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'warning', message: `Limite de ${MAX_NOTES} anotações atingido` } }));
      return;
    }
    onAddAnotacao(novaAnotacao.trim());
    setNovaAnotacao('');
  };

  return (
    <div id={containerId} className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <StickyNote className="mr-2" size={18} />
        Anotações
      </h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          id={textAreaId}
          value={novaAnotacao}
          onChange={(e) => setNovaAnotacao(e.target.value)}
          placeholder="Escreva suas observações sobre esta candidatura..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="3"
        />
        <div className="mt-2">
          <Button
            type="submit"
            variant="charcoal"
            aria-label="Salvar anotação"
            disabled={!novaAnotacao.trim() || anotacoes.length >= MAX_NOTES}
            className="text-sm"
          >
            {anotacoes.length >= MAX_NOTES ? 'Limite atingido' : 'Salvar Anotação'}
          </Button>
        </div>
        {anotacoes.length >= MAX_NOTES && (
          <p className="mt-2 text-xs text-red-600">Você atingiu o máximo de {MAX_NOTES} anotações para esta candidatura.</p>
        )}
      </form>

      {anotacoes.length === 0 && (
        <div className="mt-2 border border-dashed rounded-md p-4 text-center bg-gray-50">
          <p className="text-sm text-gray-600">Nenhuma anotação ainda. Use o campo acima para registrar aprendizados, feedbacks ou próximos passos.</p>
        </div>
      )}
      {anotacoes.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Anotações ({anotacoes.length}/{MAX_NOTES})</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {[...anotacoes].sort((a,b)=> new Date(b.data) - new Date(a.data)).map((anot, idx) => {
              const isNew = Date.now() - new Date(anot.data).getTime() < 1500;
              return (
              <div
                key={idx}
                className={`relative group bg-[#FFF9C4] border border-yellow-200 rounded-xl p-3 shadow-sm before:absolute before:-top-2 before:left-3 before:w-5 before:h-5 before:bg-yellow-300 before:rotate-6 before:rounded-sm before:shadow before:opacity-70 transition-colors ${isNew ? 'animate-note-enter' : ''}`}
              >
                {editingIdx === idx ? (
                  <div className="space-y-2" aria-label="Editando anotação">
                    <textarea
                      value={editValue}
                      onChange={(e)=>setEditValue(e.target.value)}
                      className="w-full border border-yellow-300 bg-yellow-50 rounded-md p-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      rows={3}
                      aria-label="Conteúdo da anotação"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={()=>{ setEditingIdx(null); setEditValue(''); }}
                        className="px-2 py-1 text-xs border rounded-md"
                        aria-label="Cancelar edição"
                      >Cancelar</button>
                      <button
                        disabled={!editValue.trim()}
                        onClick={()=>{
                          if(!editValue.trim()) { window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'warning', message: 'Texto vazio não pode ser salvo' } })); return; }
                          onEditAnotacao && onEditAnotacao(idx, editValue.trim());
                          setEditingIdx(null); setEditValue('');
                          window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'success', message: 'Anotação atualizada' } }));
                        }}
                        className="px-2 py-1 text-xs bg-gray-900 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Salvar alterações"
                      >Salvar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-900 whitespace-pre-line min-h-[54px]">{anot.texto}</p>
                    <p className="type-caption flex items-center mt-2 text-yellow-800">
                      <Calendar size={12} className="mr-1" />
                      {formatRelative(anot.data)}
                    </p>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={()=>{ setEditingIdx(idx); setEditValue(anot.texto); }}
                        className="p-1 rounded hover:bg-yellow-200"
                        aria-label="Editar anotação"
                      >
                        <Pencil size={14} className="text-gray-700" />
                      </button>
                      <button
                        onClick={()=>{ if(window.confirm('Excluir anotação?')) { onDeleteAnotacao && onDeleteAnotacao(idx); window.dispatchEvent(new CustomEvent('toast:show', { detail: { type: 'info', message: 'Anotação removida' } })); } }}
                        className="p-1 rounded hover:bg-yellow-200"
                        aria-label="Excluir anotação"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )})}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnotacoesSection;