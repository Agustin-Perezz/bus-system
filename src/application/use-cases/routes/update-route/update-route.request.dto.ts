import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRouteRequestDto {
  @ApiPropertyOptional({ description: 'Route name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Origin terminal' })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({ description: 'Destination terminal' })
  @IsOptional()
  @IsString()
  destination?: string;
}
