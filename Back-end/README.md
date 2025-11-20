# 🚀 Back-End do CarrerFlow

Bem-vindo ao **back-end** do CarrerFlow! Esta é a parte do projeto que roda no servidor e cuida da lógica principal, como salvar dados, fazer login e gerenciar candidaturas a vagas de emprego. Usamos o NestJS, uma ferramenta simples para criar APIs (interfaces que conectam o front-end com o banco de dados).

O back-end já tem funcionalidades básicas, como autenticação de usuários e controle de candidaturas. Ele usa um banco de dados SQLite para armazenar as informações.

---

## 🛠️ Como Usar Este Back-End

### 1. Clonar o Projeto
Primeiro, baixe o código do projeto para o seu computador. Você precisa ter o Git instalado (é gratuito e fácil de baixar).

Abra o terminal (no Windows, use o Prompt de Comando) e digite:

```bash
git clone https://github.com/CarrerFlow-Inc/CarrerFlow.git
cd CarrerFlow
```

### 2. Instalar as Dependências
Entre na pasta do back-end e instale as bibliotecas necessárias. Você precisa do Node.js instalado (baixe em nodejs.org).

```bash
cd Back-end
npm install
```

Isso vai baixar tudo que o projeto precisa para funcionar.

### 3. Rodar o Servidor
Para testar o back-end, rode o servidor em modo de desenvolvimento (ele reinicia automaticamente quando você muda o código):

```bash
npm run start:dev
```

O servidor vai ficar rodando em `http://localhost:3000`. Você pode testar as APIs usando ferramentas como Postman ou até o navegador.

Outros comandos úteis:
- `npm run start` - Roda o servidor normalmente.
- `npm run build` - Compila o código para produção.
- `npm run test` - Roda os testes automáticos.

---

## 🤝 Como Contribuir

Quer ajudar a melhorar o back-end? Ótimo! Leia o guia de contribuição na raiz do projeto: [CONTRIBUTING.md](../CONTRIBUTING.md). Lá explica como criar branches, fazer mudanças e enviar pull requests.

Dicas rápidas:
- Trabalhe apenas nesta pasta (Back-end/).
- Teste suas mudanças antes de enviar.
- Use commits claros, como "Adiciona validação no login".

---

## 📂 Estrutura da Pasta

Aqui vai uma explicação simples das pastas dentro de `Back-end/`:

- `src/` - Código principal do back-end.
  - `auth/` - Lógica de login e autenticação.
  - `candidaturas/` - Gerenciamento de candidaturas a vagas.
  - `users/` - Controle de usuários.
  - `app.module.ts` - Arquivo principal que conecta tudo.
- `test/` - Testes automáticos.
- `package.json` - Lista de dependências e comandos.

---

## 📄 Licença

Este projeto usa a licença MIT (livre para usar e modificar).

Se tiver dúvidas, abra uma issue no GitHub ou pergunte no grupo!
