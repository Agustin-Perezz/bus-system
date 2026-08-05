import { ApiProperty } from '@nestjs/swagger';

export class UpdateRouteResponseDto {
  @ApiProperty({ description: 'Route unique ID' })
  id: string;

  @ApiProperty({ description: 'Route name' })
  name: string;

  @ApiProperty({ description: 'Origin terminal' })
  origin: string;

  @ApiProperty({ description: 'Destination terminal' })
  destination: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<UpdateRouteResponseDto>) {
    Object.assign(this, partial);
  }
}
