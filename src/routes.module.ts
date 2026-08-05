import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateRouteUseCase } from './application/use-cases/routes/create-route/create-route.use-case';
import { DeleteRouteUseCase } from './application/use-cases/routes/delete-route/delete-route.use-case';
import { GetRouteUseCase } from './application/use-cases/routes/get-route/get-route.use-case';
import { ListRoutesUseCase } from './application/use-cases/routes/list-routes/list-routes.use-case';
import { UpdateRouteUseCase } from './application/use-cases/routes/update-route/update-route.use-case';
import { RouteEntitySchema } from './infrastructure/database/postgres/entities/route.entity';
import { CreateRouteRepository } from './infrastructure/database/postgres/repositories/routes/create-route.repository';
import { DeleteRouteRepository } from './infrastructure/database/postgres/repositories/routes/delete-route.repository';
import { GetRouteRepository } from './infrastructure/database/postgres/repositories/routes/get-route.repository';
import { ListRoutesRepository } from './infrastructure/database/postgres/repositories/routes/list-routes.repository';
import { UpdateRouteRepository } from './infrastructure/database/postgres/repositories/routes/update-route.repository';
import { RoutesController } from './presentation/controllers/routes/routes.controller';

@Module({
  controllers: [RoutesController],
  providers: [
    {
      provide: 'ICreateRouteRepository',
      useClass: CreateRouteRepository,
    },
    {
      provide: 'IGetRouteRepository',
      useClass: GetRouteRepository,
    },
    {
      provide: 'IListRoutesRepository',
      useClass: ListRoutesRepository,
    },
    {
      provide: 'IUpdateRouteRepository',
      useClass: UpdateRouteRepository,
    },
    {
      provide: 'IDeleteRouteRepository',
      useClass: DeleteRouteRepository,
    },
    CreateRouteUseCase,
    GetRouteUseCase,
    ListRoutesUseCase,
    UpdateRouteUseCase,
    DeleteRouteUseCase,
  ],
  imports: [MikroOrmModule.forFeature([RouteEntitySchema])],
})
export class RoutesModule {}
