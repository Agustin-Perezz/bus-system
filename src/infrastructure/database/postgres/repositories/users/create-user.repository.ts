import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateUserRepository } from '../../../../../application/use-cases/users/create-user/create-user.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { User } from '../../../../../domain/entities/user.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class CreateUserRepository implements ICreateUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: EntityRepository<UserEntity>,
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: EntityRepository<EnterpriseEntity>,
  ) {}

  async create(user: User): Promise<User> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new UserEntity(user.name, user.email, user.role, user.enterpriseId);
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
}
