import * as XLSX from 'xlsx';
import { VehicleChecklist, ItemStatus } from '../types';
import { calculateInspectionStats } from './storage';

/**
 * Exports a single vehicle checklist into a structured, multi-sheet Excel file (.xlsx)
 */
export const exportChecklistToExcel = (checklist: VehicleChecklist): void => {
  const stats = calculateInspectionStats(checklist);
  const wb = XLSX.utils.book_new();

  // --- SHEET 1: Resumen General ---
  const resumenData = [
    ['STEREN - REPORTE DE INSPECCIÓN VEHICULAR', ''],
    ['Departamento de Transporte y Control de Flota', ''],
    ['', ''],
    ['DATOS GENERALES DE LA INSPECCIÓN', ''],
    ['Folio Oficial:', checklist.folio],
    ['Fecha de Inspección:', checklist.date],
    ['Hora de Inspección:', checklist.time],
    ['Dictamen / Estado:', checklist.status],
    ['Tipo de Inspección:', checklist.inspectionType],
    ['', ''],
    ['DATOS DE LA UNIDAD', ''],
    ['Unidad:', checklist.unit || 'No especificada'],
    ['Placa:', checklist.plate || 'No especificada'],
    ['Tipo de Vehículo:', checklist.vehicleType],
    ['Kilometraje (Odómetro):', checklist.odometer || 'No registrado'],
    ['Nivel de Combustible:', checklist.fuelLevel],
    ['', ''],
    ['DATOS DEL PERSONAL Y FIRMAS', ''],
    ['Piloto Asignado:', checklist.driver || 'No asignado'],
    ['DPI del Piloto (13 dígitos):', String(checklist.driverDPI || '')],
    ['Firma Piloto:', checklist.signatures.driver.dataUrl ? 'FIRMADO' : 'PENDIENTE'],
    ['Coordinador de Transporte:', checklist.signatures.supervisor.name || 'Coordinador de Transporte'],
    ['Firma Coordinador:', checklist.signatures.supervisor.dataUrl ? 'FIRMADO' : 'PENDIENTE'],
    ['Inspector de Seguridad/Garita:', checklist.signatures.security.name || 'Seguridad'],
    ['Firma Seguridad:', checklist.signatures.security.dataUrl ? 'FIRMADO' : 'PENDIENTE'],
    ['', ''],
    ['RESUMEN DE VERIFICACIÓN', ''],
    ['Total de Ítems Evaluados:', stats.totalItems],
    ['Ítems Conformes (✓):', stats.passedItems],
    ['Fallas o Novedades (✗):', stats.failedItems],
    ['Fallas Críticas de Seguridad:', stats.criticalFails],
    ['No Aplica (N/A):', stats.naItems],
    ['Fotos Requeridas Cargadas:', `${stats.requiredPhotosUploaded} de ${stats.requiredPhotosTotal}`],
    ['', ''],
    ['OBSERVACIONES Y COMPROMISOS', ''],
    ['Observaciones Generales:', checklist.observations || 'Sin observaciones'],
    ['Acción Correctiva / Taller:', checklist.actionRequired || 'Ninguna acción requerida'],
  ];

  const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
  wsResumen['!cols'] = [{ wch: 32 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen General');

  // --- SHEET 2: Detalle Ítems de Inspección ---
  const itemsRows: (string | number)[][] = [
    ['Categoría', 'Elemento de Inspección', 'Estado', 'Crítico', 'Observaciones / Detalle'],
  ];

  checklist.categories.forEach((cat) => {
    cat.items.forEach((item) => {
      let estadoTexto = 'Pendiente';
      if (item.status === 'pass') estadoTexto = 'CONFORME (✓)';
      else if (item.status === 'fail') estadoTexto = 'NO CONFORME / FALLA (✗)';
      else if (item.status === 'na') estadoTexto = 'NO APLICA (N/A)';

      itemsRows.push([
        cat.title,
        item.label,
        estadoTexto,
        item.critical ? 'SÍ' : 'NO',
        item.notes || '',
      ]);
    });
  });

  const wsItems = XLSX.utils.aoa_to_sheet(itemsRows);
  wsItems['!cols'] = [
    { wch: 30 },
    { wch: 45 },
    { wch: 24 },
    { wch: 10 },
    { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, wsItems, 'Detalle Checklist');

  // --- SHEET 3: Registro Fotográfico ---
  const photoRows: (string | number)[][] = [
    ['Ángulo / Perspectiva', 'Descripción', 'Requerida', 'Estado de Carga', 'Fecha y Hora'],
  ];

  checklist.photos.forEach((photo) => {
    photoRows.push([
      photo.label,
      photo.description,
      photo.required ? 'OBLIGATORIA' : 'OPCIONAL',
      photo.dataUrl ? 'CARGADA' : 'PENDIENTE',
      photo.timestamp || '-',
    ]);
  });

  const wsPhotos = XLSX.utils.aoa_to_sheet(photoRows);
  wsPhotos['!cols'] = [
    { wch: 22 },
    { wch: 45 },
    { wch: 16 },
    { wch: 18 },
    { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(wb, wsPhotos, 'Registro Fotos');

  // File download
  const cleanPlate = (checklist.plate || 'flota').replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `Checklist_Steren_${checklist.folio}_${cleanPlate}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Exports all historical checklists into a comprehensive fleet database Excel table
 */
export const exportHistoryToExcel = (checklists: VehicleChecklist[]): void => {
  const wb = XLSX.utils.book_new();

  const headers = [
    'Folio',
    'Fecha',
    'Hora',
    'Estado Dictamen',
    'Unidad',
    'Placa',
    'Tipo de Vehículo',
    'Kilometraje (Odómetro)',
    'Nivel Combustible',
    'Tipo de Inspección',
    'Piloto',
    'DPI Piloto (13 dígitos)',
    'Total Ítems',
    'Conformes',
    'Fallas',
    'Fallas Críticas',
    'Fotos Cargadas',
    'Firma Piloto',
    'Firma Coordinador',
    'Observaciones Generales',
    'Acción Correctiva',
  ];

  const rows = checklists.map((chk) => {
    const stats = calculateInspectionStats(chk);
    const photoCount = chk.photos.filter((p) => p.dataUrl).length;

    return [
      chk.folio,
      chk.date,
      chk.time,
      chk.status,
      chk.unit || '',
      chk.plate || '',
      chk.vehicleType || '',
      chk.odometer || '',
      chk.fuelLevel,
      chk.inspectionType,
      chk.driver || '',
      String(chk.driverDPI || ''),
      stats.totalItems,
      stats.passedItems,
      stats.failedItems,
      stats.criticalFails,
      `${photoCount}/${chk.photos.length}`,
      chk.signatures.driver.dataUrl ? 'SÍ' : 'NO',
      chk.signatures.supervisor.dataUrl ? 'SÍ' : 'NO',
      chk.observations || '',
      chk.actionRequired || '',
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 18 },
    { wch: 28 },
    { wch: 14 },
    { wch: 22 },
    { wch: 16 },
    { wch: 14 },
    { wch: 20 },
    { wch: 28 },
    { wch: 18 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 40 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Historial Inspecciones');
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Historial_Checklists_Steren_${dateStr}.xlsx`);
};

/**
 * Reads an Excel file (.xlsx, .xls, .csv) and extracts checklist fields
 */
export const readChecklistFromExcel = async (file: File): Promise<Partial<VehicleChecklist>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const result: Partial<VehicleChecklist> = {};

        // Search key-value pairs from row data
        rawJson.forEach((row: any[]) => {
          if (!row || row.length < 2) return;
          const key = String(row[0] || '').toLowerCase().trim();
          const val = String(row[1] || '').trim();

          if (key.includes('folio')) result.folio = val;
          else if (key.includes('fecha')) result.date = val;
          else if (key.includes('hora')) result.time = val;
          else if (key.includes('piloto') && !key.includes('dpi') && !key.includes('firma')) {
            result.driver = val;
          } else if (key.includes('dpi')) {
            result.driverDPI = val.replace(/\D/g, '').slice(0, 13);
          } else if (key.includes('unidad')) {
            result.unit = val;
          } else if (key.includes('placa')) {
            result.plate = val.toUpperCase();
          } else if (key.includes('tipo de vehículo') || key.includes('vehiculo')) {
            result.vehicleType = val;
          } else if (key.includes('kilometraje') || key.includes('odómetro')) {
            result.odometer = val;
          } else if (key.includes('combustible')) {
            if (['0', '1/4', '1/2', '3/4', '1/1'].includes(val)) {
              result.fuelLevel = val as any;
            }
          } else if (key.includes('tipo de inspección')) {
            result.inspectionType = val as any;
          } else if (key.includes('observaciones')) {
            result.observations = val;
          } else if (key.includes('acción') || key.includes('accion')) {
            result.actionRequired = val;
          }
        });

        // Also check if table row format with column headers
        if (!result.driver && rawJson.length >= 2) {
          const headers = rawJson[0].map((h: any) => String(h || '').toLowerCase().trim());
          const firstRow = rawJson[1];
          if (headers && firstRow) {
            headers.forEach((h: string, idx: number) => {
              const val = String(firstRow[idx] || '').trim();
              if (h.includes('folio')) result.folio = val;
              else if (h.includes('fecha')) result.date = val;
              else if (h.includes('piloto') && !h.includes('dpi')) result.driver = val;
              else if (h.includes('dpi')) result.driverDPI = val.replace(/\D/g, '').slice(0, 13);
              else if (h.includes('unidad')) result.unit = val;
              else if (h.includes('placa')) result.plate = val.toUpperCase();
              else if (h.includes('odometro') || h.includes('kilometraje')) result.odometer = val;
            });
          }
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
