import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class UpdateTripRequestDto {
  @ApiPropertyOptional({ description: 'Departure datetime (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  departureAt?: string;

  @ApiPropertyOptional({ description: 'Route ID' })
  @IsOptional()
  @IsUUID()
  routeId?: string;
}
