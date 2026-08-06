import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListUsersRepository } from '../../../../../application/use-cases/users/list-users/list-users.repository.interface';
import { User } from '../../../../../domain/entities/user.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class ListUsersRepository implements IListUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  async findAll(pagination: PaginationRequestDto): Promise<[User[], number]> {
    const { limit, offset } = pagination;
    const [entities, total] = await this.repository.findAndCount({}, { limit, offset });
    return [entities.map((e) => this.toDomain(e)), total];
  }

  private toDomain(entity: UserEntity): User {
    return User.reconstruct({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
