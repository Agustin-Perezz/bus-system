import { Migration } from '@mikro-orm/migrations';

export class Migration20260805193319 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "buses" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "model" varchar(255) not null, "enterprise_id" uuid not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "trips" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "departure_at" timestamptz not null, "route_id" uuid not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "email" varchar(255) not null, "role" varchar(255) not null, "enterprise_id" uuid not null, primary key ("id"));`,
    );
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(
      `alter table "buses" add constraint "buses_enterprise_id_foreign" foreign key ("enterprise_id") references "enterprises" ("id");`,
    );

    this.addSql(
      `alter table "trips" add constraint "trips_route_id_foreign" foreign key ("route_id") references "routes" ("id");`,
    );

    this.addSql(
      `alter table "users" add constraint "users_enterprise_id_foreign" foreign key ("enterprise_id") references "enterprises" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "buses" cascade;`);
    this.addSql(`drop table if exists "trips" cascade;`);
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
