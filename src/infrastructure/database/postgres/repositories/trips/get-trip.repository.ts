import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import {
  IGetTripRepository,
  type TripWithBusAndLayout,
} from '../../../../../application/use-cases/trips/get-trip/get-trip.repository.interface';
import { Bus } from '../../../../../domain/entities/bus.entity';
import { BusLayout } from '../../../../../domain/entities/bus-layout.entity';
import { Trip } from '../../../../../domain/entities/trip.entity';
import { TripEntity } from '../../entities/trip.entity';

@Injectable()
export class GetTripRepository implements IGetTripRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: EntityRepository<TripEntity>,
  ) {}

  // Q: This method seems to not be used anymore.
  async findByIdWithBusAndLayout(id: string): Promise<TripWithBusAndLayout | null> {
    try {
      const entity = await this.repository.findOne({ id }, { populate: ['bus.layout'] });
      if (!entity) {
        return null;
      }
      return {
        trip: this.toDomain(entity),
        bus: Bus.reconstruct({
          id: entity.bus.id,
          model: entity.bus.model,
          enterpriseId: entity.bus.enterprise,
          layoutId: entity.bus.layout.id,
          createdAt: entity.bus.createdAt,
          updatedAt: entity.bus.updatedAt,
        }),
        layout: BusLayout.reconstruct({
          id: entity.bus.layout.id,
          name: entity.bus.layout.name,
          layoutGrid: entity.bus.layout.layoutGrid,
          createdAt: entity.bus.layout.createdAt,
          updatedAt: entity.bus.layout.updatedAt,
        }),
      };
    } catch {
      return null;
    }
  }

  private toDomain(entity: TripEntity): Trip {
    return Trip.reconstruct({
      id: entity.id,
      departureAt: entity.departureAt,
      routeId: entity.route,
      busId: entity.bus.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
