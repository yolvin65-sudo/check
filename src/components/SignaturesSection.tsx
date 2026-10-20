import React, { useState } from 'react';
import { PenTool, CheckCircle, RotateCcw, Lock } from 'lucide-react';
import { SignatureData, UserRole } from '../types';
import { SignatureModal } from './SignatureModal';

interface SignaturesSectionProps {
  signatures: {
    driver: SignatureData;
    supervisor: SignatureData;
    security: SignatureData;
  };
  currentUserRole?: UserRole;
  onUpdateSignature: (key: 'driver' | 'supervisor' | 'security', data: SignatureData) => void;
  onClearSignature: (key: 'driver' | 'supervisor' | 'security') => void;
  onRequestAdminAuth?: () => void;
}

export const SignaturesSection: React.FC<SignaturesSectionProps> = ({
  signatures,
  currentUserRole = 'coordinador',
  onUpdateSignature,
  onClearSignature,
  onRequestAdminAuth,
}) => {
  const [activeModalKey, setActiveModalKey] = useState<'driver' | 'supervisor' | 'security' | null>(null);

  const rolesConfig: Record<
    'driver' | 'supervisor' | 'security',
    {
      key: 'driver' | 'supervisor' | 'security';
      title: string;
      label: string;
      idLabel: string;
      defaultNamePlaceholder: string;
    }
  > = {
    driver: {
      key: 'driver',
      title: 'Firma del Piloto / Conductor',
      label: 'Firma del Piloto',
      idLabel: 'No. de DPI del Piloto',
      defaultNamePlaceholder: 'Nombre completo del piloto',
    },
    supervisor: {
      key: 'supervisor',
      title: 'Firma del Coordinador de Transporte',
      label: 'Firma Coordinador de Transporte',
      idLabel: 'No. Empleado / Código',
      defaultNamePlaceholder: 'Nombre del coordinador',
    },
    security: {
      key: 'security',
      title: 'Firma de Seguridad / Despacho',
      label: 'Firma Despacho / Garita',
      idLabel: 'No. Empleado / Turno',
      defaultNamePlaceholder: 'Nombre del inspector',
    },
  };

  const handleOpenModal = (key: 'driver' | 'supervisor' | 'security') => {
    setActiveModalKey(key);
  };

  const handleSaveSignature = (dataUrl: string, name: string, idNumber: string) => {
    if (!activeModalKey) return;
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('es-GT')} ${now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}`;
    onUpdateSignature(activeModalKey, {
      ...signatures[activeModalKey],
      name: name.trim() || signatures[activeModalKey].name,
      idNumber: idNumber.trim() || signatures[activeModalKey].idNumber,
      dataUrl,
      signedAt: timeStr,
    });
    setActiveModalKey(null);
  };

  const renderSignatureBox = (
    key: 'driver' | 'supervisor' | 'security',
    title: string,
    label: string,
    idLabel: string,
    placeholder: string
  ) => {
    const data = signatures[key];
    const isSigned = Boolean(data.dataUrl);

    const canSignThisBox =
      currentUserRole === 'coordinador' ||
      (currentUserRole === 'piloto' && key === 'driver') ||
      (currentUserRole === 'seguridad' && key === 'security');

    return (
      <div className="flex-1 flex flex-col items-center text-center p-3 bg-white rounded-md border border-slate-200">
        {/* Signature graphic box */}
        {!canSignThisBox && !isSigned ? (
          <div
            onClick={() => {
              if (onRequestAdminAuth) onRequestAdminAuth();
            }}
            className="w-full h-24 rounded border border-dashed border-slate-300 bg-slate-100/70 flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-slate-200/50 transition-colors"
            title="Requiere autorización y contraseña del Administrador / Garita"
          >
            <Lock className="w-4 h-4 mb-1 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">
              Pendiente de Autorización
            </span>
            <span className="text-[10px] text-slate-400">
              {key === 'supervisor' ? 'Exclusivo Coordinador' : 'Exclusivo Garita'}
            </span>
          </div>
        ) : (
          <div
            onClick={() => canSignThisBox && handleOpenModal(key)}
            className={`w-full h-24 rounded border-b-2 flex flex-col items-center justify-center relative transition-colors ${
              canSignThisBox ? 'cursor-pointer' : 'cursor-default'
            } ${
              isSigned
                ? 'border-[#004b93] bg-slate-50'
                : 'border-dashed border-slate-300 hover:border-[#004b93] bg-slate-50/50'
            }`}
          >
            {isSigned && data.dataUrl ? (
              <>
                <img
                  src={data.dataUrl}
                  alt={`Firma ${label}`}
                  className="max-h-20 w-auto max-w-full object-contain p-1"
                />
                {canSignThisBox && (
                  <div className="absolute top-1 right-1 flex items-center gap-1 no-print">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearSignature(key);
                      }}
                      className="p-1 rounded bg-white text-slate-400 hover:text-rose-600 shadow-xs text-[10px]"
                      title="Borrar firma"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 hover:text-[#004b93] p-2">
                <PenTool className="w-5 h-5 mb-1 text-slate-300" />
                <span className="text-xs font-semibold text-[#004b93]">
                  Clic para Firmar
                </span>
                <span className="text-[10px] text-slate-400">Pantalla táctil o cursor</span>
              </div>
            )}
          </div>
        )}

        {/* Printed inputs under signature */}
        <div className="w-full mt-3 space-y-1.5">
          <input
            type="text"
            readOnly={!canSignThisBox}
            value={data.name}
            onChange={(e) =>
              onUpdateSignature(key, { ...data, name: e.target.value })
            }
            placeholder={placeholder}
            className={`w-full text-center text-xs font-bold text-slate-800 border-b border-slate-300 focus:outline-hidden py-0.5 bg-transparent ${
              canSignThisBox ? 'focus:border-[#004b93]' : 'opacity-80'
            }`}
          />
          <div className="text-[10px] text-slate-500 font-mono-numbers">
            <input
              type="text"
              readOnly={!canSignThisBox}
              value={data.idNumber}
              onChange={(e) =>
                onUpdateSignature(key, { ...data, idNumber: e.target.value })
              }
              placeholder={idLabel}
              className={`w-full text-center text-[11px] text-slate-600 border-b border-dashed border-slate-200 focus:outline-hidden py-0.5 bg-transparent ${
                canSignThisBox ? 'focus:border-[#004b93]' : 'opacity-80'
              }`}
            />
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider pt-0.5">
            {label}
          </p>
          {data.signedAt && (
            <p className="text-[10px] text-slate-400 font-mono-numbers">
              {data.signedAt}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-6 pt-5 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs sm:text-sm font-bold text-[#004b93] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Validación y Firmas de Responsabilidad
          </h4>
          <span className="text-[11px] text-slate-400">
            Firma digital obligatoria para autorización de salida
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderSignatureBox(
            'driver',
            rolesConfig.driver.title,
            rolesConfig.driver.label,
            rolesConfig.driver.idLabel,
            rolesConfig.driver.defaultNamePlaceholder
          )}
          {renderSignatureBox(
            'supervisor',
            rolesConfig.supervisor.title,
            rolesConfig.supervisor.label,
            rolesConfig.supervisor.idLabel,
            rolesConfig.supervisor.defaultNamePlaceholder
          )}
          {renderSignatureBox(
            'security',
            rolesConfig.security.title,
            rolesConfig.security.label,
            rolesConfig.security.idLabel,
            rolesConfig.security.defaultNamePlaceholder
          )}
        </div>
      </div>

      {activeModalKey && (
        <SignatureModal
          isOpen={true}
          onClose={() => setActiveModalKey(null)}
          onSave={handleSaveSignature}
          title={
            activeModalKey === 'driver'
              ? 'Firma del Piloto'
              : activeModalKey === 'supervisor'
              ? 'Firma del Coordinador de Transporte'
              : 'Firma de Seguridad / Despacho'
          }
          initialName={signatures[activeModalKey].name}
          initialIdNumber={signatures[activeModalKey].idNumber}
          idLabel={
            activeModalKey === 'driver'
              ? 'No. de DPI del Piloto'
              : activeModalKey === 'supervisor'
              ? 'No. Empleado / Código'
              : 'No. Empleado / Turno'
          }
        />
      )}
    </>
  );
};
