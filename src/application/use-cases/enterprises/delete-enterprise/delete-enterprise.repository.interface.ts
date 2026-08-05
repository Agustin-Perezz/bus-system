import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface IDeleteEnterpriseRepository {
  findById(id: string): Promise<Enterprise | null>;
  delete(id: string): Promise<void>;
}
