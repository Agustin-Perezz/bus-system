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
import { CreateEnterpriseRequestDto } from '../../../application/use-cases/enterprises/create-enterprise/create-enterprise.request.dto';
import { CreateEnterpriseResponseDto } from '../../../application/use-cases/enterprises/create-enterprise/create-enterprise.response.dto';
import { CreateEnterpriseUseCase } from '../../../application/use-cases/enterprises/create-enterprise/create-enterprise.use-case';
import { DeleteEnterpriseUseCase } from '../../../application/use-cases/enterprises/delete-enterprise/delete-enterprise.use-case';
import { GetEnterpriseResponseDto } from '../../../application/use-cases/enterprises/get-enterprise/get-enterprise.response.dto';
import { GetEnterpriseUseCase } from '../../../application/use-cases/enterprises/get-enterprise/get-enterprise.use-case';
import { ListEnterprisesResponseDto } from '../../../application/use-cases/enterprises/list-enterprises/list-enterprises.response.dto';
import { ListEnterprisesUseCase } from '../../../application/use-cases/enterprises/list-enterprises/list-enterprises.use-case';
import { UpdateEnterpriseRequestDto } from '../../../application/use-cases/enterprises/update-enterprise/update-enterprise.request.dto';
import { UpdateEnterpriseResponseDto } from '../../../application/use-cases/enterprises/update-enterprise/update-enterprise.response.dto';
import { UpdateEnterpriseUseCase } from '../../../application/use-cases/enterprises/update-enterprise/update-enterprise.use-case';

@ApiTags('Enterprises')
@Controller('enterprises')
export class EnterprisesController {
  constructor(
    private readonly createEnterpriseUseCase: CreateEnterpriseUseCase,
    private readonly getEnterpriseUseCase: GetEnterpriseUseCase,
    private readonly listEnterprisesUseCase: ListEnterprisesUseCase,
    private readonly updateEnterpriseUseCase: UpdateEnterpriseUseCase,
    private readonly deleteEnterpriseUseCase: DeleteEnterpriseUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new enterprise' })
  @ApiResponse({
    status: 201,
    description: 'Enterprise created successfully',
    type: CreateEnterpriseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data or duplicate legal ID' })
  async create(@Body() dto: CreateEnterpriseRequestDto): Promise<CreateEnterpriseResponseDto> {
    return this.createEnterpriseUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all enterprises' })
  @ApiResponse({
    status: 200,
    description: 'List of enterprises',
    type: ListEnterprisesResponseDto,
  })
  async list(@Query() pagination: PaginationRequestDto): Promise<ListEnterprisesResponseDto> {
    return this.listEnterprisesUseCase.execute(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an enterprise by ID' })
  @ApiParam({ name: 'id', description: 'Enterprise ID' })
  @ApiResponse({
    status: 200,
    description: 'Enterprise found',
    type: GetEnterpriseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  async get(@Param('id') id: string): Promise<GetEnterpriseResponseDto> {
    return this.getEnterpriseUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an enterprise' })
  @ApiParam({ name: 'id', description: 'Enterprise ID' })
  @ApiResponse({
    status: 200,
    description: 'Enterprise updated',
    type: UpdateEnterpriseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEnterpriseRequestDto,
  ): Promise<UpdateEnterpriseResponseDto> {
    return this.updateEnterpriseUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an enterprise' })
  @ApiParam({ name: 'id', description: 'Enterprise ID' })
  @ApiResponse({ status: 204, description: 'Enterprise deleted' })
  @ApiResponse({ status: 404, description: 'Enterprise not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteEnterpriseUseCase.execute(id);
  }
}
