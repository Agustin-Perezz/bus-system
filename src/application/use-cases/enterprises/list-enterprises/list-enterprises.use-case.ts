import { Inject, Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';
import { IListEnterprisesRepository } from './list-enterprises.repository.interface';
import { EnterpriseResponseDto, ListEnterprisesResponseDto } from './list-enterprises.response.dto';

@Injectable()
export class ListEnterprisesUseCase {
  constructor(
    @Inject('IListEnterprisesRepository')
    private readonly repository: IListEnterprisesRepository,
  ) {}

  async execute(pagination: PaginationRequestDto): Promise<ListEnterprisesResponseDto> {
    const { limit, offset } = pagination;
    const [enterprises, total] = await this.repository.findAll(pagination);
    return new ListEnterprisesResponseDto({
      enterprises: enterprises.map(
        (enterprise) =>
          new EnterpriseResponseDto({
            id: enterprise.id,
            name: enterprise.name,
            legalId: enterprise.legalId,
            createdAt: enterprise.createdAt,
            updatedAt: enterprise.updatedAt,
          }),
      ),
      total,
      limit,
      offset,
    });
  }
}
