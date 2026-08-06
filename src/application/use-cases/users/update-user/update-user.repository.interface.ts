import { User } from '../../../../domain/entities/user.entity';

export interface IUpdateUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}
