# 🤝 Guia de Contribuição

Obrigado por querer contribuir com este projeto!
Aqui seguem as diretrizes e boas práticas para colaboração dentro do **monorepo**.

---

## 📂 Estrutura do Repositório

O repositório é organizado em pastas principais para manter a separação entre as áreas:

* `frontend/` → Código do cliente (UI/UX).
* `backend/` → Backend principal (NestJS).
* `microservices/` → Microserviços independentes.
* `docs/` → Documentação geral e técnica.
* `scripts/` → Scripts auxiliares.

👉 **Regra básica**: Trabalhe **somente na pasta que diz respeito à sua equipe**.
Exemplo:

* Time Frontend → somente em `/frontend`
* Time Backend → somente em `/backend`
* Time de Microserviços → somente em `/microservices`
* Time de Documentação → somente em `/docs`

---

## 🌿 Fluxo de Branches

Adotamos o seguinte modelo simplificado de branches:

* **main** → Branch estável e de produção. Não faça commits diretos aqui.
* **dev** → Branch de integração, onde novas features são juntadas e testadas.
* **feature/** → Branches de funcionalidades específicas. Criadas a partir de `dev`.
* **hotfix/** → Correções urgentes que partem de `main`.

### 📌 Convenções de nomenclatura

* `feature/frontend-login`
* `feature/backend-authentication`
* `feature/microservice-reporting`
* `hotfix/fix-login-bug`

---

## 🔄 Como Contribuir

1. **Clone apenas a pasta do seu time** (opcional, usando sparse-checkout):

   ```bash
   git clone --no-checkout <URL_DO_REPO>
   cd <nome_do_repo>
   git sparse-checkout init --cone
   git sparse-checkout set frontend   # ou backend, ou microservices/serviceX
   ```

   * Para trocar a pasta no futuro:

     ```bash
     git sparse-checkout set backend
     ```
   * Para voltar a baixar o repositório completo:

     ```bash
     git sparse-checkout disable
     ```

2. **Crie uma branch nova** baseada em `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/nome-da-feature
   ```

3. **Implemente suas mudanças** apenas dentro da pasta da sua equipe.

4. **Faça commits claros**:

   ```bash
   git commit -m "frontend: adiciona tela de login com validação"
   ```

   > Prefixe a mensagem com o contexto: `frontend:`, `backend:`, `microservice:`, `docs:`.

5. **Envie a branch para o repositório remoto**:

   ```bash
   git push origin feature/nome-da-feature
   ```

6. **Abra um Pull Request** para `dev`, vinculando-o a uma *issue* correspondente.

7. Espere a revisão do time antes de mergear.

---

## 🧩 Boas Práticas

* **Organização de pastas**

  * Não misture arquivos do backend dentro de `frontend/` e vice-versa.
  * Microserviços devem ser **totalmente isolados** dentro de suas próprias pastas.

* **Documentação**

  * Qualquer alteração relevante deve ser refletida em `/docs`.
  * Se adicionar uma nova API, atualize a documentação de endpoints.

* **Commits pequenos e claros**

  * Prefira vários commits pequenos e explicativos a um commit único gigante.

* **Pull Requests revisados**

  * Todo PR deve ser revisado por pelo menos 1 colega de equipe.

---

## 📋 Exemplo de Fluxo Completo

1. Backend precisa criar autenticação → abre issue **#12 Criar autenticação JWT**.
2. Desenvolvedor cria branch:

   ```bash
   git checkout -b feature/backend-auth-jwt dev
   ```
3. Implementa no `backend/`, commita e faz push.
4. Abre PR para `dev` e vincula à issue #12.
5. Outro colega revisa, aprova e mergeia.
6. A cada sprint, `dev` é integrado e testado, e depois vai para `main`.

---

## ✅ Resumindo

* Trabalhe **apenas na sua pasta**.
* Clone apenas a pasta do seu time se desejar (sparse-checkout).
* Crie branches a partir de `dev`.
* Commits claros e organizados.
* Sempre use PRs vinculados a issues.
* Documente suas alterações.

Assim, garantimos **organização, clareza e colaboração eficiente** entre os times. 🚀
