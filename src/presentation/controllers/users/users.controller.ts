import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationRequestDto } from '../../../application/shared/dtos/pagination.request.dto';
import { CreateUserRequestDto } from '../../../application/use-cases/users/create-user/create-user.request.dto';
import { CreateUserResponseDto } from '../../../application/use-cases/users/create-user/create-user.response.dto';
import { CreateUserUseCase } from '../../../application/use-cases/users/create-user/create-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/users/delete-user/delete-user.use-case';
import { GetUserResponseDto } from '../../../application/use-cases/users/get-user/get-user.response.dto';
import { GetUserUseCase } from '../../../application/use-cases/users/get-user/get-user.use-case';
import { ListUsersResponseDto } from '../../../application/use-cases/users/list-users/list-users.response.dto';
import { ListUsersUseCase } from '../../../application/use-cases/users/list-users/list-users.use-case';
import { UpdateUserRequestDto } from '../../../application/use-cases/users/update-user/update-user.request.dto';
import { UpdateUserResponseDto } from '../../../application/use-cases/users/update-user/update-user.response.dto';
import { UpdateUserUseCase } from '../../../application/use-cases/users/update-user/update-user.use-case';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data or duplicate email' })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  async create(@Body() dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: ListUsersResponseDto,
  })
  async list(@Query() pagination: PaginationRequestDto): Promise<ListUsersResponseDto> {
    return this.listUsersUseCase.execute(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: GetUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async get(@Param('id') id: string): Promise<GetUserResponseDto> {
    return this.getUserUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UpdateUserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User or enterprise not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
