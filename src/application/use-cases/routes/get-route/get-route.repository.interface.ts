import { Route } from '../../../../domain/entities/route.entity';

export interface IGetRouteRepository {
  findById(id: string): Promise<Route | null>;
}
