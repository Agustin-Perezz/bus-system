import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface IGetEnterpriseRepository {
  findById(id: string): Promise<Enterprise | null>;
}
