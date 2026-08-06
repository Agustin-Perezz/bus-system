import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateEnterpriseUseCase } from './application/use-cases/enterprises/create-enterprise/create-enterprise.use-case';
import { DeleteEnterpriseUseCase } from './application/use-cases/enterprises/delete-enterprise/delete-enterprise.use-case';
import { GetEnterpriseUseCase } from './application/use-cases/enterprises/get-enterprise/get-enterprise.use-case';
import { ListEnterprisesUseCase } from './application/use-cases/enterprises/list-enterprises/list-enterprises.use-case';
import { UpdateEnterpriseUseCase } from './application/use-cases/enterprises/update-enterprise/update-enterprise.use-case';
import { EnterpriseEntitySchema } from './infrastructure/database/postgres/entities/enterprise.entity';
import { UserEntitySchema } from './infrastructure/database/postgres/entities/user.entity';
import { CreateEnterpriseRepository } from './infrastructure/database/postgres/repositories/enterprises/create-enterprise.repository';
import { DeleteEnterpriseRepository } from './infrastructure/database/postgres/repositories/enterprises/delete-enterprise.repository';
import { GetEnterpriseRepository } from './infrastructure/database/postgres/repositories/enterprises/get-enterprise.repository';
import { ListEnterprisesRepository } from './infrastructure/database/postgres/repositories/enterprises/list-enterprises.repository';
import { UpdateEnterpriseRepository } from './infrastructure/database/postgres/repositories/enterprises/update-enterprise.repository';
import { EnterprisesController } from './presentation/controllers/enterprises/enterprises.controller';

@Module({
  controllers: [EnterprisesController],
  providers: [
    {
      provide: 'ICreateEnterpriseRepository',
      useClass: CreateEnterpriseRepository,
    },
    {
      provide: 'IGetEnterpriseRepository',
      useClass: GetEnterpriseRepository,
    },
    {
      provide: 'IListEnterprisesRepository',
      useClass: ListEnterprisesRepository,
    },
    {
      provide: 'IUpdateEnterpriseRepository',
      useClass: UpdateEnterpriseRepository,
    },
    {
      provide: 'IDeleteEnterpriseRepository',
      useClass: DeleteEnterpriseRepository,
    },
    CreateEnterpriseUseCase,
    GetEnterpriseUseCase,
    ListEnterprisesUseCase,
    UpdateEnterpriseUseCase,
    DeleteEnterpriseUseCase,
  ],
  imports: [MikroOrmModule.forFeature([EnterpriseEntitySchema, UserEntitySchema])],
})
export class EnterprisesModule {}
