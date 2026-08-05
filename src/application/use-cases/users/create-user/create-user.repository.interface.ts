import { Enterprise } from '../../../../domain/entities/enterprise.entity';
import { User } from '../../../../domain/entities/user.entity';

export interface ICreateUserRepository {
  create(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  findEnterpriseById(id: string): Promise<Enterprise | null>;
}
