```mermaid
erDiagram

    users {
        UUID id PK
        VARCHAR name
        VARCHAR email
        TEXT password_hash
        TIMESTAMP created_at
    }

    applications {
        UUID id PK
        UUID user_id FK
        VARCHAR company
        VARCHAR job_title
        VARCHAR status
        TEXT link
        DATE applied_at
        TIMESTAMP created_at
    }

    notes {
        UUID id PK
        UUID application_id FK
        TEXT content
        TIMESTAMP created_at
    }

    contacts {
        UUID id PK
        UUID application_id FK
        VARCHAR name
        VARCHAR email
        VARCHAR phone
        TIMESTAMP created_at
    }

    reminders {
        UUID id PK
        UUID application_id FK
        TIMESTAMP remind_at
        TIMESTAMP created_at
    }

    users ||--o{ applications : "possui várias"
    applications ||--o{ notes : "possui"
    applications ||--o{ contacts : "possui"
    applications ||--o{ reminders : "possui"


# 📌 **2. Arquitetura Geral – Diagrama Mermaid**

```md
```mermaid
flowchart LR

subgraph Frontend [Frontend - React]
    UI[React UI / Dashboard]
    Fetch[React Query / Axios]
end

subgraph Backend [Backend - Node.js]
    API[REST API - Express/NestJS]
    Auth[Auth / JWT]
    Orchestrator[Orquestração de Microserviços]
end

subgraph Database [PostgreSQL]
    DB[(PostgreSQL)]
end

subgraph ML [Microserviços Python]
    DS[Data Science Service\n(Pandas, sklearn)]
    NLP[Sentiment Analysis\nTransformers]
    AI[LlamaIndex / LangChain\nAgente RAG]
end

UI --> Fetch --> API
API --> DB
API --> Orchestrator

Orchestrator --> DS
Orchestrator --> NLP
Orchestrator --> AI

DS --> DB
NLP --> DB
AI --> DB

---

# 📌 **3. Scripts iniciais de Testes**

## **3.1 Teste Backend (Node + Supertest + Jest)**  
Criar arquivo:

### `test/backend/sample.test.js`

```js
const request = require("supertest");
const app = require("../../src/app"); // ajuste conforme seu projeto

describe("API Healthcheck", () => {
  it("should return status 200", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });
});
