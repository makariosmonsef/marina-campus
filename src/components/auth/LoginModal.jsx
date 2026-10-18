import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';

export const LoginModal = ({ isOpen, onClose, onOpenRegister }) => {
  const { t } = useLanguage();
  const { login } = useStore();
  const { addToast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(identifier, password);
    if (res.success) {
      addToast(`${t('parentGreeting')} ${res.user.studentName || res.user.name}`, 'success');
      onClose();
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleQuickFill = (u, p) => {
    setIdentifier(u);
    setPassword(p);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('login')}>
      <form onSubmit={handleSubmit} className="space-y-4 text-start">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t('username')} / {t('phone')}:
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="youssef / marina / coordinator"
            required
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t('password')}:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123"
            required
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Quick Demo Accounts Buttons */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-400 block mb-2">
            {t('demoTryQuick')}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('marina', '123')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200 transition"
            >
              👑 مس مارينا
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('coordinator', '123')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition"
            >
              👨‍💼 الكوردينيتور
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('youssef', '123')}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition"
            >
              👦 ولي أمر (يوسف)
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {t('register')}
          </button>
          <div className="flex space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              {t('login')}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
