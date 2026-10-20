import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, X, PenTool } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string, name: string, idNumber: string) => void;
  title: string;
  initialName?: string;
  initialIdNumber?: string;
  idLabel?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  initialName = '',
  initialIdNumber = '',
  idLabel = 'DPI o No. Colaborador',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [name, setName] = useState(initialName);
  const [idNumber, setIdNumber] = useState(initialIdNumber);

  useEffect(() => {
    setName(initialName);
    setIdNumber(initialIdNumber);
  }, [initialName, initialIdNumber, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#002d5c';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setHasDrawn(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  const handleClear = () => {
    initCanvas();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl, name, idNumber);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#002d5c] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-sky-300" />
            <h3 className="font-bold text-base tracking-wide">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre Completo:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre y Apellidos"
                className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#004b93] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {idLabel}:
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => {
                  const isDpi = idLabel.toLowerCase().includes('dpi') || title.toLowerCase().includes('piloto');
                  if (isDpi) {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 13);
                    setIdNumber(digits);
                  } else {
                    setIdNumber(e.target.value);
                  }
                }}
                maxLength={idLabel.toLowerCase().includes('dpi') || title.toLowerCase().includes('piloto') ? 13 : 30}
                placeholder={idLabel.toLowerCase().includes('dpi') || title.toLowerCase().includes('piloto') ? "2489193420101 (13 dígitos)" : "Ej. STR-COL-552"}
                className="w-full text-sm border border-slate-300 rounded px-2.5 py-1.5 focus:border-[#004b93] focus:outline-hidden font-mono-numbers"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                Trazo de Firma Digital (con el dedo o cursor):
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                Limpiar trazo
              </button>
            </div>

            <div className="relative border-2 border-dashed border-slate-300 rounded-md bg-white overflow-hidden touch-none">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 cursor-crosshair block"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs">
                  Firme aquí sobre la línea punteada
                </div>
              )}
              <div className="absolute bottom-6 left-8 right-8 border-b border-slate-200 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDrawn && !name.trim()}
            className="px-5 py-2 text-xs font-bold text-white bg-[#004b93] hover:bg-[#003970] disabled:bg-slate-300 rounded transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            Guardar Firma
          </button>
        </div>
      </div>
    </div>
  );
};
