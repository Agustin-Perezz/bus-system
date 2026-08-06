import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateBusRepository } from '../../../../../application/use-cases/buses/create-bus/create-bus.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { Enterprise } from '../../../../../domain/entities/enterprise.entity';
import { BusEntity } from '../../entities/bus.entity';
import { EnterpriseEntity } from '../../entities/enterprise.entity';

@Injectable()
export class CreateBusRepository implements ICreateBusRepository {
  constructor(
    @InjectRepository(BusEntity)
    private readonly repository: EntityRepository<BusEntity>,
    @InjectRepository(EnterpriseEntity)
    private readonly enterpriseRepository: EntityRepository<EnterpriseEntity>,
  ) {}

  async create(bus: Bus): Promise<Bus> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new BusEntity(bus.model, bus.enterpriseId);
      entity.id = bus.id;
      entity.createdAt = bus.createdAt;
      entity.updatedAt = bus.updatedAt;
      await em.persist(entity).flush();
      return bus;
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
      ownerId: entity.owner,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
