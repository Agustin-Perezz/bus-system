import { ApiProperty } from '@nestjs/swagger';

import { type UserRole } from '../../../../domain/entities/user.entity';

export class UpdateUserResponseDto {
  @ApiProperty({ description: 'User unique ID' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User role' })
  role: UserRole;

  @ApiProperty({ description: 'Enterprise ID' })
  enterpriseId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<UpdateUserResponseDto>) {
    Object.assign(this, partial);
  }
}
