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
import { CreateRouteRequestDto } from '../../../application/use-cases/routes/create-route/create-route.request.dto';
import { CreateRouteResponseDto } from '../../../application/use-cases/routes/create-route/create-route.response.dto';
import { CreateRouteUseCase } from '../../../application/use-cases/routes/create-route/create-route.use-case';
import { DeleteRouteUseCase } from '../../../application/use-cases/routes/delete-route/delete-route.use-case';
import { GetRouteResponseDto } from '../../../application/use-cases/routes/get-route/get-route.response.dto';
import { GetRouteUseCase } from '../../../application/use-cases/routes/get-route/get-route.use-case';
import { ListRoutesResponseDto } from '../../../application/use-cases/routes/list-routes/list-routes.response.dto';
import { ListRoutesUseCase } from '../../../application/use-cases/routes/list-routes/list-routes.use-case';
import { UpdateRouteRequestDto } from '../../../application/use-cases/routes/update-route/update-route.request.dto';
import { UpdateRouteResponseDto } from '../../../application/use-cases/routes/update-route/update-route.response.dto';
import { UpdateRouteUseCase } from '../../../application/use-cases/routes/update-route/update-route.use-case';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(
    private readonly createRouteUseCase: CreateRouteUseCase,
    private readonly getRouteUseCase: GetRouteUseCase,
    private readonly listRoutesUseCase: ListRoutesUseCase,
    private readonly updateRouteUseCase: UpdateRouteUseCase,
    private readonly deleteRouteUseCase: DeleteRouteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({
    status: 201,
    description: 'Route created successfully',
    type: CreateRouteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() dto: CreateRouteRequestDto): Promise<CreateRouteResponseDto> {
    return this.createRouteUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all routes' })
  @ApiResponse({
    status: 200,
    description: 'List of routes',
    type: ListRoutesResponseDto,
  })
  async list(@Query() pagination: PaginationRequestDto): Promise<ListRoutesResponseDto> {
    return this.listRoutesUseCase.execute(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a route by ID' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({
    status: 200,
    description: 'Route found',
    type: GetRouteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async get(@Param('id') id: string): Promise<GetRouteResponseDto> {
    return this.getRouteUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({
    status: 200,
    description: 'Route updated',
    type: UpdateRouteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRouteRequestDto,
  ): Promise<UpdateRouteResponseDto> {
    return this.updateRouteUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: 204, description: 'Route deleted' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteRouteUseCase.execute(id);
  }
}
