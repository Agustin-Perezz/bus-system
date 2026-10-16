import { ApiProperty } from '@nestjs/swagger';

import type { BusLayoutGrid } from '../../../../domain/entities/bus-layout-grid';
export class TripBusLayoutResponseDto {
  @ApiProperty({ description: 'Bus layout template ID' })
  id: string;

  @ApiProperty({ description: 'Layout template name' })
  name: string;

  @ApiProperty({
    description: 'Layout blueprint grid (levels, rows, columns, nodes)',
    type: Object,
  })
  layoutGrid: BusLayoutGrid;

  constructor(partial: Partial<TripBusLayoutResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TripBusResponseDto {
  @ApiProperty({ description: 'Bus unique ID' })
  id: string;

  @ApiProperty({ description: 'Bus model' })
  model: string;

  @ApiProperty({ description: 'Enterprise ID' })
  enterpriseId: string;

  @ApiProperty({ description: 'Bus layout template', type: TripBusLayoutResponseDto })
  layout: TripBusLayoutResponseDto;

  constructor(partial: Partial<TripBusResponseDto>) {
    Object.assign(this, partial);
  }
}

export class GetTripResponseDto {
  @ApiProperty({ description: 'Trip unique ID' })
  id: string;

  @ApiProperty({
    description: 'Departure datetime (ISO 8601)',
    example: '2026-08-10T08:00:00.000Z',
  })
  departureAt: Date;

  @ApiProperty({ description: 'Route ID' })
  routeId: string;

  @ApiProperty({ description: 'Bus ID' })
  busId: string;

  @ApiProperty({ description: 'Associated bus with its layout template', type: TripBusResponseDto })
  bus: TripBusResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<GetTripResponseDto>) {
    Object.assign(this, partial);
  }
}
