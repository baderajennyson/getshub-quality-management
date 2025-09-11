// src/app/shared/models/provision.ts

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
  
  export interface Provision {
    id: string;
    requestNumber: string;
    customerName: string;
    customerAddress: string;
    contactNumber: string;
    email?: string;
    provisionType: ProvisionType;
    status: ProvisionStatus;
    estimatedCost?: number;
    description?: string;
    technicalRequirements?: string;
    requestedCompletionDate?: string;
    actualCompletionDate?: string;
    assignedAuditorId?: string;
    assignedAuditor?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    uploadedById: string;
    uploadedBy: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    auditNotes?: string;
    auditPhotos?: string;
    qualityScore?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateProvisionDto {
    customerName: string;
    customerAddress: string;
    contactNumber: string;
    email?: string;
    provisionType: ProvisionType;
    estimatedCost?: number;
    description?: string;
    technicalRequirements?: string;
    requestedCompletionDate?: string;
  }
  
  export interface UpdateProvisionDto {
    customerName?: string;
    customerAddress?: string;
    contactNumber?: string;
    email?: string;
    provisionType?: ProvisionType;
    status?: ProvisionStatus;
    estimatedCost?: number;
    description?: string;
    technicalRequirements?: string;
    requestedCompletionDate?: string;
    actualCompletionDate?: string;
    assignedAuditorId?: string;
    auditNotes?: string;
    auditPhotos?: string;
    qualityScore?: number;
  }