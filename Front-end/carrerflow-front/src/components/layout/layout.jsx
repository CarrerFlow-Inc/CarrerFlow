import React, { useEffect, useState, useRef } from "react";
import { X } from 'lucide-react';
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./header";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Lock body scroll when mobile drawer (sidebar) is open on small screens
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    if (isMobile && mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
    // Ensure scroll is restored when closing or when not on mobile
    document.body.style.overflow = "";
    return undefined;
  }, [mobileOpen]);
  const skipRef = useRef(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const { type = 'info', message = '' } = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000); // auto-dismiss 4s
    }
    window.addEventListener('toast:show', onToast);
    return () => window.removeEventListener('toast:show', onToast);
  }, []);

  function toneStyles(t) {
    if (t === 'success') return 'bg-green-600 text-white';
    if (t === 'error') return 'bg-red-600 text-white';
    if (t === 'info') return 'bg-gray-900 text-white';
    return 'bg-gray-800 text-white';
  }
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Skip to content link */}
      <a
        href="#main-content"
        ref={skipRef}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity"
      >
        Ir para conteúdo principal
      </a>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          onMenuClick={() => setMobileOpen(true)}
        />
        <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </div>
        </main>
        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-3 w-72" aria-live="polite" aria-atomic="true">
          {toasts.map(t => (
            <div key={t.id} className={`relative rounded-lg shadow-lg px-4 py-3 text-sm flex items-start gap-3 ${toneStyles(t.type)} transition-opacity`}>
              <div className="flex-1">
                <p className="font-medium capitalize">{t.type === 'info' ? 'Informação' : t.type}</p>
                <p className="mt-0.5 leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                className="p-1 rounded hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Fechar aviso"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
