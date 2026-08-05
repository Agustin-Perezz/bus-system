import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { IDeleteTripRepository } from '../../../../../application/use-cases/trips/delete-trip/delete-trip.repository.interface';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { TripEntity } from '../../entities/trip.entity';

@Injectable()
export class DeleteTripRepository implements IDeleteTripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: EntityRepository<TripEntity>,
  ) {}

  async findById(id: string): Promise<Trip | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.getEntityManager().transactional(async (em) => {
      const entity = await em.findOne(TripEntity, { id });
      if (entity) {
        await em.remove(entity).flush();
      }
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
