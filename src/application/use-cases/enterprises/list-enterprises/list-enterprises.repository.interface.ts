import { Enterprise } from '../../../../domain/entities/enterprise.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListEnterprisesRepository {
  findAll(pagination: PaginationRequestDto): Promise<[Enterprise[], number]>;
}
