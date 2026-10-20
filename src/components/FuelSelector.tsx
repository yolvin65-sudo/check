import React from 'react';
import { FuelLevel } from '../types';
import { Fuel } from 'lucide-react';

interface FuelSelectorProps {
  value: FuelLevel;
  onChange: (level: FuelLevel) => void;
}

export const FuelSelector: React.FC<FuelSelectorProps> = ({ value, onChange }) => {
  const levels: { id: FuelLevel; label: string; pct: number }[] = [
    { id: '0', label: 'E (Vacío)', pct: 5 },
    { id: '1/4', label: '1/4', pct: 25 },
    { id: '1/2', label: '1/2', pct: 50 },
    { id: '3/4', label: '3/4', pct: 75 },
    { id: '1/1', label: 'F (Lleno)', pct: 100 },
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#004b93] flex items-center gap-1">
          <Fuel className="w-3.5 h-3.5" />
          Combustible:
        </span>
        <span className="font-mono-numbers font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
          {levels.find((l) => l.id === value)?.label || value}
        </span>
      </div>

      {/* Interactive segments bar */}
      <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
        {levels.map((lvl) => {
          const isSelected = value === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onChange(lvl.id)}
              className={`py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#004b93] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {lvl.id === '0' ? 'E' : lvl.id === '1/1' ? 'F' : lvl.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
