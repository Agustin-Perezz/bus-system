import { ApiProperty } from '@nestjs/swagger';

export class UpdateEnterpriseResponseDto {
  @ApiProperty({ description: 'Enterprise unique ID' })
  id: string;

  @ApiProperty({ description: 'Enterprise name' })
  name: string;

  @ApiProperty({ description: 'Legal ID' })
  legalId: string;

  @ApiProperty({ description: 'Owner user ID' })
  ownerId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<UpdateEnterpriseResponseDto>) {
    Object.assign(this, partial);
  }
}
