
import React from 'react';
import { Search } from 'lucide-react';
import { STATUS_LABELS } from '../../utils/statusColors';

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  ...STATUS_LABELS.map((label) => ({ value: label, label })),
];

const CandidaturaFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusChange, onSortChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        {/* Campo de Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por empresa ou vaga..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filtro por Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            defaultValue="recent"
          >
            <option value="recent">Mais Recentes</option>
            <option value="oldest">Mais Antigas</option>
            <option value="company">Empresa (A-Z)</option>
          </select>
        </div>

        {/* Botão Nova Candidatura */}
        <button
          onClick={() => {}}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium"
        >
          + Nova Candidatura
        </button>
      </div>
    </div>
  );
};

export default CandidaturaFilters;