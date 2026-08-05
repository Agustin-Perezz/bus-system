import { Bus } from '../../../../domain/entities/bus.entity';
import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface IUpdateBusRepository {
  findById(id: string): Promise<Bus | null>;
  save(bus: Bus): Promise<Bus>;
  findEnterpriseById(id: string): Promise<Enterprise | null>;
}
