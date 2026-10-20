import React, { useState } from 'react';
import { ChecklistCategory, ChecklistItem, ItemStatus } from '../types';
import { Check, X, Minus, MessageSquare, AlertCircle } from 'lucide-react';

interface CategorySectionProps {
  category: ChecklistCategory;
  onItemStatusChange: (categoryId: string, itemId: string, status: ItemStatus) => void;
  onItemNoteChange: (categoryId: string, itemId: string, note: string) => void;
  onMarkAllPass?: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onItemStatusChange,
  onItemNoteChange,
}) => {
  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null);

  const completedCount = category.items.filter((i) => i.status !== 'pending').length;
  const passCount = category.items.filter((i) => i.status === 'pass').length;
  const failCount = category.items.filter((i) => i.status === 'fail').length;

  return (
    <div className="border border-[#004b93] rounded-md overflow-hidden bg-white shadow-2xs flex flex-col">
      {/* Category Header */}
      <div className="bg-[#002d5c] text-white px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm font-bold tracking-wide">
        <div className="flex items-center gap-2">
          <span>{category.title}</span>
          {failCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">
              {failCount} fallo{failCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-sky-200 font-mono-numbers bg-white/10 px-2 py-0.5 rounded">
            {passCount}/{category.items.length}
          </span>
        </div>
      </div>

      {/* Items List */}
      <ul className="divide-y divide-slate-100 flex-1">
        {category.items.map((item) => {
          const isNoteOpen = activeNoteItemId === item.id || Boolean(item.notes);

          return (
            <li
              key={item.id}
              className={`p-2.5 transition-colors ${
                item.status === 'fail'
                  ? 'bg-rose-50/60'
                  : item.status === 'pass'
                  ? 'bg-slate-50/30'
                  : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {item.critical && (
                    <span
                      title="Elemento Crítico de Seguridad"
                      className="text-amber-600 shrink-0 mt-0.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs sm:text-[13px] leading-tight select-none cursor-pointer block font-semibold ${
                        item.status === 'fail'
                          ? 'text-rose-900'
                          : item.status === 'pass'
                          ? 'text-slate-900'
                          : 'text-slate-700'
                      }`}
                      onClick={() => {
                        const nextStatus: ItemStatus =
                          item.status === 'pass' ? 'pending' : 'pass';
                        onItemStatusChange(category.id, item.id, nextStatus);
                      }}
                    >
                      {item.label}
                    </span>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Note toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveNoteItemId(
                        activeNoteItemId === item.id ? null : item.id
                      )
                    }
                    className={`p-1 rounded text-slate-400 hover:text-slate-700 transition-colors ${
                      item.notes ? 'text-amber-600 bg-amber-50' : 'no-print'
                    }`}
                    title={item.notes ? `Nota: ${item.notes}` : 'Añadir nota u observación'}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  {/* Status Toggle Buttons: Only Symbols (✓, ✗, -) */}
                  <div className="inline-flex items-center rounded border border-slate-200 bg-white p-0.5 shadow-2xs gap-0.5 shrink-0">
                    {/* (✓) */}
                    <button
                      type="button"
                      aria-label="Pasa"
                      onClick={() =>
                        onItemStatusChange(
                          category.id,
                          item.id,
                          item.status === 'pass' ? 'na' : 'pass'
                        )
                      }
                      className={`w-7 h-7 sm:w-8 sm:h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        item.status === 'pass'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="Pasa (✓)"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    {/* (✗) */}
                    <button
                      type="button"
                      aria-label="No Pasa"
                      onClick={() => {
                        const newStatus = item.status === 'fail' ? 'na' : 'fail';
                        onItemStatusChange(category.id, item.id, newStatus);
                        if (newStatus === 'fail') {
                          setActiveNoteItemId(item.id);
                        }
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        item.status === 'fail'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-rose-700 hover:bg-rose-50'
                      }`}
                      title="No Pasa (✗)"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>

                    {/* (-) */}
                    <button
                      type="button"
                      aria-label="Sin evaluar / En proceso"
                      onClick={() =>
                        onItemStatusChange(category.id, item.id, 'na')
                      }
                      className={`w-7 h-7 sm:w-8 sm:h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
                        item.status === 'na' || item.status === 'pending'
                          ? 'bg-slate-700 text-white font-black shadow-xs'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Sin evaluar / En proceso (-)"
                    >
                      <Minus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Note Box */}
              {isNoteOpen && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) =>
                      onItemNoteChange(category.id, item.id, e.target.value)
                    }
                    placeholder="Detalle o anomalía observada..."
                    className="w-full text-xs px-2 py-1 bg-amber-50/70 border border-amber-200 rounded text-amber-950 placeholder-amber-400 focus:outline-hidden focus:border-amber-500"
                  />
                  {item.notes && (
                    <button
                      type="button"
                      onClick={() => onItemNoteChange(category.id, item.id, '')}
                      className="text-slate-400 hover:text-rose-600 text-[10px] px-1 no-print"
                      title="Borrar nota"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
