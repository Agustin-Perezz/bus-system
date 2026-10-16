import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IGetTripRepository } from './get-trip.repository.interface';
import {
  GetTripResponseDto,
  TripBusLayoutResponseDto,
  TripBusResponseDto,
} from './get-trip.response.dto';

@Injectable()
export class GetTripUseCase {
  constructor(
    @Inject('IGetTripRepository')
    private readonly repository: IGetTripRepository,
  ) {}

  async execute(id: string): Promise<GetTripResponseDto> {
    const result = await this.repository.findByIdWithBusAndLayout(id);
    if (!result) {
      throw new NotFoundException('Trip not found');
    }

    const { trip, bus, layout } = result;

    return new GetTripResponseDto({
      id: trip.id,
      departureAt: trip.departureAt,
      routeId: trip.routeId,
      busId: trip.busId,
      bus: new TripBusResponseDto({
        id: bus.id,
        model: bus.model,
        enterpriseId: bus.enterpriseId,
        layout: new TripBusLayoutResponseDto({
          id: layout.id,
          name: layout.name,
          layoutGrid: layout.layoutGrid,
        }),
      }),
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    });
  }
}
