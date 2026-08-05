import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateTripUseCase } from './application/use-cases/trips/create-trip/create-trip.use-case';
import { DeleteTripUseCase } from './application/use-cases/trips/delete-trip/delete-trip.use-case';
import { GetTripUseCase } from './application/use-cases/trips/get-trip/get-trip.use-case';
import { ListTripsUseCase } from './application/use-cases/trips/list-trips/list-trips.use-case';
import { UpdateTripUseCase } from './application/use-cases/trips/update-trip/update-trip.use-case';
import { RouteEntitySchema } from './infrastructure/database/postgres/entities/route.entity';
import { TripEntitySchema } from './infrastructure/database/postgres/entities/trip.entity';
import { CreateTripRepository } from './infrastructure/database/postgres/repositories/trips/create-trip.repository';
import { DeleteTripRepository } from './infrastructure/database/postgres/repositories/trips/delete-trip.repository';
import { GetTripRepository } from './infrastructure/database/postgres/repositories/trips/get-trip.repository';
import { ListTripsRepository } from './infrastructure/database/postgres/repositories/trips/list-trips.repository';
import { UpdateTripRepository } from './infrastructure/database/postgres/repositories/trips/update-trip.repository';
import { TripsController } from './presentation/controllers/trips/trips.controller';

@Module({
  controllers: [TripsController],
  providers: [
    {
      provide: 'ICreateTripRepository',
      useClass: CreateTripRepository,
    },
    {
      provide: 'IGetTripRepository',
      useClass: GetTripRepository,
    },
    {
      provide: 'IListTripsRepository',
      useClass: ListTripsRepository,
    },
    {
      provide: 'IUpdateTripRepository',
      useClass: UpdateTripRepository,
    },
    {
      provide: 'IDeleteTripRepository',
      useClass: DeleteTripRepository,
    },
    CreateTripUseCase,
    GetTripUseCase,
    ListTripsUseCase,
    UpdateTripUseCase,
    DeleteTripUseCase,
  ],
  imports: [MikroOrmModule.forFeature([TripEntitySchema, RouteEntitySchema])],
})
export class TripsModule {}
