import { FuelLevel } from '../types';

export interface FleetVehiclePreset {
  id: string;
  name: string;
  unit: string;
  plate: string;
  vehicleType: string;
  driver: string;
  driverDPI: string;
  odometer: string;
  fuelLevel: FuelLevel;
}

export const FLEET_PRESETS: FleetVehiclePreset[] = [
  {
    id: 'unit_14_hiace',
    name: 'Unidad #14 · Panel Toyota HiAce (C-784BPK)',
    unit: 'Panel Steren #14 (Toyota HiAce 2023)',
    plate: 'C-784BPK',
    vehicleType: 'Panel de Carga / Van',
    driver: 'Carlos Humberto Morales Ortiz',
    driverDPI: '2489193420101',
    odometer: '142,580 km',
    fuelLevel: '3/4',
  },
  {
    id: 'unit_08_nv350',
    name: 'Unidad #08 · Panel Nissan NV350 (C-912BMN)',
    unit: 'Panel Steren #08 (Nissan NV350 Urvan)',
    plate: 'C-912BMN',
    vehicleType: 'Panel de Carga / Van',
    driver: 'Edwin Josué Alvarado García',
    driverDPI: '1982745310101',
    odometer: '89,420 km',
    fuelLevel: '1/1',
  },
  {
    id: 'unit_03_isuzu',
    name: 'Unidad #03 · Camión Isuzu NHR 2.5T (C-451BLK)',
    unit: 'Camión Steren #03 (Isuzu NHR Furgón)',
    plate: 'C-451BLK',
    vehicleType: 'Camión Isuzu / Hino',
    driver: 'Roberto Carlos Méndez Pérez',
    driverDPI: '2154883900101',
    odometer: '210,150 km',
    fuelLevel: '1/2',
  },
  {
    id: 'unit_05_hino',
    name: 'Unidad #05 · Camión Hino 300 Serie 616 (C-338BQR)',
    unit: 'Camión Steren #05 (Hino 300 Serie 616)',
    plate: 'C-338BQR',
    vehicleType: 'Camión Isuzu / Hino',
    driver: 'Byron Antonio Lemus Valenzuela',
    driverDPI: '2631450980101',
    odometer: '67,800 km',
    fuelLevel: '3/4',
  },
  {
    id: 'unit_02_hilux',
    name: 'Unidad #02 · Pick-up Toyota Hilux 4x4 (P-562DGH)',
    unit: 'Pick-up Steren #02 (Toyota Hilux 4x4)',
    plate: 'P-562DGH',
    vehicleType: 'Pick-up Distribución',
    driver: 'Juan Francisco Castillo Estrada',
    driverDPI: '2011392010101',
    odometer: '115,300 km',
    fuelLevel: '1/1',
  },
  // Unidades de Motocicleta para Envíos y Mensajería Steren
  {
    id: 'unit_moto_01',
    name: 'Moto #01 · Honda GL 150 Cargo (M-104KJL)',
    unit: 'Moto Steren #01 (Honda Cargo GL 150)',
    plate: 'M-104KJL',
    vehicleType: 'Motocicleta de Envíos',
    driver: 'Kevin Alexander Ramos Castillo',
    driverDPI: '2894103820101',
    odometer: '18,340 km',
    fuelLevel: '1/1',
  },
  {
    id: 'unit_moto_02',
    name: 'Moto #02 · Yamaha YBR 125 Express (M-892FGT)',
    unit: 'Moto Steren #02 (Yamaha YBR 125 Express)',
    plate: 'M-892FGT',
    vehicleType: 'Motocicleta de Envíos',
    driver: 'Brayan Estuardo Lima Morales',
    driverDPI: '3015948210101',
    odometer: '24,190 km',
    fuelLevel: '3/4',
  },
  {
    id: 'unit_moto_03',
    name: 'Moto #03 · Suzuki AX4 115 Express (M-445DTY)',
    unit: 'Moto Steren #03 (Suzuki AX4 115 Express)',
    plate: 'M-445DTY',
    vehicleType: 'Motocicleta de Envíos',
    driver: 'José Daniel Gómez Rivera',
    driverDPI: '2748192030101',
    odometer: '12,850 km',
    fuelLevel: '1/2',
  },
  {
    id: 'unit_moto_04',
    name: 'Moto #04 · Bajaj Boxer BM 150 (M-673DRL)',
    unit: 'Moto Steren #04 (Bajaj Boxer BM 150)',
    plate: 'M-673DRL',
    vehicleType: 'Motocicleta de Envíos',
    driver: 'Cristian Josué Marroquín Cruz',
    driverDPI: '2341890240101',
    odometer: '15,620 km',
    fuelLevel: '1/1',
  },
];
