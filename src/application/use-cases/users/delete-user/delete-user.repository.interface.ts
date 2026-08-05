import { User } from '../../../../domain/entities/user.entity';

export interface IDeleteUserRepository {
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
