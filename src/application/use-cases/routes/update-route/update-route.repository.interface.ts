import { Route } from '../../../../domain/entities/route.entity';

export interface IUpdateRouteRepository {
  findById(id: string): Promise<Route | null>;
  save(route: Route): Promise<Route>;
}
