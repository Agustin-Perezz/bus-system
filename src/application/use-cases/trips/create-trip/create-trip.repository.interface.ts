import { Route } from '../../../../domain/entities/route.entity';
import { Trip } from '../../../../domain/entities/trip.entity';

export interface ICreateTripRepository {
  create(trip: Trip): Promise<Trip>;
  findRouteById(id: string): Promise<Route | null>;
}
