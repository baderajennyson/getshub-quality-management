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
  ValidationPipe,
} from '@nestjs/common';
import { ProvisionsService } from './provisions.service';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { UpdateProvisionDto } from './dto/update-provision.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProvisionStatus } from './entities/provision.entity';
import type { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller('provisions')
export class ProvisionsController {
  constructor(private readonly provisionsService: ProvisionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(ValidationPipe) createProvisionDto: CreateProvisionDto,
    @Request() req,
  ) {
    return this.provisionsService.create(createProvisionDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: ProvisionStatus,
    @Query('search') search?: string,
  ) {
    return this.provisionsService.findAll(
      parseInt(page),
      parseInt(limit),
      status,
      search,
    );
  }

  @Get('statistics')
  getStatistics() {
    return this.provisionsService.getStatistics();
  }

  // Lightweight search endpoint for typeahead/autocomplete
  @Get('search')
  search(
    @Query('search') search: string,
    @Query('limit') limit: string = '10',
  ) {
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    return this.provisionsService.quickSearch(search, parsedLimit);
  }

  // Export endpoint - CSV format only
  @Get('export')
  async export(
    @Res() res: Response
  ) {
    const { buffer, mimeType, filename } =
      await this.provisionsService.exportProvisionsAsCSV();
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.provisionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateProvisionDto: UpdateProvisionDto,
  ) {
    return this.provisionsService.update(id, updateProvisionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.provisionsService.remove(id);
  }

  // Bulk import endpoint
  @Post('import')
  @UseGuards(JwtAuthGuard)
  async bulkImport(
    @Body(ValidationPipe) rows: CreateProvisionDto[],
    @Request() req,
  ) {
    return this.provisionsService.bulkImport(rows, req.user.userId);
  }
}
