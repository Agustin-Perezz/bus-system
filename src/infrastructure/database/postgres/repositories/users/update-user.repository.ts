import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateUserRepository } from '../../../../../application/use-cases/users/update-user/update-user.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { User } from '../../../../../domain/entities/user.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UpdateUserRepository implements IUpdateUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: EntityRepository<EnterpriseEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async save(user: User): Promise<User> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(UserEntity, { id: user.id });
      if (!entity) {
        throw new Error('User not found');
      }
      entity.name = user.name;
      entity.email = user.email;
      entity.role = user.role;
      entity.enterprise = user.enterpriseId;
      entity.updatedAt = new Date();
      await em.flush();
      return this.toDomain(entity);
    });
  }

  async findEnterpriseById(id: string): Promise<Enterprise | null> {
    const entity = await this.enterpriseRepository.findOne({ id });
    if (!entity) {
      return null;
    }
    return Enterprise.reconstruct({
      id: entity.id,
      name: entity.name,
      legalId: entity.legalId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ email });
    return count > 0;
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
