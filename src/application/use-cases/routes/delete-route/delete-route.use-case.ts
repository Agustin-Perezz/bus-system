import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IDeleteRouteRepository } from './delete-route.repository.interface';

@Injectable()
export class DeleteRouteUseCase {
  constructor(
    @Inject('IDeleteRouteRepository')
    private readonly repository: IDeleteRouteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const route = await this.repository.findById(id);
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    await this.repository.delete(id);
  }
}
