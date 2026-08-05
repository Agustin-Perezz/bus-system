import { ApiProperty } from '@nestjs/swagger';

export class UpdateTripResponseDto {
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

  constructor(partial: Partial<UpdateTripResponseDto>) {
    Object.assign(this, partial);
  }
}
