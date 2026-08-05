import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IGetRouteRepository } from './get-route.repository.interface';
import { GetRouteResponseDto } from './get-route.response.dto';

@Injectable()
export class GetRouteUseCase {
  constructor(
    @Inject('IGetRouteRepository')
    private readonly repository: IGetRouteRepository,
  ) {}

  async execute(id: string): Promise<GetRouteResponseDto> {
    const route = await this.repository.findById(id);
    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return new GetRouteResponseDto({
      id: route.id,
      name: route.name,
      origin: route.origin,
      destination: route.destination,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
    });
  }
}
