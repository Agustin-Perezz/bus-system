import { Migration } from '@mikro-orm/migrations';

export class Migration20260805192041 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "enterprises" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "legal_id" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "enterprises" add constraint "enterprises_legal_id_unique" unique ("legal_id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "enterprises" cascade;`);
  }
}
