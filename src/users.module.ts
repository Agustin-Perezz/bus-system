import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateUserUseCase } from './application/use-cases/users/create-user/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/users/delete-user/delete-user.use-case';
import { GetUserUseCase } from './application/use-cases/users/get-user/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/users/list-users/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/users/update-user/update-user.use-case';
import { UserEntitySchema } from './infrastructure/database/postgres/entities/user.entity';
import { CreateUserRepository } from './infrastructure/database/postgres/repositories/users/create-user.repository';
import { DeleteUserRepository } from './infrastructure/database/postgres/repositories/users/delete-user.repository';
import { GetUserRepository } from './infrastructure/database/postgres/repositories/users/get-user.repository';
import { ListUsersRepository } from './infrastructure/database/postgres/repositories/users/list-users.repository';
import { UpdateUserRepository } from './infrastructure/database/postgres/repositories/users/update-user.repository';
import { UsersController } from './presentation/controllers/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'ICreateUserRepository',
      useClass: CreateUserRepository,
    },
    {
      provide: 'IGetUserRepository',
      useClass: GetUserRepository,
    },
    {
      provide: 'IListUsersRepository',
      useClass: ListUsersRepository,
    },
    {
      provide: 'IUpdateUserRepository',
      useClass: UpdateUserRepository,
    },
    {
      provide: 'IDeleteUserRepository',
      useClass: DeleteUserRepository,
    },
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  imports: [MikroOrmModule.forFeature([UserEntitySchema])],
})
export class UsersModule {}
