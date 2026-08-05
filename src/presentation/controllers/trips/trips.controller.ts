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
import { CreateTripRequestDto } from '../../../application/use-cases/trips/create-trip/create-trip.request.dto';
import { CreateTripResponseDto } from '../../../application/use-cases/trips/create-trip/create-trip.response.dto';
import { CreateTripUseCase } from '../../../application/use-cases/trips/create-trip/create-trip.use-case';
import { DeleteTripUseCase } from '../../../application/use-cases/trips/delete-trip/delete-trip.use-case';
import { GetTripResponseDto } from '../../../application/use-cases/trips/get-trip/get-trip.response.dto';
import { GetTripUseCase } from '../../../application/use-cases/trips/get-trip/get-trip.use-case';
import { ListTripsResponseDto } from '../../../application/use-cases/trips/list-trips/list-trips.response.dto';
import { ListTripsUseCase } from '../../../application/use-cases/trips/list-trips/list-trips.use-case';
import { UpdateTripRequestDto } from '../../../application/use-cases/trips/update-trip/update-trip.request.dto';
import { UpdateTripResponseDto } from '../../../application/use-cases/trips/update-trip/update-trip.response.dto';
import { UpdateTripUseCase } from '../../../application/use-cases/trips/update-trip/update-trip.use-case';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly getTripUseCase: GetTripUseCase,
    private readonly listTripsUseCase: ListTripsUseCase,
    private readonly updateTripUseCase: UpdateTripUseCase,
    private readonly deleteTripUseCase: DeleteTripUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({
    status: 201,
    description: 'Trip created successfully',
    type: CreateTripResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async create(@Body() dto: CreateTripRequestDto): Promise<CreateTripResponseDto> {
    return this.createTripUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all trips' })
  @ApiResponse({
    status: 200,
    description: 'List of trips',
    type: ListTripsResponseDto,
  })
  async list(@Query() pagination: PaginationRequestDto): Promise<ListTripsResponseDto> {
    return this.listTripsUseCase.execute(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Trip found',
    type: GetTripResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async get(@Param('id') id: string): Promise<GetTripResponseDto> {
    return this.getTripUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Trip updated',
    type: UpdateTripResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Trip or route not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTripRequestDto,
  ): Promise<UpdateTripResponseDto> {
    return this.updateTripUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({ status: 204, description: 'Trip deleted' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteTripUseCase.execute(id);
  }
}
