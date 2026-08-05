import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateBusUseCase } from './application/use-cases/buses/create-bus/create-bus.use-case';
import { DeleteBusUseCase } from './application/use-cases/buses/delete-bus/delete-bus.use-case';
import { GetBusUseCase } from './application/use-cases/buses/get-bus/get-bus.use-case';
import { ListBusesUseCase } from './application/use-cases/buses/list-buses/list-buses.use-case';
import { UpdateBusUseCase } from './application/use-cases/buses/update-bus/update-bus.use-case';
import { BusEntitySchema } from './infrastructure/database/postgres/entities/bus.entity';
import { EnterpriseEntitySchema } from './infrastructure/database/postgres/entities/enterprise.entity';
import { CreateBusRepository } from './infrastructure/database/postgres/repositories/buses/create-bus.repository';
import { DeleteBusRepository } from './infrastructure/database/postgres/repositories/buses/delete-bus.repository';
import { GetBusRepository } from './infrastructure/database/postgres/repositories/buses/get-bus.repository';
import { ListBusesRepository } from './infrastructure/database/postgres/repositories/buses/list-buses.repository';
import { UpdateBusRepository } from './infrastructure/database/postgres/repositories/buses/update-bus.repository';
import { BusesController } from './presentation/controllers/buses/buses.controller';

@Module({
  controllers: [BusesController],
  providers: [
    {
      provide: 'ICreateBusRepository',
      useClass: CreateBusRepository,
    },
    {
      provide: 'IGetBusRepository',
      useClass: GetBusRepository,
    },
    {
      provide: 'IListBusesRepository',
      useClass: ListBusesRepository,
    },
    {
      provide: 'IUpdateBusRepository',
      useClass: UpdateBusRepository,
    },
    {
      provide: 'IDeleteBusRepository',
      useClass: DeleteBusRepository,
    },
    CreateBusUseCase,
    GetBusUseCase,
    ListBusesUseCase,
    UpdateBusUseCase,
    DeleteBusUseCase,
  ],
  imports: [MikroOrmModule.forFeature([BusEntitySchema, EnterpriseEntitySchema])],
})
export class BusesModule {}
