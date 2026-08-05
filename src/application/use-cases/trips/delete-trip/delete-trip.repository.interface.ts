import { Trip } from '../../../../domain/entities/trip.entity';

export interface IDeleteTripRepository {
  findById(id: string): Promise<Trip | null>;
  delete(id: string): Promise<void>;
}
