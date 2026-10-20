import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Users,
  Shield,
  Truck,
  Wrench,
  CheckCircle2,
  Trash2,
  Edit2,
  Phone,
  Mail,
  Hash,
  Search,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Bike,
} from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  activeUserId: string;
  onSelectActiveUser: (userId: string) => void;
  onAddUser: (user: Omit<AppUser, 'id'>) => void;
  onUpdateUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
  initialAction?: 'create' | 'list';
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  activeUserId,
  onSelectActiveUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  initialAction = 'list',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(initialAction === 'create');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);

  // Sync initialAction when modal opens
  React.useEffect(() => {
    if (isOpen && initialAction === 'create') {
      handleStartCreate();
    }
  }, [isOpen, initialAction]);

  // Password verification modal for switching user
  const [authenticatingUser, setAuthenticatingUser] = useState<AppUser | null>(null);
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    idNumber: string;
    assignedUnit: string;
    assignedPlate: string;
    phone: string;
    active: boolean;
  }>({
    name: '',
    email: '',
    password: '',
    role: 'piloto',
    idNumber: '',
    assignedUnit: '',
    assignedPlate: '',
    phone: '',
    active: true,
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'piloto',
      idNumber: '',
      assignedUnit: '',
      assignedPlate: '',
      phone: '',
      active: true,
    });
    setIsCreating(false);
    setEditingUserId(null);
    setShowFormPassword(false);
  };

  const handleStartCreate = () => {
    setEditingUserId(null);
    setShowFormPassword(false);
    setFormData({
      name: '',
      email: '',
      password: 'steren' + Math.floor(100 + Math.random() * 900),
      role: 'piloto',
      idNumber: '',
      assignedUnit: '',
      assignedPlate: '',
      phone: '',
      active: true,
    });
    setIsCreating(true);
  };

  const handleStartEdit = (user: AppUser) => {
    setEditingUserId(user.id);
    setShowFormPassword(false);
    setFormData({
      name: user.name,
      email: user.email || '',
      password: user.password,
      role: user.role,
      idNumber: user.idNumber || '',
      assignedUnit: user.assignedUnit || '',
      assignedPlate: user.assignedPlate || '',
      phone: user.phone || '',
      active: user.active !== false,
    });
    setIsCreating(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Sanitize DPI to 13 digits if role is piloto
    const cleanIdNumber =
      formData.role === 'piloto'
        ? formData.idNumber.replace(/\D/g, '').slice(0, 13)
        : formData.idNumber.trim();

    const finalPassword = formData.password.trim() || 'steren2026';

    if (editingUserId) {
      const existing = users.find((u) => u.id === editingUserId);
      if (existing) {
        onUpdateUser({
          ...existing,
          ...formData,
          password: finalPassword,
          idNumber: cleanIdNumber,
        });
      }
    } else {
      const unitLower = (formData.assignedUnit || '').toLowerCase();
      onAddUser({
        ...formData,
        password: finalPassword,
        idNumber: cleanIdNumber,
        avatarColor:
          formData.role === 'coordinador'
            ? '#004b93'
            : formData.role === 'piloto'
            ? unitLower.includes('moto')
              ? '#059669'
              : '#0284c7'
            : formData.role === 'seguridad'
            ? '#475569'
            : '#ea580c',
      });
    }
    resetForm();
  };

  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Start auth verification to switch user
  const handleInitiateSwitchUser = (user: AppUser) => {
    setAuthenticatingUser(user);
    setAuthPasswordInput('');
    setAuthError(null);
    setShowAuthPassword(false);
  };

  const handleConfirmSwitchUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatingUser) return;

    if (!authPasswordInput) {
      setAuthError('Por favor ingresa la contraseña.');
      return;
    }

    if (authPasswordInput !== authenticatingUser.password) {
      setAuthError('Contraseña incorrecta. Intenta nuevamente.');
      return;
    }

    // Success
    onSelectActiveUser(authenticatingUser.id);
    setAuthenticatingUser(null);
    setAuthPasswordInput('');
    setAuthError(null);
    onClose();
  };

  const filteredUsers = users.filter((u) => {
    const isMoto = Boolean(
      u.assignedUnit && (u.assignedUnit.toLowerCase().includes('moto') || u.assignedUnit.toLowerCase().includes('motocicleta'))
    );

    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.idNumber.includes(searchTerm) ||
      (u.assignedUnit && u.assignedUnit.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.assignedPlate && u.assignedPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (searchTerm.toLowerCase().includes('moto') && isMoto);

    if (filterRole === 'all') return matchesSearch;
    if (filterRole === 'moto') return matchesSearch && u.role === 'piloto' && isMoto;
    if (filterRole === 'camion') return matchesSearch && u.role === 'piloto' && !isMoto;
    return matchesSearch && u.role === filterRole;
  });

  const getRoleBadge = (role: UserRole, assignedUnit?: string) => {
    const isMoto = Boolean(
      assignedUnit && (assignedUnit.toLowerCase().includes('moto') || assignedUnit.toLowerCase().includes('motocicleta'))
    );

    if (role === 'piloto' && isMoto) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-300">
          <Bike className="w-3.5 h-3.5 text-emerald-600" /> Piloto de Moto (Envíos)
        </span>
      );
    }

    switch (role) {
      case 'coordinador':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded">
            <Shield className="w-3 h-3 text-[#004b93]" /> Coordinador / Admin
          </span>
        );
      case 'piloto':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded">
            <Truck className="w-3 h-3 text-sky-600" /> Piloto de Flota
          </span>
        );
      case 'seguridad':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
            <Shield className="w-3 h-3 text-slate-500" /> Seguridad / Garita
          </span>
        );
      case 'mecanico':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
            <Wrench className="w-3 h-3 text-amber-600" /> Taller / Mecánico
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#002d5c] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_3b172871.png"
              alt="Steren"
              className="h-12 w-12 object-contain bg-white rounded-xl p-1 shadow-sm shrink-0 border border-white/20"
            />
            <div>
              <h3 className="font-bold text-lg leading-tight">
                Gestión de Usuarios y Contraseñas de Flota
              </h3>
              <p className="text-xs text-sky-200">
                Crear nuevos usuarios, modificar datos y contraseñas, o eliminar colaboradores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo, DPI (13 dígitos) o unidad..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#004b93] focus:outline-hidden font-medium"
            >
              <option value="all">Todos los roles</option>
              <option value="piloto">Todos los Pilotos</option>
              <option value="moto">🏍️ Pilotos de Moto (Envíos)</option>
              <option value="camion">🚚 Pilotos Panel / Camión</option>
              <option value="coordinador">Coordinadores</option>
              <option value="seguridad">Seguridad / Garita</option>
              <option value="mecanico">Mecánicos / Taller</option>
            </select>

            <button
              type="button"
              onClick={handleStartCreate}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#004b93] hover:bg-[#00376c] rounded flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario con Contraseña</span>
            </button>
          </div>
        </div>

        {/* Create / Edit Form Drawer */}
        {isCreating && (
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-sky-50/70 border-b border-sky-200 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#002d5c] uppercase flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#004b93]" />
                {editingUserId ? 'Modificar Usuario y Contraseña' : 'Registrar Nuevo Usuario con Contraseña'}
              </h4>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Nombre */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nombre Completo *:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Juan Carlos Morales"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Rol en la Operación *:
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UserRole })
                  }
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden font-medium"
                >
                  <option value="piloto">Piloto / Conductor de Flota</option>
                  <option value="coordinador">Coordinador de Transporte</option>
                  <option value="seguridad">Inspector de Seguridad / Garita</option>
                  <option value="mecanico">Técnico Mecánico / Taller</option>
                </select>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Contraseña de Acceso *:</span>
                </label>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full text-xs pl-2.5 pr-8 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    title={showFormPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* DPI / Identificación */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {formData.role === 'piloto'
                    ? 'No. de DPI (13 dígitos) *:'
                    : 'Código de Colaborador / DPI *:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    inputMode={formData.role === 'piloto' ? 'numeric' : 'text'}
                    maxLength={formData.role === 'piloto' ? 13 : 25}
                    value={formData.idNumber}
                    onChange={(e) => {
                      if (formData.role === 'piloto') {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 13);
                        setFormData({ ...formData, idNumber: digits });
                      } else {
                        setFormData({ ...formData, idNumber: e.target.value });
                      }
                    }}
                    placeholder={
                      formData.role === 'piloto' ? '2489193420101' : 'Ej. STR-COL-555'
                    }
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden font-mono-numbers"
                  />
                  {formData.role === 'piloto' && (
                    <span className="text-[10px] text-slate-400 absolute right-2 top-1.5 font-mono-numbers">
                      {formData.idNumber.length}/13
                    </span>
                  )}
                </div>
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@steren.com.gt"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Teléfono de Contacto:
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+502 5555-1234"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden"
                />
              </div>

              {/* Unidad Asignada (para pilotos) */}
              {formData.role === 'piloto' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Unidad Asignada:
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Plantilla Moto:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedUnit: 'Moto Steren #05 (Honda Cargo GL 150)',
                            assignedPlate: 'M-521KLQ',
                            password: prev.password || 'moto05',
                          }))
                        }
                        className="text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-0.5 cursor-pointer"
                        title="Autocompletar formato para Motocicleta Honda GL 150"
                      >
                        <Bike className="w-2.5 h-2.5 text-emerald-600" /> Honda 150
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedUnit: 'Moto Steren #06 (Yamaha YBR 125)',
                            assignedPlate: 'M-634FBN',
                            password: prev.password || 'moto06',
                          }))
                        }
                        className="text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-0.5 cursor-pointer"
                        title="Autocompletar formato para Motocicleta Yamaha 125"
                      >
                        <Bike className="w-2.5 h-2.5 text-emerald-600" /> Yamaha 125
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.assignedUnit}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedUnit: e.target.value })
                    }
                    placeholder="Ej. Moto Steren #01 (Honda Cargo GL 150)"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden"
                  />
                </div>
              )}

              {/* Placa Asignada */}
              {formData.role === 'piloto' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Placa Asignada:
                  </label>
                  <input
                    type="text"
                    value={formData.assignedPlate}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedPlate: e.target.value.toUpperCase() })
                    }
                    placeholder="C-784BPK"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden font-mono-numbers uppercase tracking-wider"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-sky-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded shadow-xs"
              >
                {editingUserId ? 'Guardar Cambios' : 'Registrar Usuario con Contraseña'}
              </button>
            </div>
          </form>
        )}

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">No se encontraron usuarios</p>
              <p className="text-xs text-slate-400 mt-1">
                Puedes registrar nuevos pilotos o personal de garita con el botón superior.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isActiveUser = user.id === activeUserId;
              const isRevealed = !!revealedPasswords[user.id];

              return (
                <div
                  key={user.id}
                  className={`bg-white border rounded-lg p-3.5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isActiveUser
                      ? 'border-[#004b93] shadow-xs bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar Initials */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-2xs"
                      style={{ backgroundColor: user.avatarColor || '#004b93' }}
                    >
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900 leading-tight">
                          {user.name}
                        </strong>
                        {getRoleBadge(user.role, user.assignedUnit)}
                        {isActiveUser && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Sesión Activa
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-600">
                        {user.idNumber && (
                          <div className="flex items-center gap-1 font-mono-numbers">
                            <Hash className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">
                              {user.role === 'piloto' ? 'DPI:' : 'ID:'}
                            </span>
                            <strong className="text-slate-800">{user.idNumber}</strong>
                          </div>
                        )}

                        {/* Contraseña Cell with Reveal Button */}
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-slate-400">Clave:</span>
                          <span className="font-mono text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {isRevealed ? user.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(user.id)}
                            className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            title={isRevealed ? 'Ocultar clave' : 'Ver clave'}
                          >
                            {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>

                        {user.email && (
                          <div className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        {user.assignedUnit && (
                          <div
                            className={`col-span-full sm:col-span-2 text-[11px] font-medium flex items-center gap-1.5 ${
                              user.assignedUnit.toLowerCase().includes('moto')
                                ? 'text-emerald-700'
                                : 'text-[#004b93]'
                            }`}
                          >
                            {user.assignedUnit.toLowerCase().includes('moto') ? (
                              <Bike className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Truck className="w-3.5 h-3.5 text-[#004b93] shrink-0" />
                            )}
                            <span>
                              Asignado: <strong>{user.assignedUnit}</strong>{' '}
                              <span className="font-mono text-slate-500">
                                ({user.assignedPlate || 'Sin placa'})
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    {!isActiveUser && (
                      <button
                        type="button"
                        onClick={() => handleInitiateSwitchUser(user)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#004b93] bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                        title="Verificar contraseña e iniciar sesión"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Iniciar como {user.name.split(' ')[0]}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(user)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#004b93] bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="Modificar datos o clave del usuario"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Modificar</span>
                    </button>
                    {users.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDeletingUser(user)}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Eliminar usuario del sistema"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total registrados: {users.length} colaboradores con contraseña</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 rounded transition-colors"
          >
            Cerrar
          </button>
        </div>

        {/* Nested Password Verification Modal when switching user */}
        {authenticatingUser && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <Lock className="w-4 h-4 text-[#004b93]" />
                  <h4 className="font-bold text-sm">Verificación de Contraseña</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthenticatingUser(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-sky-50 rounded-lg p-2.5 text-xs text-slate-700 flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0"
                  style={{ backgroundColor: authenticatingUser.avatarColor || '#004b93' }}
                >
                  {authenticatingUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{authenticatingUser.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">{authenticatingUser.role}</p>
                </div>
              </div>

              <form onSubmit={handleConfirmSwitchUser} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Contraseña de {authenticatingUser.name.split(' ')[0]}:
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthPasswordInput(authenticatingUser.password)}
                      className="text-[10px] text-[#004b93] font-semibold hover:underline"
                    >
                      Pista: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{authenticatingUser.password}</code>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showAuthPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      value={authPasswordInput}
                      onChange={(e) => {
                        setAuthPasswordInput(e.target.value);
                        setAuthError(null);
                      }}
                      placeholder="Ingresa la contraseña..."
                      className="w-full text-xs pl-3 pr-8 py-2 border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showAuthPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] font-semibold text-rose-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthenticatingUser(null)}
                    className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 text-xs font-bold text-white bg-[#004b93] hover:bg-[#00376c] rounded flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Confirmar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal (iFrame safe, no alert/confirm) */}
        {deletingUser && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl border border-rose-200 w-full max-w-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">¿Eliminar este usuario?</h4>
                  <p className="text-xs text-slate-500">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                <p className="font-bold text-slate-900">{deletingUser.name}</p>
                <p className="text-slate-500 capitalize">
                  {deletingUser.role} {deletingUser.assignedUnit ? `· ${deletingUser.assignedUnit}` : ''}
                </p>
                <p className="font-mono text-slate-600">ID / DPI: {deletingUser.idNumber}</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteUser(deletingUser.id);
                    setDeletingUser(null);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sí, Eliminar Usuario</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
