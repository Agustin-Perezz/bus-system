import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IGetTripRepository } from './get-trip.repository.interface';
import { GetTripResponseDto } from './get-trip.response.dto';

@Injectable()
export class GetTripUseCase {
  constructor(
    @Inject('IGetTripRepository')
    private readonly repository: IGetTripRepository,
  ) {}

  async execute(id: string): Promise<GetTripResponseDto> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return new GetTripResponseDto({
      id: trip.id,
      departureAt: trip.departureAt,
      routeId: trip.routeId,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    });
  }
}
