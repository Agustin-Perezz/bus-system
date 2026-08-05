import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListEnterprisesRepository } from '../../../../../application/use-cases/enterprises/list-enterprises/list-enterprises.repository.interface';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class ListEnterprisesRepository implements IListEnterprisesRepository {
  constructor(
    @InjectRepository(EnterpriseEntity)
    private readonly repository: EntityRepository<EnterpriseEntity>,
  ) {}

  async findAll(pagination: PaginationRequestDto): Promise<[Enterprise[], number]> {
    const { limit, offset } = pagination;
    const [entities, total] = await this.repository.findAndCount({}, { limit, offset });
    return [entities.map((e) => this.toDomain(e)), total];
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
