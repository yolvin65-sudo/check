import React, { useRef, useState } from 'react';
import { Camera, Trash2, Maximize2, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VehiclePhotoSlot } from '../types';
import { PhotoLightboxModal } from './PhotoLightboxModal';

interface PhotoSlotCardProps {
  slot: VehiclePhotoSlot;
  onPhotoChange: (slotId: string, dataUrl: string | null, timestamp?: string) => void;
}

export const PhotoSlotCard: React.FC<PhotoSlotCardProps> = ({ slot, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('es-GT')} ${now.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}`;
      onPhotoChange(slot.id, dataUrl, timeStr);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input so user can choose same photo or re-upload
    e.target.value = '';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(slot.id, null);
  };

  return (
    <>
      <div className="flex flex-col group">
        <div
          className={`relative aspect-square rounded-md border-2 overflow-hidden transition-all duration-200 flex flex-col justify-center items-center cursor-pointer ${
            slot.dataUrl
              ? 'border-[#004b93] bg-slate-900 shadow-xs'
              : slot.required
              ? 'border-dashed border-slate-300 hover:border-[#004b93] bg-slate-50 hover:bg-slate-100'
              : 'border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/70'
          }`}
          onClick={() => {
            if (slot.dataUrl) {
              setShowLightbox(true);
            } else {
              fileInputRef.current?.click();
            }
          }}
        >
          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />

          {slot.dataUrl ? (
            <>
              <img
                src={slot.dataUrl}
                alt={slot.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Status Indicator */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>Lista</span>
              </div>

              {/* Overlay actions */}
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLightbox(true);
                  }}
                  className="p-1 rounded bg-black/60 hover:bg-black/80 text-white transition-colors"
                  title="Ampliar foto"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1 rounded bg-rose-600/80 hover:bg-rose-700 text-white transition-colors"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Label and Timestamp in Card */}
              <div className="absolute bottom-1.5 left-2 right-2 text-white">
                <p className="text-xs font-bold leading-tight truncate">{slot.label}</p>
                {slot.timestamp && (
                  <p className="text-[10px] text-slate-300 font-mono-numbers truncate">
                    {slot.timestamp}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="p-2 text-center flex flex-col items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-1 group-hover:text-[#004b93] group-hover:bg-blue-100 transition-colors">
                <Camera className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-tight">
                {slot.label}
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {slot.required ? 'Obligatoria' : 'Opcional'}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons under card for mobile/touch accessibility */}
        <div className="mt-1 flex items-center justify-between text-[11px] px-0.5">
          <span className="text-slate-500 font-medium truncate max-w-[90px]" title={slot.description}>
            {slot.label}
          </span>
          <div className="flex items-center gap-1 no-print">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="text-slate-600 hover:text-[#004b93] p-1 rounded hover:bg-slate-200 cursor-pointer"
              title="Tomar con Cámara"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-slate-600 hover:text-[#004b93] p-1 rounded hover:bg-slate-200 cursor-pointer"
              title="Subir de Galería / Archivo"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <PhotoLightboxModal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        imageUrl={slot.dataUrl}
        title={`Foto: ${slot.label}`}
        timestamp={slot.timestamp}
        description={slot.description}
      />
    </>
  );
};
