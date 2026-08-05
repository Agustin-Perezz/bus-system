import { Route } from '../../../../domain/entities/route.entity';
import { Trip } from '../../../../domain/entities/trip.entity';

export interface IUpdateTripRepository {
  findById(id: string): Promise<Trip | null>;
  save(trip: Trip): Promise<Trip>;
  findRouteById(id: string): Promise<Route | null>;
}
