import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString, IsUUID } from 'class-validator';

import { USER_ROLES, type UserRole } from '../../../../domain/entities/user.entity';

export class CreateUserRequestDto {
  @ApiProperty({ description: 'User name', example: 'Jane Driver' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'User email (unique)', example: 'jane@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User role', example: 'driver', enum: USER_ROLES })
  @IsIn(USER_ROLES)
  role: UserRole;

  @ApiProperty({ description: 'Enterprise ID', example: '0193b1a0-0000-7bbb-8bbb-000000000001' })
  @IsUUID()
  enterpriseId: string;
}
