import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateRouteRepository } from '../../../../../application/use-cases/routes/create-route/create-route.repository.interface';
import { Route } from '../../../../../domain/entities/route.entity';
import { RouteEntity } from '../../entities/route.entity';

@Injectable()
export class CreateRouteRepository implements ICreateRouteRepository {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly repository: EntityRepository<RouteEntity>,
  ) {}

  async create(route: Route): Promise<Route> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new RouteEntity(route.name, route.origin, route.destination);
      entity.id = route.id;
      entity.createdAt = route.createdAt;
      entity.updatedAt = route.updatedAt;
      await em.persist(entity).flush();
      return route;
    });
  }
}
