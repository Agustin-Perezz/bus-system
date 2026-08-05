import { User } from '../../../../domain/entities/user.entity';
import { PaginationRequestDto } from '../../../shared/dtos/pagination.request.dto';

export interface IListUsersRepository {
  findAll(pagination: PaginationRequestDto): Promise<[User[], number]>;
}
