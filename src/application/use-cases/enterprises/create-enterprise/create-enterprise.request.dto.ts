import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateEnterpriseRequestDto {
  @ApiProperty({ description: 'Enterprise name', example: 'Acme Bus Co.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Legal ID (unique)', example: 'US-12-3456789' })
  @IsString()
  legalId: string;

  @ApiProperty({ description: 'Owner user ID', example: '0193b1a0-0000-7bbb-8bbb-000000000001' })
  @IsUUID()
  ownerId: string;
}
