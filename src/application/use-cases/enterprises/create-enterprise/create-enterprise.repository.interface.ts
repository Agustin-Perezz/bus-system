import { Enterprise } from '../../../../domain/entities/enterprise.entity';
import { User } from '../../../../domain/entities/user.entity';

export interface ICreateEnterpriseRepository {
  create(enterprise: Enterprise): Promise<Enterprise>;
  existsByLegalId(legalId: string): Promise<boolean>;
  findUserById(id: string): Promise<User | null>;
}
