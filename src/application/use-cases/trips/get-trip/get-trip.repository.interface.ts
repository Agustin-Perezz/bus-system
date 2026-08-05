import { Trip } from '../../../../domain/entities/trip.entity';

export interface IGetTripRepository {
  findById(id: string): Promise<Trip | null>;
}
