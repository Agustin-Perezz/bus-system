import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class TripResponseDto {
  @ApiProperty({ description: 'Trip unique ID' })
  id: string;

  @ApiProperty({ description: 'Departure datetime (ISO 8601)' })
  departureAt: Date;

  @ApiProperty({ description: 'Route ID' })
  routeId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<TripResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListTripsResponseDto extends PaginationResponseDto {
  @ApiProperty({ type: [TripResponseDto], description: 'List of trips' })
  trips: TripResponseDto[];

  constructor(partial: Partial<ListTripsResponseDto>) {
    super(partial);
    this.trips = partial.trips ?? [];
  }
}
