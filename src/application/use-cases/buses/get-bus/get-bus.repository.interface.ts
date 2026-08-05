import { Bus } from '../../../../domain/entities/bus.entity';

export interface IGetBusRepository {
  findById(id: string): Promise<Bus | null>;
}
