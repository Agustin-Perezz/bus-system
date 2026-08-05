import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IDeleteUserRepository } from './delete-user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('IDeleteUserRepository')
    private readonly repository: IDeleteUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.repository.delete(id);
  }
}
