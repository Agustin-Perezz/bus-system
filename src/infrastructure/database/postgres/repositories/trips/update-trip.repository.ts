import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IUpdateTripRepository } from '../../../../../application/use-cases/trips/update-trip/update-trip.repository.interface';
import { Route } from '../../../../../domain/entities/route.entity';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { RouteEntity } from '../../entities/route.entity';
import { TripEntity } from '../../entities/trip.entity';

@Injectable()
export class UpdateTripRepository implements IUpdateTripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: EntityRepository<TripEntity>,
    @InjectRepository(RouteEntity)
    private readonly routeRepository: EntityRepository<RouteEntity>,
  ) {}

  async findById(id: string): Promise<Trip | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async save(trip: Trip): Promise<Trip> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(TripEntity, { id: trip.id });
      if (!entity) {
        throw new Error('Trip not found');
      }
      entity.departureAt = trip.departureAt;
      entity.route = trip.routeId;
      entity.updatedAt = new Date();
      await em.flush();
      return this.toDomain(entity);
    });
  }

  async findRouteById(id: string): Promise<Route | null> {
    const entity = await this.routeRepository.findOne({ id });
    if (!entity) {
      return null;
    }
    return Route.reconstruct({
      id: entity.id,
      name: entity.name,
      origin: entity.origin,
      destination: entity.destination,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
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
