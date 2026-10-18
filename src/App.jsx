import React, { useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useStore } from './context/StoreContext';
import { useToast } from './context/ToastContext';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { Modal } from './components/common/Modal';
import { LandingPage } from './components/auth/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { SuperAdminPortal } from './components/superadmin/SuperAdminPortal';
import { CoordinatorPortal } from './components/coordinator/CoordinatorPortal';
import { ParentPortal } from './components/parent/ParentPortal';

export const MainContent = () => {
  const { t, isRTL } = useLanguage();
  const { currentUser, switchRole } = useStore();
  const { addToast } = useToast();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleNavigate = (tab) => {
    if (tab === 'login') {
      setShowLoginModal(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 antialiased ${isRTL ? 'font-cairo' : 'font-inter'}`}>
      {/* Top Header with Globe Button & User Bar */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenRoleModal={() => setShowRoleModal(true)}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        {!currentUser ? (
          <LandingPage
            onOpenLogin={() => setShowLoginModal(true)}
            onOpenRegister={() => setShowRegisterModal(true)}
          />
        ) : currentUser.role === 'superadmin' ? (
          <SuperAdminPortal
            currentTab={currentTab}
            onNavigate={handleNavigate}
          />
        ) : currentUser.role === 'admin' || currentUser.role === 'coordinator' ? (
          <CoordinatorPortal
            currentTab={currentTab}
            onNavigate={handleNavigate}
          />
        ) : currentUser.role === 'parent' ? (
          <ParentPortal
            currentTab={currentTab}
            onNavigate={handleNavigate}
          />
        ) : (
          <LandingPage
            onOpenLogin={() => setShowLoginModal(true)}
            onOpenRegister={() => setShowRegisterModal(true)}
          />
        )}
      </main>

      {/* Mobile Navigation */}
      {currentUser && (
        <MobileNav
          currentTab={currentTab}
          onNavigate={handleNavigate}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onOpenRegister={() => setShowRegisterModal(true)}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Role Switcher Modal (Demo & Testing) */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={t('switchRoleModalTitle')}
      >
        <div className="space-y-4 text-start">
          <p className="text-xs text-slate-600 font-medium">
            يمكنك التبديل الفوري بين أدوار المنصة لاختبار جميع الوظائف:
          </p>

          <div className="space-y-3">
            {/* Super Admin */}
            <div
              onClick={() => {
                switchRole('superadmin');
                setShowRoleModal(false);
                addToast(t('toastRoleSwitched') + ' (مس مارينا)', 'success');
              }}
              className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-2xl">👩‍🏫</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">مس مارينا (Super Admin)</h4>
                  <p className="text-[11px] text-purple-700">{t('marinaRoleDesc')}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-700">{t('enterAs')} ←</span>
            </div>

            {/* Coordinator */}
            <div
              onClick={() => {
                switchRole('admin');
                setShowRoleModal(false);
                addToast(t('toastRoleSwitched') + ' (الكوردينيتور)', 'success');
              }}
              className="p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-2xl">👨‍💼</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">كوردينيتور السنتر (Coordinator)</h4>
                  <p className="text-[11px] text-blue-700">{t('coordinatorRoleDesc')}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-700">{t('enterAs')} ←</span>
            </div>

            {/* Parent 1 */}
            <div
              onClick={() => {
                switchRole('parent', 'user-p1');
                setShowRoleModal(false);
                addToast(t('toastRoleSwitched') + ' (يوسف أحمد)', 'success');
              }}
              className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-2xl">👦</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">ولي الأمر (يوسف أحمد - Primary 3)</h4>
                  <p className="text-[11px] text-emerald-700">{t('parentRoleDesc')}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">{t('enterAs')} ←</span>
            </div>

            {/* Parent 2 (KG) */}
            <div
              onClick={() => {
                switchRole('parent', 'user-p2');
                setShowRoleModal(false);
                addToast(t('toastRoleSwitched') + ' (ليلى - KG2)', 'success');
              }}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-2xl">👧</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">ولي أمر ليلى (KG 2 - English)</h4>
                  <p className="text-[11px] text-slate-500">طالبة بمرحلة رياض الأطفال</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600">{t('enterAs')} ←</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default function App() {
  return <MainContent />;
}
