import { Inject, Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';
import { IListUsersRepository } from './list-users.repository.interface';
import { ListUsersResponseDto, UserResponseDto } from './list-users.response.dto';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('IListUsersRepository')
    private readonly repository: IListUsersRepository,
  ) {}

  async execute(pagination: PaginationRequestDto): Promise<ListUsersResponseDto> {
    const { limit, offset } = pagination;
    const [users, total] = await this.repository.findAll(pagination);
    return new ListUsersResponseDto({
      users: users.map(
        (user) =>
          new UserResponseDto({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            enterpriseId: user.enterpriseId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }),
      ),
      total,
      limit,
      offset,
    });
  }
}
