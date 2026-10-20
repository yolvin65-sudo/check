import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, X, CheckCircle2, Bike, Users } from 'lucide-react';
import { AppUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  onOpenUserManagement?: () => void;
  initialSelectedUserId?: string;
  isDismissable?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onOpenUserManagement,
  initialSelectedUserId,
  isDismissable = true,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialSelectedUserId || users[0]?.id || ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUser) {
      setError('Por favor seleccione un usuario válido.');
      return;
    }

    if (!password) {
      setError('Por favor ingrese la contraseña.');
      return;
    }

    if (password !== selectedUser.password) {
      setError('Contraseña incorrecta. Verifique la clave e intente nuevamente.');
      return;
    }

    // Success
    setPassword('');
    setError(null);
    onLoginSuccess(selectedUser);
  };

  const handleUsePresetPassword = () => {
    if (selectedUser) {
      setPassword(selectedUser.password);
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header Steren */}
        <div className="bg-[#002d5c] text-white px-6 py-5 relative">
          {isDismissable && onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_3b172871.png"
              alt="Steren"
              className="h-12 w-12 object-contain bg-white rounded-xl p-1 shadow-sm shrink-0 border border-white/20"
            />
            <div>
              <h3 className="font-bold text-base text-white">Steren Transporte</h3>
              <p className="text-xs text-sky-200">Autenticación de Personal y Pilotos</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Seleccionar Colaborador / Usuario
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setPassword('');
                setError(null);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800 focus:border-[#004b93] focus:bg-white focus:outline-hidden"
            >
              {users.map((u) => {
                const isMoto = u.assignedUnit?.toLowerCase().includes('moto');
                return (
                  <option key={u.id} value={u.id}>
                    {isMoto ? '🏍️ [MOTO] ' : ''}
                    {u.name} — {isMoto ? 'Piloto Moto' : u.role.toUpperCase()}
                    {u.assignedPlate ? ` (${u.assignedPlate})` : u.idNumber ? ` (${u.idNumber})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* User Preview Card */}
          {selectedUser && (
            <div
              className={`border rounded-lg p-3 flex items-center gap-3 ${
                selectedUser.assignedUnit?.toLowerCase().includes('moto')
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-sky-50 border-sky-100'
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs"
                style={{ backgroundColor: selectedUser.avatarColor || '#004b93' }}
              >
                {selectedUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-slate-900 truncate">{selectedUser.name}</p>
                  {selectedUser.assignedUnit?.toLowerCase().includes('moto') ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                      <Bike className="w-3 h-3 text-emerald-600" /> Moto Envíos
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 capitalize bg-white/70 px-1.5 py-0.2 rounded border border-slate-200">
                      {selectedUser.role}
                    </span>
                  )}
                </div>
                {selectedUser.assignedUnit ? (
                  <p className="text-[11px] text-slate-600 mt-0.5 truncate font-medium">
                    {selectedUser.assignedUnit}{' '}
                    <span className="font-mono text-slate-800 font-bold">
                      ({selectedUser.assignedPlate || 'Sin placa'})
                    </span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedUser.email || selectedUser.idNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Contraseña
              </label>
              <button
                type="button"
                onClick={handleUsePresetPassword}
                className="text-[11px] font-semibold text-[#004b93] hover:underline cursor-pointer"
                title="Autocompletar clave sugerida de este usuario"
              >
                Clave de prueba: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">{selectedUser?.password}</code>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Ingresa la contraseña..."
                className="w-full text-xs pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:border-[#004b93] focus:ring-1 focus:ring-[#004b93] focus:outline-hidden font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#004b93] hover:bg-[#00376c] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Ingresar y Activar Sesión</span>
            </button>
          </div>

          {/* Link to User Management */}
          {onOpenUserManagement && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onOpenUserManagement();
                }}
                className="font-bold text-[#004b93] hover:text-[#002d5c] hover:underline flex items-center gap-1.5 cursor-pointer py-1"
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Gestionar Usuarios (Crear / Modificar / Eliminar)</span>
              </button>
              <span className="text-[10px] text-slate-400 font-medium">
                {users.length} usuarios
              </span>
            </div>
          )}
        </form>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-400">
          <span>Acceso seguro protegido por credenciales corporativas Steren</span>
        </div>
      </div>
    </div>
  );
};
