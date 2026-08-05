import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IGetTripRepository } from '../../../../../application/use-cases/trips/get-trip/get-trip.repository.interface';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { TripEntity } from '../../entities/trip.entity';

@Injectable()
export class GetTripRepository implements IGetTripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: EntityRepository<TripEntity>,
  ) {}

  async findById(id: string): Promise<Trip | null> {
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
