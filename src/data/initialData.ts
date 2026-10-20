import { ChecklistCategory, VehiclePhotoSlot, VehicleChecklist, FuelLevel } from '../types';

export const INITIAL_CATEGORIES: ChecklistCategory[] = [
  {
    id: 'documentacion',
    title: '1. Documentación',
    items: [
      { id: 'doc-licencia', label: 'Licencia vigente del piloto', status: 'na', critical: true },
      { id: 'doc-dpi', label: 'DPI del piloto', status: 'na', critical: true },
      { id: 'doc-circulacion', label: 'Tarjeta de circulación', status: 'na', critical: true },
      { id: 'doc-seguro', label: 'Póliza de seguro vigente', status: 'na', critical: true },
      { id: 'doc-combustible', label: 'Tarjeta de combustible', status: 'na' },
      { id: 'doc-orden', label: 'Orden de trabajo / Manifiesto', status: 'na' },
      { id: 'doc-despacho', label: 'Hoja de control y despacho de almacén', status: 'na' },
      { id: 'doc-carga', label: 'Documentos de la carga (guías/facturas)', status: 'na' },
    ],
  },
  {
    id: 'carroceria',
    title: '2. Estado Exterior y Carrocería',
    items: [
      { id: 'ext-espejos', label: 'Espejos retrovisores (izquierdo, derecho e interior)', status: 'na' },
      { id: 'ext-parabrisas', label: 'Parabrisas y vidrios sin fisuras ni piquetes', status: 'na' },
      { id: 'ext-plumillas', label: 'Limpiaparabrisas y plumillas en buen estado', status: 'na' },
      { id: 'ext-golpes', label: 'Carrocería sin golpes ni rayones graves nuevos', status: 'na' },
      { id: 'ext-puertas', label: 'Puertas, manijas y cerraduras funcionando', status: 'na' },
      { id: 'ext-combustible', label: 'Tapa y tapón de combustible asegurados', status: 'na' },
      { id: 'ext-placas', label: 'Placas delantera y trasera legibles y fijas', status: 'na', critical: true },
    ],
  },
  {
    id: 'luces',
    title: '3. Sistema Eléctrico y Luces',
    items: [
      { id: 'luz-delanteras', label: 'Luces delanteras (altas y bajas)', status: 'na', critical: true },
      { id: 'luz-frenos', label: 'Luces de freno y terceras luces', status: 'na', critical: true },
      { id: 'luz-direccionales', label: 'Luces direccionales e intermitentes (warning)', status: 'na', critical: true },
      { id: 'luz-reversa', label: 'Luz de retroceso y alarma acústica de reversa', status: 'na' },
      { id: 'luz-bocina', label: 'Bocina / Claxon audible y funcionando', status: 'na' },
      { id: 'luz-tablero', label: 'Tablero de instrumentos (sin alertas rojas activas)', status: 'na', critical: true },
    ],
  },
  {
    id: 'neumaticos',
    title: '4. Neumáticos y Rodaje',
    items: [
      { id: 'neu-delanteras', label: 'Llantas delanteras (presión correcta y labrado > 3mm)', status: 'na', critical: true },
      { id: 'neu-traseras', label: 'Llantas traseras (presión correcta y labrado > 3mm)', status: 'na', critical: true },
      { id: 'neu-repuesto', label: 'Llanta de repuesto en buen estado y calibrada', status: 'na', critical: true },
      { id: 'neu-tuercas', label: 'Tuercas y birlos completos y torqueados', status: 'na' },
      { id: 'neu-desgaste', label: 'Sin deformaciones, protuberancias ni cortes laterales', status: 'na' },
    ],
  },
  {
    id: 'mecanica',
    title: '5. Mecánica y Fluidos',
    items: [
      { id: 'mec-aceite', label: 'Nivel de aceite de motor (entre marcas Min-Max)', status: 'na', critical: true },
      { id: 'mec-refrigerante', label: 'Nivel de refrigerante / anticongelante', status: 'na', critical: true },
      { id: 'mec-frenos', label: 'Nivel de líquido de frenos y pedal firme', status: 'na', critical: true },
      { id: 'mec-direccion', label: 'Líquido de dirección hidráulica y limpiabrisas', status: 'na' },
      { id: 'mec-fugas', label: 'Inspección inferior libre de goteos o fugas visibles', status: 'na' },
      { id: 'mec-bateria', label: 'Batería limpia, bornes ajustados y sin sulfato', status: 'na' },
    ],
  },
  {
    id: 'seguridad',
    title: '6. Equipo de Seguridad y Emergencia',
    items: [
      { id: 'seg-extintor', label: 'Extintor vigente con manómetro en verde', status: 'na', critical: true },
      { id: 'seg-triangulos', label: 'Triángulos o conos reflectivos (mínimo 2 unidades)', status: 'na', critical: true },
      { id: 'seg-gato', label: 'Gato hidráulico de capacidad adecuada y palanca', status: 'na' },
      { id: 'seg-llave', label: 'Llave de cruz / maneral para tuercas', status: 'na' },
      { id: 'seg-botiquin', label: 'Botiquín de primeros auxilios abastecido', status: 'na' },
      { id: 'seg-chaleco', label: 'Chaleco reflectivo de alta visibilidad', status: 'na' },
      { id: 'seg-linterna', label: 'Linterna de mano operativa con baterías', status: 'na' },
    ],
  },
  {
    id: 'cabina_carga',
    title: '7. Cabina y Compartimento de Carga',
    items: [
      { id: 'cab-cinturones', label: 'Cinturones de seguridad operativos y sin rasgaduras', status: 'na', critical: true },
      { id: 'cab-limpieza', label: 'Cabina limpia, despejada y sin objetos sueltos', status: 'na' },
      { id: 'cab-amarres', label: 'Rieles, barras y cinchos de amarre para mercadería', status: 'na' },
      { id: 'cab-cerradura', label: 'Compuerta de carga, cerrojo y portacandado/marchamo', status: 'na', critical: true },
      { id: 'cab-clima', label: 'Ventilación / Aire acondicionado / Desempañador', status: 'na' },
    ],
  },
];

export const MOTO_CATEGORIES: ChecklistCategory[] = [
  {
    id: 'traccion_llantas',
    title: '1. Sistema de Tracción y Llantas',
    items: [
      {
        id: '1.1',
        label: 'Cadena de transmisión',
        description: 'Revisar la tensión correcta y que se encuentre bien lubricada.',
        status: 'na',
        critical: true,
      },
      {
        id: '1.2',
        label: 'Neumáticos',
        description: 'Comprobar la presión de aire (PSI) y la profundidad del dibujo para evitar derrapes.',
        status: 'na',
        critical: true,
      },
      {
        id: '1.3',
        label: 'Rines',
        description: 'Verificar que no tengan deformaciones o rayos flojos (si aplica).',
        status: 'na',
        critical: false,
      },
    ],
  },
  {
    id: 'frenos_mandos',
    title: '2. Frenos y Mandos',
    items: [
      {
        id: '2.1',
        label: 'Líquido de frenos',
        description: 'Inspeccionar visualmente el depósito (delantero y trasero) para asegurar que no esté abajo del mínimo.',
        status: 'na',
        critical: true,
      },
      {
        id: '2.2',
        label: 'Balatas y discos',
        description: 'Verificar el grosor de las balatas y que los discos no tengan surcos profundos.',
        status: 'na',
        critical: true,
      },
      {
        id: '2.3',
        label: 'Manijas y pedales',
        description: 'Probar la suavidad y el juego libre de la manija de freno, embrague (clutch) y pedal de freno trasero.',
        status: 'na',
        critical: true,
      },
    ],
  },
  {
    id: 'luces_electrico',
    title: '3. Luces y Sistema Eléctrico',
    items: [
      {
        id: '3.1',
        label: 'Faro principal',
        description: 'Funcionamiento correcto de la luz alta y baja (vital para la visibilidad diurna y nocturna).',
        status: 'na',
        critical: true,
      },
      {
        id: '3.2',
        label: 'Direccionales y stop',
        description: 'Verificar las luces direccionales traseras/delanteras y que la luz de freno se active tanto con el freno delantero como con el trasero.',
        status: 'na',
        critical: true,
      },
      {
        id: '3.3',
        label: 'Claxon y Tablero',
        description: 'Probar el claxon y asegurar que los testigos del tablero funcionen adecuadamente.',
        status: 'na',
        critical: false,
      },
    ],
  },
  {
    id: 'niveles_fugas',
    title: '4. Niveles y Fugas',
    items: [
      {
        id: '4.1',
        label: 'Aceite de motor',
        description: 'Revisar el nivel mediante la bayoneta o la mirilla de cristal con la moto nivelada.',
        status: 'na',
        critical: true,
      },
      {
        id: '4.2',
        label: 'Fugas visibles',
        description: 'Inspeccionar visualmente el piso y el motor en busca de manchas de aceite o combustible.',
        status: 'na',
        critical: true,
      },
    ],
  },
  {
    id: 'proteccion_documentacion',
    title: '5. Equipo de Protección y Documentación',
    items: [
      {
        id: '5.1',
        label: 'Casco y equipo',
        description: 'Verificar que el casco del conductor esté en buen estado, sin grietas en el visor ni en la estructura, y que cuente con chaleco reflejante.',
        status: 'na',
        critical: true,
      },
      {
        id: '5.2',
        label: 'Caja o maletero',
        description: 'Asegurar el correcto anclaje del contenedor de carga o mochila de reparto.',
        status: 'na',
        critical: false,
      },
      {
        id: '5.3',
        label: 'Documentos',
        description: 'Confirmar la presencia de la tarjeta de circulación y la póliza de seguro vigente.',
        status: 'na',
        critical: true,
      },
    ],
  },
];

export const INITIAL_PHOTO_SLOTS: VehiclePhotoSlot[] = [
  {
    id: 'foto_derecho',
    label: 'DERECHO',
    required: true,
    description: 'Costado lateral derecho e inspección de llantas y carrocería',
    dataUrl: null,
  },
  {
    id: 'foto_izquierdo',
    label: 'IZQUIERDO',
    required: true,
    description: 'Costado lateral izquierdo e inspección de llantas y carrocería',
    dataUrl: null,
  },
  {
    id: 'foto_delantera',
    label: 'DELANTERA',
    required: true,
    description: 'Vista frontal / delantera y placa visible',
    dataUrl: null,
  },
  {
    id: 'foto_trasera',
    label: 'TRASERA',
    required: true,
    description: 'Vista posterior / trasera y placa visible',
    dataUrl: null,
  },
];

import { DEMO_PHOTOS } from './demoPhotos';
import { DEMO_SIGNATURES } from './demoSignatures';

export const generateFolio = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `STR-${year}${month}${day}-${randomNum}`;
};

export const getTodayDate = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const getCurrentTime = (): string => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

// Generates a fully pre-filled default checklist with realistic Steren data
export const createDefaultChecklist = (): VehicleChecklist => {
  const now = new Date();
  const dateStr = getTodayDate();
  const timeStr = getCurrentTime();
  const timestampStr = `${now.toLocaleDateString('es-GT')} ${timeStr}`;

  return {
    id: 'chk_' + Date.now(),
    folio: generateFolio(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: 'En Proceso',
    date: dateStr,
    time: timeStr,
    driver: 'Carlos Humberto Morales Ortiz',
    driverDPI: '2489193420101',
    unit: 'Panel Steren #14 (Toyota HiAce 2023)',
    plate: 'C-784BPK',
    vehicleType: 'Panel de Carga / Van',
    odometer: '142,580 km',
    fuelLevel: '3/4',
    inspectionType: 'Salida de Almacén',
    // By default when starting or logging in, all items start in '-' ('na')
    categories: INITIAL_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({
        ...item,
        status: 'na' as const,
      })),
    })),
    // All photos preloaded with realistic inspection SVGs
    photos: INITIAL_PHOTO_SLOTS.map((slot) => ({
      ...slot,
      dataUrl: DEMO_PHOTOS[slot.id] || null,
      timestamp: timestampStr,
    })),
    observations: 'Unidad en óptimas condiciones para ruta de distribución. Mercadería, repuestos y accesorios electrónicos Steren debidamente estibados con cinchos de sujeción. Documentación física completa a bordo.',
    actionRequired: 'Ninguna acción correctiva inmediata requerida. Unidad liberada para salida.',
    signatures: {
      driver: {
        name: 'Carlos Humberto Morales Ortiz',
        role: 'Piloto / Conductor',
        idNumber: '2489193420101',
        dataUrl: DEMO_SIGNATURES.driver,
        signedAt: `${dateStr} ${timeStr}`,
      },
      supervisor: {
        name: 'Ing. Alejandro Solórzano',
        role: 'Coordinador de Transporte Steren',
        idNumber: 'STR-COL-552',
        dataUrl: DEMO_SIGNATURES.supervisor,
        signedAt: `${dateStr} ${timeStr}`,
      },
      security: {
        name: 'Mario R. Gómez',
        role: 'Inspector de Seguridad & Garita',
        idNumber: 'SEC-09',
        dataUrl: DEMO_SIGNATURES.security,
        signedAt: `${dateStr} ${timeStr}`,
      },
    },
  };
};

export const createMotoChecklist = (options?: { driver?: string; plate?: string; odometer?: string; driverDPI?: string; unit?: string }): VehicleChecklist => {
  const now = new Date();
  const dateStr = getTodayDate();
  const timeStr = getCurrentTime();

  return {
    id: 'chk_moto_' + Date.now(),
    folio: 'STR-20261019-8777',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: 'En Proceso',
    date: dateStr,
    time: timeStr,
    driver: options?.driver || 'Kevin Alexander Ramos Castillo',
    driverDPI: options?.driverDPI || '2894103820101',
    unit: options?.unit || 'Moto Steren #01 (Honda Cargo GL 150)',
    plate: options?.plate || 'M-104KJL',
    vehicleType: 'Motocicleta de Envíos',
    odometer: options?.odometer || '24,150 km',
    fuelLevel: '1/2',
    inspectionType: 'Salida de Almacén',
    // Starts in '-' ('na') by default
    categories: MOTO_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({
        ...item,
        status: 'na' as const,
      })),
    })),
    photos: JSON.parse(JSON.stringify(INITIAL_PHOTO_SLOTS)),
    observations: '',
    actionRequired: '',
    signatures: {
      driver: {
        name: options?.driver || 'Kevin Alexander Ramos Castillo',
        role: 'Piloto / Conductor',
        idNumber: options?.driverDPI || '2894103820101',
        dataUrl: null,
      },
      supervisor: {
        name: 'Ing. Alejandro Solórzano',
        role: 'Coordinador de Transporte Steren',
        idNumber: 'STR-COL-552',
        dataUrl: null,
      },
      security: {
        name: 'Mario R. Gómez',
        role: 'Inspector de Seguridad & Garita',
        idNumber: 'SEC-09',
        dataUrl: null,
      },
    },
  };
};

export const createBlankChecklist = (isMoto: boolean = false): VehicleChecklist => {
  const now = new Date().toISOString();
  return {
    id: 'chk_' + Date.now(),
    folio: generateFolio(),
    createdAt: now,
    updatedAt: now,
    status: 'En Proceso',
    date: getTodayDate(),
    time: getCurrentTime(),
    driver: '',
    driverDPI: '2489193420101',
    unit: '',
    plate: '',
    vehicleType: isMoto ? 'Motocicleta de Envíos' : 'Panel de Carga / Van',
    odometer: '',
    fuelLevel: '1/2',
    inspectionType: 'Salida de Almacén',
    categories: (isMoto ? MOTO_CATEGORIES : INITIAL_CATEGORIES).map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({ ...item, status: 'na' as const })),
    })),
    photos: JSON.parse(JSON.stringify(INITIAL_PHOTO_SLOTS)),
    observations: '',
    actionRequired: '',
    signatures: {
      driver: { name: '', role: 'Piloto / Conductor', idNumber: '', dataUrl: null },
      supervisor: { name: 'Coordinador de Transporte Steren', role: 'Coordinador de Transporte', idNumber: 'STR-LOG-01', dataUrl: null },
      security: { name: '', role: 'Inspector / Despacho', idNumber: '', dataUrl: null },
    },
  };
};

export const SAMPLE_STEREN_CHECKLIST: VehicleChecklist = {
  ...createDefaultChecklist(),
  status: 'Aprobado',
  categories: INITIAL_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => ({ ...item, status: 'pass' as const })),
  })),
};

