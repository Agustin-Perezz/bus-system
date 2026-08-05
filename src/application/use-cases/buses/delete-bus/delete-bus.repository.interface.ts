import { Bus } from '../../../../domain/entities/bus.entity';

export interface IDeleteBusRepository {
  findById(id: string): Promise<Bus | null>;
  delete(id: string): Promise<void>;
}
