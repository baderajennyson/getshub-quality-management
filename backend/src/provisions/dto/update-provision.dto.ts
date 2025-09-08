import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { CreateProvisionDto } from './create-provision.dto';
import { ProvisionStatus } from '../entities/provision.entity';

export class UpdateProvisionDto extends PartialType(CreateProvisionDto) {
  @IsEnum(ProvisionStatus)
  @IsOptional()
  status?: ProvisionStatus;

  @IsString()
  @IsOptional()
  assignedAuditorId?: string;

  @IsString()
  @IsOptional()
  auditNotes?: string;

  @IsString()
  @IsOptional()
  auditPhotos?: string;

  @IsNumber()
  @IsOptional()
  qualityScore?: number;

  @IsDateString()
  @IsOptional()
  actualCompletionDate?: string;
}