import { Inject, Injectable } from '@nestjs/common';

import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';
import { IListRoutesRepository } from './list-routes.repository.interface';
import { ListRoutesResponseDto, RouteResponseDto } from './list-routes.response.dto';

@Injectable()
export class ListRoutesUseCase {
  constructor(
    @Inject('IListRoutesRepository')
    private readonly repository: IListRoutesRepository,
  ) {}

  async execute(pagination: PaginationRequestDto): Promise<ListRoutesResponseDto> {
    const { limit, offset } = pagination;
    const [routes, total] = await this.repository.findAll(pagination);
    return new ListRoutesResponseDto({
      routes: routes.map(
        (route) =>
          new RouteResponseDto({
            id: route.id,
            name: route.name,
            origin: route.origin,
            destination: route.destination,
            createdAt: route.createdAt,
            updatedAt: route.updatedAt,
          }),
      ),
      total,
      limit,
      offset,
    });
  }
}
