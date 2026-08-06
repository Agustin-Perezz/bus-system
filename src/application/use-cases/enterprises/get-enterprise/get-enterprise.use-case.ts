import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IGetEnterpriseRepository } from './get-enterprise.repository.interface';
import { GetEnterpriseResponseDto } from './get-enterprise.response.dto';

@Injectable()
export class GetEnterpriseUseCase {
  constructor(
    @Inject('IGetEnterpriseRepository')
    private readonly repository: IGetEnterpriseRepository,
  ) {}

  async execute(id: string): Promise<GetEnterpriseResponseDto> {
    const enterprise = await this.repository.findById(id);
    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }

    return new GetEnterpriseResponseDto({
      id: enterprise.id,
      name: enterprise.name,
      legalId: enterprise.legalId,
      ownerId: enterprise.ownerId,
      createdAt: enterprise.createdAt,
      updatedAt: enterprise.updatedAt,
    });
  }
}
