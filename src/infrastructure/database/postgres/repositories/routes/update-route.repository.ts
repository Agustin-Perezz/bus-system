import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateRouteRepository } from '../../../../../application/use-cases/routes/update-route/update-route.repository.interface';
import { Route } from '../../../../../domain/entities/route.entity';
import { RouteEntity } from '../../entities/route.entity';

@Injectable()
export class UpdateRouteRepository implements IUpdateRouteRepository {
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

  async save(route: Route): Promise<Route> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(RouteEntity, { id: route.id });
      if (!entity) {
        throw new Error('Route not found');
      }
      entity.name = route.name;
      entity.origin = route.origin;
      entity.destination = route.destination;
      entity.updatedAt = new Date();
      await em.flush();
      return this.toDomain(entity);
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
