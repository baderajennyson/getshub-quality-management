import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProvisionStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  AUDIT_ASSIGNED = 'AUDIT_ASSIGNED',
  AUDIT_IN_PROGRESS = 'AUDIT_IN_PROGRESS',
  AUDIT_COMPLETED = 'AUDIT_COMPLETED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BACKJOB = 'BACKJOB',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
}

export enum ActivityType {
  INSTALL_VOICE_DATA_TV = 'Inside - INSTALL VOICE/DATA/CABLE TV',
  INSTALL_DATA_ONLY = 'Inside - INSTALL DATA ONLY',
  INSTALL_VOICE_ONLY = 'Inside - INSTALL VOICE ONLY',
  RECONNECTION = 'Inside - RECONNECTION',
  METER_CHANGE = 'Inside - METER CHANGE',
  SERVICE_UPGRADE = 'Inside - SERVICE UPGRADE',
  DISCONNECTION = 'Inside - DISCONNECTION',
  OUTSIDE_PLANT = 'Outside Plant Work',
  MAINTENANCE = 'Maintenance',
}

export enum MarketSegment {
  RBG = 'RBG',
  CBG = 'CBG',
  SME = 'SME',
  ENTERPRISE = 'ENTERPRISE',
}

export enum NEType {
  FTTX = 'FTTX',
  COPPER = 'COPPER',
  FIBER = 'FIBER',
}

export enum PRDispatch {
  SOD_OPEN_SO = 'SOD(OPEN S.O)',
  REGULAR_DISPATCH = 'REGULAR DISPATCH',
  EMERGENCY_DISPATCH = 'EMERGENCY DISPATCH',
  SCHEDULED_DISPATCH = 'SCHEDULED DISPATCH',
}

@Entity('provisions')
@Index(['requestNumber'])
@Index(['status'])
@Index(['accountNumber'])
@Index(['province', 'city'])
@Index(['createdAt'])
export class Provision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === CORE IDENTIFICATION ===
  @Column({ unique: true, nullable: false })
  requestNumber: string;

  @Column({ default: false })
  isManualRequestNumber: boolean;

  // === CUSTOMER INFORMATION ===
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text' })
  addressLine1: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  barangay: string;

  @Column({ nullable: true })
  landmark?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true, type: 'bigint' })
  accountNumber?: number;

  // === DISPATCH & ACTIVITY INFORMATION ===
  @Column()
  resource: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: PRDispatch,
    nullable: true,
  })
  prDispatch?: PRDispatch;

  @Column({
    type: 'enum',
    enum: ProvisionStatus,
    default: ProvisionStatus.PENDING_ASSIGNMENT,
  })
  status: ProvisionStatus;

  @Column({
    type: 'enum',
    enum: ActivityType,
    nullable: true,
  })
  activityType?: ActivityType;

  @Column({ nullable: true })
  verificationType?: string;

  @Column({ nullable: true })
  activityLane?: string;

  @Column({ nullable: true })
  activityGrouping?: string;

  @Column({ nullable: true })
  activityClassification?: string;

  @Column({ nullable: true })
  activityStatus?: string;

  @Column({ type: 'int', nullable: true })
  positionInRoute?: number;

  // === SERVICE INFORMATION ===
  @Column({
    type: 'enum',
    enum: MarketSegment,
    nullable: true,
  })
  marketSegment?: MarketSegment;

  @Column({ nullable: true })
  zone?: string;

  @Column({ nullable: true })
  exchange?: string;

  @Column({ nullable: true })
  nodeLocation?: string;

  @Column({ nullable: true })
  cabinetLocation?: string;

  @Column({ nullable: true })
  modemOwnership?: string;

  @Column({ nullable: true })
  priority?: string;

  @Column({ nullable: true })
  homeServiceDevice?: string;

  @Column({ nullable: true })
  packageType?: string;

  @Column({
    type: 'enum',
    enum: NEType,
    nullable: true,
  })
  neType?: NEType;

  @Column({ nullable: true })
  complaintType?: string;

  // === TIMING INFORMATION ===
  @Column({ type: 'timestamp', nullable: true })
  dateCreated?: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateExtracted?: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedDateTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completionDateTime?: Date;

  @Column({ nullable: true })
  start?: string;

  @Column({ nullable: true })
  end?: string;

  @Column({ nullable: true })
  sawa?: string;

  @Column({ nullable: true })
  tandemOutsideStatus?: string;

  // === QUALITY MANAGEMENT ===
  @Column({ nullable: true })
  assignedAuditorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedAuditorId' })
  assignedAuditor?: User;

  @Column()
  uploadedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @Column({ type: 'text', nullable: true })
  auditNotes?: string;

  @Column({ type: 'text', nullable: true })
  auditPhotos?: string;

  @Column({ type: 'int', nullable: true })
  qualityScore?: number;

  // === REMARKS & NOTES ===
  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'text', nullable: true })
  managerNotes?: string;

  // === FLEXIBLE EXTENDED DATA ===
  @Column({ type: 'jsonb', nullable: true })
  extendedData?: Record<string, any>;

  // === SYSTEM FIELDS ===
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // === HELPER METHODS ===
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getFullAddress(): string {
    return `${this.addressLine1}, ${this.barangay}, ${this.city}, ${this.province}`;
  }

  getExtendedField(fieldName: string): any {
    return this.extendedData?.[fieldName] || null;
  }

  setExtendedField(fieldName: string, value: any): void {
    if (!this.extendedData) {
      this.extendedData = {};
    }
    this.extendedData[fieldName] = value;
  }
}
