import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ meta = {}, onChange }) {
  const { page = 1, totalPages = 1 } = meta;

  function goTo(p) {
    if (p < 1 || p > totalPages) return;
    onChange && onChange(p);
  }

  if (totalPages <= 1) return null;

  const makePages = () => {
    const pages = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, start + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = makePages();

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="inline-flex items-center gap-2 w-full justify-between sm:justify-end min-w-max">
      <button
        onClick={() => goTo(page - 1)}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed btn-hover touch-target"
        disabled={page === 1}
        aria-label="Anterior"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {page > 2 && (
        <button
          onClick={() => goTo(1)}
          className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 btn-hover touch-target"
        >
          1
        </button>
      )}
      {page > 3 && <span className="px-1 text-gray-400">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          aria-current={p === page ? "page" : undefined}
          className={`px-3 py-2 rounded-md text-sm btn-hover touch-target ${
            p === page
              ? "bg-indigo-600 text-white border border-indigo-600"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      {page < totalPages - 2 && <span className="px-1 text-gray-400">…</span>}
      {page < totalPages - 1 && (
        <button
          onClick={() => goTo(totalPages)}
          className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 btn-hover touch-target"
        >
          {totalPages}
        </button>
      )}

      <button
        onClick={() => goTo(page + 1)}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed btn-hover touch-target"
        disabled={page === totalPages}
        aria-label="Próxima"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="w-4 h-4" />
      </button>
      </div>
    </div>
  );
}
