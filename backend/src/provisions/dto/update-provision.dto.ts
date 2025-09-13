import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { CreateProvisionDto } from './create-provision.dto';
import { ProvisionStatus } from '../entities/provision.entity';

export class UpdateProvisionDto extends PartialType(CreateProvisionDto) {
  // All fields from CreateProvisionDto are automatically available as optional

  // Additional update-specific fields
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

  @IsBoolean()
  @IsOptional()
  isManualRequestNumber?: boolean;
}
