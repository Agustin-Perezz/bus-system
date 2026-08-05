import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBusRequestDto {
  @ApiPropertyOptional({ description: 'Bus model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Enterprise ID' })
  @IsOptional()
  @IsUUID()
  enterpriseId?: string;
}
