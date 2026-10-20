import React from 'react';
import { AlertTriangle, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ValidationSummary } from '../utils/validation';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: ValidationSummary;
  onAutoFixDemo?: () => void;
  isAdmin?: boolean;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  validation,
  onAutoFixDemo,
  isAdmin,
}) => {
  if (!isOpen) return null;

  // Group missing items by section
  const grouped = validation.missingItems.reduce<Record<string, typeof validation.missingItems>>(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-rose-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Campos Obligatorios Incompletos</h3>
              <p className="text-xs text-rose-100">
                Es obligatorio llenar todos los campos antes de poder guardar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>
            Por política institucional de <strong>Steren Transporte</strong>, el sistema no permite guardar la inspección con campos vacíos. Debe completar los <strong>{validation.missingCount}</strong> requerimiento(s) listados a continuación.
          </p>
        </div>

        {/* Body list of missing items grouped by section */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-1.5 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{section}</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  {items.length} pendiente{items.length > 1 ? 's' : ''}
                </span>
              </div>
              <ul className="divide-y divide-slate-100 bg-white">
                {items.map((item) => (
                  <li key={item.id} className="p-3 text-xs flex items-start gap-2.5 hover:bg-slate-50">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800">{item.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {isAdmin && onAutoFixDemo && (
            <button
              type="button"
              onClick={() => {
                onAutoFixDemo();
                onClose();
              }}
              className="text-xs font-semibold text-[#004b93] hover:underline flex items-center gap-1 cursor-pointer"
              title="Completar automáticamente con datos y firmas de muestra válidas"
            >
              <span>Completar con datos de prueba</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 text-xs font-bold text-white bg-[#004b93] hover:bg-[#003970] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Entendido, completar campos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
