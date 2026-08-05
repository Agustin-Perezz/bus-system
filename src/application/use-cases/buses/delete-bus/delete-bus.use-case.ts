import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IDeleteBusRepository } from './delete-bus.repository.interface';

@Injectable()
export class DeleteBusUseCase {
  constructor(
    @Inject('IDeleteBusRepository')
    private readonly repository: IDeleteBusRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const bus = await this.repository.findById(id);
    if (!bus) {
      throw new NotFoundException('Bus not found');
    }
    await this.repository.delete(id);
  }
}
