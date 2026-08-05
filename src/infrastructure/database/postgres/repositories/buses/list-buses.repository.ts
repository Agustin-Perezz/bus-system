import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListBusesRepository } from '../../../../../application/use-cases/buses/list-buses/list-buses.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { BusEntity } from '../../entities/bus.entity';

@Injectable()
export class ListBusesRepository implements IListBusesRepository {
  constructor(
    @InjectRepository(BusEntity)
    private readonly repository: EntityRepository<BusEntity>,
  ) {}

  async findAll(pagination: PaginationRequestDto): Promise<[Bus[], number]> {
    const { limit, offset } = pagination;
    const [entities, total] = await this.repository.findAndCount({}, { limit, offset });
    return [entities.map((e) => this.toDomain(e)), total];
  }

  private toDomain(entity: BusEntity): Bus {
    return Bus.reconstruct({
      id: entity.id,
      model: entity.model,
      enterpriseId: entity.enterprise,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
