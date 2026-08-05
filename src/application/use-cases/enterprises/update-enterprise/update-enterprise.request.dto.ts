import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEnterpriseRequestDto {
  @ApiPropertyOptional({ description: 'Enterprise name' })
  @IsOptional()
  @IsString()
  name?: string;
}
