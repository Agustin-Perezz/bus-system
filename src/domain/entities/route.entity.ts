import { BaseEntity, type BaseEntityProps, generateBaseEntityProps } from './base.entity';

export interface RouteProperties extends BaseEntityProps {
  name: string;
  origin: string;
  destination: string;
}

export interface CreateRouteParams {
  name: string;
  origin: string;
  destination: string;
}

export interface ReconstructRouteParams extends BaseEntityProps {
  name: string;
  origin: string;
  destination: string;
}

export class Route extends BaseEntity {
  private _name: string;
  private _origin: string;
  private _destination: string;

  private constructor(props: RouteProperties) {
    super(props);
    this._name = props.name;
    this._origin = props.origin;
    this._destination = props.destination;
  }

  static create(params: CreateRouteParams): Route {
    return new Route({
      ...generateBaseEntityProps(),
      name: params.name,
      origin: params.origin,
      destination: params.destination,
    });
  }

  static reconstruct(params: ReconstructRouteParams): Route {
    return new Route(params);
  }

  get name(): string {
    return this._name;
  }

  get origin(): string {
    return this._origin;
  }

  get destination(): string {
    return this._destination;
  }

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  updateOrigin(origin: string): void {
    this._origin = origin;
    this.touch();
  }

  updateDestination(destination: string): void {
    this._destination = destination;
    this.touch();
  }
}
