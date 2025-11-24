# CarrerFlow Frontend

Aplicação web para organizar e acompanhar candidaturas de emprego: registro, visualização em lista ou Kanban, métricas, lembretes e anotações rápidas.

## Visão Geral

- Cadastro e login simples com recuperação de senha (simulada).
- Dashboard com estatísticas, distribuição por status e lembrete mais próximo.
- Gerenciamento de candidaturas: criação, edição, exclusão, busca, filtros, ordenação e mudança de status.
- Modos Lista e Kanban para diferentes formas de acompanhamento.
- Página de detalhes com anotações, contatos e lembrete persistente.
- Lazy loading de componentes pesados (gráficos, slider, formulários) para melhorar carregamento.

## Principais Tecnologias

- React + Vite
- React Router (rotas protegidas e divisão de código)
- Tailwind CSS (estilização utilitária)
- Recharts (gráficos) e Swiper (slider de onboarding)

## Scripts

- `npm install` – instala dependências
- `npm run dev` – ambiente de desenvolvimento
- `npm run build` – build de produção

## Fluxo Básico

1. Cadastre-se ou faça login
2. Adicione candidaturas (data, fonte, status, etc.)
3. Acompanhe métricas no dashboard
4. Use Kanban para movimentar estágios
5. Registre notas, contatos e defina lembretes na página de detalhes

## Status Suportados (exemplos)

Aplicada, Em Análise, Entrevista RH, Entrevista Técnica, Entrevista Agendada, Oferta Recebida, Aceita, Recusada, Não Selecionado.

---
