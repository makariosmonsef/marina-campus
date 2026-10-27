import React from 'react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const { isRTL } = useLanguage();

  const styles = {
    success: {
      card: 'border-brand-200/90 shadow-brand-500/10',
      badge: 'bg-brand-50 text-brand-600 border-brand-200',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    error: {
      card: 'border-coral-200/90 shadow-coral-500/10',
      badge: 'bg-coral-50 text-coral-700 border-coral-200',
      icon: <AlertOctagon className="w-4 h-4" />
    },
    warning: {
      card: 'border-gold-200/90 shadow-gold-500/10',
      badge: 'bg-gold-50 text-gold-700 border-gold-200',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    info: {
      card: 'border-surface-border shadow-forest/10',
      badge: 'bg-surface-alt text-forest border-surface-border',
      icon: <Info className="w-4 h-4" />
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className={`fixed bottom-20 md:bottom-6 z-50 flex flex-col space-y-2 pointer-events-auto max-w-sm w-[calc(100%-2rem)] mx-4 md:mx-0 ${isRTL ? 'md:left-6' : 'md:right-6'}`}>
      {toasts.map(toast => {
        const item = styles[toast.type] || styles.success;
        return (
          <div
            key={toast.id}
            className={`bg-surface border rounded-2xl shadow-xl p-3 flex items-start justify-between transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200 ${item.card}`}
          >
            <div className="flex items-center space-x-2.5 space-x-reverse">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center border shrink-0 ${item.badge}`}>
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm font-bold text-forest leading-snug">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-forest-muted hover:text-forest hover:bg-surface-alt transition shrink-0 ml-1 mr-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
