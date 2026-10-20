import React, { useState } from 'react';
import { X, Search, FileText, Trash2, Download, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, Clock, FileSpreadsheet } from 'lucide-react';
import { VehicleChecklist } from '../types';
import { exportChecklistJSON } from '../utils/storage';
import { exportHistoryToExcel, exportChecklistToExcel } from '../utils/excelExport';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedChecklists: VehicleChecklist[];
  onLoadChecklist: (checklist: VehicleChecklist) => void;
  onDeleteChecklist: (id: string) => void;
  isAdmin?: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedChecklists,
  onLoadChecklist,
  onDeleteChecklist,
  isAdmin = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = savedChecklists.filter((chk) => {
    const matchesSearch =
      chk.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chk.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chk.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chk.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chk.date.includes(searchTerm);

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && chk.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprobado':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
          </span>
        );
      case 'Aprobado con Observación':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Con Observación
          </span>
        );
      case 'No Apto para Circular':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> No Apto
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Clock className="w-3.5 h-3.5" /> En Proceso
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#002d5c] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-lg">Historial de Checklists Vehiculares</h3>
              <p className="text-xs text-sky-200">
                Registros guardados en el dispositivo para la flota de Steren
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por placa, piloto, unidad, folio o fecha..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded focus:border-[#004b93] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#004b93] focus:outline-hidden"
            >
              <option value="all">Todos los estados</option>
              <option value="Aprobado">Aprobados</option>
              <option value="Aprobado con Observación">Con Observación</option>
              <option value="No Apto para Circular">No Aptos</option>
              <option value="En Proceso">En Proceso</option>
            </select>

            {savedChecklists.length > 0 && (
              <button
                type="button"
                onClick={() => exportHistoryToExcel(savedChecklists)}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Descargar toda la base de datos de inspecciones en un archivo Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Todo a Excel</span>
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">No se encontraron registros</p>
              <p className="text-xs text-slate-400 mt-1">
                {savedChecklists.length === 0
                  ? 'Aún no has guardado ninguna inspección en este equipo.'
                  : 'No hay resultados que coincidan con la búsqueda actual.'}
              </p>
            </div>
          ) : (
            filtered.map((chk) => {
              const photoCount = chk.photos.filter((p) => p.dataUrl).length;
              return (
                <div
                  key={chk.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:border-[#004b93] transition-all hover:shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-numbers text-xs font-bold text-[#004b93]">
                        {chk.folio}
                      </span>
                      {getStatusBadge(chk.status)}
                      <span className="text-xs text-slate-400">
                        {chk.date} · {chk.time}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Placa: </span>
                        <strong className="text-slate-800 font-mono-numbers">{chk.plate || 'S/N'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Unidad: </span>
                        <strong className="text-slate-800">{chk.unit || 'No especificada'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Piloto: </span>
                        <strong className="text-slate-800 truncate block sm:inline">{chk.driver || 'No asignado'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Tipo: </span>
                        <span className="text-slate-700 truncate">{chk.inspectionType || 'Salida'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Fotos: </span>
                        <span className="text-slate-700 font-mono-numbers">{photoCount} / {chk.photos.length}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Odómetro: </span>
                        <span className="text-slate-700 font-mono-numbers">{chk.odometer || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => exportChecklistToExcel(chk)}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded transition-colors"
                      title="Descargar esta inspección en Excel (.xlsx)"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportChecklistJSON(chk)}
                      className="p-1.5 text-slate-600 hover:text-[#004b93] hover:bg-blue-50 rounded transition-colors"
                      title="Descargar Respaldo JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar la inspección ${chk.folio}?`)) {
                            onDeleteChecklist(chk.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="Eliminar del historial (Administrador)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onLoadChecklist(chk);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#004b93] hover:bg-[#00376c] rounded flex items-center gap-1 transition-colors"
                    >
                      <span>Cargar</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total registrados: {savedChecklists.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 rounded transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
