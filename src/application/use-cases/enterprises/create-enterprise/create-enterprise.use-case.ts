import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { Enterprise } from '../../../../domain/entities/enterprise.entity';
import { ICreateEnterpriseRepository } from './create-enterprise.repository.interface';
import { CreateEnterpriseRequestDto } from './create-enterprise.request.dto';
import { CreateEnterpriseResponseDto } from './create-enterprise.response.dto';

@Injectable()
export class CreateEnterpriseUseCase {
  constructor(
    @Inject('ICreateEnterpriseRepository')
    private readonly repository: ICreateEnterpriseRepository,
  ) {}

  async execute(dto: CreateEnterpriseRequestDto): Promise<CreateEnterpriseResponseDto> {
    const legalIdExists = await this.repository.existsByLegalId(dto.legalId);
    if (legalIdExists) {
      throw new BadRequestException('An enterprise with that legal ID already exists');
    }

    const enterprise = Enterprise.create({ name: dto.name, legalId: dto.legalId });
    const created = await this.repository.create(enterprise);

    return new CreateEnterpriseResponseDto({
      id: created.id,
      name: created.name,
      legalId: created.legalId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
