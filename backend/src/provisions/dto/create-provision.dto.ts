import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, IsEmail } from 'class-validator';
import { ProvisionType } from '../entities/provision.entity';

export class CreateProvisionDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(ProvisionType)
  @IsOptional()
  provisionType?: ProvisionType;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  technicalRequirements?: string;

  @IsDateString()
  @IsOptional()
  requestedCompletionDate?: string;
}