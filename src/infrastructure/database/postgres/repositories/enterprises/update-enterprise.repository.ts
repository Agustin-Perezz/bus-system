import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateEnterpriseRepository } from '../../../../../application/use-cases/enterprises/update-enterprise/update-enterprise.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class UpdateEnterpriseRepository implements IUpdateEnterpriseRepository {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly repository: EntityRepository<EnterpriseEntity>,
  ) {}

  async findById(id: string): Promise<Enterprise | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async save(enterprise: Enterprise): Promise<Enterprise> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(EnterpriseEntity, { id: enterprise.id });
      if (!entity) {
        throw new Error('Enterprise not found');
      }
      entity.name = enterprise.name;
      entity.updatedAt = new Date();
      await em.flush();
      return this.toDomain(entity);
    });
  }

  private toDomain(entity: EnterpriseEntity): Enterprise {
    return Enterprise.reconstruct({
      id: entity.id,
      name: entity.name,
      legalId: entity.legalId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
