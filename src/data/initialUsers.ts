import { AppUser } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr_coord_1',
    name: 'Ing. Alejandro Solórzano',
    email: 'coordinador.transporte.str@gmail.com',
    password: 'admin2026',
    role: 'coordinador',
    idNumber: 'STR-COL-552',
    phone: '+502 2420-5500',
    active: true,
    avatarColor: '#004b93',
  },
  {
    id: 'usr_pilot_1',
    name: 'Carlos Humberto Morales Ortiz',
    email: 'carlos.morales@steren.com.gt',
    password: 'piloto14',
    role: 'piloto',
    idNumber: '2489193420101',
    assignedUnit: 'Panel Steren #14 (Toyota HiAce 2023)',
    assignedPlate: 'C-784BPK',
    phone: '+502 5512-3489',
    active: true,
    avatarColor: '#0284c7',
  },
  {
    id: 'usr_pilot_2',
    name: 'Edwin Josué Alvarado García',
    email: 'edwin.alvarado@steren.com.gt',
    password: 'piloto08',
    role: 'piloto',
    idNumber: '1982745310101',
    assignedUnit: 'Panel Steren #08 (Nissan NV350 Urvan)',
    assignedPlate: 'C-912BMN',
    phone: '+502 5489-1234',
    active: true,
    avatarColor: '#0d9488',
  },
  {
    id: 'usr_pilot_3',
    name: 'Roberto Carlos Méndez Pérez',
    email: 'roberto.mendez@steren.com.gt',
    password: 'piloto03',
    role: 'piloto',
    idNumber: '2154883900101',
    assignedUnit: 'Camión Steren #03 (Isuzu NHR Furgón)',
    assignedPlate: 'C-451BLK',
    phone: '+502 4402-9811',
    active: true,
    avatarColor: '#0891b2',
  },
  // Pilotos de Moto / Envíos y Mensajería Steren
  {
    id: 'usr_moto_1',
    name: 'Kevin Alexander Ramos Castillo',
    email: 'kevin.ramos@steren.com.gt',
    password: 'moto01',
    role: 'piloto',
    idNumber: '2894103820101',
    assignedUnit: 'Moto Steren #01 (Honda Cargo GL 150)',
    assignedPlate: 'M-104KJL',
    phone: '+502 5901-2244',
    active: true,
    avatarColor: '#059669',
  },
  {
    id: 'usr_moto_2',
    name: 'Brayan Estuardo Lima Morales',
    email: 'brayan.lima@steren.com.gt',
    password: 'moto02',
    role: 'piloto',
    idNumber: '3015948210101',
    assignedUnit: 'Moto Steren #02 (Yamaha YBR 125 Express)',
    assignedPlate: 'M-892FGT',
    phone: '+502 5314-8890',
    active: true,
    avatarColor: '#10b981',
  },
  {
    id: 'usr_moto_3',
    name: 'José Daniel Gómez Rivera',
    email: 'jose.gomez@steren.com.gt',
    password: 'moto03',
    role: 'piloto',
    idNumber: '2748192030101',
    assignedUnit: 'Moto Steren #03 (Suzuki AX4 115 Express)',
    assignedPlate: 'M-445DTY',
    phone: '+502 4811-9032',
    active: true,
    avatarColor: '#7c3aed',
  },
  {
    id: 'usr_moto_4',
    name: 'Cristian Josué Marroquín Cruz',
    email: 'cristian.marroquin@steren.com.gt',
    password: 'moto04',
    role: 'piloto',
    idNumber: '2341890240101',
    assignedUnit: 'Moto Steren #04 (Bajaj Boxer BM 150)',
    assignedPlate: 'M-673DRL',
    phone: '+502 5120-7763',
    active: true,
    avatarColor: '#d97706',
  },
  {
    id: 'usr_sec_1',
    name: 'Mario R. Gómez',
    email: 'seguridad.garita@steren.com.gt',
    password: 'garita2026',
    role: 'seguridad',
    idNumber: 'SEC-09',
    phone: '+502 2420-5510',
    active: true,
    avatarColor: '#475569',
  },
  {
    id: 'usr_mec_1',
    name: 'Walter René Vásquez',
    email: 'taller.mantenimiento@steren.com.gt',
    password: 'taller2026',
    role: 'mecanico',
    idNumber: 'MEC-04',
    phone: '+502 5590-7712',
    active: true,
    avatarColor: '#ea580c',
  },
];

const USERS_STORAGE_KEY = 'steren_users_v2';
const ACTIVE_USER_STORAGE_KEY = 'steren_active_user_id_v2';

export const getStoredUsers = (): AppUser[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Return stored users, guaranteeing passwords and structure
      return parsed.map((u: any) => ({
        ...u,
        password: u.password || 'steren2026',
      }));
    }
    return INITIAL_USERS;
  } catch (e) {
    console.error('Error reading users from storage', e);
    return INITIAL_USERS;
  }
};

export const saveStoredUsers = (users: AppUser[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to storage', e);
  }
};

export const getActiveUserId = (): string => {
  try {
    const id = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    return id || INITIAL_USERS[0].id;
  } catch {
    return INITIAL_USERS[0].id;
  }
};

export const setActiveUserId = (userId: string): void => {
  try {
    localStorage.setItem(ACTIVE_USER_STORAGE_KEY, userId);
  } catch (e) {
    console.error('Error saving active user id', e);
  }
};
