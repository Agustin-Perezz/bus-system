import { Route } from '../../../../domain/entities/route.entity';

export interface IDeleteRouteRepository {
  findById(id: string): Promise<Route | null>;
  delete(id: string): Promise<void>;
}
