import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Save,
  RotateCcw,
  RefreshCw,
  Sparkles,
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  Download,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Hash,
  FileSpreadsheet,
  Upload,
  Users,
  Lock,
  KeyRound,
  LogIn,
  LogOut,
  Bike,
  Disc,
  Gauge,
  IdCard,
  Camera,
  AlertOctagon,
} from 'lucide-react';
import {
  VehicleChecklist,
  ItemStatus,
  SignatureData,
  OverallStatus,
  FuelLevel,
  InspectionType,
  AppUser,
} from './types';
import {
  createBlankChecklist,
  createDefaultChecklist,
  createMotoChecklist,
  MOTO_CATEGORIES,
  INITIAL_CATEGORIES,
  INITIAL_PHOTO_SLOTS,
  SAMPLE_STEREN_CHECKLIST,
} from './data/initialData';
import { FLEET_PRESETS } from './data/fleetPresets';
import {
  getStoredUsers,
  saveStoredUsers,
  getActiveUserId,
  setActiveUserId,
} from './data/initialUsers';
import {
  getSavedChecklists,
  saveChecklistToHistory,
  deleteChecklistFromHistory,
  getSavedDraft,
  saveCurrentDraft,
  calculateInspectionStats,
  exportChecklistJSON,
} from './utils/storage';
import {
  exportChecklistToExcel,
  readChecklistFromExcel,
} from './utils/excelExport';
import { CategorySection } from './components/CategorySection';
import { PhotoSlotCard } from './components/PhotoSlotCard';
import { SignaturesSection } from './components/SignaturesSection';
import { HistoryModal } from './components/HistoryModal';
import { UserManagementModal } from './components/UserManagementModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { FuelSelector } from './components/FuelSelector';

export default function App() {
  const [users, setUsers] = useState<AppUser[]>(() => getStoredUsers());
  const [activeUserId, setActiveUserIdState] = useState<string>(() => getActiveUserId());
  // Lock main screen until logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('steren_auth_session') === 'true';
    } catch {
      return false;
    }
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Live real-time clock state (synced continuously every second)
  const [realtimeClock, setRealtimeClock] = useState(() => {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('es-GT', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  });

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];
  const isAdmin = activeUser.role === 'coordinador';
  const isPilot = activeUser.role === 'piloto';

  const [checklist, setChecklist] = useState<VehicleChecklist>(() => {
    const draft = getSavedDraft();
    const currentActive = getActiveUserId();
    const initialUser = getStoredUsers().find((u) => u.id === currentActive);
    const isMoto = Boolean(
      (initialUser?.assignedUnit &&
        (initialUser.assignedUnit.toLowerCase().includes('moto') ||
          initialUser.assignedUnit.toLowerCase().includes('motocicleta'))) ||
        initialUser?.id?.includes('moto')
    );
    if (isMoto) {
      return createMotoChecklist({
        driver: initialUser?.name,
        plate: initialUser?.assignedPlate,
        unit: initialUser?.assignedUnit,
        driverDPI: initialUser?.idNumber,
      });
    }
    return draft || createDefaultChecklist();
  });

  const isMotoUser = Boolean(
    (activeUser.assignedUnit &&
      (activeUser.assignedUnit.toLowerCase().includes('moto') ||
        activeUser.assignedUnit.toLowerCase().includes('motocicleta'))) ||
      activeUser.id.includes('moto') ||
      checklist.vehicleType === 'Motocicleta de Envíos' ||
      checklist.unit.toLowerCase().includes('moto')
  );

  const [savedList, setSavedList] = useState<VehicleChecklist[]>(() =>
    getSavedChecklists()
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);

  // Auto-save draft whenever checklist state changes
  useEffect(() => {
    saveCurrentDraft(checklist);
  }, [checklist]);

  // Real-time synchronization: keep date and time strictly synchronized with live real time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString('es-GT', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setRealtimeClock({ date, time });

      // Keep checklist timestamp locked to real time
      setChecklist((prev) => {
        if (prev.date !== date || prev.time !== time) {
          return { ...prev, date, time };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep checklist categories in sync with motorcycle vs fleet vehicle
  useEffect(() => {
    const isCurrentlyMotoCategories = checklist.categories.some(
      (c) => c.id === 'traccion_llantas'
    );
    if (isMotoUser && !isCurrentlyMotoCategories) {
      setChecklist((prev) => ({
        ...prev,
        vehicleType: 'Motocicleta de Envíos',
        folio: prev.folio.startsWith('STR-') ? prev.folio : 'STR-20261019-8777',
        driver: activeUser.role === 'piloto' ? activeUser.name : prev.driver,
        driverDPI: activeUser.role === 'piloto' ? activeUser.idNumber : prev.driverDPI,
        plate: (activeUser.role === 'piloto' && activeUser.assignedPlate) ? activeUser.assignedPlate : prev.plate,
        unit: (activeUser.role === 'piloto' && activeUser.assignedUnit) ? activeUser.assignedUnit : prev.unit,
        status: 'En Proceso',
        categories: MOTO_CATEGORIES.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({ ...item, status: 'na' as const })),
        })),
        photos: JSON.parse(JSON.stringify(INITIAL_PHOTO_SLOTS)),
        signatures: {
          ...prev.signatures,
          driver: {
            ...prev.signatures.driver,
            name: activeUser.role === 'piloto' ? activeUser.name : prev.signatures.driver.name,
            idNumber: activeUser.role === 'piloto' ? activeUser.idNumber : prev.signatures.driver.idNumber,
          },
        },
      }));
    } else if (!isMotoUser && isCurrentlyMotoCategories) {
      setChecklist((prev) => ({
        ...prev,
        categories: INITIAL_CATEGORIES.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({ ...item, status: 'na' as const })),
        })),
        photos: JSON.parse(JSON.stringify(INITIAL_PHOTO_SLOTS)),
      }));
    }
  }, [isMotoUser, activeUserId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Stats
  const stats = calculateInspectionStats(checklist);

  // Items that are still in '-' ('na' or 'pending')
  const itemsInDash = checklist.categories.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.status === 'na' || i.status === 'pending').length,
    0
  );
  const allItemsEvaluated = itemsInDash === 0 && stats.totalItems > 0;

  const allHeaderFieldsCompleted = Boolean(
    checklist.driver?.trim() &&
    checklist.driverDPI?.trim() &&
    checklist.plate?.trim() &&
    checklist.odometer?.trim() &&
    checklist.date?.trim() &&
    checklist.time?.trim()
  );

  const allPhotosUploaded =
    checklist.photos.length === 4 &&
    checklist.photos.every((p) => Boolean(p.dataUrl));

  const driverSignatureCompleted = Boolean(checklist.signatures.driver?.dataUrl);

  // Mandatory rule: Revision remains 'En Proceso' until every item is evaluated, all 4 photos taken, driver signed, and all fields filled
  const isRevisionCompleted =
    allItemsEvaluated &&
    allHeaderFieldsCompleted &&
    allPhotosUploaded &&
    driverSignatureCompleted;

  // Auto-calculate status recommendation
  useEffect(() => {
    let nextStatus: OverallStatus = 'En Proceso';

    if (!isRevisionCompleted) {
      nextStatus = 'En Proceso';
    } else {
      if (stats.criticalFails > 0) {
        nextStatus = 'No Apto para Circular';
      } else if (stats.failedItems > 0) {
        nextStatus = 'Aprobado con Observación';
      } else {
        nextStatus = 'Aprobado';
      }
    }

    if (checklist.status !== nextStatus) {
      setChecklist((prev) => ({ ...prev, status: nextStatus }));
    }
  }, [
    isRevisionCompleted,
    stats.criticalFails,
    stats.failedItems,
    checklist.status,
  ]);

  // General field handlers
  const handleFieldChange = (field: keyof VehicleChecklist, value: string) => {
    setChecklist((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Item status handler
  const handleItemStatusChange = (
    categoryId: string,
    itemId: string,
    status: ItemStatus
  ) => {
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, status };
          }),
        };
      }),
    }));
  };

  // Item note handler
  const handleItemNoteChange = (
    categoryId: string,
    itemId: string,
    notes: string
  ) => {
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, notes };
          }),
        };
      }),
    }));
  };

  // Mark all pass in a category
  const handleMarkCategoryAllPass = (categoryId: string) => {
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => ({ ...item, status: 'pass' })),
        };
      }),
    }));
    showToast('Categoría marcada como Conforme');
  };

  // Mark everything pass across all categories
  const handleMarkAllChecklistPass = () => {
    setChecklist((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, status: 'pass' })),
      })),
    }));
    showToast('Todos los ítems marcados como Conformes (✓)');
  };

  // Photo change handler
  const handlePhotoChange = (
    slotId: string,
    dataUrl: string | null,
    timestamp?: string
  ) => {
    setChecklist((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => {
        if (p.id !== slotId) return p;
        return {
          ...p,
          dataUrl,
          timestamp: timestamp || (dataUrl ? p.timestamp : undefined),
        };
      }),
    }));
  };

  // Signature handlers
  const handleUpdateSignature = (
    key: 'driver' | 'supervisor' | 'security',
    data: SignatureData
  ) => {
    setChecklist((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [key]: data,
      },
    }));
    showToast(`Firma de ${key === 'driver' ? 'Piloto' : key === 'supervisor' ? 'Coordinador' : 'Seguridad'} registrada`);
  };

  const handleClearSignature = (key: 'driver' | 'supervisor' | 'security') => {
    setChecklist((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [key]: {
          ...prev.signatures[key],
          dataUrl: null,
          signedAt: undefined,
        },
      },
    }));
  };

  // Save to history (Validates ALL mandatory fields)
  const handleSaveToHistory = () => {
    const missing: string[] = [];

    if (!checklist.driver?.trim()) missing.push('Nombre del Conductor');
    if (!checklist.driverDPI?.trim()) missing.push('Número de DPI');
    if (!checklist.plate?.trim()) missing.push('Placas / Matrícula');
    if (!checklist.odometer?.trim()) missing.push('Kilometraje actual');
    if (!checklist.date?.trim() || !checklist.time?.trim()) missing.push('Fecha y Hora de inspección');

    if (itemsInDash > 0) {
      missing.push(`Lista de inspección: faltan ${itemsInDash} ítem(s) por evaluar (se encuentran en '-'). Todos los ítems son obligatorios y deben evaluarse con ✓ o ✗.`);
    }

    const missingPhotos = checklist.photos.filter((p) => !p.dataUrl);
    if (missingPhotos.length > 0) {
      missing.push(`Registro fotográfico: faltan ${missingPhotos.length} fotografía(s) obligatoria(s): ${missingPhotos.map((p) => p.label).join(', ')}.`);
    }

    if (!checklist.signatures.driver.dataUrl) {
      missing.push('Firma digital obligatoria del Conductor / Piloto.');
    }

    if (missing.length > 0) {
      setValidationErrors(missing);
      showToast('No se puede guardar: Todos los campos son obligatorios.');
      return;
    }

    const success = saveChecklistToHistory(checklist);
    if (success) {
      setSavedList(getSavedChecklists());
      showToast(`¡Checklist ${checklist.folio} guardado exitosamente!`);
    } else {
      showToast('Error al guardar el checklist');
    }
  };

  // Load from history
  const handleLoadChecklist = (loaded: VehicleChecklist) => {
    setChecklist(loaded);
    showToast(`Cargada inspección ${loaded.folio} (${loaded.plate})`);
  };

  // Delete from history
  const handleDeleteChecklist = (id: string) => {
    deleteChecklistFromHistory(id);
    setSavedList(getSavedChecklists());
    showToast('Inspección eliminada del historial');
  };

  // Select fleet preset
  const handleSelectFleetPreset = (presetId: string) => {
    const preset = FLEET_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const isMoto = Boolean(
      preset.vehicleType.toLowerCase().includes('moto') ||
        preset.unit.toLowerCase().includes('moto')
    );
    setChecklist((prev) => ({
      ...prev,
      folio: isMoto ? 'STR-20261019-8777' : prev.folio,
      unit: preset.unit,
      plate: preset.plate,
      vehicleType: preset.vehicleType,
      driver: preset.driver,
      driverDPI: preset.driverDPI,
      odometer: preset.odometer,
      fuelLevel: preset.fuelLevel,
      status: 'En Proceso',
      categories: (isMoto ? MOTO_CATEGORIES : INITIAL_CATEGORIES).map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, status: 'na' as const })),
      })),
      signatures: {
        ...prev.signatures,
        driver: {
          ...prev.signatures.driver,
          name: preset.driver,
          idNumber: preset.driverDPI,
        },
      },
    }));
    showToast(`Cargada unidad: ${preset.unit} (${preset.plate})`);
  };

  const handleSelectActiveUser = (userId: string) => {
    setActiveUserIdState(userId);
    setActiveUserId(userId);
    const selected = users.find((u) => u.id === userId);
    if (!selected) return;

    if (selected.role === 'piloto') {
      const isMoto = Boolean(
        (selected.assignedUnit &&
          (selected.assignedUnit.toLowerCase().includes('moto') ||
            selected.assignedUnit.toLowerCase().includes('motocicleta'))) ||
          selected.id.includes('moto')
      );
      setChecklist((prev) => ({
        ...prev,
        folio: isMoto ? 'STR-20261019-8777' : prev.folio,
        status: 'En Proceso',
        driver: selected.name,
        driverDPI: selected.idNumber,
        unit: selected.assignedUnit || prev.unit,
        plate: selected.assignedPlate || prev.plate,
        vehicleType: isMoto ? 'Motocicleta de Envíos' : prev.vehicleType,
        odometer: isMoto ? (prev.odometer || '24,150 km') : prev.odometer,
        // Start all items in '-' ('na') by default when logging in
        categories: (isMoto ? MOTO_CATEGORIES : INITIAL_CATEGORIES).map((cat) => ({
          ...cat,
          items: cat.items.map((item) => ({ ...item, status: 'na' as const })),
        })),
        photos: JSON.parse(JSON.stringify(INITIAL_PHOTO_SLOTS)),
        signatures: {
          ...prev.signatures,
          driver: {
            ...prev.signatures.driver,
            name: selected.name,
            idNumber: selected.idNumber,
            dataUrl: null,
            signedAt: undefined,
          },
        },
      }));
      showToast(`Sesión activa: Piloto ${isMoto ? 'de Moto ' : ''}${selected.name}`);
    } else if (selected.role === 'coordinador') {
      setChecklist((prev) => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          supervisor: {
            ...prev.signatures.supervisor,
            name: selected.name,
            idNumber: selected.idNumber,
          },
        },
      }));
      showToast(`Sesión activa: Coordinador ${selected.name}`);
    } else if (selected.role === 'seguridad') {
      setChecklist((prev) => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          security: {
            ...prev.signatures.security,
            name: selected.name,
            idNumber: selected.idNumber,
          },
        },
      }));
      showToast(`Sesión activa: Seguridad ${selected.name}`);
    }
  };

  const handleAddUser = (userData: Omit<AppUser, 'id'>) => {
    const newUser: AppUser = {
      ...userData,
      id: 'usr_' + Date.now(),
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveStoredUsers(updated);
    showToast(`Usuario ${newUser.name} registrado con éxito`);
  };

  const handleUpdateUser = (updatedUser: AppUser) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    saveStoredUsers(updated);
    showToast(`Usuario ${updatedUser.name} actualizado`);
  };

  const handleDeleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    saveStoredUsers(updated);
    if (activeUserId === userId && updated.length > 0) {
      setActiveUserIdState(updated[0].id);
      setActiveUserId(updated[0].id);
    }
    showToast('Usuario eliminado');
  };

  // Login success handler
  const handleLoginSuccess = (user: AppUser) => {
    setActiveUserIdState(user.id);
    setActiveUserId(user.id);
    try {
      sessionStorage.setItem('steren_auth_session', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);

    const isMoto = Boolean(
      (user.assignedUnit &&
        (user.assignedUnit.toLowerCase().includes('moto') ||
          user.assignedUnit.toLowerCase().includes('motocicleta'))) ||
        user.id.includes('moto')
    );

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('es-GT', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setChecklist((prev) => ({
      ...prev,
      vehicleType: isMoto ? 'Motocicleta de Envíos' : (user.assignedUnit ? 'Panel de Carga / Van' : prev.vehicleType),
      driver: user.role === 'piloto' ? user.name : prev.driver,
      driverDPI: user.role === 'piloto' ? user.idNumber : prev.driverDPI,
      plate: (user.role === 'piloto' && user.assignedPlate) ? user.assignedPlate : prev.plate,
      unit: (user.role === 'piloto' && user.assignedUnit) ? user.assignedUnit : prev.unit,
      odometer: isMoto
        ? (user.assignedUnit?.includes('01') ? '24,150 km' : '18,340 km')
        : (prev.odometer || '142,580 km'),
      date: dateStr,
      time: timeStr,
      signatures: {
        ...prev.signatures,
        driver: {
          ...prev.signatures.driver,
          name: user.role === 'piloto' ? user.name : prev.signatures.driver.name,
          idNumber: user.role === 'piloto' ? user.idNumber : prev.signatures.driver.idNumber,
        },
      },
    }));
    showToast(`Bienvenido: ${user.name}`);
  };

  // Logout handler
  const handleLogout = () => {
    try {
      sessionStorage.removeItem('steren_auth_session');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    showToast('Sesión cerrada. Pantalla bloqueada.');
  };

  // Botón de Reinicio: Restablece todo el checklist a estado inicial
  const handleConfirmReset = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('es-GT', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newFolio = `STR-${dateStr.replace(/-/g, '')}-${randomSuffix}`;

    const categoriesReset = (isMotoUser ? MOTO_CATEGORIES : INITIAL_CATEGORIES).map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({
        ...item,
        status: 'na' as const,
        notes: undefined,
      })),
    }));

    setChecklist({
      id: 'chk_' + Date.now(),
      folio: newFolio,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'En Proceso',
      date: dateStr,
      time: timeStr,
      driver: activeUser.role === 'piloto' ? activeUser.name : (checklist.driver || activeUser.name),
      driverDPI: activeUser.role === 'piloto' ? activeUser.idNumber : (checklist.driverDPI || activeUser.idNumber),
      unit: (activeUser.role === 'piloto' && activeUser.assignedUnit) ? activeUser.assignedUnit : checklist.unit,
      plate: (activeUser.role === 'piloto' && activeUser.assignedPlate) ? activeUser.assignedPlate : checklist.plate,
      vehicleType: isMotoUser ? 'Motocicleta de Envíos' : checklist.vehicleType,
      odometer: isMotoUser
        ? (activeUser.assignedUnit?.includes('01') ? '24,150 km' : '18,340 km')
        : (checklist.odometer || '142,580 km'),
      fuelLevel: '1/2',
      inspectionType: 'Salida de Almacén',
      categories: categoriesReset,
      photos: JSON.parse(JSON.stringify(INITIAL_PHOTO_SLOTS)),
      observations: '',
      actionRequired: '',
      signatures: {
        driver: {
          name: activeUser.role === 'piloto' ? activeUser.name : checklist.driver,
          role: 'Piloto / Conductor',
          idNumber: activeUser.role === 'piloto' ? activeUser.idNumber : checklist.driverDPI,
          dataUrl: null,
          signedAt: undefined,
        },
        supervisor: {
          name: 'Ing. Alejandro Solórzano',
          role: 'Coordinador de Transporte Steren',
          idNumber: 'STR-COL-552',
          dataUrl: null,
          signedAt: undefined,
        },
        security: {
          name: 'Mario R. Gómez',
          role: 'Inspector de Seguridad & Garita',
          idNumber: 'SEC-09',
          dataUrl: null,
          signedAt: undefined,
        },
      },
    });

    showToast('¡Checklist reiniciado exitosamente a estado inicial!');
  };

  // Reset to blank
  const handleNewChecklist = () => {
    setIsResetModalOpen(true);
  };

  // Load sample Steren checklist
  const handleLoadSample = () => {
    if (isMotoUser) {
      setChecklist(
        createMotoChecklist({
          driver: 'Kevin Alexander Ramos Castillo',
          plate: 'M-104KJL',
          unit: 'Moto Steren #01 (Honda Cargo GL 150)',
          odometer: '24,150 km',
        })
      );
      showToast('Datos de ejemplo cargados (Motocicleta Honda Cargo Steren)');
    } else {
      setChecklist(JSON.parse(JSON.stringify(SAMPLE_STEREN_CHECKLIST)));
      showToast('Datos de ejemplo cargados (Panel Toyota HiAce Steren)');
    }
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    try {
      exportChecklistToExcel(checklist);
      showToast(`Excel generado: ${checklist.folio} (${checklist.plate || 'flota'})`);
    } catch (e) {
      console.error(e);
      showToast('Error al generar archivo Excel');
    }
  };

  // Import from Excel file (.xlsx / .csv)
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await readChecklistFromExcel(file);
      setChecklist((prev) => ({
        ...prev,
        ...imported,
        updatedAt: new Date().toISOString(),
      }));
      showToast(`¡Datos cargados desde Excel! (${file.name})`);
    } catch (err) {
      console.error('Error cargando Excel:', err);
      showToast('No se pudo procesar el archivo Excel');
    }
    e.target.value = '';
  };

  // Print format
  const handlePrint = () => {
    window.print();
  };

  // Lock main screen and block viewing anything until user logs in
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen
          users={users}
          initialUserId={activeUserId}
          onLoginSuccess={handleLoginSuccess}
          onOpenUserManagement={() => setIsUserModalOpen(true)}
        />
        <UserManagementModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          users={users}
          activeUserId={activeUserId}
          onSelectActiveUser={handleSelectActiveUser}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#2c3e50] pb-16">
      {/* Top Bar Contract (1-line Brand Wordmark - 4 concise nav links - 1 primary action) */}
      <header className="no-print bg-[#002d5c] text-white border-b border-[#001f40] px-3 sm:px-6 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark with Official Steren Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/assets/aistudio/image_3b172871.png"
              alt="Steren"
              className="h-10 w-10 object-contain bg-white rounded-lg p-0.5 shadow-sm shrink-0"
            />
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap block leading-tight">
                Steren Transporte
              </span>
              <span className="text-[9px] uppercase tracking-wider text-sky-200 font-semibold block leading-none">
                Inspección Vehicular
              </span>
            </div>
          </div>

          {/* Real-time Clock Widget */}
          <div className="hidden lg:flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sky-200">{realtimeClock.date}</span>
            <span className="text-white font-bold">{realtimeClock.time}</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-sans font-bold uppercase tracking-wider">
              Tiempo Real
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-sky-100">
            <span className="text-white border-b-2 border-sky-400 pb-0.5 whitespace-nowrap shrink-0">
              Checklist Activo
            </span>
            <button
              type="button"
              onClick={() => setIsUserModalOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer text-amber-200 font-bold"
              title="Gestión de usuarios: crear, modificar o eliminar colaboradores"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Gestión Usuarios ({users.length})</span>
            </button>
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Historial ({savedList.length})</span>
                </button>
                <span
                  className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  onClick={handleLoadSample}
                >
                  Cargar Muestra
                </span>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Actions (Reiniciar, Guardar, User, Cerrar Sesión) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botón de Reinicio */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer border border-amber-500"
              title="Reiniciar checklist a su estado inicial"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-900" />
              <span>Reiniciar</span>
            </button>

            {/* Botón Guardar */}
            <button
              type="button"
              onClick={handleSaveToHistory}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#004b93] hover:bg-[#005fb8] border border-blue-400/40 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Guardar checklist validado"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>

            {/* Active User Switcher Chip */}
            <button
              type="button"
              onClick={() => {
                if (isAdmin) {
                  setIsUserModalOpen(true);
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors text-left border border-white/10 shadow-2xs"
              title={isAdmin ? "Gestión de usuarios y contraseñas (Administrador)" : "Cambiar usuario"}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0"
                style={{ backgroundColor: activeUser.avatarColor || '#004b93' }}
              >
                {activeUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-bold text-white truncate max-w-[110px] flex items-center gap-1">
                  {activeUser.assignedUnit?.toLowerCase().includes('moto') && (
                    <Bike className="w-3 h-3 text-emerald-300 shrink-0" />
                  )}
                  {activeUser.name.split(' ')[0]}
                </p>
                <p className="text-[9px] text-sky-200 capitalize flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5 text-emerald-300" />
                  {activeUser.assignedUnit?.toLowerCase().includes('moto')
                    ? 'Piloto Moto'
                    : activeUser.role}
                </p>
              </div>
            </button>

            {/* Cerrar Sesión Button */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors border border-rose-500/30 shadow-2xs"
              title="Cerrar sesión y bloquear pantalla"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1140px] mx-auto p-3 sm:p-6">
        {/* Floating / Toast notification */}
        {toastMessage && (
          <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action Controls Ribbon for Administrator (hidden for pilot) */}
        {isAdmin && (
          <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Acciones Administrador:</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-2.5 py-1.5 text-xs font-semibold text-[#004b93] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Cargar inspección con datos reales de una unidad Steren"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Cargar Ejemplo</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>Historial ({savedList.length})</span>
              </button>

              {/* Exportar a Excel */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Descargar reporte completo en hoja de cálculo Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Excel</span>
              </button>

              {/* Cargar desde Excel */}
              <label
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Cargar datos desde archivo Excel (.xlsx, .csv)"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cargar de Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => exportChecklistJSON(checklist)}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Exportar respaldo en archivo JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Imprimir formato o Guardar como PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleNewChecklist}
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                title="Nueva Inspección en Blanco"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* KPI Strip & Departure Readiness Alert (ONLY FOR ADMIN) */}
        {isAdmin && (() => {
          const tiresCategory = checklist.categories.find((c) => c.id === 'neumaticos');
          const tireItems = tiresCategory?.items || [];
          const tireFails = tireItems.filter((i) => i.status === 'fail');
          const tirePasses = tireItems.filter((i) => i.status === 'pass');
          const hasWearIssue = tireFails.some(
            (i) => i.id === 'neu-desgaste' || i.label.toLowerCase().includes('desgaste')
          );
          const hasPressureIssue = tireFails.some(
            (i) => i.label.toLowerCase().includes('presión') || i.id === 'neu-delanteras' || i.id === 'neu-traseras'
          );

          let tireStatusText = 'Presión OK';
          let tireStatusColor = 'text-emerald-600';
          let tireBadgeBg = 'bg-emerald-100 text-emerald-800';
          let tireStatusDesc = 'Neumáticos verificados';

          if (tireFails.length > 0) {
            if (hasWearIssue) {
              tireStatusText = 'Desgaste Detectado';
              tireStatusColor = 'text-rose-600';
              tireBadgeBg = 'bg-rose-100 text-rose-800';
              tireStatusDesc = 'Deformación o labrado bajo';
            } else if (hasPressureIssue) {
              tireStatusText = 'Presión No Conforme';
              tireStatusColor = 'text-amber-600';
              tireBadgeBg = 'bg-amber-100 text-amber-800';
              tireStatusDesc = 'Calibrar antes de salida';
            } else {
              tireStatusText = 'Falla en Rodaje';
              tireStatusColor = 'text-rose-600';
              tireBadgeBg = 'bg-rose-100 text-rose-800';
              tireStatusDesc = `${tireFails.length} falla(s) detectadas`;
            }
          } else if (tirePasses.length === tireItems.length && tireItems.length > 0) {
            tireStatusText = 'Presión OK';
            tireStatusColor = 'text-emerald-600';
            tireBadgeBg = 'bg-emerald-100 text-emerald-800';
            tireStatusDesc = 'Presión y labrado conformes';
          } else {
            tireStatusText = 'Por Verificar';
            tireStatusColor = 'text-slate-600';
            tireBadgeBg = 'bg-slate-100 text-slate-700';
            tireStatusDesc = 'Revisión pendiente';
          }

          return (
            <div className="no-print mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-fade-in">
              <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 block">Progreso de Inspección</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-bold font-mono-numbers text-slate-800">
                    {stats.completedItems}/{stats.totalItems}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {Math.round((stats.completedItems / stats.totalItems) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#004b93] h-full transition-all"
                    style={{ width: `${(stats.completedItems / stats.totalItems) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 block">Novedades o Fallas</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span
                    className={`text-xl font-bold font-mono-numbers ${
                      stats.failedItems > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {stats.failedItems}
                  </span>
                  {stats.criticalFails > 0 && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                      {stats.criticalFails} Crítica(s)
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {stats.criticalFails > 0 ? 'Vehículo retenido por seguridad' : 'Sin fallas críticas'}
                </span>
              </div>

              {/* Tarjeta de Estado Consolidado de Neumáticos */}
              <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Estado de Neumáticos</span>
                  <Disc className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-1">
                  <span className={`text-sm sm:text-base font-bold truncate ${tireStatusColor}`}>
                    {tireStatusText}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${tireBadgeBg}`}>
                    {tirePasses.length}/{tireItems.length}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block truncate">
                  {tireStatusDesc}
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 block">Fotografías del Vehículo</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-bold font-mono-numbers text-slate-800">
                    {stats.requiredPhotosUploaded}/{stats.requiredPhotosTotal}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {stats.requiredPhotosUploaded >= stats.requiredPhotosTotal ? 'Completas' : 'Pendientes'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Obligatorias para despacho
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 block">Dictamen de Salida</span>
                <div className="mt-1 flex items-center gap-1.5">
                  {stats.criticalFails > 0 ? (
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" /> No Apto
                    </span>
                  ) : stats.isReadyForDeparture ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Autorizado
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Requiere Firmas/Fotos
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono-numbers">
                  {checklist.folio}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Printable Card Area - Matches user's exact checklist-card specifications */}
        <div className="checklist-card bg-white border-2 border-[#004b93] rounded-lg p-5 sm:p-7 shadow-md">
          {/* Encabezado Principal */}
          <header className="header-banner flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#004b93] via-[#002d5c] to-[#0099ff] text-white px-6 py-4 rounded-md mb-5 gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_3b172871.png"
                alt="Steren"
                className="h-11 w-11 object-contain bg-white rounded-lg p-0.5 shadow-xs shrink-0"
              />
              <div className="bg-white text-[#004b93] font-black text-2xl tracking-tighter px-2.5 py-0.5 rounded shadow-xs">
                STEREN
              </div>
              <div className="border-l border-white/20 pl-3">
                <p className="text-[10px] uppercase tracking-widest text-sky-200 font-semibold">
                  Control de Flota y Logística
                </p>
                <p className="text-xs text-white/90">
                  {isMotoUser
                    ? 'Inspección Preoperacional de Motocicletas'
                    : 'Inspección Preoperacional de Transporte'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-white">
                {isMotoUser ? 'Checklist Vehicular Motocicletas' : 'Checklist Vehicular'}
              </h1>
              <div className="flex items-center sm:justify-end gap-2 mt-0.5">
                <span className="text-xs font-mono-numbers text-sky-200">
                  Folio: <strong className="text-white">{checklist.folio}</strong>
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs ${
                    checklist.status === 'Aprobado'
                      ? 'bg-emerald-500 text-white'
                      : checklist.status === 'No Apto para Circular'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-400 text-slate-900'
                  }`}
                >
                  {checklist.status}
                </span>
              </div>
            </div>
          </header>

          {/* Grid de Datos Generales (Responsive: 4 cols on desktop, 2 on tablet, 1 on mobile) */}
          <section className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-[#004b93] uppercase tracking-wide">
                {isMotoUser ? 'Datos Generales de la Motocicleta' : 'Datos Generales del Vehículo'}
              </span>
              {isAdmin && (
                <div className="flex items-center gap-2 no-print">
                  <label className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                    Unidad Preconfigurada:
                  </label>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) handleSelectFleetPreset(e.target.value);
                    }}
                    className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1 focus:border-[#004b93] focus:outline-hidden font-semibold text-slate-800"
                  >
                    <option value="">-- Seleccionar Unidad Flota Steren --</option>
                    {FLEET_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Grid de Campos Bloqueados y en Tiempo Real */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* 1. Conductor / Piloto (Bloqueado) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Piloto / Conductor:
                  </label>
                  <span className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    <Lock className="w-2.5 h-2.5 text-slate-600" /> Bloqueado
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={checklist.driver}
                  placeholder="Conductor asignado"
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 cursor-not-allowed select-none rounded-t"
                />
              </div>

              {/* 2. Número de DPI (Bloqueado) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    <IdCard className="w-3.5 h-3.5" /> DPI / Identificación:
                  </label>
                  <span className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    <Lock className="w-2.5 h-2.5 text-slate-600" /> Bloqueado
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={checklist.driverDPI}
                  placeholder="Número de DPI"
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800 cursor-not-allowed select-none rounded-t font-mono-numbers tracking-wider"
                />
              </div>

              {/* 3. Placas / Matrícula (Bloqueado) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> Placas / Matrícula:
                  </label>
                  <span className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    <Lock className="w-2.5 h-2.5 text-slate-600" /> Bloqueado
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={checklist.plate}
                  placeholder="Placa oficial"
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 uppercase cursor-not-allowed select-none rounded-t font-mono-numbers tracking-wider"
                />
              </div>

              {/* 4. Kilometraje actual (Bloqueado) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" /> Kilometraje Actual:
                  </label>
                  <span className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    <Lock className="w-2.5 h-2.5 text-slate-600" /> Bloqueado
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={checklist.odometer}
                  placeholder="Kilometraje registrado"
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800 cursor-not-allowed select-none rounded-t font-mono-numbers"
                />
              </div>

              {/* 5. Unidad Asignada (Bloqueado) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    {isMotoUser ? (
                      <Bike className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    <span>Unidad Asignada:</span>
                  </label>
                  <span className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    <Lock className="w-2.5 h-2.5 text-slate-600" /> Bloqueado
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={checklist.unit}
                  placeholder="Unidad de transporte"
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 cursor-not-allowed select-none rounded-t"
                />
              </div>

              {/* 6. Fecha en Tiempo Real (Bloqueado & Sincronizado en Vivo) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fecha (Tiempo Real):</span>
                  </label>
                  <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>En Vivo</span>
                  </span>
                </div>
                <input
                  type="date"
                  readOnly
                  disabled
                  value={realtimeClock.date}
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800 cursor-not-allowed select-none rounded-t font-mono-numbers"
                />
              </div>

              {/* 7. Hora en Tiempo Real (Bloqueado & Reloj en Vivo con Segundos) */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hora (Tiempo Real):</span>
                  </label>
                  <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>LIVE</span>
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={realtimeClock.time}
                  className="w-full border-b border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 cursor-not-allowed select-none rounded-t font-mono-numbers tracking-wider"
                />
              </div>

              {/* 8. Tipo de Inspección */}
              <div className="flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <label className="font-bold text-xs text-[#004b93] whitespace-nowrap flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tipo de Inspección:</span>
                </label>
                <select
                  value={checklist.inspectionType}
                  onChange={(e) =>
                    handleFieldChange('inspectionType', e.target.value as InspectionType)
                  }
                  className="w-full border-b border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:border-[#004b93] focus:outline-hidden rounded-t"
                >
                  <option value="Salida de Almacén">Salida de Almacén</option>
                  <option value="Retorno de Ruta">Retorno de Ruta</option>
                  <option value="Traslado Inter-sucursal">Traslado Inter-sucursal</option>
                  <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                </select>
              </div>

              {/* 9. Nivel de Combustible */}
              <div className="sm:col-span-2 lg:col-span-4 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <FuelSelector
                  value={checklist.fuelLevel}
                  onChange={(lvl) => setChecklist((prev) => ({ ...prev, fuelLevel: lvl }))}
                />
              </div>
            </div>
          </section>

          {/* Contenedor Modular de Checklists (2 Columnas simétricas) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {checklist.categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                onItemStatusChange={handleItemStatusChange}
                onItemNoteChange={handleItemNoteChange}
              />
            ))}
          </div>

          {/* --- SECCIÓN DE FOTOGRAFÍAS (4 FOTOGRAFÍAS OBLIGATORIAS: DERECHO, IZQUIERDO, DELANTERA, TRASERA) --- */}
          <section className="border border-[#004b93] rounded-md overflow-hidden bg-white mb-6">
            <div className="bg-[#002d5c] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-300" />
                <span className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                  Registro Fotográfico de la Unidad (4 Fotos Obligatorias: DERECHO, IZQUIERDO, DELANTERA, TRASERA)
                </span>
              </div>
              <span className="text-xs text-sky-200 font-mono-numbers font-semibold">
                {stats.requiredPhotosUploaded} de 4 tomadas
              </span>
            </div>

            <div className="p-4 bg-slate-50">
              <p className="no-print text-xs text-slate-500 mb-3">
                Debe tomar o subir obligatoriamente las 4 fotografías requeridas de la unidad (<strong>DERECHO</strong>, <strong>IZQUIERDO</strong>, <strong>DELANTERA</strong>, <strong>TRASERA</strong>) antes de poder guardar o finalizar la inspección.
              </p>

              {/* Grid de 4 Fotos Unicamente */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {checklist.photos.map((slot) => (
                  <PhotoSlotCard
                    key={slot.id}
                    slot={slot}
                    onPhotoChange={handlePhotoChange}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Campo de Observaciones Generales */}
          <section className="border border-[#004b93] rounded-md overflow-hidden bg-white mb-6">
            <div className="bg-[#002d5c] text-white px-4 py-2 flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                Observaciones Generales y Hallazgos
              </span>
              <span className="text-[11px] text-sky-200">
                Detallar novedades mecánicas, carrocería o mercadería
              </span>
            </div>
            <div className="p-4 bg-white space-y-3">
              <textarea
                value={checklist.observations}
                onChange={(e) => handleFieldChange('observations', e.target.value)}
                placeholder="Indique cualquier anomalía observada, rayones previos, faltantes de equipo o instrucciones especiales para la ruta..."
                className="w-full h-20 text-xs border border-slate-300 rounded p-2.5 resize-none focus:outline-hidden focus:border-[#004b93] text-slate-800"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                {isAdmin ? (
                  <div>
                    <label className="block text-[11px] font-bold text-[#004b93] mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Acción Correctiva o Compromiso de Taller:</span>
                    </label>
                    <input
                      type="text"
                      value={checklist.actionRequired}
                      onChange={(e) => handleFieldChange('actionRequired', e.target.value)}
                      placeholder="Ej. Ingresar a mantenimiento de 150,000 km el viernes"
                      className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden focus:border-[#004b93]"
                    />
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center justify-end gap-3 text-xs text-slate-500">
                  <span>
                    Fallas encontradas:{' '}
                    <strong className="font-mono-numbers text-rose-600 font-bold">
                      {stats.failedItems}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Ítems Aprobados:{' '}
                    <strong className="font-mono-numbers text-emerald-600 font-bold">
                      {stats.passedItems}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Sección de Firmas Inferior */}
          <SignaturesSection
            signatures={checklist.signatures}
            currentUserRole={activeUser.role}
            onRequestAdminAuth={() => setIsLoginModalOpen(true)}
            onUpdateSignature={handleUpdateSignature}
            onClearSignature={handleClearSignature}
          />

          {/* Pie de Página Oficial Steren para Impresión */}
          <footer className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              <span>Steren Electrónica · Departamento de Transporte y Logística</span>
            </div>
            <div className="font-mono-numbers text-[10px]">
              Folio: {checklist.folio} · Verificado el {checklist.date} {checklist.time}
            </div>
          </footer>
        </div>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedChecklists={savedList}
        isAdmin={isAdmin}
        onLoadChecklist={handleLoadChecklist}
        onDeleteChecklist={handleDeleteChecklist}
      />

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={users}
        activeUserId={activeUserId}
        onSelectActiveUser={handleSelectActiveUser}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Login Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        initialSelectedUserId={activeUserId}
        onLoginSuccess={(u) => {
          handleLoginSuccess(u);
          setIsLoginModalOpen(false);
        }}
      />

      {/* Modal de Confirmación de Reinicio */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        folio={checklist.folio}
        vehicleUnit={checklist.unit}
      />

      {/* Modal de Confirmación de Cierre de Sesión */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        activeUser={activeUser}
        onConfirmLogout={handleLogout}
      />

      {/* Modal de Validación: Bloqueo de Guardado por Campos Obligatorios Incompletos */}
      {validationErrors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in no-print">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-300 w-full max-w-lg overflow-hidden">
            <div className="bg-rose-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-rose-200 shrink-0" />
                <h3 className="font-bold text-sm sm:text-base">
                  No se puede guardar: Todos los campos son obligatorios
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setValidationErrors(null)}
                className="text-rose-200 hover:text-white p-1 rounded hover:bg-rose-600 transition-colors cursor-pointer"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                El checklist no puede guardarse hasta que se completen todos los requisitos obligatorios de la inspección vehicular:
              </p>
              <ul className="space-y-2 bg-rose-50 border border-rose-200 rounded-lg p-3.5 text-xs text-rose-950 font-medium">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setValidationErrors(null)}
                  className="px-4 py-2 bg-[#004b93] hover:bg-[#003d77] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Entendido, completar campos obligatorios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
