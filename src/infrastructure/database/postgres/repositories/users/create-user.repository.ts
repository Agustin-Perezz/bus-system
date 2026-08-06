import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateUserRepository } from '../../../../../application/use-cases/users/create-user/create-user.repository.interface';
import { User } from '../../../../../domain/entities/user.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class CreateUserRepository implements ICreateUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new UserEntity(user.name, user.email, user.role);
      entity.id = user.id;
      entity.createdAt = user.createdAt;
      entity.updatedAt = user.updatedAt;
      await em.persist(entity).flush();
      return user;
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ email });
    return count > 0;
  }
}
