import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Bike,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Users,
  UserPlus,
} from 'lucide-react';
import { AppUser } from '../types';

interface LoginScreenProps {
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  onOpenUserManagement?: (action?: 'create' | 'list') => void;
  initialUserId?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  users,
  onLoginSuccess,
  onOpenUserManagement,
  initialUserId,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialUserId || users[0]?.id || ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time clock in login screen
  const [liveClock, setLiveClock] = useState(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('es-GT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: now.toLocaleTimeString('es-GT', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveClock({
        date: now.toLocaleDateString('es-GT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: now.toLocaleTimeString('es-GT', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];
  const isMoto = Boolean(
    (selectedUser?.assignedUnit &&
      (selectedUser.assignedUnit.toLowerCase().includes('moto') ||
        selectedUser.assignedUnit.toLowerCase().includes('motocicleta'))) ||
      selectedUser?.id?.includes('moto')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUser) {
      setError('Por favor selecciona un colaborador válido.');
      return;
    }

    if (!password) {
      setError('Por favor ingresa la contraseña.');
      return;
    }

    if (password !== selectedUser.password) {
      setError('Contraseña incorrecta. Verifica la clave e intenta de nuevo.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(selectedUser);
    }, 250);
  };

  const handleUsePreset = () => {
    if (selectedUser) {
      setPassword(selectedUser.password);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001933] via-[#002d5c] to-[#004b93] flex flex-col justify-between p-4 sm:p-6 text-white relative overflow-hidden select-none">
      {/* Background glowing accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Branding */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/image_3b172871.png"
            alt="Steren"
            className="h-11 w-11 object-contain bg-white rounded-xl p-1 shadow-md shrink-0"
          />
          <div>
            <span className="text-xl font-bold tracking-tight text-white block">
              STEREN
            </span>
            <span className="text-[10px] uppercase tracking-widest text-sky-200 font-semibold block">
              Control de Flota & Inspección Vehicular
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenUserManagement && (
            <button
              type="button"
              onClick={onOpenUserManagement}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-sky-100 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border border-white/15 shadow-sm transition-colors"
              title="Crear, modificar o eliminar usuarios y contraseñas"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Gestión Usuarios ({users.length})</span>
            </button>
          )}

          {/* Live Real-time Clock Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-xs backdrop-blur-xs font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sky-200 capitalize">{liveClock.date}</span>
            <span className="text-white font-bold">{liveClock.time}</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] uppercase px-1.5 py-0.5 rounded font-sans font-bold">
              Tiempo Real
            </span>
          </div>
        </div>
      </header>

      {/* Center Authentication Lock Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/20 overflow-hidden text-[#2c3e50] animate-fade-in">
          {/* Card Banner */}
          <div className="bg-[#002d5c] text-white px-6 py-5 relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#004b93] to-sky-500 flex items-center justify-center text-white shadow-md">
                <Lock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Acceso Requerido
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Bloqueado
                  </span>
                </div>
                <p className="text-xs text-sky-200">
                  Inicia sesión para desbloquear el checklist vehicular
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-lg p-3 flex items-start gap-2.5 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-[#004b93] shrink-0 mt-0.5" />
              <p className="leading-snug">
                Por política de seguridad Steren, la pantalla principal permanece bloqueada hasta validar las credenciales del colaborador.
              </p>
            </div>

            {/* User Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>Seleccionar Colaborador</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {users.length} registrados
                </span>
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
                  const isUserMoto = Boolean(
                    (u.assignedUnit &&
                      (u.assignedUnit.toLowerCase().includes('moto') ||
                        u.assignedUnit.toLowerCase().includes('motocicleta'))) ||
                      u.id.includes('moto')
                  );
                  return (
                    <option key={u.id} value={u.id}>
                      {isUserMoto ? '🏍️ [MOTO] ' : '🚐 '}
                      {u.name} — {isUserMoto ? 'Piloto Moto' : u.role.toUpperCase()}
                      {u.assignedPlate ? ` (${u.assignedPlate})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* User Preview Box */}
            {selectedUser && (
              <div
                className={`border rounded-xl p-3.5 flex items-center gap-3 transition-colors ${
                  isMoto
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : selectedUser.role === 'coordinador'
                    ? 'bg-blue-50/80 border-blue-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm"
                  style={{ backgroundColor: selectedUser.avatarColor || '#004b93' }}
                >
                  {selectedUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 truncate">
                      {selectedUser.name}
                    </p>
                    {isMoto ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        <Bike className="w-3 h-3 text-emerald-600" /> Moto Envíos
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 uppercase bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {selectedUser.role}
                      </span>
                    )}
                  </div>
                  {selectedUser.assignedUnit ? (
                    <p className="text-[11px] text-slate-600 mt-0.5 truncate font-medium">
                      {selectedUser.assignedUnit} ·{' '}
                      <span className="font-mono text-slate-800 font-bold">
                        {selectedUser.assignedPlate}
                      </span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      DPI / ID: <span className="font-mono">{selectedUser.idNumber}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" /> Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleUsePreset}
                  className="text-[11px] font-semibold text-[#004b93] hover:underline cursor-pointer"
                  title="Autocompletar clave sugerida de prueba"
                >
                  Clave rápida:{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">
                    {selectedUser?.password}
                  </code>
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
                  placeholder="Ingresa la contraseña para desbloquear..."
                  className="w-full text-xs pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:border-[#004b93] focus:ring-1 focus:ring-[#004b93] focus:outline-hidden font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#004b93] hover:bg-[#003d77] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Verificando e Ingresando...' : 'Desbloquear e Iniciar Sesión'}
              </span>
            </button>

            {/* Quick Link for User Management */}
            {onOpenUserManagement && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={onOpenUserManagement}
                  className="font-bold text-[#004b93] hover:text-[#002d5c] hover:underline flex items-center gap-1.5 cursor-pointer py-0.5"
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Crear, modificar o eliminar usuarios</span>
                </button>
                <span className="text-[10px] text-slate-400 font-medium">
                  {users.length} usuarios
                </span>
              </div>
            )}
          </form>

          {/* Footer note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validación de identidad institucional Steren Transporte</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-sky-200/80 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Steren Electrónica · Departamento de Transporte y Logística</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>Sistema Seguro v2.4</span>
          <span>·</span>
          <span>Sincronización en Tiempo Real</span>
        </div>
      </footer>
    </div>
  );
};
