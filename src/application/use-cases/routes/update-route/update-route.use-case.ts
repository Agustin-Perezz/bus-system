import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IUpdateRouteRepository } from './update-route.repository.interface';
import { UpdateRouteRequestDto } from './update-route.request.dto';
import { UpdateRouteResponseDto } from './update-route.response.dto';

@Injectable()
export class UpdateRouteUseCase {
  constructor(
    @Inject('IUpdateRouteRepository')
    private readonly repository: IUpdateRouteRepository,
  ) {}

  async execute(id: string, dto: UpdateRouteRequestDto): Promise<UpdateRouteResponseDto> {
    const route = await this.repository.findById(id);
    if (!route) {
      throw new NotFoundException('Route not found');
    }

    if (dto.name !== undefined) {
      route.updateName(dto.name);
    }
    if (dto.origin !== undefined) {
      route.updateOrigin(dto.origin);
    }
    if (dto.destination !== undefined) {
      route.updateDestination(dto.destination);
    }

    const updated = await this.repository.save(route);

    return new UpdateRouteResponseDto({
      id: updated.id,
      name: updated.name,
      origin: updated.origin,
      destination: updated.destination,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }
}
