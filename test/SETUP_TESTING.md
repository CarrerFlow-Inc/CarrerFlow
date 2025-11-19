# Guia de Testes – CarrerFlow

Este documento define como serão estruturados testes no projeto.

## Estrutura inicial recomendada


## Testes por camada

### Frontend
- Framework sugerido: **Vitest + React Testing Library**
- Testar:
  - componentes
  - hooks
  - páginas e navegação

### Backend (Node)
- Framework: **Jest + Supertest**
- Testar:
  - rotas
  - autenticação
  - validação de inputs
  - integração com banco

### Microserviços Python
- Framework: **Pytest**
- Testar:
  - métricas
  - funções de análise
  - endpoints FastAPI

---

## Comandos iniciais

### Node
```bash
npm install jest supertest --save-dev
