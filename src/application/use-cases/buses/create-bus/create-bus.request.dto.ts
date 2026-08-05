import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBusRequestDto {
  @ApiProperty({ description: 'Bus model', example: 'Mercedes-Benz O500' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Enterprise ID', example: '0193b1a0-0000-7bbb-8bbb-000000000001' })
  @IsUUID()
  enterpriseId: string;
}
