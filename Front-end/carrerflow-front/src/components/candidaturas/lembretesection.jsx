import React, { useState } from 'react';
import { Bell, Calendar, AlertTriangle } from 'lucide-react';
import Button from '../ui/button';

const LembreteSection = ({ lembrete, onSetLembrete, containerId = "lembrete-section" }) => {
  const [dataLembrete, setDataLembrete] = useState(lembrete ? lembrete.split('T')[0] : '');

  const handleSave = () => {
    if (dataLembrete) {
      onSetLembrete(new Date(dataLembrete).toISOString());
    }
  };

  const isTodayOrPast = lembrete && new Date(lembrete) <= new Date();
  const soon = lembrete && !isTodayOrPast && (new Date(lembrete) - new Date() < 1000 * 60 * 60 * 24 * 2);

  return (
    <div id={containerId} className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Bell className="mr-2" size={18} />
        Lembrete de Acompanhamento
      </h3>

      {lembrete && (
        <div className={`mb-4 p-3 rounded-md flex items-start gap-2 ${isTodayOrPast ? 'bg-yellow-100 border-l-4 border-yellow-500' : soon ? 'bg-orange-50 border-l-4 border-orange-400' : 'bg-gray-50'}`}>
          <AlertTriangle className={`${isTodayOrPast ? 'text-yellow-600' : soon ? 'text-orange-500' : 'text-gray-400'}`} size={16} />
          <div>
            <p className="text-sm font-medium">
              {isTodayOrPast ? 'Hoje é o dia do lembrete!' : 'Próximo lembrete:'}
            </p>
            <p className="text-sm">
              {new Date(lembrete).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dataLembrete}
          onChange={(e) => setDataLembrete(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button
          onClick={handleSave}
          variant="charcoal"
          aria-label="Definir lembrete"
          disabled={!dataLembrete}
          className="text-sm"
        >
          Definir
        </Button>
      </div>
    </div>
  );
};

export default LembreteSection;