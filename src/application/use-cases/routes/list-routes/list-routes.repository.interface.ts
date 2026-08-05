import { Route } from '../../../../domain/entities/route.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListRoutesRepository {
  findAll(pagination: PaginationRequestDto): Promise<[Route[], number]>;
}
