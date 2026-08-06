import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateEnterpriseRepository } from '../../../../../application/use-cases/enterprises/create-enterprise/create-enterprise.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { User } from '../../../../../domain/entities/user.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class CreateEnterpriseRepository implements ICreateEnterpriseRepository {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly repository: EntityRepository<EnterpriseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async create(enterprise: Enterprise): Promise<Enterprise> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new EnterpriseEntity(enterprise.name, enterprise.legalId, enterprise.ownerId);
      entity.id = enterprise.id;
      entity.createdAt = enterprise.createdAt;
      entity.updatedAt = enterprise.updatedAt;
      await em.persist(entity).flush();
      return enterprise;
    });
  }

  async existsByLegalId(legalId: string): Promise<boolean> {
    const count = await this.repository.count({ legalId });
    return count > 0;
  }

  async findUserById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ id });
    if (!entity) {
      return null;
    }
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
