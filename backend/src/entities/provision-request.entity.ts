import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum ProvisionStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  AUDIT_ASSIGNED = 'AUDIT_ASSIGNED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BACKJOB = 'BACKJOB',
  CLOSED = 'CLOSED'
}

@Entity('provision_requests')
export class ProvisionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @Column()
  customerFirstName: string;

  @Column()
  customerLastName: string;

  @Column('text')
  customerAddress: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  barangay: string;

  @Column({ nullable: true })
  landmark: string;

  @Column()
  activityType: string;

  @Column()
  serviceType: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: 'enum', enum: ProvisionStatus, default: ProvisionStatus.PENDING_ASSIGNMENT })
  status: ProvisionStatus;

  @Column({ type: 'decimal', nullable: true })
  latitude: number;

  @Column({ type: 'decimal', nullable: true })
  longitude: number;

  @Column('json', { nullable: true })
  additionalData: any;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_by_id' })
  assignedBy: User;

  @Column({ nullable: true })
  assignedById: string;

  @Column({ nullable: true })
  assignedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}