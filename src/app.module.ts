import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';

import { AuthorsModule } from './authors.module';
import { BooksModule } from './books.module';
import { BusesModule } from './buses.module';
import { EnterprisesModule } from './enterprises.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RoutesModule } from './routes.module';
import { TripsModule } from './trips.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    DatabaseModule,
    BooksModule,
    AuthorsModule,
    EnterprisesModule,
    RoutesModule,
    UsersModule,
    BusesModule,
    TripsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
