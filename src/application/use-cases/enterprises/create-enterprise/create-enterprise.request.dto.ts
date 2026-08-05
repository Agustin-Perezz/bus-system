import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateEnterpriseRequestDto {
  @ApiProperty({ description: 'Enterprise name', example: 'Acme Bus Co.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Legal ID (unique)', example: 'US-12-3456789' })
  @IsString()
  legalId: string;
}
