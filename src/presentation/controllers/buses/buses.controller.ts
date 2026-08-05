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
import { CreateBusRequestDto } from '../../../application/use-cases/buses/create-bus/create-bus.request.dto';
import { CreateBusResponseDto } from '../../../application/use-cases/buses/create-bus/create-bus.response.dto';
import { CreateBusUseCase } from '../../../application/use-cases/buses/create-bus/create-bus.use-case';
import { DeleteBusUseCase } from '../../../application/use-cases/buses/delete-bus/delete-bus.use-case';
import { GetBusResponseDto } from '../../../application/use-cases/buses/get-bus/get-bus.response.dto';
import { GetBusUseCase } from '../../../application/use-cases/buses/get-bus/get-bus.use-case';
import { ListBusesResponseDto } from '../../../application/use-cases/buses/list-buses/list-buses.response.dto';
import { ListBusesUseCase } from '../../../application/use-cases/buses/list-buses/list-buses.use-case';
import { UpdateBusRequestDto } from '../../../application/use-cases/buses/update-bus/update-bus.request.dto';
import { UpdateBusResponseDto } from '../../../application/use-cases/buses/update-bus/update-bus.response.dto';
import { UpdateBusUseCase } from '../../../application/use-cases/buses/update-bus/update-bus.use-case';

@ApiTags('Buses')
@Controller('buses')
export class BusesController {
  constructor(
    private readonly createBusUseCase: CreateBusUseCase,
    private readonly getBusUseCase: GetBusUseCase,
    private readonly listBusesUseCase: ListBusesUseCase,
    private readonly updateBusUseCase: UpdateBusUseCase,
    private readonly deleteBusUseCase: DeleteBusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bus' })
  @ApiResponse({
    status: 201,
    description: 'Bus created successfully',
    type: CreateBusResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  async create(@Body() dto: CreateBusRequestDto): Promise<CreateBusResponseDto> {
    return this.createBusUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all buses' })
  @ApiResponse({
    status: 200,
    description: 'List of buses',
    type: ListBusesResponseDto,
  })
  async list(@Query() pagination: PaginationRequestDto): Promise<ListBusesResponseDto> {
    return this.listBusesUseCase.execute(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bus by ID' })
  @ApiParam({ name: 'id', description: 'Bus ID' })
  @ApiResponse({
    status: 200,
    description: 'Bus found',
    type: GetBusResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  async get(@Param('id') id: string): Promise<GetBusResponseDto> {
    return this.getBusUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a bus' })
  @ApiParam({ name: 'id', description: 'Bus ID' })
  @ApiResponse({
    status: 200,
    description: 'Bus updated',
    type: UpdateBusResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Bus or enterprise not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBusRequestDto,
  ): Promise<UpdateBusResponseDto> {
    return this.updateBusUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a bus' })
  @ApiParam({ name: 'id', description: 'Bus ID' })
  @ApiResponse({ status: 204, description: 'Bus deleted' })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteBusUseCase.execute(id);
  }
}
