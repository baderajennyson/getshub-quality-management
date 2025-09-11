import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provision, ProvisionStatus } from './entities/provision.entity';
import { User } from '../users/entities/user.entity';
import { CreateProvisionDto } from './dto/create-provision.dto';
import { UpdateProvisionDto } from './dto/update-provision.dto';

@Injectable()
export class ProvisionsService {
  constructor(
    @InjectRepository(Provision)
    private provisionsRepository: Repository<Provision>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createProvisionDto: CreateProvisionDto, uploadedById: string): Promise<Provision> {
    let requestNumber: string;
    let isManualRequestNumber = false;

    // Check if manual request number provided
    if (createProvisionDto.requestNumber?.trim()) {
      const trimmedRequestNumber = createProvisionDto.requestNumber.trim();
      
      // Validate manual request number format
      if (!this.isValidRequestNumberFormat(trimmedRequestNumber)) {
        throw new BadRequestException('Invalid request number format.');
      }

      // Check if manual request number already exists
      const existingProvision = await this.provisionsRepository.findOne({
        where: { requestNumber: trimmedRequestNumber }
      });

      if (existingProvision) {
        throw new ConflictException(`Request number "${trimmedRequestNumber}" already exists.`);
      }

      requestNumber = trimmedRequestNumber;
      isManualRequestNumber = true;
    } else {
      // Generate automatic request number
      requestNumber = await this.generateRequestNumber();
      isManualRequestNumber = false;
    }

    // Create provision entity instance
    const provision = new Provision();
    
    // Set required fields
    provision.requestNumber = requestNumber;
    provision.isManualRequestNumber = isManualRequestNumber;
    provision.uploadedById = uploadedById;
    
    // Customer information (required fields)
    provision.firstName = createProvisionDto.firstName;
    provision.lastName = createProvisionDto.lastName;
    provision.addressLine1 = createProvisionDto.addressLine1;
    provision.province = createProvisionDto.province;
    provision.city = createProvisionDto.city;
    provision.barangay = createProvisionDto.barangay;
    
    // Customer information (optional fields)
    if (createProvisionDto.landmark !== undefined) provision.landmark = createProvisionDto.landmark;
    if (createProvisionDto.contactPhone !== undefined) provision.contactPhone = createProvisionDto.contactPhone;
    if (createProvisionDto.accountNumber !== undefined) provision.accountNumber = createProvisionDto.accountNumber;

    // Dispatch & Activity (required fields)
    provision.resource = createProvisionDto.resource;
    provision.date = new Date(createProvisionDto.date);
    provision.status = createProvisionDto.status || ProvisionStatus.PENDING_ASSIGNMENT;
    
    // Dispatch & Activity (optional fields)
    if (createProvisionDto.prDispatch !== undefined) provision.prDispatch = createProvisionDto.prDispatch;
    if (createProvisionDto.activityType !== undefined) provision.activityType = createProvisionDto.activityType;
    if (createProvisionDto.verificationType !== undefined) provision.verificationType = createProvisionDto.verificationType;
    if (createProvisionDto.activityLane !== undefined) provision.activityLane = createProvisionDto.activityLane;
    if (createProvisionDto.activityGrouping !== undefined) provision.activityGrouping = createProvisionDto.activityGrouping;
    if (createProvisionDto.activityClassification !== undefined) provision.activityClassification = createProvisionDto.activityClassification;
    if (createProvisionDto.activityStatus !== undefined) provision.activityStatus = createProvisionDto.activityStatus;
    if (createProvisionDto.positionInRoute !== undefined) provision.positionInRoute = createProvisionDto.positionInRoute;

    // Service information (all optional)
    if (createProvisionDto.marketSegment !== undefined) provision.marketSegment = createProvisionDto.marketSegment;
    if (createProvisionDto.zone !== undefined) provision.zone = createProvisionDto.zone;
    if (createProvisionDto.exchange !== undefined) provision.exchange = createProvisionDto.exchange;
    if (createProvisionDto.nodeLocation !== undefined) provision.nodeLocation = createProvisionDto.nodeLocation;
    if (createProvisionDto.cabinetLocation !== undefined) provision.cabinetLocation = createProvisionDto.cabinetLocation;
    if (createProvisionDto.modemOwnership !== undefined) provision.modemOwnership = createProvisionDto.modemOwnership;
    if (createProvisionDto.priority !== undefined) provision.priority = createProvisionDto.priority;
    if (createProvisionDto.homeServiceDevice !== undefined) provision.homeServiceDevice = createProvisionDto.homeServiceDevice;
    if (createProvisionDto.packageType !== undefined) provision.packageType = createProvisionDto.packageType;
    if (createProvisionDto.neType !== undefined) provision.neType = createProvisionDto.neType;
    if (createProvisionDto.complaintType !== undefined) provision.complaintType = createProvisionDto.complaintType;

    // Timing information
    if (createProvisionDto.dateCreated) {
      provision.dateCreated = new Date(createProvisionDto.dateCreated);
    } else {
      provision.dateCreated = new Date();
    }
    if (createProvisionDto.dateExtracted !== undefined) provision.dateExtracted = createProvisionDto.dateExtracted ? new Date(createProvisionDto.dateExtracted) : undefined;
    if (createProvisionDto.startedDateTime !== undefined) provision.startedDateTime = createProvisionDto.startedDateTime ? new Date(createProvisionDto.startedDateTime) : undefined;
    if (createProvisionDto.completionDateTime !== undefined) provision.completionDateTime = createProvisionDto.completionDateTime ? new Date(createProvisionDto.completionDateTime) : undefined;
    if (createProvisionDto.start !== undefined) provision.start = createProvisionDto.start;
    if (createProvisionDto.end !== undefined) provision.end = createProvisionDto.end;
    if (createProvisionDto.sawa !== undefined) provision.sawa = createProvisionDto.sawa;
    if (createProvisionDto.tandemOutsideStatus !== undefined) provision.tandemOutsideStatus = createProvisionDto.tandemOutsideStatus;

    // Quality management
    if (createProvisionDto.assignedAuditorId !== undefined) provision.assignedAuditorId = createProvisionDto.assignedAuditorId;
    if (createProvisionDto.auditNotes !== undefined) provision.auditNotes = createProvisionDto.auditNotes;
    if (createProvisionDto.auditPhotos !== undefined) provision.auditPhotos = createProvisionDto.auditPhotos;
    if (createProvisionDto.qualityScore !== undefined) provision.qualityScore = createProvisionDto.qualityScore;

    // Remarks & notes
    if (createProvisionDto.remarks !== undefined) provision.remarks = createProvisionDto.remarks;
    if (createProvisionDto.managerNotes !== undefined) provision.managerNotes = createProvisionDto.managerNotes;

    // Extended data
    provision.extendedData = createProvisionDto.extendedData || {};

    return this.provisionsRepository.save(provision);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    status?: ProvisionStatus,
    search?: string
  ): Promise<{
    provisions: Provision[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.provisionsRepository
      .createQueryBuilder('provision')
      .leftJoinAndSelect('provision.uploadedBy', 'uploadedBy')
      .leftJoinAndSelect('provision.assignedAuditor', 'assignedAuditor');

    // Status filter
    if (status) {
      queryBuilder.andWhere('provision.status = :status', { status });
    }

    // Search functionality
    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.andWhere(`(
        provision.requestNumber ILIKE :search OR
        provision.firstName ILIKE :search OR
        provision.lastName ILIKE :search OR
        provision.addressLine1 ILIKE :search OR
        provision.province ILIKE :search OR
        provision.city ILIKE :search OR
        provision.barangay ILIKE :search OR
        provision.resource ILIKE :search OR
        CAST(provision.accountNumber AS TEXT) ILIKE :search OR
        provision.contactPhone ILIKE :search
      )`, { search: searchTerm });
    }

    queryBuilder
      .orderBy('provision.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [provisions, total] = await queryBuilder.getManyAndCount();

    return {
      provisions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Provision> {
    const provision = await this.provisionsRepository.findOne({
      where: { id },
      relations: ['uploadedBy', 'assignedAuditor']
    });

    if (!provision) {
      throw new NotFoundException(`Provision with ID ${id} not found`);
    }

    return provision;
  }

  async findByRequestNumber(requestNumber: string): Promise<Provision> {
    const provision = await this.provisionsRepository.findOne({
      where: { requestNumber },
      relations: ['uploadedBy', 'assignedAuditor']
    });

    if (!provision) {
      throw new NotFoundException(`Provision with request number ${requestNumber} not found`);
    }

    return provision;
  }

  async update(id: string, updateProvisionDto: UpdateProvisionDto): Promise<Provision> {
    const provision = await this.findOne(id);

    // Handle manual request number updates
    if (updateProvisionDto.requestNumber?.trim()) {
      const trimmedRequestNumber = updateProvisionDto.requestNumber.trim();
      
      if (trimmedRequestNumber !== provision.requestNumber) {
        if (!this.isValidRequestNumberFormat(trimmedRequestNumber)) {
          throw new BadRequestException('Invalid request number format.');
        }

        const existingProvision = await this.provisionsRepository.findOne({
          where: { requestNumber: trimmedRequestNumber }
        });

        if (existingProvision) {
          throw new ConflictException(`Request number "${trimmedRequestNumber}" already exists.`);
        }

        provision.requestNumber = trimmedRequestNumber;
        provision.isManualRequestNumber = true;
      }
    }

    // If assigning an auditor
    if (updateProvisionDto.assignedAuditorId) {
      const auditor = await this.usersRepository.findOne({
        where: { id: updateProvisionDto.assignedAuditorId }
      });

      if (!auditor) {
        throw new NotFoundException('Assigned auditor not found');
      }

      if (auditor.role !== 'QA_AUDITOR') {
        throw new BadRequestException('Assigned user must have QA_AUDITOR role');
      }

      provision.status = ProvisionStatus.AUDIT_ASSIGNED;
      provision.assignedAuditorId = updateProvisionDto.assignedAuditorId;
    }

    // Update all other fields if provided
    if (updateProvisionDto.firstName !== undefined) provision.firstName = updateProvisionDto.firstName;
    if (updateProvisionDto.lastName !== undefined) provision.lastName = updateProvisionDto.lastName;
    if (updateProvisionDto.addressLine1 !== undefined) provision.addressLine1 = updateProvisionDto.addressLine1;
    if (updateProvisionDto.province !== undefined) provision.province = updateProvisionDto.province;
    if (updateProvisionDto.city !== undefined) provision.city = updateProvisionDto.city;
    if (updateProvisionDto.barangay !== undefined) provision.barangay = updateProvisionDto.barangay;
    if (updateProvisionDto.landmark !== undefined) provision.landmark = updateProvisionDto.landmark;
    if (updateProvisionDto.contactPhone !== undefined) provision.contactPhone = updateProvisionDto.contactPhone;
    if (updateProvisionDto.accountNumber !== undefined) provision.accountNumber = updateProvisionDto.accountNumber;
    if (updateProvisionDto.resource !== undefined) provision.resource = updateProvisionDto.resource;
    if (updateProvisionDto.prDispatch !== undefined) provision.prDispatch = updateProvisionDto.prDispatch;
    if (updateProvisionDto.status !== undefined) provision.status = updateProvisionDto.status;
    if (updateProvisionDto.activityType !== undefined) provision.activityType = updateProvisionDto.activityType;
    if (updateProvisionDto.verificationType !== undefined) provision.verificationType = updateProvisionDto.verificationType;
    if (updateProvisionDto.activityLane !== undefined) provision.activityLane = updateProvisionDto.activityLane;
    if (updateProvisionDto.activityGrouping !== undefined) provision.activityGrouping = updateProvisionDto.activityGrouping;
    if (updateProvisionDto.activityClassification !== undefined) provision.activityClassification = updateProvisionDto.activityClassification;
    if (updateProvisionDto.activityStatus !== undefined) provision.activityStatus = updateProvisionDto.activityStatus;
    if (updateProvisionDto.positionInRoute !== undefined) provision.positionInRoute = updateProvisionDto.positionInRoute;
    if (updateProvisionDto.marketSegment !== undefined) provision.marketSegment = updateProvisionDto.marketSegment;
    if (updateProvisionDto.zone !== undefined) provision.zone = updateProvisionDto.zone;
    if (updateProvisionDto.exchange !== undefined) provision.exchange = updateProvisionDto.exchange;
    if (updateProvisionDto.nodeLocation !== undefined) provision.nodeLocation = updateProvisionDto.nodeLocation;
    if (updateProvisionDto.cabinetLocation !== undefined) provision.cabinetLocation = updateProvisionDto.cabinetLocation;
    if (updateProvisionDto.modemOwnership !== undefined) provision.modemOwnership = updateProvisionDto.modemOwnership;
    if (updateProvisionDto.priority !== undefined) provision.priority = updateProvisionDto.priority;
    if (updateProvisionDto.homeServiceDevice !== undefined) provision.homeServiceDevice = updateProvisionDto.homeServiceDevice;
    if (updateProvisionDto.packageType !== undefined) provision.packageType = updateProvisionDto.packageType;
    if (updateProvisionDto.neType !== undefined) provision.neType = updateProvisionDto.neType;
    if (updateProvisionDto.complaintType !== undefined) provision.complaintType = updateProvisionDto.complaintType;
    if (updateProvisionDto.start !== undefined) provision.start = updateProvisionDto.start;
    if (updateProvisionDto.end !== undefined) provision.end = updateProvisionDto.end;
    if (updateProvisionDto.sawa !== undefined) provision.sawa = updateProvisionDto.sawa;
    if (updateProvisionDto.tandemOutsideStatus !== undefined) provision.tandemOutsideStatus = updateProvisionDto.tandemOutsideStatus;
    if (updateProvisionDto.auditNotes !== undefined) provision.auditNotes = updateProvisionDto.auditNotes;
    if (updateProvisionDto.auditPhotos !== undefined) provision.auditPhotos = updateProvisionDto.auditPhotos;
    if (updateProvisionDto.qualityScore !== undefined) provision.qualityScore = updateProvisionDto.qualityScore;
    if (updateProvisionDto.remarks !== undefined) provision.remarks = updateProvisionDto.remarks;
    if (updateProvisionDto.managerNotes !== undefined) provision.managerNotes = updateProvisionDto.managerNotes;
    if (updateProvisionDto.extendedData !== undefined) provision.extendedData = updateProvisionDto.extendedData;

    // Handle date field updates
    if (updateProvisionDto.date) {
      provision.date = new Date(updateProvisionDto.date);
    }
    if (updateProvisionDto.dateCreated) {
      provision.dateCreated = new Date(updateProvisionDto.dateCreated);
    }
    if (updateProvisionDto.dateExtracted) {
      provision.dateExtracted = new Date(updateProvisionDto.dateExtracted);
    }
    if (updateProvisionDto.startedDateTime) {
      provision.startedDateTime = new Date(updateProvisionDto.startedDateTime);
    }
    if (updateProvisionDto.completionDateTime) {
      provision.completionDateTime = new Date(updateProvisionDto.completionDateTime);
    }
    if (updateProvisionDto.actualCompletionDate) {
      provision.completionDateTime = new Date(updateProvisionDto.actualCompletionDate);
    }

    return this.provisionsRepository.save(provision);
  }

  async remove(id: string): Promise<void> {
    const provision = await this.findOne(id);
    await this.provisionsRepository.remove(provision);
  }

  async getStatistics(): Promise<{
    total: number;
    pendingAssignment: number;
    auditAssigned: number;
    passed: number;
    failed: number;
    backjobs: number;
    completed: number;
    byMarketSegment: Record<string, number>;
    byActivityType: Record<string, number>;
  }> {
    const total = await this.provisionsRepository.count();
    
    const pendingAssignment = await this.provisionsRepository.count({
      where: { status: ProvisionStatus.PENDING_ASSIGNMENT }
    });
    
    const auditAssigned = await this.provisionsRepository.count({
      where: { status: ProvisionStatus.AUDIT_ASSIGNED }
    });
    
    const passed = await this.provisionsRepository.count({
      where: { status: ProvisionStatus.PASSED }
    });
    
    const failed = await this.provisionsRepository.count({
      where: { status: ProvisionStatus.FAILED }
    });
    
    const backjobs = await this.provisionsRepository.count({
      where: { status: ProvisionStatus.BACKJOB }
    });

    const completed = await this.provisionsRepository.count({
      where: { status: ProvisionStatus.COMPLETED }
    });

    // Market segment breakdown
    const marketSegmentStats = await this.provisionsRepository
      .createQueryBuilder('provision')
      .select('provision.marketSegment', 'segment')
      .addSelect('COUNT(*)', 'count')
      .groupBy('provision.marketSegment')
      .getRawMany();

    const byMarketSegment = marketSegmentStats.reduce((acc, stat) => {
      acc[stat.segment || 'Unknown'] = parseInt(stat.count);
      return acc;
    }, {});

    // Activity type breakdown
    const activityTypeStats = await this.provisionsRepository
      .createQueryBuilder('provision')
      .select('provision.activityType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('provision.activityType')
      .getRawMany();

    const byActivityType = activityTypeStats.reduce((acc, stat) => {
      acc[stat.type || 'Unknown'] = parseInt(stat.count);
      return acc;
    }, {});

    return {
      total,
      pendingAssignment,
      auditAssigned,
      passed,
      failed,
      backjobs,
      completed,
      byMarketSegment,
      byActivityType
    };
  }

  private async generateRequestNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const latestProvision = await this.provisionsRepository
      .createQueryBuilder('provision')
      .where('provision.requestNumber LIKE :pattern', { 
        pattern: `REQ-${currentYear}${currentMonth}%` 
      })
      .andWhere('provision.isManualRequestNumber = :isManual', { isManual: false })
      .orderBy('provision.requestNumber', 'DESC')
      .getOne();

    let sequenceNumber = 1;
    if (latestProvision) {
      const lastSequence = latestProvision.requestNumber.split('-')[1].slice(6);
      sequenceNumber = parseInt(lastSequence) + 1;
    }

    const formattedSequence = String(sequenceNumber).padStart(6, '0');
    return `REQ-${currentYear}${currentMonth}${formattedSequence}`;
  }

  private isValidRequestNumberFormat(requestNumber: string): boolean {
    // Allow various formats - more flexible for manual entry
    const patterns = [
      /^REQ-\d{6,12}$/,        // REQ-YYYYMM000001 (auto-generated)
      /^[A-Z]{2,10}-\d{1,12}$/, // MANUAL-001, TECH-123456, etc.
      /^[A-Z0-9]{3,20}$/,      // ALPHANUMERIC codes without dash
      /^[A-Z0-9-]{5,25}$/      // Any combination with dashes
    ];
  
    return patterns.some(pattern => pattern.test(requestNumber.trim()));
  }

  async isRequestNumberExists(requestNumber: string): Promise<boolean> {
    const count = await this.provisionsRepository.count({
      where: { requestNumber: requestNumber.trim() }
    });
    return count > 0;
  }

  async bulkImport(provisionsData: CreateProvisionDto[], uploadedById: string): Promise<{
    successful: number;
    failed: number;
    errors: string[];
  }> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const [index, provisionData] of provisionsData.entries()) {
      try {
        await this.create(provisionData, uploadedById);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Row ${index + 1}: ${error?.message || 'Unknown error'}`);
      }
    }

    return results;
  }
}