import { Migration } from '@mikro-orm/migrations';

import { STANDARD_BUS_LAYOUT } from '../domain/entities/bus-layout-grid';

export class Migration20261015121550AddBusLayouts extends Migration {
  private escapeSqlLiteral(value: string): string {
    return `'${value.replaceAll("'", "''")}'`;
  }

  override up(): void | Promise<void> {
    this.addSql(
      `create table "bus_layouts" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "layout_grid" jsonb not null, primary key ("id"));`,
    );

    this.addSql(
      `insert into "bus_layouts" ("id", "created_at", "updated_at", "name", "layout_grid") values (${this.escapeSqlLiteral(STANDARD_BUS_LAYOUT.id)}, now(), now(), ${this.escapeSqlLiteral(STANDARD_BUS_LAYOUT.name)}, ${this.escapeSqlLiteral(JSON.stringify(STANDARD_BUS_LAYOUT.layoutGrid))}::jsonb) on conflict ("id") do nothing;`,
    );

    this.addSql(`alter table "buses" add "layout_id" uuid null;`);

    this.addSql(
      `update "buses" set "layout_id" = ${this.escapeSqlLiteral(STANDARD_BUS_LAYOUT.id)} where "layout_id" is null;`,
    );

    this.addSql(`alter table "buses" alter column "layout_id" set not null;`);

    this.addSql(
      `alter table "buses" add constraint "buses_layout_id_foreign" foreign key ("layout_id") references "bus_layouts" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "buses" drop constraint "buses_layout_id_foreign";`);

    this.addSql(`drop table if exists "bus_layouts" cascade;`);

    this.addSql(`alter table "buses" drop column "layout_id";`);
  }
}
