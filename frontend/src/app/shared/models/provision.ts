// src/app/shared/models/provision.ts
// BACKWARD COMPATIBLE - Works with existing components AND new backend

// Keep existing enums that components expect
export enum ProvisionStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  AUDIT_ASSIGNED = 'AUDIT_ASSIGNED',
  AUDIT_IN_PROGRESS = 'AUDIT_IN_PROGRESS',
  AUDIT_COMPLETED = 'AUDIT_COMPLETED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  BACKJOB = 'BACKJOB',
  // Add new statuses but mark as optional in components
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED'
}

// Keep this enum - existing components need it
export enum ProvisionType {
  NEW_CONNECTION = 'NEW_CONNECTION',
  RECONNECTION = 'RECONNECTION',
  METER_CHANGE = 'METER_CHANGE',
  SERVICE_UPGRADE = 'SERVICE_UPGRADE',
  DISCONNECTION = 'DISCONNECTION'
}

// New enums from updated backend
export enum ActivityType {
  INSTALL_VOICE_DATA_TV = 'Inside - INSTALL VOICE/DATA/CABLE TV',
  INSTALL_DATA_ONLY = 'Inside - INSTALL DATA ONLY',
  INSTALL_VOICE_ONLY = 'Inside - INSTALL VOICE ONLY',
  RECONNECTION = 'Inside - RECONNECTION',
  METER_CHANGE = 'Inside - METER CHANGE',
  SERVICE_UPGRADE = 'Inside - SERVICE UPGRADE',
  DISCONNECTION = 'Inside - DISCONNECTION',
  OUTSIDE_PLANT = 'Outside Plant Work',
  MAINTENANCE = 'Maintenance'
}

export enum MarketSegment {
  RBG = 'RBG',
  CBG = 'CBG', 
  SME = 'SME',
  ENTERPRISE = 'ENTERPRISE'
}

export enum NEType {
  FTTX = 'FTTX',
  COPPER = 'COPPER',
  FIBER = 'FIBER'
}

export enum PRDispatch {
  SOD_OPEN_SO = 'SOD(OPEN S.O)',
  REGULAR_DISPATCH = 'REGULAR DISPATCH',
  EMERGENCY_DISPATCH = 'EMERGENCY DISPATCH',
  SCHEDULED_DISPATCH = 'SCHEDULED DISPATCH'
}

// HYBRID interface - supports BOTH old and new field names
export interface Provision {
  // Core identification
  id: string;
  requestNumber: string;
  isManualRequestNumber?: boolean;

  // OLD FIELD NAMES (for existing components)
  customerName?: string;
  customerAddress?: string;
  contactNumber?: string;
  email?: string;
  provisionType?: ProvisionType;
  estimatedCost?: number;
  description?: string;
  technicalRequirements?: string;
  requestedCompletionDate?: string;
  actualCompletionDate?: string;

  // NEW FIELD NAMES (matching backend)
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  province?: string;
  city?: string;
  barangay?: string;
  landmark?: string;
  contactPhone?: string;
  accountNumber?: number;

  // Dispatch & Activity
  resource?: string;
  date?: string;
  prDispatch?: PRDispatch;
  status: ProvisionStatus;
  activityType?: ActivityType;
  verificationType?: string;
  activityLane?: string;
  activityGrouping?: string;
  activityClassification?: string;
  activityStatus?: string;
  positionInRoute?: number;

  // Service Information
  marketSegment?: MarketSegment;
  zone?: string;
  exchange?: string;
  nodeLocation?: string;
  cabinetLocation?: string;
  modemOwnership?: string;
  priority?: string;
  homeServiceDevice?: string;
  packageType?: string;
  neType?: NEType;
  complaintType?: string;

  // Timing
  dateCreated?: string;
  dateExtracted?: string;
  startedDateTime?: string;
  completionDateTime?: string;
  start?: string;
  end?: string;
  sawa?: string;
  tandemOutsideStatus?: string;

  // Quality Management
  assignedAuditorId?: string;
  assignedAuditor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  uploadedById?: string;
  uploadedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  auditNotes?: string;
  auditPhotos?: string;
  qualityScore?: number;

  // Remarks
  remarks?: string;
  managerNotes?: string;
  extendedData?: Record<string, any>;

  // System fields
  createdAt: string;
  updatedAt: string;
}

// Keep old CreateProvisionDto for existing components
export interface CreateProvisionDto {
  // OLD format that existing components expect
  customerName?: string;
  customerAddress?: string;
  contactNumber?: string;
  email?: string;
  provisionType?: ProvisionType;
  estimatedCost?: number;
  description?: string;
  technicalRequirements?: string;
  requestedCompletionDate?: string;

  // NEW format for backend compatibility
  requestNumber?: string;
  isManualRequestNumber?: boolean;
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  province?: string;
  city?: string;
  barangay?: string;
  landmark?: string;
  contactPhone?: string;
  accountNumber?: number;
  resource?: string;
  date?: string;
  prDispatch?: PRDispatch;
  status?: ProvisionStatus;
  activityType?: ActivityType;
  verificationType?: string;
  activityLane?: string;
  activityGrouping?: string;
  activityClassification?: string;
  activityStatus?: string;
  positionInRoute?: number;
  marketSegment?: MarketSegment;
  zone?: string;
  exchange?: string;
  nodeLocation?: string;
  cabinetLocation?: string;
  modemOwnership?: string;
  priority?: string;
  homeServiceDevice?: string;
  packageType?: string;
  neType?: NEType;
  complaintType?: string;
  dateCreated?: string;
  dateExtracted?: string;
  startedDateTime?: string;
  completionDateTime?: string;
  start?: string;
  end?: string;
  sawa?: string;
  tandemOutsideStatus?: string;
  assignedAuditorId?: string;
  auditNotes?: string;
  auditPhotos?: string;
  qualityScore?: number;
  remarks?: string;
  managerNotes?: string;
  extendedData?: Record<string, any>;
}

export interface UpdateProvisionDto extends Partial<CreateProvisionDto> {
  actualCompletionDate?: string;
}

// Helper function to map old fields to new fields
export function mapOldToNewProvision(provision: any): any {
  return {
    ...provision,
    // Map old field names to new ones
    firstName: provision.firstName || (provision.customerName ? provision.customerName.split(' ')[0] : ''),
    lastName: provision.lastName || (provision.customerName ? provision.customerName.split(' ').slice(1).join(' ') : ''),
    addressLine1: provision.addressLine1 || provision.customerAddress,
    contactPhone: provision.contactPhone || provision.contactNumber
  };
}

// Helper function to map new fields to old fields (for existing components)
export function mapNewToOldProvision(provision: any): any {
  return {
    ...provision,
    // Map new field names to old ones for backward compatibility
    customerName: provision.customerName || (provision.firstName && provision.lastName ? `${provision.firstName} ${provision.lastName}` : ''),
    customerAddress: provision.customerAddress || provision.addressLine1,
    contactNumber: provision.contactNumber || provision.contactPhone
  };
}