import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class RouteResponseDto {
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

  constructor(partial: Partial<RouteResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListRoutesResponseDto extends PaginationResponseDto {
  @ApiProperty({ type: [RouteResponseDto], description: 'List of routes' })
  routes: RouteResponseDto[];

  constructor(partial: Partial<ListRoutesResponseDto>) {
    super(partial);
    this.routes = partial.routes ?? [];
  }
}
