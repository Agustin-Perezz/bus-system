import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IGetBusRepository } from '../../../../../application/use-cases/buses/get-bus/get-bus.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { BusEntity } from '../../entities/bus.entity';

@Injectable()
export class GetBusRepository implements IGetBusRepository {
  constructor(
    @InjectRepository(BusEntity)
    private readonly repository: EntityRepository<BusEntity>,
  ) {}

  async findById(id: string): Promise<Bus | null> {
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
