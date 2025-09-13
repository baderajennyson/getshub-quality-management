// provisions-table.config.ts - EXACT 52-Field Configuration

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'datetime' | 'enum' | 'boolean' | 'badge' | 'actions';
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    width?: string;
    sticky?: 'left' | 'right';
    visible?: boolean;
    format?: (value: any, row: any) => string;
    enumOptions?: { value: string; label: string; color?: string }[];
  }
  
  // EXACT 52-field configuration matching your backend columns
  export const PROVISION_TABLE_COLUMNS: TableColumn[] = [
    // 1. id
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      sortable: true,
      visible: false,
      width: '100px'
    },
    
    // 2. requestNumber
    {
      key: 'requestNumber',
      label: 'Request Number',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      sticky: 'left',
      visible: true,
      width: '140px'
    },
    
    // 3. isManualRequestNumber
    {
      key: 'isManualRequestNumber',
      label: 'Manual Request',
      type: 'boolean',
      sortable: true,
      filterable: true,
      visible: false,
      width: '120px',
      format: (value) => value ? 'Yes' : 'No'
    },
    
    // 4. firstName
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '120px'
    },
    
    // 5. lastName
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '120px'
    },
    
    // 6. addressLine1
    {
      key: 'addressLine1',
      label: 'Address Line 1',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '200px'
    },
    
    // 7. province
    {
      key: 'province',
      label: 'Province',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '120px'
    },
    
    // 8. city
    {
      key: 'city',
      label: 'City',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '120px'
    },
    
    // 9. barangay
    {
      key: 'barangay',
      label: 'Barangay',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: false,
      width: '120px'
    },
    
    // 10. landmark
    {
      key: 'landmark',
      label: 'Landmark',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: false,
      width: '150px'
    },
    
    // 11. contactPhone
    {
      key: 'contactPhone',
      label: 'Contact Phone',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '140px'
    },
    
    // 12. accountNumber
    {
      key: 'accountNumber',
      label: 'Account Number',
      type: 'number',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '130px'
    },
    
    // 13. resource
    {
      key: 'resource',
      label: 'Resource',
      type: 'text',
      sortable: true,
      filterable: true,
      searchable: true,
      visible: true,
      width: '120px'
    },
    
    // 14. date
    {
      key: 'date',
      label: 'Date',
      type: 'date',
      sortable: true,
      filterable: true,
      visible: true,
      width: '120px'
    },
    
    // 15. prDispatch
    {
      key: 'prDispatch',
      label: 'PR Dispatch',
      type: 'enum',
      sortable: true,
      filterable: true,
      visible: true,
      width: '160px',
      enumOptions: [
        { value: 'SOD(OPEN S.O)', label: 'SOD Open', color: 'bg-orange-100 text-orange-800' },
        { value: 'REGULAR DISPATCH', label: 'Regular', color: 'bg-blue-100 text-blue-800' },
        { value: 'EMERGENCY DISPATCH', label: 'Emergency', color: 'bg-red-100 text-red-800' },
        { value: 'SCHEDULED DISPATCH', label: 'Scheduled', color: 'bg-green-100 text-green-800' }
      ]
    },
    
    // 16. status
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      sortable: true,
      filterable: true,
      visible: true,
      sticky: 'right',
      width: '150px',
      enumOptions: [
        { value: 'PENDING_ASSIGNMENT', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'AUDIT_ASSIGNED', label: 'Assigned', color: 'bg-blue-100 text-blue-800' },
        { value: 'AUDIT_IN_PROGRESS', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
        { value: 'AUDIT_COMPLETED', label: 'Completed', color: 'bg-indigo-100 text-indigo-800' },
        { value: 'PASSED', label: 'Passed', color: 'bg-green-100 text-green-800' },
        { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' },
        { value: 'BACKJOB', label: 'Backjob', color: 'bg-orange-100 text-orange-800' },
        { value: 'COMPLETED', label: 'Complete', color: 'bg-emerald-100 text-emerald-800' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
        { value: 'SUSPENDED', label: 'Suspended', color: 'bg-slate-100 text-slate-800' }
      ]
    },
    
    // 17. activityType
    {
      key: 'activityType',
      label: 'Activity Type',
      type: 'enum',
      sortable: true,
      filterable: true,
      visible: true,
      width: '220px',
      enumOptions: [
        { value: 'Inside - INSTALL VOICE/DATA/CABLE TV', label: 'Install Voice/Data/TV' },
        { value: 'Inside - INSTALL DATA ONLY', label: 'Install Data Only' },
        { value: 'Inside - INSTALL VOICE ONLY', label: 'Install Voice Only' },
        { value: 'Inside - RECONNECTION', label: 'Reconnection' },
        { value: 'Inside - METER CHANGE', label: 'Meter Change' },
        { value: 'Inside - SERVICE UPGRADE', label: 'Service Upgrade' },
        { value: 'Inside - DISCONNECTION', label: 'Disconnection' },
        { value: 'Outside Plant Work', label: 'Outside Plant' },
        { value: 'Maintenance', label: 'Maintenance' }
      ]
    },
    
    // 18. verificationType
    {
      key: 'verificationType',
      label: 'Verification Type',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '140px'
    },
    
    // 19. activityLane
    {
      key: 'activityLane',
      label: 'Activity Lane',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '130px'
    },
    
    // 20. activityGrouping
    {
      key: 'activityGrouping',
      label: 'Activity Grouping',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '150px'
    },
    
    // 21. activityClassification
    {
      key: 'activityClassification',
      label: 'Activity Classification',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '160px'
    },
    
    // 22. activityStatus
    {
      key: 'activityStatus',
      label: 'Activity Status',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '130px'
    },
    
    // 23. positionInRoute
    {
      key: 'positionInRoute',
      label: 'Position in Route',
      type: 'number',
      sortable: true,
      filterable: true,
      visible: false,
      width: '130px'
    },
    
    // 24. marketSegment
    {
      key: 'marketSegment',
      label: 'Market Segment',
      type: 'enum',
      sortable: true,
      filterable: true,
      visible: true,
      width: '130px',
      enumOptions: [
        { value: 'RBG', label: 'RBG', color: 'bg-blue-100 text-blue-800' },
        { value: 'CBG', label: 'CBG', color: 'bg-green-100 text-green-800' },
        { value: 'SME', label: 'SME', color: 'bg-purple-100 text-purple-800' },
        { value: 'ENTERPRISE', label: 'Enterprise', color: 'bg-indigo-100 text-indigo-800' }
      ]
    },
    
    // 25. zone
    {
      key: 'zone',
      label: 'Zone',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: true,
      width: '100px'
    },
    
    // 26. exchange
    {
      key: 'exchange',
      label: 'Exchange',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: true,
      width: '120px'
    },
    
    // 27. nodeLocation
    {
      key: 'nodeLocation',
      label: 'Node Location',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '150px'
    },
    
    // 28. cabinetLocation
    {
      key: 'cabinetLocation',
      label: 'Cabinet Location',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '150px'
    },
    
    // 29. modemOwnership
    {
      key: 'modemOwnership',
      label: 'Modem Ownership',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '140px'
    },
    
    // 30. priority
    {
      key: 'priority',
      label: 'Priority',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: true,
      width: '100px'
    },
    
    // 31. homeServiceDevice
    {
      key: 'homeServiceDevice',
      label: 'Home Service Device',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '160px'
    },
    
    // 32. packageType
    {
      key: 'packageType',
      label: 'Package Type',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '130px'
    },
    
    // 33. neType
    {
      key: 'neType',
      label: 'NE Type',
      type: 'enum',
      sortable: true,
      filterable: true,
      visible: true,
      width: '100px',
      enumOptions: [
        { value: 'FTTX', label: 'FTTX', color: 'bg-emerald-100 text-emerald-800' },
        { value: 'COPPER', label: 'Copper', color: 'bg-amber-100 text-amber-800' },
        { value: 'FIBER', label: 'Fiber', color: 'bg-cyan-100 text-cyan-800' }
      ]
    },
    
    // 34. complaintType
    {
      key: 'complaintType',
      label: 'Complaint Type',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '130px'
    },
    
    // 35. dateCreated
    {
      key: 'dateCreated',
      label: 'Date Created',
      type: 'datetime',
      sortable: true,
      filterable: true,
      visible: false,
      width: '160px'
    },
    
    // 36. dateExtracted
    {
      key: 'dateExtracted',
      label: 'Date Extracted',
      type: 'datetime',
      sortable: true,
      filterable: true,
      visible: false,
      width: '160px'
    },
    
    // 37. startedDateTime
    {
      key: 'startedDateTime',
      label: 'Started Date Time',
      type: 'datetime',
      sortable: true,
      filterable: true,
      visible: true,
      width: '160px'
    },
    
    // 38. completionDateTime
    {
      key: 'completionDateTime',
      label: 'Completion Date Time',
      type: 'datetime',
      sortable: true,
      filterable: true,
      visible: true,
      width: '160px'
    },
    
    // 39. start
    {
      key: 'start',
      label: 'Start',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '100px'
    },
    
    // 40. end
    {
      key: 'end',
      label: 'End',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '100px'
    },
    
    // 41. sawa
    {
      key: 'sawa',
      label: 'SAWA',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '100px'
    },
    
    // 42. tandemOutsideStatus
    {
      key: 'tandemOutsideStatus',
      label: 'Tandem Outside Status',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '160px'
    },
    
    // 43. assignedAuditorId
    {
      key: 'assignedAuditorId',
      label: 'Assigned Auditor ID',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '150px'
    },
    
    // 44. uploadedById
    {
      key: 'uploadedById',
      label: 'Uploaded By ID',
      type: 'text',
      sortable: true,
      filterable: true,
      visible: false,
      width: '150px'
    },
    
    // 45. auditNotes
    {
      key: 'auditNotes',
      label: 'Audit Notes',
      type: 'text',
      sortable: false,
      filterable: false,
      visible: false,
      width: '200px'
    },
    
    // 46. auditPhotos
    {
      key: 'auditPhotos',
      label: 'Audit Photos',
      type: 'text',
      sortable: false,
      filterable: false,
      visible: false,
      width: '120px',
      format: (value) => {
        if (!value) return 'No Photos';
        try {
          const photos = JSON.parse(value);
          return `${photos.length} photo(s)`;
        } catch {
          return 'Invalid';
        }
      }
    },
    
    // 47. qualityScore
    {
      key: 'qualityScore',
      label: 'Quality Score',
      type: 'number',
      sortable: true,
      filterable: true,
      visible: true,
      width: '120px',
      format: (value) => value ? `${value}/10` : 'Not Scored'
    },
    
    // 48. remarks
    {
      key: 'remarks',
      label: 'Remarks',
      type: 'text',
      sortable: false,
      filterable: false,
      visible: false,
      width: '200px'
    },
    
    // 49. managerNotes
    {
      key: 'managerNotes',
      label: 'Manager Notes',
      type: 'text',
      sortable: false,
      filterable: false,
      visible: false,
      width: '200px'
    },
    
    // 50. extendedData
    {
      key: 'extendedData',
      label: 'Extended Data',
      type: 'text',
      sortable: false,
      filterable: false,
      visible: false,
      width: '150px',
      format: (value) => value ? 'Has Data' : 'No Data'
    },
    
    // 51. createdAt
    {
      key: 'createdAt',
      label: 'Created At',
      type: 'datetime',
      sortable: true,
      filterable: true,
      visible: true,
      width: '160px'
    },
    
    // 52. updatedAt
    {
      key: 'updatedAt',
      label: 'Updated At',
      type: 'datetime',
      sortable: true,
      filterable: true,
      visible: false,
      width: '160px'
    },
    
    // Actions column (not a data field)
    {
      key: 'actions',
      label: 'Actions',
      type: 'actions',
      sortable: false,
      filterable: false,
      sticky: 'right',
      visible: true,
      width: '120px'
    }
  ];
  
  // Default column visibility sets
  export const DEFAULT_VISIBLE_COLUMNS = [
    'requestNumber', 'firstName', 'lastName', 'addressLine1', 'province', 'city', 
    'contactPhone', 'resource', 'date', 'status', 'activityType', 'marketSegment',
    'zone', 'exchange', 'qualityScore', 'startedDateTime', 'completionDateTime',
    'createdAt', 'actions'
  ];
  
  export const COMPACT_VISIBLE_COLUMNS = [
    'requestNumber', 'firstName', 'lastName', 'province', 'city', 
    'status', 'qualityScore', 'actions'
  ];
  
  export const COMPREHENSIVE_VISIBLE_COLUMNS = PROVISION_TABLE_COLUMNS.map(col => col.key);
  
  export default { PROVISION_TABLE_COLUMNS, DEFAULT_VISIBLE_COLUMNS, COMPACT_VISIBLE_COLUMNS, COMPREHENSIVE_VISIBLE_COLUMNS };