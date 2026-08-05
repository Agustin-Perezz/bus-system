import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface IUpdateEnterpriseRepository {
  findById(id: string): Promise<Enterprise | null>;
  save(enterprise: Enterprise): Promise<Enterprise>;
}
