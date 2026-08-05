import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRouteRequestDto {
  @ApiProperty({ description: 'Route name', example: 'Central - North' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Origin terminal', example: 'Terminal Central' })
  @IsString()
  origin: string;

  @ApiProperty({ description: 'Destination terminal', example: 'Terminal Norte' })
  @IsString()
  destination: string;
}
