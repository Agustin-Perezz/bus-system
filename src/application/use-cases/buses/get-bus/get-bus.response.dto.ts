import { ApiProperty } from '@nestjs/swagger';

export class GetBusResponseDto {
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

  constructor(partial: Partial<GetBusResponseDto>) {
    Object.assign(this, partial);
  }
}
