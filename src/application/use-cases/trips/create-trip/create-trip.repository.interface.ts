import { Bus } from '../../../../domain/entities/bus.entity';
import { Route } from '../../../../domain/entities/route.entity';
import { Trip } from '../../../../domain/entities/trip.entity';

export interface ICreateTripRepository {
  create(trip: Trip): Promise<Trip>;
  findRouteById(id: string): Promise<Route | null>;
  findBusById(id: string): Promise<Bus | null>;
}
