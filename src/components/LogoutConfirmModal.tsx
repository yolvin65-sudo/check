import React from 'react';
import { LogOut, X, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { AppUser } from '../types';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: AppUser | null;
  onConfirmLogout: () => void;
  isSwitchingUser?: boolean;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  onConfirmLogout,
  isSwitchingUser = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#002d5c] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-400/30">
              <LogOut className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isSwitchingUser ? 'Cambio de Usuario' : 'Cerrar Sesión'}
              </h3>
              <p className="text-xs text-sky-200">Protocolo de Seguridad Steren Transporte</p>
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-bold mb-1">
                Es obligatorio cerrar la sesión actual para poder realizar el cambio de usuario.
              </p>
              <p className="text-amber-800">
                Para mantener la trazabilidad y autoría de firmas y checklists en el sistema, no es posible cambiar de cuenta directamente sin antes finalizar la sesión activa.
              </p>
            </div>
          </div>

          {activeUser && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs"
                style={{ backgroundColor: activeUser.avatarColor || '#004b93' }}
              >
                {activeUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Sesión Activa Actual</span>
                <p className="font-bold text-slate-900 truncate">{activeUser.name}</p>
                <p className="text-slate-500 capitalize">{activeUser.role} {activeUser.idNumber ? `(${activeUser.idNumber})` : ''}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Permanecer en Sesión
          </button>
          <button
            type="button"
            onClick={onConfirmLogout}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isSwitchingUser ? 'Cerrar Sesión y Cambiar Usuario' : 'Confirmar y Cerrar Sesión'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
