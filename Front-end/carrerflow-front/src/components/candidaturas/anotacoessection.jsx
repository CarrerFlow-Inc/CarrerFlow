import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Pencil } from 'lucide-react';
import { formatRelative } from '../../utils/time';

const AnotacoesSection = ({ anotacoes = [], onAddAnotacao, onDeleteAnotacao, onEditAnotacao, containerId = "anotacoes-section", textAreaId = "nova-anotacao" }) => {
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaAnotacao.trim()) {
      onAddAnotacao(novaAnotacao);
      setNovaAnotacao('');
    }
  };

  return (
    <div id={containerId} className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Plus className="mr-2" size={18} />
        Adicionar Anotação
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
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium"
        >
          Salvar Anotação
        </button>
      </form>

      {anotacoes.length === 0 && (
        <div className="mt-2 border border-dashed rounded-md p-4 text-center bg-gray-50">
          <p className="text-sm text-gray-600">Nenhuma anotação ainda. Use o campo acima para registrar aprendizados, feedbacks ou próximos passos.</p>
        </div>
      )}
      {anotacoes.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Anotações Anteriores</h4>
          <div className="space-y-3">
            {[...anotacoes].sort((a,b)=> new Date(b.data) - new Date(a.data)).map((anot, idx) => (
              <div key={idx} className="rounded-lg border px-3 py-2 bg-gray-50 relative">
                {editingIdx === idx ? (
                  <div className="space-y-2">
                    <textarea value={editValue} onChange={(e)=>setEditValue(e.target.value)} className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" rows={3} />
                    <div className="flex gap-2 justify-end">
                      <button onClick={()=>{ setEditingIdx(null); setEditValue(''); }} className="px-2 py-1 text-xs border rounded-md">Cancelar</button>
                      <button onClick={()=>{ onEditAnotacao && onEditAnotacao(idx, editValue); setEditingIdx(null); setEditValue(''); }} className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md">Salvar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-800">{anot.texto}</p>
                    <p className="type-caption flex items-center mt-1">
                      <Calendar size={12} className="mr-1" />
                      {formatRelative(anot.data)}
                    </p>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                      <button onClick={()=>{ setEditingIdx(idx); setEditValue(anot.texto); }} className="p-1 rounded hover:bg-white" aria-label="Editar anotação">
                        <Pencil size={14} className="text-gray-600" />
                      </button>
                      <button onClick={()=>{ if(window.confirm('Excluir anotação?')) onDeleteAnotacao && onDeleteAnotacao(idx); }} className="p-1 rounded hover:bg-white" aria-label="Excluir anotação">
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnotacoesSection;