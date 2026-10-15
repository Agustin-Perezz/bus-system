import { Bus } from '../../../../domain/entities/bus.entity';
import { BusLayout } from '../../../../domain/entities/bus-layout.entity';
import { Enterprise } from '../../../../domain/entities/enterprise.entity';

export interface ICreateBusRepository {
  create(bus: Bus): Promise<Bus>;
  findEnterpriseById(id: string): Promise<Enterprise | null>;
  findLayoutById(id: string): Promise<BusLayout | null>;
}
