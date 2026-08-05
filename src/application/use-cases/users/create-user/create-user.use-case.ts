import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../../../../domain/entities/user.entity';
import { ICreateUserRepository } from './create-user.repository.interface';
import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserResponseDto } from './create-user.response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('ICreateUserRepository')
    private readonly repository: ICreateUserRepository,
  ) {}

  async execute(dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const enterprise = await this.repository.findEnterpriseById(dto.enterpriseId);
    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }

    const emailExists = await this.repository.existsByEmail(dto.email);
    if (emailExists) {
      throw new BadRequestException('A user with that email already exists');
    }

    const user = User.create({
      name: dto.name,
      email: dto.email,
      role: dto.role,
      enterpriseId: dto.enterpriseId,
    });
    const created = await this.repository.create(user);

    return new CreateUserResponseDto({
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      enterpriseId: created.enterpriseId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
