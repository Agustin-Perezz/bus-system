import { Trip } from '../../../../domain/entities/trip.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListTripsRepository {
  findAll(pagination: PaginationRequestDto): Promise<[Trip[], number]>;
}
