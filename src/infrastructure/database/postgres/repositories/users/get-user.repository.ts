import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IGetUserRepository } from '../../../../../application/use-cases/users/get-user/get-user.repository.interface';
import { User } from '../../../../../domain/entities/user.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class GetUserRepository implements IGetUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.repository.findOne({ id });
      if (!entity) {
        return null;
      }
      return this.toDomain(entity);
    } catch {
      return null;
    }
  }

  private toDomain(entity: UserEntity): User {
    return User.reconstruct({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      enterpriseId: entity.enterprise,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
