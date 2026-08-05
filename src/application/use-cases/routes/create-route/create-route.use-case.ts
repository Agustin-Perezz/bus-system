import { Inject, Injectable } from '@nestjs/common';

import { Route } from '../../../../domain/entities/route.entity';
import { ICreateRouteRepository } from './create-route.repository.interface';
import { CreateRouteRequestDto } from './create-route.request.dto';
import { CreateRouteResponseDto } from './create-route.response.dto';

@Injectable()
export class CreateRouteUseCase {
  constructor(
    @Inject('ICreateRouteRepository')
    private readonly repository: ICreateRouteRepository,
  ) {}

  async execute(dto: CreateRouteRequestDto): Promise<CreateRouteResponseDto> {
    const route = Route.create({
      name: dto.name,
      origin: dto.origin,
      destination: dto.destination,
    });
    const created = await this.repository.create(route);

    return new CreateRouteResponseDto({
      id: created.id,
      name: created.name,
      origin: created.origin,
      destination: created.destination,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }
}
