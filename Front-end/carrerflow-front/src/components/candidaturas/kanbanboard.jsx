import React from "react";
import Badge from "../ui/badge";
import { getStatusTone, STATUS_LABELS } from "../../utils/statusColors";

export default function KanbanBoard({ items = [], onMove, onCardClick, columnMaxHeight = null, shadowThreshold = 1, edgeThreshold = 36, maxAutoScrollSpeed = 18, dimOnlyActiveColumn = true, popOnDrop = true }) {
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
  const isDragging = !!draggingId;
  const [poppedId, setPoppedId] = React.useState(null);

  function KanbanColumn({ label, items }) {
    const tone = getStatusTone(label);
    const over = overCol === label;
    const scrollRef = React.useRef(null);
    const rafRef = React.useRef(null);
    const pointerYRef = React.useRef(null);
    const [showTop, setShowTop] = React.useState(false);
    const [showBottom, setShowBottom] = React.useState(false);

    const updateShadows = React.useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const th = Number(shadowThreshold) || 1;
      setShowTop(scrollTop > th);
      setShowBottom(scrollTop + clientHeight < scrollHeight - th);
    }, [shadowThreshold]);

    React.useEffect(() => {
      updateShadows();
    }, [items, updateShadows]);

    // Autoscroll the column when dragging near top/bottom edges
    const EDGE = Number(edgeThreshold) || 36; // px threshold from edge to start autoscroll
    const MAX_SPEED = Number(maxAutoScrollSpeed) || 18; // px per frame at the very edge
    const tick = React.useCallback(() => {
      const el = scrollRef.current;
      if (!el || !over || !draggingId) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        return;
      }
      const py = pointerYRef.current;
      if (typeof py === 'number') {
        const rect = el.getBoundingClientRect();
        const topDist = py - rect.top;
        const bottomDist = rect.bottom - py;
        let dy = 0;
        if (topDist > 0 && topDist < EDGE) {
          const t = (EDGE - topDist) / EDGE; // 0..1
          dy = -Math.ceil(t * MAX_SPEED);
        } else if (bottomDist > 0 && bottomDist < EDGE) {
          const t = (EDGE - bottomDist) / EDGE; // 0..1
          dy = Math.ceil(t * MAX_SPEED);
        }
        if (dy !== 0) {
          el.scrollTop += dy;
          updateShadows();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, [draggingId, over, updateShadows]);

    const startRaf = React.useCallback(() => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }, [tick]);

    const stopRaf = React.useCallback(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, []);

    React.useEffect(() => {
      // Stop autoscroll when dragging ends or column is no longer overed
      if (!draggingId || !over) {
        stopRaf();
      }
      return () => stopRaf();
    }, [draggingId, over, stopRaf]);

    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOverCol(label);
          pointerYRef.current = e.clientY;
          startRaf();
        }}
        onDragEnter={() => setOverCol(label)}
        onDragLeave={() => { setOverCol(null); stopRaf(); }}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData('text/plain');
          if (id) onMove && onMove(id, label);
          setOverCol(null);
          stopRaf();
          if (popOnDrop && id) {
            setPoppedId(id);
            setTimeout(() => setPoppedId(null), 220);
          }
        }}
        className={`rounded-2xl border bg-white overflow-hidden transition-shadow transition-transform duration-150 ${over ? 'ring-2 ring-indigo-500/30 shadow-sm scale-[1.01]' : ''}`}
      >
        <div
          className="px-4 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{ backgroundColor: tone.background, borderBottom: `1px solid ${tone.border}` }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tone.text }} aria-hidden="true"></span>
            <span className="type-body-sm" style={{ color: tone.text }}>{label}</span>
          </div>
          <Badge tone={tone}>{items.length}</Badge>
        </div>
        <div className="relative">
          {showTop && <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent z-10" />}
          <div
            ref={scrollRef}
            onScroll={updateShadows}
            className="p-3 space-y-3 min-h-[120px] pr-1 pb-2 overflow-y-auto max-h-[55vh] md:max-h-[65vh] lg:max-h-[70vh]"
            style={columnMaxHeight ? { maxHeight: columnMaxHeight } : undefined}
          >
            {/* Animated placeholder remains mounted for smooth height transition */}
            <div className={`${isDragging && over ? 'h-14 my-1' : 'h-0 my-0'} transition-all duration-200 overflow-hidden`}> 
              <div className="h-14 border-2 border-dashed border-indigo-300/70 rounded-xl bg-indigo-50/40" />
            </div>
            {items.map((it) => (
              <div
                key={it.id}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', it.id); setDraggingId(it.id); }}
                onDragEnd={() => { setDraggingId(null); stopRaf(); }}
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
                className={`rounded-xl border p-3 bg-white hover:shadow-md cursor-grab focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:cursor-grabbing transition-all duration-200 ease-out ${draggingId===it.id ? 'opacity-90 scale-[0.97] rotate-[1.5deg] shadow-2xl ring-2 ring-indigo-500/40' : (draggingId && (!dimOnlyActiveColumn || over)) ? 'opacity-60' : ''} ${poppedId===it.id ? 'scale-[1.02] ring-1 ring-indigo-400/30' : ''}`}
                style={{ borderColor: tone.border, willChange: 'transform' }}
              >
                <div className="font-medium text-gray-900">{it.title}</div>
                <div className="type-caption">{it.company}</div>
                <div className="type-caption">{new Date(it.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="type-caption text-center text-gray-400">Sem itens</div>
            )}
          </div>
          {showBottom && <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/5 to-transparent" />}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${isDragging ? 'select-none' : ''}`}>
      {STATUS_LABELS.map((label) => (
        <KanbanColumn key={label} label={label} items={groups[label] || []} />
      ))}
    </div>
  );
}
