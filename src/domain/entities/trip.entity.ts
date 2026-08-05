import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface TripProperties extends BaseEntityProps {
  departureAt: Date;
  routeId: string;
}

export interface CreateTripParams {
  departureAt: Date;
  routeId: string;
}

export interface ReconstructTripParams extends BaseEntityProps {
  departureAt: Date;
  routeId: string;
}

export class Trip extends BaseEntity {
  private _departureAt: Date;
  private _routeId: string;

  private constructor(props: TripProperties) {
    super(props);
    this._departureAt = props.departureAt;
    this._routeId = props.routeId;
  }

  static create(params: CreateTripParams): Trip {
    return new Trip({
      ...generateBaseEntityProps(),
      departureAt: params.departureAt,
      routeId: params.routeId,
    });
  }

  static reconstruct(params: ReconstructTripParams): Trip {
    return new Trip(params);
  }

  get departureAt(): Date {
    return this._departureAt;
  }

  get routeId(): string {
    return this._routeId;
  }

  updateDepartureAt(departureAt: Date): void {
    this._departureAt = departureAt;
    this.touch();
  }

  updateRouteId(routeId: string): void {
    this._routeId = routeId;
    this.touch();
  }
}
