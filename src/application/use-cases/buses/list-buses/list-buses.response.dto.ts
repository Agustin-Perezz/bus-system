import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class BusResponseDto {
  @ApiProperty({ description: 'Bus unique ID' })
  id: string;

  @ApiProperty({ description: 'Bus model' })
  model: string;

  @ApiProperty({ description: 'Enterprise ID' })
  enterpriseId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<BusResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListBusesResponseDto extends PaginationResponseDto {
  @ApiProperty({ type: [BusResponseDto], description: 'List of buses' })
  buses: BusResponseDto[];

  constructor(partial: Partial<ListBusesResponseDto>) {
    super(partial);
    this.buses = partial.buses ?? [];
  }
}
