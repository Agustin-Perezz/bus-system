import { Enterprise } from '../../../../domain/entities/enterprise.entity';
import { User } from '../../../../domain/entities/user.entity';

export interface IUpdateEnterpriseRepository {
  findById(id: string): Promise<Enterprise | null>;
  save(enterprise: Enterprise): Promise<Enterprise>;
  findUserById(id: string): Promise<User | null>;
}
