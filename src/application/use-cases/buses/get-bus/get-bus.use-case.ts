import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IGetBusRepository } from './get-bus.repository.interface';
import { GetBusResponseDto } from './get-bus.response.dto';

@Injectable()
export class GetBusUseCase {
  constructor(
    @Inject('IGetBusRepository')
    private readonly repository: IGetBusRepository,
  ) {}

  async execute(id: string): Promise<GetBusResponseDto> {
    const bus = await this.repository.findById(id);
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }

    return new GetBusResponseDto({
      id: bus.id,
      model: bus.model,
      enterpriseId: bus.enterpriseId,
      createdAt: bus.createdAt,
      updatedAt: bus.updatedAt,
    });
  }
}
