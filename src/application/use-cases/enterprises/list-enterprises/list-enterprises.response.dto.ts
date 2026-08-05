import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class EnterpriseResponseDto {
  @ApiProperty({ description: 'Enterprise unique ID' })
  id: string;

  @ApiProperty({ description: 'Enterprise name' })
  name: string;

  @ApiProperty({ description: 'Legal ID' })
  legalId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<EnterpriseResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListEnterprisesResponseDto extends PaginationResponseDto {
  @ApiProperty({ type: [EnterpriseResponseDto], description: 'List of enterprises' })
  enterprises: EnterpriseResponseDto[];

  constructor(partial: Partial<ListEnterprisesResponseDto>) {
    super(partial);
    this.enterprises = partial.enterprises ?? [];
  }
}
