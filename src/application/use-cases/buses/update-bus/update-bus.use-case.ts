import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUpdateBusRepository } from './update-bus.repository.interface';
import { UpdateBusRequestDto } from './update-bus.request.dto';
import { UpdateBusResponseDto } from './update-bus.response.dto';

@Injectable()
export class UpdateBusUseCase {
  constructor(
    @Inject('IUpdateBusRepository')
    private readonly repository: IUpdateBusRepository,
  ) {}

  async execute(id: string, dto: UpdateBusRequestDto): Promise<UpdateBusResponseDto> {
    const bus = await this.repository.findById(id);
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }

    if (dto.enterpriseId !== undefined) {
      const enterprise = await this.repository.findEnterpriseById(dto.enterpriseId);
      if (!enterprise) {
        throw new NotFoundException('Enterprise not found');
      }
      bus.updateEnterpriseId(dto.enterpriseId);
    }

    if (dto.model !== undefined) {
      bus.updateModel(dto.model);
    }

    const updated = await this.repository.save(bus);

    return new UpdateBusResponseDto({
      id: updated.id,
      model: updated.model,
      enterpriseId: updated.enterpriseId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
