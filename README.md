# User CRUD

Aplicação fullstack de cadastro de pessoas com operações de **Listar, Criar, Editar e Excluir**.

**Backend:** Node.js · NestJS · MongoDB (Mongoose) · TypeScript  
**Frontend:** Vue 3 · Pinia · TanStack Query · Tailwind CSS · TypeScript

---

## Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/installation) >= 8
- [Docker](https://www.docker.com/) e Docker Compose (para subir o banco de dados)

---

## Estrutura do projeto

```
User-CRUD/
├── backend/    # API REST com NestJS
└── frontend/   # Interface com Vue 3
```

---

## 1. Banco de dados (MongoDB via Docker)

Dentro da pasta `backend/`, crie um arquivo `.env` com as variáveis abaixo:

```env
# backend/.env

URI_MONGO=mongodb://root:root@localhost:27017/user-crud?authSource=admin
PORT=3000
ORIGIN_CORS=http://localhost:5173

# Usadas pelo Docker Compose
USER_DB=root
DB_NAME=user-crud
```

Com o arquivo `.env` criado, suba o MongoDB:

```bash
cd backend
docker compose up -d
```

Isso inicia um container MongoDB na porta `27017`. Os dados são persistidos na pasta `backend/data/` (ignorada pelo git).

---

## 2. Backend

```bash
cd backend

# Instalar dependências
pnpm install

# Rodar em modo desenvolvimento (hot reload)
pnpm run start:dev
```

A API ficará disponível em: `http://localhost:3000`

### Endpoints disponíveis

| Método   | Rota            | Descrição               |
| -------- | --------------- | ----------------------- |
| `GET`    | `/api/user`     | Lista todos os usuários |
| `GET`    | `/api/user/:id` | Busca um usuário por ID |
| `POST`   | `/api/user`     | Cria um novo usuário    |
| `PATCH`  | `/api/user/:id` | Atualiza um usuário     |
| `DELETE` | `/api/user/:id` | Remove um usuário       |

### Exemplo de payload (POST /api/user)

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678900",
  "birthDate": "1990-05-20",
  "phone": "11999999999"
}
```

> **Nota:** `cpf` e `phone` devem ser enviados **sem máscara** (apenas dígitos). A formatação visual é aplicada pelo frontend.

---

## 3. Frontend

Em uma nova aba do terminal:

```bash
cd frontend

# Instalar dependências
pnpm install

# Rodar em modo desenvolvimento
pnpm run dev
```

A aplicação ficará disponível em: `http://localhost:5173`

### Variável de ambiente (opcional)

Por padrão, o frontend aponta para `http://localhost:3000`. Para alterar, crie um arquivo `.env` na pasta `frontend/`:

```env
# frontend/.env
VITE_API_URL=http://localhost:3000
```

---

## 4. Rodando os testes (Backend)

```bash
cd backend

# Testes unitários
pnpm run test

# Testes com cobertura
pnpm run test:cov

# Testes E2E
pnpm run test:e2e
```

---

## Resumo rápido

```bash
# Terminal 1 — banco de dados
cd backend && docker compose up -d

# Terminal 2 — backend
cd backend && pnpm install && pnpm run start:dev

# Terminal 3 — frontend
cd frontend && pnpm install && pnpm run dev
```

Acesse `http://localhost:5173` e a aplicação estará pronta para uso.

---

# 👨‍💻 Autor

**Luis Fernando Silva Ferreira**  
Desenvolvedor Back-end / Full Stack

GitHub: https://github.com/LuisFernando12/

---

# 📄 Licença

Projeto desenvolvido para fins técnicos e educacionais.
