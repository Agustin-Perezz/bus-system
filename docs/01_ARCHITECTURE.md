# Architecture - Clean Architecture

## Overview

```mermaid
graph TB
    subgraph C1["Presentation Layer (Controllers)"]
        CTRL[Controllers<br/>DTOs<br/>Filters]
    end

    subgraph C2["Application Layer (Use Cases)"]
        UC[Use Cases<br/>Repository Interfaces<br/>DTOs]
    end

    subgraph C3["Domain Layer (Domain)"]
        ENTITY[Entities<br/>Value Objects<br/>Domain Services]
    end

    subgraph C4["Infrastructure Layer (Infrastructure)"]
        REPO[Repository Implementations<br/>Database Entities<br/>External Services]
    end

    C1 --> C2
    C2 --> C3
    C4 --> C3
    C2 --> C4
```

## Core Principles

### 1. Separation of Concerns

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Presentation** | HTTP, DTOs, Swagger | Controllers |
| **Application** | Business logic, Orchestration | Use Cases |
| **Domain** | Pure entities, Business rules | Book |
| **Infrastructure** | Persistence, External services | Repositories, MikroORM |

### 2. Folder Structure

```
src/
├── app.module.ts                          # Root module (DatabaseModule + domain modules)
├── {domain}.module.ts                     # One per domain — forFeature([...schemas])
│
├── domain/
│   └── entities/
│       ├── base.entity.ts                 # Abstract BaseEntity (id, createdAt, updatedAt, touch)
│       ├── enterprise.entity.ts           # Enterprise, Route, User, Bus, Trip
│       └── ...
│
├── application/
│   └── use-cases/
│       └── {domain}/                      # enterprises, routes, users, buses, trips
│           ├── create-{entity}/
│           ├── get-{entity}/
│           ├── list-{entity}s/
│           ├── update-{entity}/
│           └── delete-{entity}/
│
├── infrastructure/
│   └── database/
│       ├── database.module.ts             # MikroOrmModule.forRoot(ormConfig)
│       └── postgres/
│           ├── entities/
│           │   ├── base.entity.ts         # BaseEntitySchema (defineEntity, abstract)
│           │   ├── enterprise.entity.ts   # MikroORM entities (defineEntity, no decorators)
│           │   └── ...
│           ├── factories/                 # MikroORM seeder factories (test seed data)
│           └── repositories/
│               └── {domain}/              # one repo file per use case
│
├── migrations/                            # MikroORM migration files (TS source)
│
└── presentation/
    └── controllers/
        └── {domain}/
            └── {domain}.controller.ts
```

### 3. Data Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UseCase
    participant Repository
    participant DomainEntity
    participant Database

    Client->>Controller: HTTP Request
    Controller->>UseCase: execute(DTO)
    UseCase->>Repository: operation(entity)
    Repository->>DomainEntity: map to/from
    DomainEntity->>Repository: return entity
    Repository->>Database: SQL query
    Database-->>Repository: result
    Repository-->>UseCase: return entity
    UseCase-->>Controller: return ResponseDTO
    Controller-->>Client: HTTP Response
```

## Domain–Infrastructure Boundary

> **Note**: `BaseEntity` (domain) and `BaseEntitySchema` (infra) share the
> same `id`, `createdAt`, and `updatedAt` contract. The domain `BaseEntity`
> holds them as plain private fields with a `protected touch()`; the infra
> `BaseEntitySchema` maps them to columns via `defineEntity({ abstract: true })`.
> Domain entities extend the domain `BaseEntity`; MikroORM entities extend the
> infra `BaseEntity`.

> Architectural rules (pure domain, repository per operation, mandatory
> transactions) live in `docs/rules/` and are loaded via `opencode.json`.

## Dependency Injection

```mermaid
graph LR
    subgraph Module
        PROVIDER[Providers]
        CONTROLLER[Controllers]
    end

    PROVIDER -->|injects| CONTROLLER
    CONTROLLER -->|uses| USECASE[Use Cases]
    USECASE -->|uses| REPO[Repositories]
```

### Provider Registration

```typescript
// books.module.ts
providers: [
    {
        provide: 'ICreateBookRepository',
        useClass: CreateBookRepository,
    },
    CreateBookUseCase,
    // ...
]
```

## MikroORM Configuration

```mermaid
graph TB
    subgraph AppModule["AppModule (root)"]
        DBMOD[DatabaseModule]
        BOOKSMOD[BooksModule]
    end

    subgraph DatabaseModule["DatabaseModule"]
        A[MikroOrmModule.forRoot<br/>ormConfig from mikro-orm.config.ts]
    end

    subgraph BooksModule["BooksModule"]
        B[MikroOrmModule.forFeature]
    end

    subgraph Config
        CFG[mikro-orm.config.ts<br/>PostgreSQL + SeedManager + Migrator]
    end

    subgraph Entities
        C[BookEntitySchema]
    end

    DBMOD --> A
    BOOKSMOD --> B
    A --> CFG
    B --> C
```

`mikro-orm.config.ts` is the single source of truth for the MikroORM config
(PostgreSQL driver, `SeedManager` + `Migrator` extensions, entity list,
migrations path). `DatabaseModule` imports it via `MikroOrmModule.forRoot(ormConfig)`;
the CLI reads the same file via `configPaths` in `package.json`. `BooksModule`
only registers `forFeature([BookEntitySchema])`. `AppModule` imports both,
and `main.ts` bootstraps `AppModule`.

`.env` is loaded by `import 'dotenv/config'` in both `main.ts` (app) and
`mikro-orm.config.ts` (CLI), so app and CLI resolve the same database.

## Build and Execution

```bash
# Build with NestJS CLI
pnpm build

# Run
pnpm start:prod

# Type check
npx tsc --noEmit
```

## Migrations

Schema changes are tracked as migration files in `src/migrations/`. The
`Migrator` extension (registered in `mikro-orm.config.ts`) generates and
applies migrations against the configured PostgreSQL database.

```bash
# Generate a new migration from the current schema diff
pnpm migration:create -- --name=create_books_schema

# Apply pending migrations
pnpm migration:up

# Roll back one migration
pnpm migration:down

# Show pending / executed migrations
pnpm migration:pending
pnpm migration:list

# Drop schema + re-run all migrations
pnpm migration:fresh

# Verify schema is up to date
pnpm migration:check
```

Migration files live in `src/migrations/` (TS source, compiled to
`dist/migrations/` in production). The migrator config uses `pathTs` for
development and `path` (compiled JS) for production. Snapshot files
(`.snapshot-*.json`) are generated alongside migrations and should be
versioned with them.
