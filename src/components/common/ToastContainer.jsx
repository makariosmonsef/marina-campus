import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-sky-600 text-white'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    error: <AlertOctagon className="w-5 h-5 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
    info: <Info className="w-5 h-5 shrink-0" />
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col space-y-2 pointer-events-auto max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center justify-between px-4 py-3 rounded-2xl shadow-xl transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-300 text-xs sm:text-sm font-bold ${bgColors[toast.type] || bgColors.success}`}
        >
          <div className="flex items-center space-x-2.5 space-x-reverse">
            {icons[toast.type] || icons.success}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-80 hover:opacity-100 p-1 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
