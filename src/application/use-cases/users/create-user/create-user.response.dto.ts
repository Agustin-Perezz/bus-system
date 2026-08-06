import { ApiProperty } from '@nestjs/swagger';

import { type UserRole } from '../../../../domain/entities/user.entity';

export class CreateUserResponseDto {
  @ApiProperty({ description: 'User unique ID' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User role' })
  role: UserRole;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<CreateUserResponseDto>) {
    Object.assign(this, partial);
  }
}
