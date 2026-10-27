import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/40 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className={`relative bg-surface rounded-2xl shadow-2xl ${maxWidth} w-full overflow-hidden border border-surface-border transition-all transform max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-alt/70">
          <h3 className="font-extrabold text-forest text-base leading-snug">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-forest-muted hover:text-forest hover:bg-surface border border-transparent hover:border-surface-border transition shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 bg-surface-alt/80 border-t border-surface-border flex justify-end space-x-2 space-x-reverse">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
