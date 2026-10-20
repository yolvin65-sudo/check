import { VehicleChecklist } from '../types';

export interface MissingFieldItem {
  id: string;
  section: string;
  label: string;
  detail: string;
}

export interface ValidationSummary {
  isValid: boolean;
  missingItems: MissingFieldItem[];
  missingCount: number;
}

/**
 * Validates that all mandatory fields in the vehicle checklist are completed
 * before allowing save, strictly adhering to Steren Transporte safety rules.
 */
export const validateChecklistForSaving = (checklist: VehicleChecklist): ValidationSummary => {
  const missing: MissingFieldItem[] = [];

  // 1. Datos Generales del Vehículo y Piloto
  if (!checklist.driver || !checklist.driver.trim()) {
    missing.push({
      id: 'driver',
      section: 'Datos Generales',
      label: 'Conductor / Piloto',
      detail: 'El nombre del piloto conductor es obligatorio.',
    });
  }

  const dpiClean = checklist.driverDPI ? checklist.driverDPI.replace(/\D/g, '') : '';
  if (!dpiClean || dpiClean.length < 13) {
    missing.push({
      id: 'driverDPI',
      section: 'Datos Generales',
      label: 'DPI del Piloto',
      detail: 'Debe contener los 13 dígitos completos del DPI.',
    });
  }

  if (!checklist.plate || !checklist.plate.trim()) {
    missing.push({
      id: 'plate',
      section: 'Datos Generales',
      label: 'Placas del Vehículo',
      detail: 'El número de placa del vehículo es obligatorio.',
    });
  }

  if (!checklist.unit || !checklist.unit.trim()) {
    missing.push({
      id: 'unit',
      section: 'Datos Generales',
      label: 'Unidad de Transporte',
      detail: 'La identificación de la unidad es obligatoria.',
    });
  }

  if (!checklist.odometer || !checklist.odometer.trim()) {
    missing.push({
      id: 'odometer',
      section: 'Datos Generales',
      label: 'Kilometraje / Odómetro',
      detail: 'Debe registrar el kilometraje actual del vehículo.',
    });
  }

  if (!checklist.date || !checklist.date.trim()) {
    missing.push({
      id: 'date',
      section: 'Datos Generales',
      label: 'Fecha de Inspección',
      detail: 'La fecha de inspección es obligatoria.',
    });
  }

  if (!checklist.time || !checklist.time.trim()) {
    missing.push({
      id: 'time',
      section: 'Datos Generales',
      label: 'Hora de Inspección',
      detail: 'La hora de inspección es obligatoria.',
    });
  }

  if (!checklist.fuelLevel) {
    missing.push({
      id: 'fuelLevel',
      section: 'Datos Generales',
      label: 'Nivel de Combustible',
      detail: 'Debe seleccionar el nivel de combustible actual.',
    });
  }

  // 2. Checklist Items (no item may be in pending status)
  let pendingItemsCount = 0;
  checklist.categories.forEach((cat) => {
    cat.items.forEach((item) => {
      if (item.status === 'pending') {
        pendingItemsCount++;
      }
    });
  });

  if (pendingItemsCount > 0) {
    missing.push({
      id: 'checklist_items',
      section: 'Ítems de Inspección',
      label: 'Puntos de Inspección Pendientes',
      detail: `Hay ${pendingItemsCount} ítem(s) sin evaluar. Debe calificar todos los ítems como Conforme (✓), Novedad (✗) o No Aplica (-).`,
    });
  }

  // 3. Fotografías Obligatorias
  const requiredPhotosMissing = checklist.photos.filter((p) => p.required && !p.dataUrl);
  if (requiredPhotosMissing.length > 0) {
    missing.push({
      id: 'photos',
      section: 'Fotografías del Vehículo',
      label: 'Fotos Obligatorias Faltantes',
      detail: `Falta capturar ${requiredPhotosMissing.length} foto(s) obligatoria(s): ${requiredPhotosMissing.map((p) => p.label).join(', ')}.`,
    });
  }

  // 4. Firmas Obligatorias
  if (!checklist.signatures.driver.dataUrl) {
    missing.push({
      id: 'sig_driver',
      section: 'Firmas Digitales',
      label: 'Firma del Piloto',
      detail: 'Es obligatoria la firma digital del piloto conductor.',
    });
  }

  if (!checklist.signatures.supervisor.dataUrl) {
    missing.push({
      id: 'sig_supervisor',
      section: 'Firmas Digitales',
      label: 'Firma del Coordinador',
      detail: 'Es obligatoria la firma digital del coordinador de transporte.',
    });
  }

  return {
    isValid: missing.length === 0,
    missingItems: missing,
    missingCount: missing.length,
  };
};
