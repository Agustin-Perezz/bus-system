import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateBusRepository } from '../../../../../application/use-cases/buses/update-bus/update-bus.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { BusEntity } from '../../entities/bus.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class UpdateBusRepository implements IUpdateBusRepository {
  constructor(
    @InjectRepository(BusEntity)
    private readonly repository: EntityRepository<BusEntity>,
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: EntityRepository<EnterpriseEntity>,
  ) {}

  async findById(id: string): Promise<Bus | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async save(bus: Bus): Promise<Bus> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(BusEntity, { id: bus.id });
      if (!entity) {
        throw new Error('Bus not found');
      }
      entity.model = bus.model;
      entity.enterprise = bus.enterpriseId;
      entity.updatedAt = new Date();
      await em.flush();
      return this.toDomain(entity);
    });
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
