import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateEnterpriseRepository } from '../../../../../application/use-cases/enterprises/create-enterprise/create-enterprise.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class CreateEnterpriseRepository implements ICreateEnterpriseRepository {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly repository: EntityRepository<EnterpriseEntity>,
  ) {}

  async create(enterprise: Enterprise): Promise<Enterprise> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new EnterpriseEntity(enterprise.name, enterprise.legalId);
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
}
