import { VehicleChecklist } from '../types';

const STORAGE_KEY = 'steren_checklists_history_v1';
const CURRENT_DRAFT_KEY = 'steren_current_draft_v1';

export const getSavedChecklists = (): VehicleChecklist[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading checklists from localStorage', e);
    return [];
  }
};

export const saveChecklistToHistory = (checklist: VehicleChecklist): boolean => {
  try {
    const list = getSavedChecklists();
    const existingIdx = list.findIndex((c) => c.id === checklist.id);
    const updated = {
      ...checklist,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      list[existingIdx] = updated;
    } else {
      list.unshift(updated);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // If quota exceeded, keep only the latest 4 items and retry
      const trimmed = list.slice(0, 4);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }

    // Also save as draft
    try {
      localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(updated));
    } catch {
      // Ignore draft quota warning
    }
    return true;
  } catch (e) {
    console.error('Error saving checklist', e);
    return false;
  }
};

export const deleteChecklistFromHistory = (id: string): boolean => {
  try {
    const list = getSavedChecklists().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Error deleting checklist', e);
    return false;
  }
};

export const getSavedDraft = (): VehicleChecklist | null => {
  try {
    const raw = localStorage.getItem(CURRENT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveCurrentDraft = (checklist: VehicleChecklist): void => {
  try {
    localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(checklist));
  } catch (e) {
    console.warn('Draft save failed (likely storage limit due to photos)', e);
  }
};

export const clearCurrentDraft = (): void => {
  localStorage.removeItem(CURRENT_DRAFT_KEY);
};

export const exportChecklistJSON = (checklist: VehicleChecklist): void => {
  const jsonStr = JSON.stringify(checklist, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Checklist_${checklist.folio}_${checklist.plate || 'vehiculo'}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export interface InspectionStats {
  totalItems: number;
  completedItems: number;
  passedItems: number;
  failedItems: number;
  naItems: number;
  pendingItems: number;
  criticalFails: number;
  requiredPhotosTotal: number;
  requiredPhotosUploaded: number;
  signaturesCount: number;
  isReadyForDeparture: boolean;
}

export const calculateInspectionStats = (checklist: VehicleChecklist): InspectionStats => {
  let totalItems = 0;
  let passedItems = 0;
  let failedItems = 0;
  let naItems = 0;
  let pendingItems = 0;
  let criticalFails = 0;

  checklist.categories.forEach((cat) => {
    cat.items.forEach((item) => {
      totalItems++;
      if (item.status === 'pass') passedItems++;
      else if (item.status === 'fail') {
        failedItems++;
        if (item.critical) criticalFails++;
      } else if (item.status === 'na') naItems++;
      else pendingItems++;
    });
  });

  const completedItems = passedItems + failedItems + naItems;

  const requiredPhotos = checklist.photos.filter((p) => p.required);
  const requiredPhotosTotal = requiredPhotos.length;
  const requiredPhotosUploaded = requiredPhotos.filter((p) => Boolean(p.dataUrl)).length;

  let signaturesCount = 0;
  if (checklist.signatures.driver.dataUrl) signaturesCount++;
  if (checklist.signatures.supervisor.dataUrl) signaturesCount++;
  if (checklist.signatures.security.dataUrl) signaturesCount++;

  const isReadyForDeparture =
    criticalFails === 0 &&
    pendingItems === 0 &&
    requiredPhotosUploaded >= requiredPhotosTotal &&
    Boolean(checklist.signatures.driver.dataUrl) &&
    Boolean(checklist.signatures.supervisor.dataUrl);

  return {
    totalItems,
    completedItems,
    passedItems,
    failedItems,
    naItems,
    pendingItems,
    criticalFails,
    requiredPhotosTotal,
    requiredPhotosUploaded,
    signaturesCount,
    isReadyForDeparture,
  };
};
