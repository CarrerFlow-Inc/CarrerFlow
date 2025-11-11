import React from "react";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4 w-full px-4 py-4">
        <div className="flex items-center gap-3 min-w-[56px]">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-11 min-h-11"
            onClick={onMenuClick}
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-11 min-h-11" aria-label="Notificações" title="Notificações">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.name || "Usuário"}
              </div>
              <div className="type-caption">
                {user?.email || "usuario@exemplo.com"}
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40" aria-label="Abrir menu de usuário" title="Perfil" type="button">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
