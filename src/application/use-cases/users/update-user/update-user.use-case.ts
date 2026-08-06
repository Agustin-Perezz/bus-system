import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUpdateUserRepository } from './update-user.repository.interface';
import { UpdateUserRequestDto } from './update-user.request.dto';
import { UpdateUserResponseDto } from './update-user.response.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUpdateUserRepository')
    private readonly repository: IUpdateUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email !== undefined && dto.email !== user.email) {
      const emailExists = await this.repository.existsByEmail(dto.email);
      if (emailExists) {
        throw new BadRequestException('A user with that email already exists');
      }
      user.updateEmail(dto.email);
    }

    if (dto.name !== undefined) {
      user.updateName(dto.name);
    }
    if (dto.role !== undefined) {
      user.updateRole(dto.role);
    }

    const updated = await this.repository.save(user);

    return new UpdateUserResponseDto({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
