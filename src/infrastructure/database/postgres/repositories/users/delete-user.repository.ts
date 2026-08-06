import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IDeleteUserRepository } from '../../../../../application/use-cases/users/delete-user/delete-user.repository.interface';
import { User } from '../../../../../domain/entities/user.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class DeleteUserRepository implements IDeleteUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(UserEntity, { id });
      if (entity) {
        await em.remove(entity).flush();
      }
    });
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
