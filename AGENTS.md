# Scaffold NestJS

NestJS + Clean Architecture + MikroORM 7. Four layers: domain, application,
infrastructure, presentation. One repository per use case. Mandatory
transactions. UUIDv7 IDs.

## Stack

- **Runtime**: Node.js
- **Framework**: NestJS 11.x
- **ORM**: MikroORM 7.x (`defineEntity`, no decorators)
- **Database**: PostgreSQL (SQLite in-memory for e2e tests)
- **Migrations**: `@mikro-orm/migrations` — schema changes tracked in `src/migrations/`
- **Env config**: `dotenv` — `.env` loaded by app (`main.ts`) and CLI (`mikro-orm.config.ts`)
- **Validation**: class-validator
- **Docs**: Swagger (OpenAPI 3.0)
- **Testing**: Jest 30 + Supertest
- **Seeding**: `@mikro-orm/seeder`, `@faker-js/faker`

## Key Constraints

- Incremental checking: pnpm typecheck → pnpm lint → pnpm build.
- Never use magic strings — always use named constants or enums for values that can change or have semantic meaning.

## Rules and Checklists

Rules and checklists live in `docs/` and are loaded automatically by OpenCode
via `opencode.json`:

- `docs/rules/coding-standars.md` — clean code 
- `docs/rules/domain.md` — pure domain, no decorators, factory methods
- `docs/rules/use-cases.md` — one folder per operation, DTOs, interfaces
- `docs/rules/repositories.md` — one repo per operation, transactions
- `docs/rules/relations.md` — FK as plain ID string, schema registration, FK validation
- `docs/rules/testing.md` — unit + e2e patterns, coverage scope
- `docs/checklists/new-domain.md` — add a new domain (autos, clientes, etc.)
- `docs/checklists/new-use-case.md` — add a new use case to an existing domain
- `docs/checklists/new-entity.md` — add a new entity to an existing domain
