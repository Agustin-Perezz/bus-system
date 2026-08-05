import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IDeleteRouteRepository } from '../../../../../application/use-cases/routes/delete-route/delete-route.repository.interface';
import { Route } from '../../../../../domain/entities/route.entity';
import { RouteEntity } from '../../entities/route.entity';

@Injectable()
export class DeleteRouteRepository implements IDeleteRouteRepository {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly repository: EntityRepository<RouteEntity>,
  ) {}

  async findById(id: string): Promise<Route | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(RouteEntity, { id });
      if (entity) {
        await em.remove(entity).flush();
      }
    });
  }

  private toDomain(entity: RouteEntity): Route {
    return Route.reconstruct({
      id: entity.id,
      name: entity.name,
      origin: entity.origin,
      destination: entity.destination,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
