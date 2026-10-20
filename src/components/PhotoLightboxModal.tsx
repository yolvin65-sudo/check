import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface PhotoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
  timestamp?: string;
  description?: string;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  timestamp,
  description,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white border-b border-slate-700">
          <div>
            <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-sky-400" />
              {title}
            </h4>
            {timestamp && (
              <span className="text-xs text-slate-400 font-mono-numbers">
                Capturado: {timestamp}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[75vh] flex items-center justify-center bg-black p-2">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded"
          />
        </div>

        {description && (
          <div className="p-3 bg-slate-800 text-xs text-slate-300 border-t border-slate-700">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
