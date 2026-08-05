import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IDeleteTripRepository } from './delete-trip.repository.interface';

@Injectable()
export class DeleteTripUseCase {
  constructor(
    @Inject('IDeleteTripRepository')
    private readonly repository: IDeleteTripRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const trip = await this.repository.findById(id);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    await this.repository.delete(id);
  }
}
