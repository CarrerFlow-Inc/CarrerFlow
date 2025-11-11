import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/card";
import Badge from "../ui/badge";
import Button from "../ui/button";
import { Table, THead, TBody, TRow, THeadCell, TCell } from "../ui/table";
import { getStatusTone, getStatusLabel } from "../../utils/statusColors";

export default function CandidaturasRecentesTable({ items = [] }) {
  const navigate = useNavigate();

  return (
    <Card className="mt-6" title="Candidaturas Recentes">
      <Table>
        <THead>
          <TRow hover={false}>
            <THeadCell>Vaga</THeadCell>
            <THeadCell>Data Aplicação</THeadCell>
            <THeadCell>Empresa</THeadCell>
            <THeadCell>Local</THeadCell>
            <THeadCell>Status</THeadCell>
            <THeadCell align="right">Opções</THeadCell>
          </TRow>
        </THead>
        <TBody>
          {items.length === 0 && (
            <TRow hover={false}>
              <TCell align="center" colSpan={6}>
                <span className="type-subtle">Nenhuma candidatura</span>
              </TCell>
            </TRow>
          )}
          {items.map((it) => (
            <TRow key={it.id}>
              <TCell>
                <div className="text-gray-900 font-medium">{it.title}</div>
                <div className="type-caption mt-0.5">{it.company}</div>
              </TCell>
              <TCell>
                <span className="type-caption">{(new Date(it.date || it.createdAt)).toLocaleDateString()}</span>
              </TCell>
              <TCell className="type-body-sm">{it.company}</TCell>
              <TCell className="type-caption">{it.location || "Remoto"}</TCell>
              <TCell>
                <Badge tone={getStatusTone(it.status)}>
                  {getStatusLabel(it.status)}
                </Badge>
              </TCell>
              <TCell align="right">
                <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => navigate(`/candidaturas/${it.id}`)} aria-label={`Ver detalhes de ${it.title}`}>Detalhes</Button>
              </TCell>
            </TRow>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}
