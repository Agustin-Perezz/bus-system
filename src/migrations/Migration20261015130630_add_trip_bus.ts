import { Migration } from '@mikro-orm/migrations';

export class Migration20261015130630AddTripBus extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`alter table "trips" add "bus_id" uuid not null;`);
    this.addSql(
      `alter table "trips" add constraint "trips_bus_id_foreign" foreign key ("bus_id") references "buses" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "trips" drop constraint "trips_bus_id_foreign";`);

    this.addSql(`alter table "trips" drop column "bus_id";`);
  }
}
