import { Migration } from '@mikro-orm/migrations';

export class Migration20260805192221AddRoute extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "routes" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "origin" varchar(255) not null, "destination" varchar(255) not null, primary key ("id"));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "routes" cascade;`);
  }
}
