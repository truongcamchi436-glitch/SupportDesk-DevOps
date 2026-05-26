# SupportDesk

SupportDesk is a support ticket management platform built to explore role-based access control, RESTful API design, and containerized full-stack infrastructure with Docker.

The server is built using Node.js + Express, communicates with a MongoDB database, and exposes a typed REST API consumed by a React frontend. The application supports two roles, **clients** (who open tickets) and **agents** (who manage and resolve them), with strict permission enforcement across all endpoints.

## 🚀 Technologies

**Backend**
- Node.js + Express 5
- MongoDB 7 + Mongoose 9
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Zod for request validation
- Jest + Supertest for integration testing
- TypeScript + ESM

**Frontend**
- React 19 + TypeScript
- Vite 8
- React Router v7
- TanStack React Query v5
- Styled Components v6
- Axios
- Lucide React (icons)

**Infrastructure**
- Docker + Docker Compose
- Nginx (reverse proxy)

## 🖼 Project Screenshots
<img width="1366" height="720" alt="image" src="https://i.imgur.com/zPxxCk0.png" />
<img width="1366" height="720" alt="image" src="https://i.imgur.com/7CIwg5R.png" />
<img width="1366" height="720" alt="image" src="https://i.imgur.com/WUWEZum.png" />
<img width="1366" height="720" alt="image" src="https://i.imgur.com/w11GC8q.png" />

## 🏗 Architecture

The backend follows a layered architecture:

```
Routes → Controllers → Services → Models
```

- Global error handling via `AppError` + `errorMiddleware`
- MongoDB connection via Mongoose
- JWT authentication via `authenticate` middleware
- Role enforcement via `requireRole` middleware

The frontend is structured around React contexts (`AuthContext`, `ThemeContext`, `ToastContext`) with server state managed by TanStack React Query and routing handled by React Router with protected and public route guards.

## 🐳 Infrastructure with Docker

All services are orchestrated with Docker Compose:

```yaml
services:

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: supportdesk

  backend:
    build: ./backend
    expose:
      - "3000"
    env_file: ./backend/.env
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    expose:
      - "5173"
    depends_on:
      - backend
    environment:
      - BACKEND_URL=http://backend:3000

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - backend
      - frontend

volumes:
  mongo_data:
```

Nginx listens on port 80 and proxies `/api/` requests to the backend on port 3000 and all other requests to the frontend dev server on port 5173 (with WebSocket upgrade support for Vite HMR).

## 🎫 Ticket Lifecycle

Tickets follow a strict state machine with role-based transitions:

| Status | Description |
|--------|-------------|
| `open` | Ticket created by a client, awaiting an agent |
| `in_progress` | An agent has assigned themselves to the ticket |
| `closed` | The assigned agent has resolved the ticket |
| `canceled` | The client who created the ticket has canceled it |

**State transitions:**

| Action | Endpoint | Allowed Role | Condition |
|--------|----------|--------------|-----------|
| Create | `POST /tickets` | client | — |
| Assign | `PATCH /tickets/:id/assign` | agent | Ticket must be open |
| Unassign | `PATCH /tickets/:id/unassign` | agent | Must be the assigned agent |
| Close | `PATCH /tickets/:id/close` | agent | Must be the assigned agent |
| Cancel | `PATCH /tickets/:id/cancel` | client | Must be the ticket creator |
| Comment | `POST /tickets/:id/comments` | client or agent | Ticket must not be closed |

## 📡 REST API

The backend exposes a REST API on port 3000 (proxied via Nginx at `/api/`).

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate and receive a JWT |

### Tickets

All ticket routes require a valid `Authorization: Bearer <token>` header.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/tickets` | any | List tickets (filtered by role) |
| POST | `/tickets` | client | Create a new ticket |
| GET | `/tickets/:id` | any | Get ticket details |
| PATCH | `/tickets/:id/assign` | agent | Assign ticket to self |
| PATCH | `/tickets/:id/unassign` | agent | Unassign self from ticket |
| PATCH | `/tickets/:id/close` | agent | Close an assigned ticket |
| PATCH | `/tickets/:id/cancel` | client | Cancel own ticket |
| POST | `/tickets/:id/comments` | any | Add a comment to a ticket |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Returns API and DB status |

## 🗄 Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `email` | String | Unique, lowercase |
| `password` | String | Hashed with bcrypt (min 6 chars) |
| `role` | Enum | `client` or `agent` |
| `createdAt` | Date | Auto-generated |

> Passwords are stripped from all JSON responses.

### Ticket

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Short description |
| `description` | String | Full problem description |
| `status` | Enum | `open`, `in_progress`, `closed`, `canceled` |
| `priority` | Enum | `low`, `medium`, `high` |
| `createdBy` | ObjectId | Reference to User |
| `assignedTo` | ObjectId | Reference to User (nullable) |
| `comments` | Array | Embedded comment subdocuments |
| `createdAt` | Date | Auto-generated |

### Comment (embedded)

| Field | Type | Description |
|-------|------|-------------|
| `author` | ObjectId | Reference to User |
| `body` | String | Comment text |
| `createdAt` | Date | Auto-generated |

## 🧪 Tests

The backend has integration tests written with Jest and Supertest, covering authentication and the full ticket lifecycle.

```bash
cd backend
npm test
```

Tests run against a separate MongoDB instance defined by `MONGO_TEST_URL`. The database is wiped before each test case to ensure isolation.

**Auth tests cover:** registration, duplicate email rejection, login, and wrong password rejection.

**Ticket tests cover:** creation (client/agent roles), listing, ownership checks, assign/unassign/close/cancel flows, comment permissions, and unauthenticated access.

## 📦 Installation

**1. Clone the repository**

```bash
git clone https://github.com/DavidEricson00/SupportDesk.git
cd SupportDesk
```

**2. Configure the backend environment**

```bash
cp backend/.env.example backend/.env
```

Fill in the values (see [Environment Variables](#️-environment-variables) below).

**3. Start all services**

```bash
docker compose up -d --build
```

The application will be available at `http://localhost`.

**4. (Optional) Run tests**

```bash
cd backend
npm test
```

## ⚙️ Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=

MONGO_URL=
MONGO_TEST_URL=

JWT_SECRET=

NODE_ENV=
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: 3000) |
| `MONGO_URL` | MongoDB connection string for the main database |
| `MONGO_TEST_URL` | MongoDB connection string for the test database |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `NODE_ENV` | Environment (`development`, `production`, `test`) |
