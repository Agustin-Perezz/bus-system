import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IDeleteEnterpriseRepository } from './delete-enterprise.repository.interface';

@Injectable()
export class DeleteEnterpriseUseCase {
  constructor(
    @Inject('IDeleteEnterpriseRepository')
    private readonly repository: IDeleteEnterpriseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const enterprise = await this.repository.findById(id);
    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }
    await this.repository.delete(id);
  }
}
