import React from 'react';
import { RotateCcw, X, AlertTriangle, RefreshCw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  folio: string;
  vehicleUnit?: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  folio,
  vehicleUnit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#002d5c] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
              <RotateCcw className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Reiniciar Inspección</h3>
              <p className="text-xs text-sky-200">Restablecer Checklist a Estado Inicial</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed space-y-1.5">
              <p className="font-bold">
                ¿Estás seguro de que deseas reiniciar este checklist?
              </p>
              <p className="text-amber-900">
                Se restablecerán a su estado inicial:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                <li>Todos los ítems evaluados (✓ / ✗) volverán al estado pendiente <strong>'-'</strong>.</li>
                <li>Se vaciarán las <strong>4 fotografías</strong> obligatorias registradas.</li>
                <li>Se limpiarán las <strong>firmas digitales</strong> de piloto, coordinador y seguridad.</li>
                <li>Se limpiarán las observaciones generales y acciones requeridas.</li>
              </ul>
              <p className="text-emerald-800 font-semibold pt-1">
                ✓ Los datos de piloto, unidad y la hora en tiempo real se mantendrán sincronizados.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">Folio actual:</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
              {folio}
            </span>
          </div>
          {vehicleUnit && (
            <p className="text-[11px] text-slate-500 text-center">
              Unidad vinculada: <span className="font-semibold text-slate-700">{vehicleUnit}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sí, Reiniciar Checklist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
