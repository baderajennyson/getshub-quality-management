import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe,
    ValidationPipe
  } from '@nestjs/common';
  import { ProvisionsService } from './provisions.service';
  import { CreateProvisionDto } from './dto/create-provision.dto';
  import { UpdateProvisionDto } from './dto/update-provision.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { ProvisionStatus } from './entities/provision.entity';
  
  @Controller('provisions')
  @UseGuards(JwtAuthGuard)
  export class ProvisionsController {
    constructor(private readonly provisionsService: ProvisionsService) {}
  
    @Post()
    create(
      @Body(ValidationPipe) createProvisionDto: CreateProvisionDto,
      @Request() req
    ) {
      return this.provisionsService.create(createProvisionDto, req.user.userId);
    }
  
    @Get()
    findAll(
      @Query('page') page: string = '1',
      @Query('limit') limit: string = '10',
      @Query('status') status?: ProvisionStatus
    ) {
      return this.provisionsService.findAll(
        parseInt(page),
        parseInt(limit),
        status
      );
    }
  
    @Get('statistics')
    getStatistics() {
      return this.provisionsService.getStatistics();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.provisionsService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body(ValidationPipe) updateProvisionDto: UpdateProvisionDto
    ) {
      return this.provisionsService.update(id, updateProvisionDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.provisionsService.remove(id);
    }
  }