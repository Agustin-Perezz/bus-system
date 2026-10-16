# Bus System

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_bus-system4&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_bus-system4)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_bus-system4&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_bus-system4)

REST API for a bus transportation system, built with NestJS and Clean
Architecture. Manages enterprises, routes, users, bus layout templates,
buses, trips, and seat bookings.

## Domain Model

```mermaid
erDiagram
    User ||--o| Enterprise : "owns"
    Enterprise ||--o{ Bus : "owns"
    BusLayout ||--o{ Bus : "blueprints"
    Route ||--o{ Trip : "schedules"
    Bus ||--o{ Trip : "operates"
    Trip ||--o{ Ticket : "reserves"
    User ||--o{ Ticket : "books"

    Enterprise {
        uuid id PK
        string name
        string legal_id UK
        uuid owner_id FK
    }
    Route {
        uuid id PK
        string name
        string origin
        string destination
    }
    User {
        uuid id PK
        string name
        string email UK
        string role
    }
    BusLayout {
        uuid id PK
        string name
        jsonb layout_grid
    }
    Bus {
        uuid id PK
        string model
        uuid enterprise_id FK
        uuid layout_id FK
    }
    Trip {
        uuid id PK
        datetime departure_at
        uuid route_id FK
        uuid bus_id FK
    }
    Ticket {
        uuid id PK
        uuid trip_id FK
        string seat_id
        uuid user_id FK
        string status
        datetime held_until
        datetime created_at
    }
```

## Architecture

```
src/
├── domain/           # Pure entities (no decorators)
├── application/      # Use cases
├── infrastructure/   # Repositories, MikroORM
└── presentation/     # REST controllers
```

### Key Principles

| Rule | Description |
|------|-------------|
| **Pure Domain** | Entities without framework decorators |
| **Repository per Operation** | One repository per use case, not a fat one |
| **Transactions** | Always use `transactional()` |
| **Direct Imports** | No barrel files |

## Local Setup

### Requirements

- Node.js 20+
- Docker and Docker Compose
- pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd bus-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration if needed
   ```

4. **Start PostgreSQL with Docker**
   ```bash
   pnpm docker:up
   pnpm docker:logs
   ```

5. **Apply migrations and seed layout templates**
   ```bash
   pnpm migration:up
   pnpm mikro-orm seeder:run
   ```
   The seeder inserts the standard single-deck and double-decker bus layout
   templates that buses reference.

6. **Build and run the application**
   ```bash
   pnpm start:dev     # Development (hot-reload)
   # or
   pnpm build
   pnpm start:prod
   ```

7. **Verify it works**
   - API: http://localhost:3000
   - Swagger: http://localhost:3000/api

### Docker Commands

```bash
pnpm docker:up      # Start PostgreSQL
pnpm docker:down    # Stop PostgreSQL
pnpm docker:logs    # View logs
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | PostgreSQL user | postgres |
| `DB_PASSWORD` | PostgreSQL password | postgres |
| `DB_NAME` | Database name | bus_system |
| `PORT` | API port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `SENTRY_DSN` | Sentry DSN (only sent in production) | - |
| `SENTRY_TRACES_SAMPLE_RATE` | Sentry tracing sample rate (0.0 to 1.0) | 0.1 |

## Main Commands

```bash
# Development
pnpm start:dev          # Development mode (watch)
pnpm build              # Compile TypeScript
pnpm start:prod         # Production

# Testing
pnpm test               # Unit tests
pnpm test:e2e           # E2E tests

# Linting / Formatting
pnpm lint               # Lint source code
pnpm format             # Format source code
pnpm check              # Lint + format + organize imports

# Docker
pnpm docker:up          # Start PostgreSQL
pnpm docker:down        # Stop PostgreSQL
pnpm docker:logs        # View PostgreSQL logs

# Database migrations & seeding
pnpm migration:up        # Apply pending migrations
pnpm migration:down      # Revert the last migration
pnpm migration:list      # List executed and pending migrations
pnpm mikro-orm seeder:run # Seed bus layout templates

# Verification
npx tsc --noEmit        # Type check
pnpm check              # Lint + format + organize imports
```

## Documentation

- [Index](./docs/00_INDEX.md)
- [Architecture](./docs/01_ARCHITECTURE.md)
- [Entities](./docs/02_ENTITIES.md)
- [Use Cases](./docs/03_USE_CASES.md)
- [API](./docs/04_API.md)
- [Testing](./docs/07_TESTING.md)