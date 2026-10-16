import { Migration } from '@mikro-orm/migrations';

export class Migration20261016114237_add_tickets extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "tickets" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "trip_id" uuid not null, "seat_id" varchar(255) not null, "user_id" uuid not null, "status" text not null, "held_until" timestamptz null, primary key ("id"));`,
    );
    this.addSql(
      `create unique index "tickets_trip_id_seat_id_unique" on "tickets" ("trip_id", "seat_id") where "status" != 'cancelled';`,
    );

    this.addSql(
      `alter table "tickets" add constraint "tickets_trip_id_foreign" foreign key ("trip_id") references "trips" ("id");`,
    );
    this.addSql(
      `alter table "tickets" add constraint "tickets_user_id_foreign" foreign key ("user_id") references "users" ("id");`,
    );
    this.addSql(
      `alter table "tickets" add constraint "tickets_status_check" check ("status" in ('held', 'booked', 'cancelled'));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "tickets" cascade;`);
  }
}
