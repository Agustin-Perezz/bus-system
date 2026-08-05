import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IGetUserRepository } from './get-user.repository.interface';
import { GetUserResponseDto } from './get-user.response.dto';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject('IGetUserRepository')
    private readonly repository: IGetUserRepository,
  ) {}

  async execute(id: string): Promise<GetUserResponseDto> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new GetUserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enterpriseId: user.enterpriseId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
