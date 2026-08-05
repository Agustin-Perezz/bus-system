import { Inject, Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';
import { IListTripsRepository } from './list-trips.repository.interface';
import { ListTripsResponseDto, TripResponseDto } from './list-trips.response.dto';

@Injectable()
export class ListTripsUseCase {
  constructor(
    @Inject('IListTripsRepository')
    private readonly repository: IListTripsRepository,
  ) {}

  async execute(pagination: PaginationRequestDto): Promise<ListTripsResponseDto> {
    const { limit, offset } = pagination;
    const [trips, total] = await this.repository.findAll(pagination);
    return new ListTripsResponseDto({
      trips: trips.map(
        (trip) =>
          new TripResponseDto({
            id: trip.id,
            departureAt: trip.departureAt,
            routeId: trip.routeId,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
          }),
      ),
      total,
      limit,
      offset,
    });
  }
}
