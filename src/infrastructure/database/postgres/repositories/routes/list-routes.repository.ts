import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListRoutesRepository } from '../../../../../application/use-cases/routes/list-routes/list-routes.repository.interface';
import { Route } from '../../../../../domain/entities/route.entity';
import { RouteEntity } from '../../entities/route.entity';

@Injectable()
export class ListRoutesRepository implements IListRoutesRepository {
  constructor(
    @InjectRepository(RouteEntity)
    private readonly repository: EntityRepository<RouteEntity>,
  ) {}

  async findAll(pagination: PaginationRequestDto): Promise<[Route[], number]> {
    const { limit, offset } = pagination;
    const [entities, total] = await this.repository.findAndCount({}, { limit, offset });
    return [entities.map((e) => this.toDomain(e)), total];
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
