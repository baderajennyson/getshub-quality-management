import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsObject,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import {
  ActivityType,
  MarketSegment,
  NEType,
  PRDispatch,
  ProvisionStatus,
} from '../entities/provision.entity';

export class CreateProvisionDto {
  // === REQUEST NUMBER (Manual OR Auto) ===
  @IsOptional()
  @IsString()
  requestNumber?: string;

  @IsOptional()
  @IsBoolean()
  isManualRequestNumber?: boolean;

  // === REQUIRED CUSTOMER INFORMATION ===
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  barangay: string;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsOptional()
  @IsNumber()
  accountNumber?: number;

  // === DISPATCH & ACTIVITY INFORMATION ===
  @IsString()
  @IsNotEmpty()
  resource: string;

  @IsDateString()
  date: string;

  @IsEnum(PRDispatch)
  @IsOptional()
  prDispatch?: PRDispatch;

  @IsEnum(ProvisionStatus)
  @IsOptional()
  status?: ProvisionStatus;

  @IsEnum(ActivityType)
  @IsOptional()
  activityType?: ActivityType;

  @IsString()
  @IsOptional()
  verificationType?: string;

  @IsString()
  @IsOptional()
  activityLane?: string;

  @IsString()
  @IsOptional()
  activityGrouping?: string;

  @IsString()
  @IsOptional()
  activityClassification?: string;

  @IsString()
  @IsOptional()
  activityStatus?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(999)
  positionInRoute?: number;

  // === SERVICE INFORMATION ===
  @IsEnum(MarketSegment)
  @IsOptional()
  marketSegment?: MarketSegment;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @IsOptional()
  exchange?: string;

  @IsString()
  @IsOptional()
  nodeLocation?: string;

  @IsString()
  @IsOptional()
  cabinetLocation?: string;

  @IsString()
  @IsOptional()
  modemOwnership?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  homeServiceDevice?: string;

  @IsString()
  @IsOptional()
  packageType?: string;

  @IsEnum(NEType)
  @IsOptional()
  neType?: NEType;

  @IsString()
  @IsOptional()
  complaintType?: string;

  // === TIMING INFORMATION ===
  @IsOptional()
  @IsDateString()
  dateCreated?: string;

  @IsOptional()
  @IsDateString()
  dateExtracted?: string;

  @IsOptional()
  @IsDateString()
  startedDateTime?: string;

  @IsOptional()
  @IsDateString()
  completionDateTime?: string;

  @IsString()
  @IsOptional()
  start?: string;

  @IsString()
  @IsOptional()
  end?: string;

  @IsString()
  @IsOptional()
  sawa?: string;

  @IsString()
  @IsOptional()
  tandemOutsideStatus?: string;

  // === REMARKS & NOTES ===
  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  managerNotes?: string;

  // === EXTENDED DATA ===
  @IsOptional()
  @IsObject()
  extendedData?: Record<string, any>;

  // === QUALITY MANAGEMENT ===
  @IsString()
  @IsOptional()
  assignedAuditorId?: string;

  @IsString()
  @IsOptional()
  auditNotes?: string;

  @IsString()
  @IsOptional()
  auditPhotos?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  qualityScore?: number;
}
