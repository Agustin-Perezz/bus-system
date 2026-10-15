import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Bus } from '../../../../domain/entities/bus.entity';
import { ICreateBusRepository } from './create-bus.repository.interface';
import { CreateBusRequestDto } from './create-bus.request.dto';
import { CreateBusResponseDto } from './create-bus.response.dto';

@Injectable()
export class CreateBusUseCase {
  constructor(
    @Inject('ICreateBusRepository')
    private readonly repository: ICreateBusRepository,
  ) {}

  async execute(dto: CreateBusRequestDto): Promise<CreateBusResponseDto> {
    const enterprise = await this.repository.findEnterpriseById(dto.enterpriseId);
    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }

    const layout = await this.repository.findLayoutById(dto.layoutId);
    if (!layout) {
      throw new NotFoundException('Bus layout not found');
    }

    const bus = Bus.create({
      model: dto.model,
      enterpriseId: dto.enterpriseId,
      layoutId: dto.layoutId,
    });
    const created = await this.repository.create(bus);

    return new CreateBusResponseDto({
      id: created.id,
      model: created.model,
      enterpriseId: created.enterpriseId,
      layoutId: created.layoutId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
