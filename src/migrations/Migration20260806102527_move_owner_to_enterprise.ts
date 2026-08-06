import { Migration } from '@mikro-orm/migrations';

export class Migration20260806102527MoveOwnerToEnterprise extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_enterprise_id_foreign";`);

    this.addSql(`alter table "users" drop column "enterprise_id";`);

    this.addSql(`alter table "enterprises" add "owner_id" uuid not null;`);
    this.addSql(
      `alter table "enterprises" add constraint "enterprises_owner_id_foreign" foreign key ("owner_id") references "users" ("id");`,
    );
    this.addSql(
      `alter table "enterprises" add constraint "enterprises_owner_id_unique" unique ("owner_id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "enterprises" drop constraint "enterprises_owner_id_foreign";`);

    this.addSql(`alter table "enterprises" drop constraint "enterprises_owner_id_unique";`);
    this.addSql(`alter table "enterprises" drop column "owner_id";`);

    this.addSql(`alter table "users" add "enterprise_id" uuid not null;`);
    this.addSql(
      `alter table "users" add constraint "users_enterprise_id_foreign" foreign key ("enterprise_id") references "enterprises" ("id");`,
    );
  }
}
