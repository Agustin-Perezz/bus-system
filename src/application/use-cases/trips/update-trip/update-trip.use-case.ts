import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUpdateTripRepository } from './update-trip.repository.interface';
import { UpdateTripRequestDto } from './update-trip.request.dto';
import { UpdateTripResponseDto } from './update-trip.response.dto';

@Injectable()
export class UpdateTripUseCase {
  constructor(
    @Inject('IUpdateTripRepository')
    private readonly repository: IUpdateTripRepository,
  ) {}

  async execute(id: string, dto: UpdateTripRequestDto): Promise<UpdateTripResponseDto> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (dto.routeId !== undefined) {
      const route = await this.repository.findRouteById(dto.routeId);
      if (!route) {
        throw new NotFoundException('Route not found');
      }
      trip.updateRouteId(dto.routeId);
    }

    if (dto.departureAt !== undefined) {
      trip.updateDepartureAt(new Date(dto.departureAt));
    }

    const updated = await this.repository.save(trip);

    return new UpdateTripResponseDto({
      id: updated.id,
      departureAt: updated.departureAt,
      routeId: updated.routeId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
