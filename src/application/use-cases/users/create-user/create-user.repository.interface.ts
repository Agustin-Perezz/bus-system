import { User } from '../../../../domain/entities/user.entity';

export interface ICreateUserRepository {
  create(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}
