import { ApiProperty } from '@nestjs/swagger';

import { type UserRole } from '../../../../domain/entities/user.entity';
import { PaginationResponseDto } from '../../../shared/dtos/pagination.response.dto';

export class UserResponseDto {
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

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListUsersResponseDto extends PaginationResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'List of users' })
  users: UserResponseDto[];

  constructor(partial: Partial<ListUsersResponseDto>) {
    super(partial);
    this.users = partial.users ?? [];
  }
}
