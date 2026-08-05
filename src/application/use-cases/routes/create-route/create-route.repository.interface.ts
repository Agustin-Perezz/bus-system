import { Route } from '../../../../domain/entities/route.entity';

export interface ICreateRouteRepository {
  create(route: Route): Promise<Route>;
}
