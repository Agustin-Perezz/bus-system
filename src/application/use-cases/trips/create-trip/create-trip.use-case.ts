import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Trip } from '../../../../domain/entities/trip.entity';
import { ICreateTripRepository } from './create-trip.repository.interface';
import { CreateTripRequestDto } from './create-trip.request.dto';
import { CreateTripResponseDto } from './create-trip.response.dto';

@Injectable()
export class CreateTripUseCase {
  constructor(
    @Inject('ICreateTripRepository')
    private readonly repository: ICreateTripRepository,
  ) {}

  async execute(dto: CreateTripRequestDto): Promise<CreateTripResponseDto> {
    const route = await this.repository.findRouteById(dto.routeId);
    if (!route) {
      throw new NotFoundException('Route not found');
    }

    const trip = Trip.create({
      departureAt: new Date(dto.departureAt),
      routeId: dto.routeId,
    });
    const created = await this.repository.create(trip);

    return new CreateTripResponseDto({
      id: created.id,
      departureAt: created.departureAt,
      routeId: created.routeId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
