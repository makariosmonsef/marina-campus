import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
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
  UserCheck,
  Crown,
  ShieldCheck,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Languages
} from 'lucide-react';

export const Header = ({ currentTab, onNavigate, onOpenRoleModal, onOpenLogin, onOpenRegister }) => {
  const { lang, isRTL, toggleLanguage, t } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();
  const { currentUser, switchRole, resetToDefaults, logout, data } = useStore();
  const { addToast } = useToast();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingPaymentsCount = data?.payments?.filter(p => p.status === 'pending_review').length || 0;
  const pendingMakeupCount = data?.makeupRequests?.filter(r => r.status === 'pending').length || 0;
  const unreadMessagesCount = data?.messages?.filter(m => !m.read && m.sender === 'parent').length || 0;
  const totalNotifications = pendingPaymentsCount + pendingMakeupCount + unreadMessagesCount;

  const handleLanguageSwitch = () => {
    toggleLanguage();
    addToast(lang === 'ar' ? 'Switched to English' : 'تم تغيير اللغة إلى العربية', 'info');
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -72; // Sticky header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'hero', label: t('navHome') || 'الرئيسية' },
    { id: 'about', label: t('navAbout') || 'عن الأكاديمية' },
    { id: 'tracks', label: t('navTracks') || 'المسارات والبرامج' },
    { id: 'instructor', label: t('navInstructor') || 'مس مارينا' },
    { id: 'pricing', label: t('navPricing') || 'باقات الاشتراك' },
    { id: 'contact', label: t('navContact') || 'تواصل معنا' }
  ];

  const roleBadges = {
    superadmin: (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-gold-50 text-gold-700 border border-gold-200">
        <Crown className="w-3.5 h-3.5 ml-1 text-gold-600 inline" />
        {t('superadminRole')}
      </span>
    ),
    admin: (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
        <ShieldCheck className="w-3.5 h-3.5 ml-1 text-brand-600 inline" />
        {t('adminRole')}
      </span>
    ),
    parent: (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-coral-50 text-coral-700 border border-coral-200">
        <UserCheck className="w-3.5 h-3.5 ml-1 text-coral-600 inline" />
        {t('parentRole')}
      </span>
    )
  };

  return (
    <header className="bg-surface/95 backdrop-blur-md border-b border-surface-border sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        
        {/* Logo & Brand Identity */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => {
            if (!currentUser) {
              scrollToSection('hero');
            } else {
              onNavigate('dashboard');
            }
          }}
        >
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-black text-forest tracking-tight">
                {t('brandName')}
              </h1>
              <span className="text-[10px] bg-gold-50 text-gold-700 border border-gold-200/90 px-2 py-0.5 rounded-md font-bold">
                Math & English
              </span>
            </div>
            <p className="text-[11px] text-forest-muted font-medium hidden sm:block">
              {t('brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Center: Public Landing Navigation (When visitor is not logged in) */}
        {!currentUser && (
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-forest">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3.5 py-2 rounded-lg text-forest hover:text-brand-600 hover:bg-surface-alt transition-colors font-medium text-xs tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Center: Quick Role Switcher for Testing/Demo (When user is logged in) */}
        {currentUser && (
          <div className="hidden xl:flex items-center bg-surface-alt/80 p-1 rounded-xl border border-surface-border text-xs shadow-xs gap-1.5">
            <span className="text-[11px] text-forest-muted px-2 font-semibold">
              {t('switchRoleBtn')}
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => {
                  switchRole('superadmin');
                  addToast(t('toastRoleSwitched'), 'success');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentUser.role === 'superadmin' 
                    ? 'bg-brand-500 text-white shadow-xs' 
                    : 'text-forest hover:text-brand-600 hover:bg-surface'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-gold-300 shrink-0" />
                <span>{t('owner')}</span>
              </button>
              <button 
                onClick={() => {
                  switchRole('admin');
                  addToast(t('toastRoleSwitched'), 'success');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all relative flex items-center gap-1 ${
                  currentUser.role === 'admin' 
                    ? 'bg-brand-700 text-white shadow-xs' 
                    : 'text-forest hover:text-brand-600 hover:bg-surface'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('coordinator')}</span>
                {totalNotifications > 0 && (
                  <span className="inline-block w-2 h-2 rounded-full bg-coral-500 mr-1 animate-pulse" />
                )}
              </button>
              <button 
                onClick={() => {
                  switchRole('parent', 'user-p1');
                  addToast(t('toastRoleSwitched'), 'success');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentUser.role === 'parent' 
                    ? 'bg-coral-500 text-white shadow-xs' 
                    : 'text-forest hover:text-coral-600 hover:bg-surface'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('parentRole')} ({lang === 'ar' ? 'يوسف' : 'Youssef'})</span>
              </button>
            </div>
          </div>
        )}

        {/* Right Side Actions: Language + Dark Mode + Auth Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Language Switcher Button (ICON ONLY) */}
          <button
            onClick={handleLanguageSwitch}
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            aria-label="Switch Language"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface hover:bg-surface-alt text-brand-700 border border-surface-border flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
          >
            <Languages className="w-4 h-4 text-brand-600" />
          </button>

          {/* Dark Mode Toggle Button (ICON ONLY) */}
          <button
            onClick={() => {
              toggleTheme();
              addToast(
                isDark 
                  ? (lang === 'ar' ? 'تم تفعيل الوضع النهاري' : 'Light mode enabled') 
                  : (lang === 'ar' ? 'تم تفعيل الوضع الليلي' : 'Dark mode enabled'),
                'info'
              );
            }}
            title={
              isDark 
                ? (lang === 'ar' ? 'التحويل إلى الوضع النهاري' : 'Switch to Light Mode') 
                : (lang === 'ar' ? 'التحويل إلى الوضع الليلي' : 'Switch to Dark Mode')
            }
            aria-label="Toggle dark mode"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface hover:bg-surface-alt text-brand-700 border border-surface-border flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gold-500 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-brand-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Pending Notifications Bell for Admins */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
            <div className="relative">
              <button 
                onClick={() => onNavigate('makeup-requests')} 
                title={t('pendingMakeupsCount')}
                className="p-2.5 rounded-xl text-forest hover:bg-surface-alt hover:text-brand-600 relative transition"
              >
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral-500 text-[10px] font-black text-white ring-2 ring-surface animate-pulse">
                    {totalNotifications}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* User Profile Card & Dropdown (Logged in) */}
          {currentUser ? (
            <div className="relative">
              <div 
                onClick={() => setShowUserDropdown(prev => !prev)}
                className="flex items-center bg-surface-alt/90 hover:bg-brand-50/60 border border-surface-border rounded-xl p-1.5 pr-2.5 cursor-pointer transition select-none"
              >
                <div className="text-start ml-2.5 mr-2.5 hidden sm:block">
                  <div className="text-xs font-bold text-forest leading-tight">
                    {currentUser.studentName || currentUser.name}
                  </div>
                  <div className="text-[11px] text-forest-muted">
                    {roleBadges[currentUser.role] || currentUser.role}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-forest text-sm shadow-2xs">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-forest-muted mr-1 ml-1" />
              </div>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowUserDropdown(false)} 
                  />
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 bg-surface rounded-2xl shadow-xl border border-surface-border p-2 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150`}>
                    <div className="p-3 bg-surface-alt/70 rounded-xl border border-surface-border text-start">
                      <div className="text-xs font-bold text-forest">
                        {currentUser.studentName || currentUser.name}
                      </div>
                      <div className="text-[11px] text-forest-muted font-mono">
                        {t('username')}: {currentUser.username}
                      </div>
                      <span className="text-[10px] font-bold text-brand-600 block mt-0.5">
                        {currentUser.title || currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenRoleModal();
                      }}
                      className="w-full text-start p-2.5 rounded-xl hover:bg-surface-alt text-forest font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>{t('switchRoleModalTitle')}</span>
                      <Shuffle className="w-4 h-4 text-forest-muted" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (window.confirm(t('resetDemo') + ' ?')) {
                          resetToDefaults();
                          addToast(t('toastResetSuccess'), 'info');
                        }
                      }}
                      className="w-full text-start p-2.5 rounded-xl hover:bg-gold-50 text-gold-700 font-bold text-xs flex items-center justify-between transition"
                    >
                      <span>{t('resetDemo')}</span>
                      <RotateCcw className="w-4 h-4 text-gold-600" />
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                        addToast(t('logout'), 'info');
                      }}
                      className="w-full text-start p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-between transition border-t border-surface-border pt-2"
                    >
                      <span>{t('logout')}</span>
                      <LogOut className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Visitor CTA Buttons (Not logged in) */
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={onOpenLogin || (() => onNavigate('login'))}
                className="px-3.5 py-2 text-forest hover:text-brand-700 bg-surface hover:bg-surface-alt border border-surface-border rounded-xl font-bold text-xs transition shadow-2xs hover:shadow-xs"
              >
                {t('login')}
              </button>

              <button
                onClick={onOpenRegister || (() => onNavigate('register'))}
                className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-sm transition"
              >
                <span>{isRTL ? 'اشترك الآن' : 'Enroll Now'}</span>
              </button>

              {/* Mobile Hamburger Toggle for Landing navigation */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-xl bg-surface hover:bg-surface-alt border border-surface-border text-forest transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Mobile Switch Role Button (Logged in) */}
          {currentUser && (
            <button
              onClick={onOpenRoleModal}
              className="lg:hidden p-2 rounded-xl bg-surface-alt text-forest hover:bg-brand-50 transition border border-surface-border"
              title={t('switchRoleModalTitle')}
            >
              <UserCheck className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* Mobile Drawer Dropdown for Landing Navigation */}
      {!currentUser && mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-surface px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full text-start px-3 py-2.5 rounded-lg text-sm font-bold text-forest hover:bg-surface-alt hover:text-brand-600 transition"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
            <button
              onClick={() => {
                toggleTheme();
                addToast(isDark ? (lang === 'ar' ? 'تم تفعيل الوضع النهاري' : 'Light mode enabled') : (lang === 'ar' ? 'تم تفعيل الوضع الليلي' : 'Dark mode enabled'), 'info');
              }}
              className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 rounded-lg bg-surface-alt text-forest border border-surface-border font-bold text-xs"
            >
              {isDark ? <Sun className="w-4 h-4 text-gold-500" /> : <Moon className="w-4 h-4 text-brand-600" />}
              <span>{isDark ? (lang === 'ar' ? 'الوضع النهاري' : 'Light Mode') : (lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}</span>
            </button>

            <button
              onClick={handleLanguageSwitch}
              className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 rounded-lg bg-surface-alt text-brand-700 border border-surface-border font-bold text-xs"
            >
              <Globe className="w-4 h-4 text-brand-600" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenRegister) onOpenRegister();
              }}
              className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs text-center shadow-xs transition"
            >
              {isRTL ? 'تسجيل طالب جديد' : 'Enroll Student'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenLogin) onOpenLogin();
              }}
              className="px-4 py-2.5 bg-surface-alt text-forest rounded-xl font-bold text-xs border border-surface-border transition"
            >
              {t('login')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
