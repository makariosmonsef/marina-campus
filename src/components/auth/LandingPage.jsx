import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { 
  UserPlus, 
  LogIn, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export const LandingPage = ({ onOpenLogin, onOpenRegister }) => {
  const { t } = useLanguage();
  const { login } = useStore();
  const { addToast } = useToast();

  const handleQuickLogin = (username) => {
    const res = login(username, '123');
    if (res.success) {
      addToast(`${t('parentGreeting')} ${res.user.studentName || res.user.name}`, 'success');
    }
  };

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 text-white p-8 md:p-14 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 ml-1 text-amber-300 shrink-0" />
            <span>{t('welcomePill')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {t('heroTitlePrefix')}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          <p className="text-sm md:text-lg text-purple-200 leading-relaxed font-medium max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 ml-2 mr-2" />
              {t('heroRegisterBtn')}
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl backdrop-blur-md border border-white/20 transition flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 ml-2 mr-2" />
              {t('heroLoginBtn')}
            </button>
          </div>

          {/* Demo shortcuts */}
          <div className="pt-8 border-t border-white/10 text-xs text-purple-300">
            <span className="block mb-2 font-semibold">
              {t('demoTryQuick')}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleQuickLogin('marina')}
                className="px-3 py-1.5 bg-purple-500/30 hover:bg-purple-500/50 rounded-xl text-purple-200 border border-purple-400/30 font-bold transition flex items-center"
              >
                <Award className="w-3.5 h-3.5 ml-1 mr-1" />
                👑 {t('superadminRole')}
              </button>
              <button
                onClick={() => handleQuickLogin('coordinator')}
                className="px-3 py-1.5 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl text-blue-200 border border-blue-400/30 font-bold transition flex items-center"
              >
                <BookOpen className="w-3.5 h-3.5 ml-1 mr-1" />
                👨‍💼 {t('adminRole')}
              </button>
              <button
                onClick={() => handleQuickLogin('youssef')}
                className="px-3 py-1.5 bg-emerald-500/30 hover:bg-emerald-500/50 rounded-xl text-emerald-200 border border-emerald-400/30 font-bold transition flex items-center"
              >
                👦 ولي أمر (يوسف)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {t('featureScheduleTitle')}
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {t('featureScheduleDesc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {t('featurePaymentsTitle')}
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {t('featurePaymentsDesc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {t('featureSupportTitle')}
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {t('featureSupportDesc')}
          </p>
        </div>
      </div>
    </div>
  );
};
