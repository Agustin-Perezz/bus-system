import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { ICreateTripRepository } from '../../../../../application/use-cases/trips/create-trip/create-trip.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { Route } from '../../../../../domain/entities/route.entity';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { BusEntity } from '../../entities/bus.entity';
import { RouteEntity } from '../../entities/route.entity';
import { TripEntity } from '../../entities/trip.entity';

@Injectable()
export class CreateTripRepository implements ICreateTripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: EntityRepository<TripEntity>,
    @InjectRepository(RouteEntity)
    private readonly routeRepository: EntityRepository<RouteEntity>,
    @InjectRepository(BusEntity)
    private readonly busRepository: EntityRepository<BusEntity>,
  ) {}

  async create(trip: Trip): Promise<Trip> {
    return this.repository.getEntityManager().transactional(async (em) => {
      const entity = new TripEntity(trip.departureAt, trip.routeId);
      entity.id = trip.id;
      entity.createdAt = trip.createdAt;
      entity.updatedAt = trip.updatedAt;
      entity.bus = em.getReference(BusEntity, trip.busId);
      await em.persist(entity).flush();
      return trip;
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

  async findBusById(id: string): Promise<Bus | null> {
    const entity = await this.busRepository.findOne({ id });
    if (!entity) {
      return null;
    }
    return Bus.reconstruct({
      id: entity.id,
      model: entity.model,
      enterpriseId: entity.enterprise,
      layoutId: entity.layout.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
