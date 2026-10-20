export type ItemStatus = 'pass' | 'fail' | 'na' | 'pending';

export type UserRole = 'coordinador' | 'piloto' | 'seguridad' | 'mecanico';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  idNumber: string; // 13-digit DPI for pilots, or employee code for coordinator/security
  assignedUnit?: string;
  assignedPlate?: string;
  phone?: string;
  active: boolean;
  avatarColor?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
  notes?: string;
  critical?: boolean; // Critical items like brakes, driver license, steering, fire extinguisher
  description?: string; // Optional inspection instructions/guidelines
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface VehiclePhotoSlot {
  id: string;
  label: string;
  required: boolean;
  description: string;
  dataUrl: string | null;
  timestamp?: string;
}

export interface SignatureData {
  name: string;
  role: string;
  idNumber: string;
  dataUrl: string | null;
  signedAt?: string;
}

export type FuelLevel = '0' | '1/4' | '1/2' | '3/4' | '1/1';
export type InspectionType = 'Salida de Almacén' | 'Retorno de Ruta' | 'Traslado Inter-sucursal' | 'Mantenimiento Preventivo';
export type OverallStatus = 'Aprobado' | 'Aprobado con Observación' | 'No Apto para Circular' | 'En Proceso';

export interface VehicleChecklist {
  id: string;
  folio: string;
  createdAt: string;
  updatedAt: string;
  status: OverallStatus;
  
  // General Info
  date: string;
  time: string;
  driver: string;
  driverDPI: string;
  unit: string;
  plate: string;
  vehicleType: string;
  odometer: string;
  fuelLevel: FuelLevel;
  route?: string;
  destination?: string;
  inspectionType: InspectionType;

  // Categories & Items
  categories: ChecklistCategory[];

  // Photos
  photos: VehiclePhotoSlot[];

  // Observations & Notes
  observations: string;
  actionRequired: string;

  // Signatures
  signatures: {
    driver: SignatureData;
    supervisor: SignatureData;
    security: SignatureData;
  };
}
