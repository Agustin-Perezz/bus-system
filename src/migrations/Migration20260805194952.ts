import { Migration } from '@mikro-orm/migrations';

export class Migration20260805194952 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`alter table "books" drop constraint "books_author_id_foreign";`);

    this.addSql(`drop table if exists "authors" cascade;`);
    this.addSql(`drop table if exists "books" cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(
      `create table "authors" ("created_at" timestamptz(6) not null, "id" uuid not null, "name" varchar(255) not null, "updated_at" timestamptz(6) not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "books" ("author_id" uuid not null, "created_at" timestamptz(6) not null, "genre" varchar(255) null, "id" uuid not null, "isbn" varchar(255) not null, "publication_year" int not null, "title" varchar(255) not null, "updated_at" timestamptz(6) not null, primary key ("id"));`,
    );
    this.addSql(`alter table "books" add constraint "books_isbn_unique" unique ("isbn");`);
    this.addSql(`create index "books_title_index" on "books" ("title");`);

    this.addSql(
      `alter table "books" add constraint "books_author_id_foreign" foreign key ("author_id") references "authors" ("id");`,
    );
  }
}
