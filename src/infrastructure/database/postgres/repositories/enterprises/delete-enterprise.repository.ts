import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IDeleteEnterpriseRepository } from '../../../../../application/use-cases/enterprises/delete-enterprise/delete-enterprise.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class DeleteEnterpriseRepository implements IDeleteEnterpriseRepository {
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

  async delete(id: string): Promise<void> {
    await this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(EnterpriseEntity, { id });
      if (entity) {
        await em.remove(entity).flush();
      }
    });
  }

  private toDomain(entity: EnterpriseEntity): Enterprise {
    return Enterprise.reconstruct({
      id: entity.id,
      name: entity.name,
      legalId: entity.legalId,
      ownerId: entity.owner,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
