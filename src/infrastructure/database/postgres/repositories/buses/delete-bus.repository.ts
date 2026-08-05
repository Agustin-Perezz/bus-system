import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IDeleteBusRepository } from '../../../../../application/use-cases/buses/delete-bus/delete-bus.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { BusEntity } from '../../entities/bus.entity';

@Injectable()
export class DeleteBusRepository implements IDeleteBusRepository {
  constructor(
    @InjectRepository(BusEntity)
    private readonly repository: EntityRepository<BusEntity>,
  ) {}

  async findById(id: string): Promise<Bus | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(BusEntity, { id });
      if (entity) {
        await em.remove(entity).flush();
      }
    });
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
