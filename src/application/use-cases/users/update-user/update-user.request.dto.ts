import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

import { USER_ROLES, type UserRole } from '../../../../domain/entities/user.entity';

export class UpdateUserRequestDto {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'User email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'User role', enum: USER_ROLES })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Enterprise ID' })
  @IsOptional()
  @IsUUID()
  enterpriseId?: string;
}
