import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusResponseDto {
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

  constructor(partial: Partial<UpdateBusResponseDto>) {
    Object.assign(this, partial);
  }
}
