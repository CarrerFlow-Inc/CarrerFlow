import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Badge from '../ui/badge';
import { getStatusLabel, getStatusTone } from '../../utils/statusColors';
import { Table, THead, TBody, TRow, THeadCell, TCell } from '../ui/table';

const CandidaturaList = ({ candidaturas, onEdit, onDelete, onView }) => {
  return (
    <div>
      <Table>
        <THead>
          <TRow hover={false}>
            <THeadCell>Vaga</THeadCell>
            <THeadCell>Empresa</THeadCell>
            <THeadCell>Data</THeadCell>
            <THeadCell>Status</THeadCell>
            <THeadCell>Ações</THeadCell>
          </TRow>
        </THead>
        <TBody>
          {candidaturas.length === 0 && (
            <TRow hover={false}>
              <TCell colSpan={5} align="center">
                <span className="type-subtle">Nenhuma candidatura encontrada</span>
              </TCell>
            </TRow>
          )}
          {candidaturas.map((c) => (
            <TRow key={c.id}>
              <TCell>
                <span className="font-medium text-gray-900">{c.vaga}</span>
              </TCell>
              <TCell>{c.empresa}</TCell>
              <TCell>{new Date(c.data).toLocaleDateString('pt-BR')}</TCell>
              <TCell>
                <Badge tone={getStatusTone(c.status)}>
                  {getStatusLabel(c.status)}
                </Badge>
              </TCell>
              <TCell>
                <div className="flex items-center gap-2">
                  <button onClick={() => onView(c)} className="text-blue-600 hover:text-blue-900" aria-label={`Ver candidatura ${c.vaga}`}>
                    <Eye size={16} />
                  </button>
                  <button onClick={() => onEdit(c)} className="text-gray-600 hover:text-gray-900" aria-label={`Editar candidatura ${c.vaga}`}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-900" aria-label={`Excluir candidatura ${c.vaga}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </TCell>
            </TRow>
          ))}
        </TBody>
      </Table>
    </div>
  );
};

export default CandidaturaList;