import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProvisionStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  AUDIT_ASSIGNED = 'AUDIT_ASSIGNED',
  AUDIT_IN_PROGRESS = 'AUDIT_IN_PROGRESS',
  AUDIT_COMPLETED = 'AUDIT_COMPLETED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BACKJOB = 'BACKJOB'
}

export enum ProvisionType {
  NEW_CONNECTION = 'NEW_CONNECTION',
  RECONNECTION = 'RECONNECTION',
  METER_CHANGE = 'METER_CHANGE',
  SERVICE_UPGRADE = 'SERVICE_UPGRADE',
  DISCONNECTION = 'DISCONNECTION'
}

@Entity('provisions')
export class Provision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  requestNumber: string;

  @Column()
  customerName: string;

  @Column()
  customerAddress: string;

  @Column()
  contactNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: 'enum',
    enum: ProvisionType,
    default: ProvisionType.NEW_CONNECTION
  })
  provisionType: ProvisionType;

  @Column({
    type: 'enum',
    enum: ProvisionStatus,
    default: ProvisionStatus.PENDING_ASSIGNMENT
  })
  status: ProvisionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  technicalRequirements: string;

  @Column({ type: 'date', nullable: true })
  requestedCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate: Date;

  @Column({ nullable: true })
  assignedAuditorId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedAuditorId' })
  assignedAuditor: User;

  @Column({ nullable: true })
  uploadedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @Column({ type: 'text', nullable: true })
  auditNotes: string;

  @Column({ type: 'text', nullable: true })
  auditPhotos: string; // JSON string array of photo URLs

  @Column({ type: 'int', nullable: true })
  qualityScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}