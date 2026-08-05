import { User } from '../../../../domain/entities/user.entity';

export interface IGetUserRepository {
  findById(id: string): Promise<User | null>;
}
