import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IGetRouteRepository } from '../../../../../application/use-cases/routes/get-route/get-route.repository.interface';
import { Route } from '../../../../../domain/entities/route.entity';
import { RouteEntity } from '../../entities/route.entity';

@Injectable()
export class GetRouteRepository implements IGetRouteRepository {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly repository: EntityRepository<RouteEntity>,
  ) {}

  async findById(id: string): Promise<Route | null> {
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
