import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUpdateEnterpriseRepository } from './update-enterprise.repository.interface';
import { UpdateEnterpriseRequestDto } from './update-enterprise.request.dto';
import { UpdateEnterpriseResponseDto } from './update-enterprise.response.dto';

@Injectable()
export class UpdateEnterpriseUseCase {
  constructor(
    @Inject('IUpdateEnterpriseRepository')
    private readonly repository: IUpdateEnterpriseRepository,
  ) {}

  async execute(id: string, dto: UpdateEnterpriseRequestDto): Promise<UpdateEnterpriseResponseDto> {
    const enterprise = await this.repository.findById(id);
    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }

    if (dto.ownerId !== undefined) {
      const owner = await this.repository.findUserById(dto.ownerId);
      if (!owner) {
        throw new NotFoundException('Owner user not found');
      }
      enterprise.updateOwnerId(dto.ownerId);
    }

    if (dto.name !== undefined) {
      enterprise.updateName(dto.name);
    }

    const updated = await this.repository.save(enterprise);

    return new UpdateEnterpriseResponseDto({
      id: updated.id,
      name: updated.name,
      legalId: updated.legalId,
      ownerId: updated.ownerId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
