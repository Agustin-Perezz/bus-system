import { Bus } from '../../../../domain/entities/bus.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListBusesRepository {
  findAll(pagination: PaginationRequestDto): Promise<[Bus[], number]>;
}
