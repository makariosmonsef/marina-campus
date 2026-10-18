import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { 
  GraduationCap, 
  Globe, 
  Bell, 
  ChevronDown, 
  Shuffle, 
  RotateCcw, 
  LogOut, 
  UserCheck 
} from 'lucide-react';

export const Header = ({ currentTab, onNavigate, onOpenRoleModal }) => {
  const { lang, isRTL, toggleLanguage, t } = useLanguage();
  const { currentUser, switchRole, resetToDefaults, logout, data } = useStore();
  const { addToast } = useToast();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const pendingPaymentsCount = data.payments.filter(p => p.status === 'pending_review').length;
  const pendingMakeupCount = data.makeupRequests.filter(r => r.status === 'pending').length;
  const unreadMessagesCount = data.messages.filter(m => !m.read && m.sender === 'parent').length;
  const totalNotifications = pendingPaymentsCount + pendingMakeupCount + unreadMessagesCount;

  const handleLanguageSwitch = () => {
    toggleLanguage();
    addToast(lang === 'ar' ? 'Switched to English' : 'تم تغيير اللغة إلى العربية', 'info');
  };

  const roleBadges = {
    superadmin: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
        👑 {t('superadminRole')}
      </span>
    ),
    admin: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
        🛠️ {t('adminRole')}
      </span>
    ),
    parent: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        👨‍👧 {t('parentRole')}
      </span>
    )
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 ring-2 ring-purple-100 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                {t('brandName')}
              </h1>
              <span className="text-[11px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md font-bold">
                Math & English
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {t('brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Center: Quick Role Switcher for Testing/Demo (Desktop) */}
        {currentUser && (
          <div className="hidden lg:flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <span className="text-xs text-slate-500 px-2 font-semibold">
              {t('switchRoleBtn')}
            </span>
            <button 
              onClick={() => {
                switchRole('superadmin');
                addToast(t('toastRoleSwitched'), 'success');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentUser.role === 'superadmin' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-purple-600 hover:bg-white'
              }`}
            >
              👑 {t('owner')}
            </button>
            <button 
              onClick={() => {
                switchRole('admin');
                addToast(t('toastRoleSwitched'), 'success');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                currentUser.role === 'admin' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              👨‍💼 {t('coordinator')}
              {totalNotifications > 0 && (
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1 animate-pulse" />
              )}
            </button>
            <button 
              onClick={() => {
                switchRole('parent', 'user-p1');
                addToast(t('toastRoleSwitched'), 'success');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentUser.role === 'parent' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-white'
              }`}
            >
              👦 {t('parentRole')} (يوسف)
            </button>
          </div>
        )}

        {/* Right Side Actions: Globe Language Button + Profile + Notifications */}
        <div className="flex items-center space-x-2.5 space-x-reverse">
          
          {/* 🌐 GLOBE LANGUAGE SWITCHER BUTTON (Requested prominently) */}
          <button
            onClick={handleLanguageSwitch}
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Globe className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            <span className="font-extrabold uppercase tracking-wide">
              {lang === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          {/* Pending Notifications Bell for Admins */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
            <div className="relative">
              <button 
                onClick={() => onNavigate('makeup-requests')} 
                title={t('pendingMakeupsCount')}
                className="p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-indigo-600 relative transition"
              >
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                    {totalNotifications}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* User Profile Card & Dropdown */}
          {currentUser ? (
            <div className="relative">
              <div 
                onClick={() => setShowUserDropdown(prev => !prev)}
                className="flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-1.5 pr-2.5 cursor-pointer transition select-none"
              >
                <div className="text-right ml-2.5 hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.studentName || currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {roleBadges[currentUser.role] || currentUser.role}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-lg shadow-sm">
                  {currentUser.avatar || '👤'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
              </div>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowUserDropdown(false)} 
                  />
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150`}>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-800">
                        {currentUser.studentName || currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {t('username')}: {currentUser.username}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 block mt-0.5">
                        {currentUser.title || currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenRoleModal();
                      }}
                      className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>{t('switchRoleModalTitle')}</span>
                      <Shuffle className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (window.confirm(t('resetDemo') + ' ?')) {
                          resetToDefaults();
                          addToast(t('toastResetSuccess'), 'info');
                        }
                      }}
                      className="w-full text-right p-2.5 rounded-xl hover:bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>{t('resetDemo')}</span>
                      <RotateCcw className="w-4 h-4 text-amber-500" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                        addToast(t('logout'), 'info');
                      }}
                      className="w-full text-right p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-between transition border-t border-slate-100 pt-2"
                    >
                      <span>{t('logout')}</span>
                      <LogOut className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
            >
              {t('login')}
            </button>
          )}

          {/* Mobile Switch Role Button */}
          {currentUser && (
            <button
              onClick={onOpenRoleModal}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title={t('switchRoleModalTitle')}
            >
              <UserCheck className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
