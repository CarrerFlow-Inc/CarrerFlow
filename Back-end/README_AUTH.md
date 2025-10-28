# Autenticação e Segurança - CarrerFlow API

## Implementação JWT com Hash + SALT

Este documento descreve a implementação de autenticação e segurança no back-end do CarrerFlow.

## Tecnologias Utilizadas

- **JWT (JSON Web Tokens)**: Para autenticação stateless
- **Bcrypt**: Para hash de senhas com salt automático
- **Passport**: Estratégia de autenticação para NestJS
- **@nestjs/jwt**: Módulo JWT do NestJS
- **@nestjs/passport**: Integração Passport com NestJS

## Estrutura de Arquivos

```
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts          # DTO para login
│   │   └── register.dto.ts       # DTO para registro
│   ├── auth.controller.ts        # Endpoints de autenticação
│   ├── auth.service.ts           # Lógica de autenticação
│   ├── auth.module.ts            # Módulo de autenticação
│   ├── jwt.strategy.ts           # Estratégia JWT do Passport
│   └── jwt-auth.guard.ts         # Guard para proteger rotas
└── users/
    └── entities/
        └── user.entity.ts        # Entidade de usuário
```

## Funcionalidades Implementadas

### 1. Hash de Senhas com SALT

As senhas são hasheadas usando **bcrypt** com 10 rounds de salt:

```typescript
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

O bcrypt automaticamente:
- Gera um salt único para cada senha
- Combina o salt com a senha
- Aplica o algoritmo de hash
- Armazena o salt junto com o hash

### 2. Endpoints de Autenticação

#### POST /auth/register
Registra um novo usuário no sistema.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Autentica um usuário existente.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Proteção de Rotas

As rotas de candidaturas agora estão protegidas com JWT:

```typescript
@UseGuards(JwtAuthGuard)
@Controller('candidaturas')
export class CandidaturasController {
  // Todas as rotas requerem autenticação
}
```

Para acessar rotas protegidas, inclua o token no header:
```
Authorization: Bearer <seu_token_jwt>
```

### 4. Validação de Dados

Validações implementadas:
- **Email**: Deve ser um email válido
- **Senha**: Mínimo de 6 caracteres
- **Nome**: Campo obrigatório

## Configuração

### 1. Variáveis de Ambiente

Atualize o arquivo `.env` com:

```env
#Database
DB_TYPE=sqlite
DB_DATABASE=carrerflow.sqlite

#Server
PORT=3000
NODE_ENV=development

#JWT
JWT_SECRET=your-secret-key-here-change-in-production
```

**IMPORTANTE**: Altere o `JWT_SECRET` para uma chave secreta forte em produção!

### 2. Instalação de Dependências

As seguintes dependências foram instaladas:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/bcrypt @types/passport-jwt
```

## Segurança

### Boas Práticas Implementadas

1. **Hash com Salt**: Cada senha tem um salt único
2. **JWT com Expiração**: Tokens expiram em 1 hora
3. **Validação de Entrada**: Todos os dados são validados
4. **Proteção de Rotas**: Rotas sensíveis requerem autenticação
5. **Senhas Nunca Retornadas**: A senha hasheada nunca é exposta na API

### Recomendações para Produção

1. Use uma chave JWT forte e única
2. Configure HTTPS
3. Implemente rate limiting
4. Adicione refresh tokens
5. Implemente logout (blacklist de tokens)
6. Configure CORS adequadamente
7. Adicione logs de auditoria
8. Implemente 2FA (autenticação de dois fatores)

## Testando a API

### 1. Registrar um Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

### 3. Acessar Rota Protegida

```bash
curl -X GET http://localhost:3000/candidaturas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Fluxo de Autenticação

1. **Registro**:
   - Usuário envia email, senha e nome
   - Sistema valida os dados
   - Senha é hasheada com bcrypt (salt automático)
   - Usuário é salvo no banco
   - JWT é gerado e retornado

2. **Login**:
   - Usuário envia email e senha
   - Sistema busca usuário por email
   - Senha é comparada com bcrypt.compare()
   - Se válida, JWT é gerado e retornado

3. **Acesso a Rotas Protegidas**:
   - Cliente envia JWT no header Authorization
   - JwtAuthGuard valida o token
   - Se válido, extrai dados do usuário
   - Requisição prossegue com dados do usuário

## Estrutura do JWT

O token JWT contém:

```json
{
  "email": "user@example.com",
  "sub": 1,
  "iat": 1234567890,
  "exp": 1234571490
}
```

- **email**: Email do usuário
- **sub**: ID do usuário
- **iat**: Timestamp de emissão
- **exp**: Timestamp de expiração

## Próximos Passos

Melhorias sugeridas:

1. Implementar refresh tokens
2. Adicionar recuperação de senha
3. Implementar verificação de email
4. Adicionar roles e permissões
5. Implementar rate limiting
6. Adicionar logs de auditoria
7. Implementar 2FA
8. Adicionar blacklist de tokens para logout

## Suporte

Para dúvidas ou problemas, consulte a documentação do NestJS:
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [NestJS JWT](https://docs.nestjs.com/security/authentication#jwt-token)
- [Passport JWT](http://www.passportjs.org/packages/passport-jwt/)
