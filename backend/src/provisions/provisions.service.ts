import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    // Generate unique request number
    const requestNumber = await this.generateRequestNumber();
    
    const provision = this.provisionsRepository.create({
      ...createProvisionDto,
      requestNumber,
      uploadedById,
      status: ProvisionStatus.PENDING_ASSIGNMENT
    });

    return this.provisionsRepository.save(provision);
  }

  async findAll(page: number = 1, limit: number = 10, status?: ProvisionStatus): Promise<{
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

    if (status) {
      queryBuilder.where('provision.status = :status', { status });
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

  async update(id: string, updateProvisionDto: UpdateProvisionDto): Promise<Provision> {
    const provision = await this.findOne(id);

    // If assigning an auditor, verify the user exists and has QA_AUDITOR role
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

      // Update status when assigning auditor
      updateProvisionDto.status = ProvisionStatus.AUDIT_ASSIGNED;
    }

    Object.assign(provision, updateProvisionDto);
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

    return {
      total,
      pendingAssignment,
      auditAssigned,
      passed,
      failed,
      backjobs
    };
  }

  private async generateRequestNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Find the latest request number for this month
    const latestProvision = await this.provisionsRepository
      .createQueryBuilder('provision')
      .where('provision.requestNumber LIKE :pattern', { 
        pattern: `REQ-${currentYear}${currentMonth}%` 
      })
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
}