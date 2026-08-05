import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface ICreateEnterpriseRepository {
  create(enterprise: Enterprise): Promise<Enterprise>;
  existsByLegalId(legalId: string): Promise<boolean>;
}
