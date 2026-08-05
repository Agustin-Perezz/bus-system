import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../../../application/shared/dtos/pagination.request.dto';
import { IListTripsRepository } from '../../../../../application/use-cases/trips/list-trips/list-trips.repository.interface';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { TripEntity } from '../../entities/trip.entity';

@Injectable()
export class ListTripsRepository implements IListTripsRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: EntityRepository<TripEntity>,
  ) {}

  async findAll(pagination: PaginationRequestDto): Promise<[Trip[], number]> {
    const { limit, offset } = pagination;
    const [entities, total] = await this.repository.findAndCount({}, { limit, offset });
    return [entities.map((e) => this.toDomain(e)), total];
  }

  private toDomain(entity: TripEntity): Trip {
    return Trip.reconstruct({
      id: entity.id,
      departureAt: entity.departureAt,
      routeId: entity.route,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
