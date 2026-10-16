import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class CreateTripRequestDto {
  @ApiProperty({
    description: 'Departure datetime (ISO 8601)',
    example: '2026-08-10T08:00:00.000Z',
  })
  @IsDateString()
  departureAt: string;

  @ApiProperty({ description: 'Route ID', example: '0193b1a0-0000-7bbb-8bbb-000000000001' })
  @IsUUID()
  routeId: string;

  @ApiProperty({
    description: 'Bus ID assigned to the trip',
    example: '01a13f8a-99b8-7419-b0ea-de165a7b4fe5',
  })
  @IsUUID()
  busId: string;
}
