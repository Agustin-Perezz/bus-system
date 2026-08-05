import { Enterprise } from '../../../../domain/entities/enterprise.entity';
import { User } from '../../../../domain/entities/user.entity';

export interface IUpdateUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findEnterpriseById(id: string): Promise<Enterprise | null>;
  existsByEmail(email: string): Promise<boolean>;
}
