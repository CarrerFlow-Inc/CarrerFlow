# CarrerFlow – Arquitetura Geral, Stack e Justificativas

## 1. Visão Geral
A arquitetura é organizada em quatro camadas principais:

1. Frontend (React)
2. Backend principal (Node.js)
3. Banco de Dados (PostgreSQL)
4. Microserviços de Inteligência e Data Science (Python)

---

## 2. Frontend – React
Interface moderna, interativa e orientada a componentes.

### Tecnologias recomendadas
- React + Vite
- React Query (TanStack Query)
- MUI ou TailwindCSS
- Recharts / Chart.js / Plotly.js

---

## 3. Backend – Node.js
Responsável por autenticação, CRUD e orquestração de microserviços.

### Sugestão de frameworks
- Express (leve)
- NestJS (robusto e modular)

### Suporte adicional
- BullMQ (Redis) para filas
- Axios/Fetch para comunicação interna

---

## 4. Banco de Dados – PostgreSQL
Relacional, ACID, suporte avançado para JSONB e queries complexas.

---

## 5. Microserviços Python
Análises, métricas, NLP e inteligência.

### Stack sugerida
- FastAPI
- Pandas / NumPy
- scikit-learn
- sentence-transformers
- HuggingFace Transformers
- LlamaIndex / LangChain (para agente conversacional)

---

## 6. Agente de IA
Permite ao usuário consultar seus dados em linguagem natural.

Exemplos:
- “Quantas candidaturas fiz este mês?”
- “Quais empresas mais responderam?”

---

## 7. Motivos da Stack
| Camada | Tecnologia | Motivo |
|--------|-------------|--------|
| Frontend | React | Produtivo, familiaridade |
| Backend | Node.js | Simples, rápido, equipe domina |
| IA | Python | Stack madura de Data Science |
| Banco | PostgreSQL | Relacional robusto |

---

## 8. Conclusão
A arquitetura mantém modularidade, escalabilidade e flexibilidade para IA.
