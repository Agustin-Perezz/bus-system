import { Inject, Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';
import { IListBusesRepository } from './list-buses.repository.interface';
import { BusResponseDto, ListBusesResponseDto } from './list-buses.response.dto';

@Injectable()
export class ListBusesUseCase {
  constructor(
    @Inject('IListBusesRepository')
    private readonly repository: IListBusesRepository,
  ) {}

  async execute(pagination: PaginationRequestDto): Promise<ListBusesResponseDto> {
    const { limit, offset } = pagination;
    const [buses, total] = await this.repository.findAll(pagination);
    return new ListBusesResponseDto({
      buses: buses.map(
        (bus) =>
          new BusResponseDto({
            id: bus.id,
            model: bus.model,
            enterpriseId: bus.enterpriseId,
            createdAt: bus.createdAt,
            updatedAt: bus.updatedAt,
          }),
      ),
      total,
      limit,
      offset,
    });
  }
}
