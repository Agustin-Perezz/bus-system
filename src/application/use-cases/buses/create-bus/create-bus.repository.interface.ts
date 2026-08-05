import { Bus } from '../../../../domain/entities/bus.entity';
import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface ICreateBusRepository {
  create(bus: Bus): Promise<Bus>;
  findEnterpriseById(id: string): Promise<Enterprise | null>;
}
