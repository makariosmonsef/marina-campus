import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import {
  Home,
  Calendar,
  ClipboardCheck,
  CreditCard,
  RefreshCw,
  MessageCircle,
  LayoutDashboard,
  CheckSquare,
  Wallet,
  MessageSquare,
  Layers,
  Users,
  DollarSign,
  Clock,
  Settings
} from 'lucide-react';

export const MobileNav = ({ currentTab, onNavigate }) => {
  const { t } = useLanguage();
  const { currentUser } = useStore();

  if (!currentUser) return null;

  let items = [];

  if (currentUser.role === 'parent') {
    items = [
      { id: 'dashboard', label: t('navHome'), icon: <Home className="w-4 h-4" /> },
      { id: 'parent-schedule', label: t('navMySchedule'), icon: <Calendar className="w-4 h-4" /> },
      { id: 'parent-attendance', label: t('navMyAttendance'), icon: <ClipboardCheck className="w-4 h-4" /> },
      { id: 'parent-payments', label: t('navMyPayments'), icon: <CreditCard className="w-4 h-4" /> },
      { id: 'parent-makeup', label: t('navRequestMakeup'), icon: <RefreshCw className="w-4 h-4" /> },
      { id: 'parent-chat', label: t('navCoordinatorChat'), icon: <MessageCircle className="w-4 h-4" /> }
    ];
  } else if (currentUser.role === 'admin' || currentUser.role === 'coordinator') {
    items = [
      { id: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'groups-management', label: t('navSchedule'), icon: <Calendar className="w-4 h-4" /> },
      { id: 'attendance-manager', label: t('navAttendance'), icon: <CheckSquare className="w-4 h-4" /> },
      { id: 'payments-manager', label: t('navPayments'), icon: <Wallet className="w-4 h-4" /> },
      { id: 'makeup-requests', label: t('navMakeups'), icon: <RefreshCw className="w-4 h-4" /> },
      { id: 'messages-center', label: t('navMessages'), icon: <MessageSquare className="w-4 h-4" /> }
    ];
  } else {
    // superadmin
    items = [
      { id: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'groups-management', label: t('navGroups'), icon: <Layers className="w-4 h-4" /> },
      { id: 'students-list', label: t('navStudents'), icon: <Users className="w-4 h-4" /> },
      { id: 'financial-reports', label: t('navFinancial'), icon: <DollarSign className="w-4 h-4" /> },
      { id: 'makeup-slots-manager', label: t('navMakeupSlots'), icon: <Clock className="w-4 h-4" /> },
      { id: 'center-settings', label: t('navSettings'), icon: <Settings className="w-4 h-4" /> }
    ];
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-surface-border z-40 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-start sm:justify-around space-x-1 space-x-reverse overflow-x-auto no-scrollbar min-w-full">
        {items.map(item => {
          const isActive = currentTab === item.id || (!currentTab && item.id === 'dashboard');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[62px] py-1.5 px-2 rounded-xl transition shrink-0 ${
                isActive
                  ? 'text-brand-600 bg-brand-50 border border-brand-200/90 font-bold shadow-2xs'
                  : 'text-forest-muted hover:text-forest hover:bg-surface-alt/70'
              }`}
            >
              {item.icon}
              <span className="text-[10px] whitespace-nowrap mt-1 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
