import { Bus } from '../../../../domain/entities/bus.entity';
import { BusLayout } from '../../../../domain/entities/bus-layout.entity';
import { Trip } from '../../../../domain/entities/trip.entity';

export interface TripWithBusAndLayout {
  trip: Trip;
  bus: Bus;
  layout: BusLayout;
}

export interface IGetTripRepository {
  findByIdWithBusAndLayout(id: string): Promise<TripWithBusAndLayout | null>;
}
