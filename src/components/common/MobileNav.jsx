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
      { id: 'dashboard', label: t('navHome'), icon: <Home className="w-5 h-5 mb-1" /> },
      { id: 'parent-schedule', label: t('navMySchedule'), icon: <Calendar className="w-5 h-5 mb-1" /> },
      { id: 'parent-attendance', label: t('navMyAttendance'), icon: <ClipboardCheck className="w-5 h-5 mb-1" /> },
      { id: 'parent-payments', label: t('navMyPayments'), icon: <CreditCard className="w-5 h-5 mb-1" /> },
      { id: 'parent-makeup', label: t('navRequestMakeup'), icon: <RefreshCw className="w-5 h-5 mb-1" /> },
      { id: 'parent-chat', label: t('navCoordinatorChat'), icon: <MessageCircle className="w-5 h-5 mb-1" /> }
    ];
  } else if (currentUser.role === 'admin' || currentUser.role === 'coordinator') {
    items = [
      { id: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-5 h-5 mb-1" /> },
      { id: 'groups-management', label: t('navSchedule'), icon: <Calendar className="w-5 h-5 mb-1" /> },
      { id: 'attendance-manager', label: t('navAttendance'), icon: <CheckSquare className="w-5 h-5 mb-1" /> },
      { id: 'payments-manager', label: t('navPayments'), icon: <Wallet className="w-5 h-5 mb-1" /> },
      { id: 'makeup-requests', label: t('navMakeups'), icon: <RefreshCw className="w-5 h-5 mb-1" /> },
      { id: 'messages-center', label: t('navMessages'), icon: <MessageSquare className="w-5 h-5 mb-1" /> }
    ];
  } else {
    // superadmin
    items = [
      { id: 'dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-5 h-5 mb-1" /> },
      { id: 'groups-management', label: t('navGroups'), icon: <Layers className="w-5 h-5 mb-1" /> },
      { id: 'students-list', label: t('navStudents'), icon: <Users className="w-5 h-5 mb-1" /> },
      { id: 'financial-reports', label: t('navFinancial'), icon: <DollarSign className="w-5 h-5 mb-1" /> },
      { id: 'makeup-slots-manager', label: t('navMakeupSlots'), icon: <Clock className="w-5 h-5 mb-1" /> },
      { id: 'center-settings', label: t('navSettings'), icon: <Settings className="w-5 h-5 mb-1" /> }
    ];
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-2 px-3 shadow-lg flex justify-around items-center">
      {items.map(item => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center text-xs font-semibold py-1 px-2 rounded-xl transition ${
              isActive
                ? 'text-indigo-600 bg-indigo-50 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {item.icon}
            <span className="text-[10px] whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
