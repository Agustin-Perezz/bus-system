import { ApiProperty } from '@nestjs/swagger';

export class CreateTripResponseDto {
  @ApiProperty({ description: 'Trip unique ID' })
  id: string;

  @ApiProperty({
    description: 'Departure datetime (ISO 8601)',
    example: '2026-08-10T08:00:00.000Z',
  })
  departureAt: Date;

  @ApiProperty({ description: 'Route ID' })
  routeId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<CreateTripResponseDto>) {
    Object.assign(this, partial);
  }
}
