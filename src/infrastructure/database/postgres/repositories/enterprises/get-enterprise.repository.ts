import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IGetEnterpriseRepository } from '../../../../../application/use-cases/enterprises/get-enterprise/get-enterprise.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class GetEnterpriseRepository implements IGetEnterpriseRepository {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly repository: EntityRepository<EnterpriseEntity>,
  ) {}

  async findById(id: string): Promise<Enterprise | null> {
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
