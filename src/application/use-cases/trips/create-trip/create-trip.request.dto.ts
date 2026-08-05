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
}
