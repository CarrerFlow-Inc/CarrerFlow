import React from "react";
import Badge from "../ui/badge";
import { getStatusTone, STATUS_LABELS } from "../../utils/statusColors";

export default function KanbanBoard({ items = [], onMove, onCardClick }) {
  const groups = STATUS_LABELS.reduce((acc, label) => {
    acc[label] = [];
    return acc;
  }, {});
  items.forEach((it) => {
    const key = STATUS_LABELS.includes(it.status) ? it.status : STATUS_LABELS[0];
    groups[key].push(it);
  });

  const [draggingId, setDraggingId] = React.useState(null);
  const [overCol, setOverCol] = React.useState(null);

  function handleDrop(e, status) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onMove && onMove(id, status);
    setOverCol(null);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {STATUS_LABELS.map((label) => {
        const tone = getStatusTone(label);
        const list = groups[label] || [];
        return (
          <div key={label}
               onDragOver={(e) => { e.preventDefault(); setOverCol(label); }}
               onDragEnter={() => setOverCol(label)}
               onDragLeave={() => setOverCol(null)}
               onDrop={(e) => handleDrop(e, label)}
               className={`rounded-2xl border bg-white overflow-hidden transition-shadow ${overCol===label ? 'ring-2 ring-indigo-500/30' : ''}`}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: tone.background, borderBottom: `1px solid ${tone.border}` }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tone.text }} aria-hidden="true"></span>
                <span className="type-body-sm" style={{ color: tone.text }}>{label}</span>
              </div>
              <Badge tone={tone}>{list.length}</Badge>
            </div>
            <div className="p-3 space-y-3 min-h-[120px]">
              {list.map((it) => (
       <div key={it.id}
                     draggable
                     onDragStart={(e) => { e.dataTransfer.setData('text/plain', it.id); setDraggingId(it.id); }}
                     onDragEnd={() => setDraggingId(null)}
         onClick={() => onCardClick && onCardClick(it)}
                     role="button"
                     tabIndex={0}
                     onKeyDown={(e) => {
                       if (!onCardClick) return;
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         onCardClick(it);
                       }
                     }}
                     aria-label={`Abrir detalhes: ${it.title} na ${it.company}`}
                    className={`rounded-xl border p-3 bg-white hover:shadow-sm cursor-grab focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:cursor-grabbing transition-transform ${draggingId===it.id ? 'opacity-70 scale-[0.98]' : ''}`}
                     style={{ borderColor: tone.border }}>
                  <div className="font-medium text-gray-900">{it.title}</div>
                  <div className="type-caption">{it.company}</div>
                  <div className="type-caption">{new Date(it.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="type-caption text-center text-gray-400">Sem itens</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
