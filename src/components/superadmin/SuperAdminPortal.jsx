import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  DollarSign, 
  PieChart, 
  BookOpen, 
  Printer, 
  Edit3, 
  PlusCircle, 
  Save, 
  Settings,
  CreditCard,
  Building,
  Smartphone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Activity,
  MapPin,
  Crown,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const SuperAdminPortal = ({ currentTab, onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const { data, updateStudent, updatePaymentSettings, addGroup } = useStore();
  const { addToast } = useToast();

  const students = data.users.filter(u => u.role === 'parent');
  const groups = data.groups;
  const payments = data.payments;
  const centerInfo = data.centerInfo;

  // Selected student for editing
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({ studentName: '', name: '', phone: '', grade: '', password: '' });

  // Dashboard interactive state: day filter & add-group modal
  const [selectedDayFilter, setSelectedDayFilter] = useState('today');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    nameEn: '',
    subject: 'math',
    grade: 'Primary 1 (الصف الأول)',
    stage: 'primary',
    day: 'السبت',
    dayEn: 'Saturday',
    time: '04:00 م - 05:30 م',
    timeEn: '04:00 PM - 05:30 PM',
    maxCapacity: 12,
    monthlyFee: 450,
    location: 'قاعة 1 (السنتر الرئيسي)',
    locationEn: 'Hall 1 (Main Center)'
  });

  // Payment settings state
  const [settingsForm, setSettingsForm] = useState({
    vfNumber: centerInfo.payments.vodafoneCash.number,
    vfOwner: centerInfo.payments.vodafoneCash.ownerName,
    vfInstructions: centerInfo.payments.vodafoneCash.instructions,
    ipa: centerInfo.payments.instapay.ipa,
    ipaPhone: centerInfo.payments.instapay.phone,
    ipaOwner: centerInfo.payments.instapay.ownerName,
    bankName: centerInfo.payments.bankTransfer.bankName,
    bankAcc: centerInfo.payments.bankTransfer.accountNumber,
    bankHolder: centerInfo.payments.bankTransfer.accountHolder,
    bankIban: centerInfo.payments.bankTransfer.iban
  });

  // Financial calculations
  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'pending_review')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const vodafoneRevenue = payments
    .filter(p => p.status === 'paid' && p.method === 'vodafone_cash')
    .reduce((sum, p) => sum + p.amount, 0);

  const instapayRevenue = payments
    .filter(p => p.status === 'paid' && p.method === 'instapay')
    .reduce((sum, p) => sum + p.amount, 0);

  const bankRevenue = payments
    .filter(p => p.status === 'paid' && p.method === 'bank')
    .reduce((sum, p) => sum + p.amount, 0);

  const mathStudents = students.filter(s => s.subjects && s.subjects.includes('math')).length;
  const engStudents = students.filter(s => s.subjects && s.subjects.includes('english')).length;

  const totalCapacity = groups.reduce((acc, g) => acc + g.maxCapacity, 0);
  const totalOccupied = groups.reduce((acc, g) => acc + g.studentIds.length, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const handleOpenEditStudent = (student) => {
    setEditingStudent(student);
    setEditFormData({
      studentName: student.studentName,
      name: student.name,
      phone: student.phone,
      grade: student.grade,
      password: student.password
    });
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, editFormData);
      addToast('تم حفظ وتعديل بيانات الطالب بنجاح', 'success');
      setEditingStudent(null);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updatePaymentSettings({
      vodafoneCash: {
        number: settingsForm.vfNumber,
        ownerName: settingsForm.vfOwner,
        instructions: settingsForm.vfInstructions
      },
      instapay: {
        ipa: settingsForm.ipa,
        phone: settingsForm.ipaPhone,
        ownerName: settingsForm.ipaOwner,
        instructions: "تحويل فوري عبر تطبيق إنستاباي"
      },
      bankTransfer: {
        bankName: settingsForm.bankName,
        accountNumber: settingsForm.bankAcc,
        accountHolder: settingsForm.bankHolder,
        iban: settingsForm.bankIban,
        instructions: "تحويل بنكي"
      }
    });
    addToast('تم حفظ وتحديث إعدادات وسائل الدفع بنجاح', 'success');
  };

  // Day filter logic
  const daysMapAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysMapEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  const todayNameAr = daysMapAr[todayIndex];
  const todayNameEn = daysMapEn[todayIndex];

  const pendingPaymentsCount = payments.filter(p => p.status === 'pending_review').length;
  const pendingMakeupCount = data.makeupRequests ? data.makeupRequests.filter(r => r.status === 'pending').length : 0;
  const unreadInquiriesCount = data.messages ? data.messages.filter(m => !m.read && m.sender === 'parent').length : 0;

  const filteredScheduleGroups = groups.filter(g => {
    if (selectedDayFilter === 'all') return true;
    if (selectedDayFilter === 'today') {
      return g.day === todayNameAr || g.dayEn === todayNameEn;
    }
    return g.day === selectedDayFilter || g.dayEn === selectedDayFilter;
  });

  const formattedTodayDate = new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupForm.name) return;
    addGroup({
      ...newGroupForm,
      subjectName: newGroupForm.subject === 'math' ? 'Math (ماث)' : 'English (لغة إنجليزية)',
      subjectNameEn: newGroupForm.subject === 'math' ? 'Math' : 'English',
      teacher: 'مس مارينا',
      studentIds: []
    });
    addToast(isRTL ? 'تم إضافة المجموعة والموعد بنجاح' : 'New class group added successfully', 'success');
    setShowAddGroupModal(false);
    setNewGroupForm({
      name: '',
      nameEn: '',
      subject: 'math',
      grade: 'Primary 1 (الصف الأول)',
      stage: 'primary',
      day: 'السبت',
      dayEn: 'Saturday',
      time: '04:00 م - 05:30 م',
      timeEn: '04:00 PM - 05:30 PM',
      maxCapacity: 12,
      monthlyFee: 450,
      location: 'قاعة 1 (السنتر الرئيسي)',
      locationEn: 'Hall 1 (Main Center)'
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ZONE 1 & 2: Integrated Executive Command Header & Sub-Navigation Strip */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-warm-xs overflow-hidden">
        {/* Top Command Strip */}
        <div className="p-5 sm:p-6 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Identity & Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs shrink-0 border border-brand-400">
              <Crown className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-forest tracking-tight">
                  {t('superAdminTitle')}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-gold-50 text-gold-800 border border-gold-200">
                  <Crown className="w-3.5 h-3.5 text-gold-600 inline shrink-0" />
                  <span>{t('superAdminBadge')}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-forest-muted mt-1">
                <Calendar className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="font-semibold text-forest">{formattedTodayDate}</span>
                <span className="text-surface-border">•</span>
                <span>{t('brandSubtitle')}</span>
              </div>
            </div>
          </div>

          {/* Action Hub (Strict 2-Tier Hierarchy) */}
          <div className="flex items-center flex-wrap gap-2 pt-2 lg:pt-0">
            <button
              onClick={() => onNavigate('financial-reports')}
              className="px-3.5 py-2 bg-surface-alt hover:bg-surface text-forest border border-surface-border font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs hover:border-gold-400"
            >
              <DollarSign className="w-4 h-4 text-gold-700" />
              <span>{t('navFinancial')}</span>
              {pendingRevenue > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-gold-400 text-forest">
                  {pendingPaymentsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('students-list')}
              className="px-3.5 py-2 bg-surface-alt hover:bg-surface text-forest border border-surface-border font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs hover:border-brand-400"
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>{t('navStudents')}</span>
              <span className="text-[11px] font-mono font-bold text-forest-muted">({students.length})</span>
            </button>
            <button
              onClick={() => setShowAddGroupModal(true)}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-black rounded-xl text-xs shadow-warm-sm transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>+ {isRTL ? 'إضافة موعد دراسي جديد' : 'Add New Class'}</span>
            </button>
          </div>
        </div>

        {/* Integrated Segmented Navigation Tabs */}
        <div className="px-4 py-2 bg-surface-alt/70 border-t border-surface-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: t('navOverview') },
            { id: 'students-list', label: `${t('navStudents')} (${students.length})` },
            { id: 'financial-reports', label: t('navFinancial') },
            { id: 'groups-management', label: `${t('navGroups')} (${groups.length})` },
            { id: 'center-settings', label: t('navSettings') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === tab.id || (!currentTab && tab.id === 'dashboard')
                  ? 'bg-surface text-forest shadow-xs font-black border border-surface-border'
                  : 'text-forest-muted hover:text-forest hover:bg-surface/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {(currentTab === 'dashboard' || !currentTab) && (
        <div className="space-y-6">
          {/* ZONE 3: At-A-Glance Metric Strip (4 High-Density Operational Tiles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Collected Revenue */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-surface-border shadow-warm-xs flex flex-col justify-between hover:border-gold-300 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-muted">{t('collectedRevenue')}</span>
                  <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="text-2xl font-black text-forest font-mono tracking-tight">
                    {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-forest-muted">{t('currency')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px]">
                {pendingRevenue > 0 ? (
                  <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {pendingRevenue.toLocaleString()} {t('currency')} {t('pendingRevenue')}
                  </span>
                ) : (
                  <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {isRTL ? 'جميع التحصيلات مدققة' : 'Verified'}
                  </span>
                )}
                <button onClick={() => onNavigate('financial-reports')} className="font-bold text-brand-600 hover:text-brand-700">
                  {t('details')} →
                </button>
              </div>
            </div>

            {/* 2. Total Students */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-surface-border shadow-warm-xs flex flex-col justify-between hover:border-brand-300 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-muted">{t('totalStudents')}</span>
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="text-2xl font-black text-forest tracking-tight">
                    {students.length} <span className="text-xs font-medium text-forest-muted">{t('student')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center space-x-1.5 space-x-reverse">
                  <span className="text-brand-700">Math: {mathStudents}</span>
                  <span className="text-forest-muted">•</span>
                  <span className="text-gold-800">English: {engStudents}</span>
                </div>
                <button onClick={() => onNavigate('students-list')} className="text-brand-600 hover:text-brand-700">
                  {t('details')} →
                </button>
              </div>
            </div>

            {/* 3. Seat Occupancy Rate */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-surface-border shadow-warm-xs flex flex-col justify-between hover:border-brand-300 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-muted">{t('occupancyRate')}</span>
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                    <PieChart className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="text-2xl font-black text-forest tracking-tight">{occupancyRate}%</div>
                  {/* Micro Progress Bar */}
                  <div className="w-full bg-surface-alt rounded-full h-1.5 mt-2 overflow-hidden border border-surface-border">
                    <div 
                      className="bg-brand-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px]">
                <span className="text-forest-muted font-medium">
                  {totalOccupied} {t('seatsOccupiedOf')} {totalCapacity}
                </span>
                <span className="font-bold text-brand-700">
                  {totalCapacity - totalOccupied} {isRTL ? 'شاغر' : 'left'}
                </span>
              </div>
            </div>

            {/* 4. Active Groups */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-surface-border shadow-warm-xs flex flex-col justify-between hover:border-gold-300 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-muted">{t('activeGroups')}</span>
                  <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="text-2xl font-black text-forest tracking-tight">
                    {groups.length} <span className="text-xs font-medium text-forest-muted">{t('groupsCount')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px] font-bold">
                <span className="text-forest-muted">
                  KG: {groups.filter(g => g.stage === 'kg').length} • Primary: {groups.filter(g => g.stage === 'primary').length}
                </span>
                <button onClick={() => onNavigate('groups-management')} className="text-gold-700 hover:text-gold-800">
                  {t('details')} →
                </button>
              </div>
            </div>

          </div>

          {/* ZONE 4: Asymmetric Operational Workspace (70% Schedule / 30% Operations Pulse) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 4A. Master Timetable & Class Sessions (8 Cols) */}
            <div className="lg:col-span-8 bg-surface rounded-2xl p-5 sm:p-6 border border-surface-border shadow-warm-xs flex flex-col justify-between">
              <div>
                {/* Header & Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-surface-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-forest text-base sm:text-lg">
                        {selectedDayFilter === 'today' 
                          ? `${t('todayClasses')} (${isRTL ? todayNameAr : todayNameEn})` 
                          : (selectedDayFilter === 'all' 
                              ? t('allDaysClasses') 
                              : `${isRTL ? 'جدول يوم' : 'Classes for'} ${selectedDayFilter}`)}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
                        {filteredScheduleGroups.length} {t('groupsCount')}
                      </span>
                    </div>
                    <p className="text-xs text-forest-muted mt-0.5">
                      {selectedDayFilter === 'today' 
                        ? (isRTL ? `مواعيد الحصص المجدولة لليوم (${todayNameAr})` : `Classes scheduled for today (${todayNameEn})`) 
                        : (isRTL ? 'استعراض مواعيد الحصص والقاعات ونسب الإشغال' : 'Browse group schedules, halls, and occupancy')}
                    </p>
                  </div>

                  <button 
                    onClick={() => onNavigate('groups-management')} 
                    className="self-start sm:self-auto px-3 py-1.5 bg-surface-alt hover:bg-surface text-forest border border-surface-border rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{t('navGroups')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-forest-muted" />
                  </button>
                </div>

                {/* Day Filter Segmented Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3.5 text-xs font-bold no-scrollbar">
                  <button
                    onClick={() => setSelectedDayFilter('today')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                      selectedDayFilter === 'today'
                        ? 'bg-forest text-white shadow-xs font-black'
                        : 'bg-surface-alt text-forest-muted hover:text-forest hover:bg-brand-50 border border-surface-border'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    <span>{t('todayClasses')} ({isRTL ? todayNameAr : todayNameEn})</span>
                  </button>
                  <button
                    onClick={() => setSelectedDayFilter('all')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                      selectedDayFilter === 'all'
                        ? 'bg-brand-500 text-white shadow-xs font-black'
                        : 'bg-surface-alt text-forest-muted hover:text-forest hover:bg-brand-50 border border-surface-border'
                    }`}
                  >
                    {t('allDaysClasses')}
                  </button>
                  {[
                    { ar: 'السبت', en: 'Saturday' },
                    { ar: 'الأحد', en: 'Sunday' },
                    { ar: 'الاثنين', en: 'Monday' },
                    { ar: 'الثلاثاء', en: 'Tuesday' },
                    { ar: 'الأربعاء', en: 'Wednesday' },
                    { ar: 'الخميس', en: 'Thursday' }
                  ].map(d => {
                    const isSelected = selectedDayFilter === d.ar || selectedDayFilter === d.en;
                    return (
                      <button
                        key={d.en}
                        onClick={() => setSelectedDayFilter(isRTL ? d.ar : d.en)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-xs font-black'
                            : 'bg-surface-alt text-forest-muted hover:text-forest hover:bg-brand-50 border border-surface-border'
                        }`}
                      >
                        {isRTL ? d.ar : d.en}
                      </button>
                    );
                  })}
                </div>

                {/* Structured Operational Session Rows */}
                {filteredScheduleGroups.length === 0 ? (
                  <div className="p-8 text-center bg-surface-alt/50 rounded-xl border border-dashed border-surface-border my-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2.5">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-forest">
                      {t('noClassesToday')}
                    </h4>
                    <p className="text-xs text-forest-muted mt-0.5 max-w-sm mx-auto">
                      لا توجد مواعيد مجدولة لهذا اليوم. يمكنك استعراض باقي أيام الأسبوع أو إضافة موعد جديد.
                    </p>
                    <div className="flex items-center justify-center space-x-2 space-x-reverse mt-3.5">
                      <button
                        onClick={() => setSelectedDayFilter('all')}
                        className="px-3 py-1.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-600 transition"
                      >
                        {t('allDaysClasses')}
                      </button>
                      <button
                        onClick={() => setShowAddGroupModal(true)}
                        className="px-3 py-1.5 bg-surface text-forest border border-surface-border rounded-xl text-xs font-bold hover:bg-surface-alt transition"
                      >
                        + {isRTL ? 'إضافة موعد جديد' : 'Add Class'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredScheduleGroups.map(g => (
                      <div
                        key={g.id}
                        className="p-3.5 bg-surface hover:bg-surface-alt/50 rounded-xl border border-surface-border transition flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                      >
                        {/* Group Details & Subject */}
                        <div className="flex items-start sm:items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                            g.subject === 'math'
                              ? 'bg-brand-50 text-brand-800 border border-brand-200'
                              : 'bg-gold-50 text-gold-800 border border-gold-200'
                          }`}>
                            {g.subject === 'math' ? 'Math' : 'English'}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-forest text-sm">
                                {isRTL ? g.name : (g.nameEn || g.name)}
                              </h4>
                              <span className="text-[11px] font-semibold text-forest-muted bg-surface-alt px-2 py-0.5 rounded border border-surface-border">
                                {isRTL ? g.grade : (g.grade?.replace(/\s*\([\u0600-\u06FF\s]+\)/g, '') || g.grade)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-forest-muted mt-1 font-medium">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5 text-brand-600" />
                                <span>{isRTL ? g.time : (g.timeEn || g.time)}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-forest-muted" />
                                <span>{isRTL ? (g.location || 'قاعة السنتر') : (g.locationEn || g.location || 'Center Hall')}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Capacity Meter & Quick Action */}
                        <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t border-surface-border md:border-t-0">
                          <div className="text-start md:text-end">
                            <div className="text-xs font-bold text-forest">
                              <span>{g.studentIds.length} / {g.maxCapacity}</span>
                              <span className="text-forest-muted text-[11px] font-normal mr-1 ml-1">{t('student')}</span>
                            </div>
                            <div className="w-24 bg-surface-alt rounded-full h-1.5 mt-1 overflow-hidden border border-surface-border">
                              <div
                                className={`h-full rounded-full ${
                                  g.studentIds.length >= g.maxCapacity ? 'bg-rose-500' : (g.subject === 'math' ? 'bg-brand-500' : 'bg-gold-500')
                                }`}
                                style={{ width: `${Math.min((g.studentIds.length / g.maxCapacity) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => onNavigate('groups-management')}
                            className="px-3 py-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-surface rounded-lg border border-surface-border hover:bg-surface-alt transition shadow-2xs whitespace-nowrap"
                          >
                            {t('details')} →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Quick Bar */}
              <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-forest-muted">
                <span>{isRTL ? centerInfo.address : (centerInfo.addressEn || centerInfo.address)}</span>
                <span className="font-bold text-forest">
                  {isRTL ? `معلمة المادة: ${centerInfo.owner}` : `Instructor: Miss Marina`}
                </span>
              </div>
            </div>

            {/* 4B. Operations Pulse & Utilities Hub (4 Cols) */}
            <div className="lg:col-span-4 bg-surface rounded-2xl p-5 sm:p-6 border border-surface-border shadow-warm-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-600" />
                    <h3 className="font-extrabold text-forest text-base">
                      {t('centerPulse')}
                    </h3>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Priority Attention Tiles */}
                <div className="space-y-2.5">
                  {/* Pending receipts monitor */}
                  <div 
                    onClick={() => onNavigate('financial-reports')}
                    className="p-3 bg-surface-alt hover:bg-gold-50/50 rounded-xl border border-surface-border cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-forest group-hover:text-gold-900 block">
                        {t('pendingReviewReceipts')}
                      </span>
                      <span className="text-[11px] text-forest-muted">
                        {pendingRevenue > 0 
                          ? `${pendingRevenue.toLocaleString()} ${t('currency')} ${isRTL ? 'بانتظار الاعتماد' : 'pending verification'}` 
                          : (isRTL ? 'جميع التحصيلات معتمدة' : 'All collections verified')}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                      pendingPaymentsCount > 0 ? 'bg-gold-100 text-gold-900 border border-gold-300' : 'bg-surface text-forest-muted border border-surface-border'
                    }`}>
                      {pendingPaymentsCount}
                    </span>
                  </div>

                  {/* Urgent Makeups monitor */}
                  <div 
                    onClick={() => onNavigate('groups-management')}
                    className="p-3 bg-surface-alt hover:bg-brand-50/50 rounded-xl border border-surface-border cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-forest group-hover:text-brand-900 block">
                        {t('urgentMakeups')}
                      </span>
                      <span className="text-[11px] text-forest-muted">
                        {pendingMakeupCount > 0 
                          ? (isRTL ? 'بحاجة لتسكين مواعيد بديلة' : 'Pending slot assignment') 
                          : (isRTL ? 'لا توجد طلبات معلقة' : 'No pending requests')}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                      pendingMakeupCount > 0 ? 'bg-brand-100 text-brand-900 border border-brand-300' : 'bg-surface text-forest-muted border border-surface-border'
                    }`}>
                      {pendingMakeupCount}
                    </span>
                  </div>

                  {/* Coordinator Status */}
                  <div className="p-3 bg-surface-alt rounded-xl border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-forest block">
                        {t('coordinatorInquiries')}
                      </span>
                      <span className="text-[11px] text-forest-muted">
                        {unreadInquiriesCount > 0 
                          ? (isRTL ? `${unreadInquiriesCount} استفسارات جديدة` : `${unreadInquiriesCount} new inquiries`) 
                          : t('coordinatorInquiriesFast')}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-surface text-brand-700 border border-surface-border">
                      {t('coordinatorStatusActive')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Administrative Utilities */}
              <div className="mt-5 pt-4 border-t border-surface-border space-y-2">
                <span className="text-[11px] font-bold text-forest-muted block mb-1">
                  {t('quickActionsTitle')}
                </span>
                <button
                  onClick={() => setShowAddGroupModal(true)}
                  className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-warm-xs transition flex items-center justify-center space-x-1.5 space-x-reverse"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ {isRTL ? 'إضافة موعد دراسي جديد' : 'Add Class Group'}</span>
                </button>
                <button
                  onClick={() => onNavigate('center-settings')}
                  className="w-full py-2 bg-surface-alt hover:bg-surface text-forest rounded-xl font-bold text-xs transition border border-surface-border flex items-center justify-center space-x-1.5 space-x-reverse"
                >
                  <Settings className="w-4 h-4 text-forest-muted" />
                  <span>{t('editPaymentSettingsBtn')}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full py-2 bg-surface-alt hover:bg-surface text-forest rounded-xl font-bold text-xs transition border border-surface-border flex items-center justify-center space-x-1.5 space-x-reverse"
                >
                  <Printer className="w-4 h-4 text-forest-muted" />
                  <span>{t('printReport')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Students Directory */}
      {currentTab === 'students-list' && (
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-forest">{t('navStudents')}</h3>
              <p className="text-xs text-forest-muted mt-1">
                سجل الطلاب وأولياء الأمور المقيدين في سنتر مس مارينا
              </p>
            </div>
            <span className="px-3 py-1 bg-brand-50 text-brand-800 border border-brand-200 rounded-xl text-xs font-bold">
              {students.length} {t('student')}
            </span>
          </div>

          <div className="bg-surface rounded-xl border border-surface-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-surface-alt text-forest-muted font-bold border-b border-surface-border">
                  <tr>
                    <th className="p-3.5">اسم الطالب</th>
                    <th className="p-3.5">ولي الأمر</th>
                    <th className="p-3.5">{t('grade')}</th>
                    <th className="p-3.5">{t('subjects')}</th>
                    <th className="p-3.5">{t('phone')}</th>
                    <th className="p-3.5">{t('username')}</th>
                    <th className="p-3.5">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {students.map(st => (
                    <tr key={st.id} className="hover:bg-surface-alt/70 transition">
                      <td className="p-3.5 font-extrabold text-forest flex items-center space-x-2 space-x-reverse">
                        <span className="text-lg">{st.avatar || '👦'}</span>
                        <span>{st.studentName}</span>
                      </td>
                      <td className="p-3.5 text-forest font-semibold">{st.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-brand-50 text-brand-800 border border-brand-200">
                          {st.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-forest font-semibold">
                        {st.subjects.map(s => s === 'math' ? t('math') : t('english')).join(' + ')}
                      </td>
                      <td className="p-3.5 font-mono text-forest-muted">{st.phone}</td>
                      <td className="p-3.5 font-mono text-forest font-bold">{st.username}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleOpenEditStudent(st)}
                          className="px-2.5 py-1 bg-surface-alt hover:bg-surface text-forest border border-surface-border rounded-lg font-bold text-xs flex items-center space-x-1 space-x-reverse"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{t('edit')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Financial Reports */}
      {currentTab === 'financial-reports' && (
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-forest">{t('financialReportTitle')}</h3>
              <p className="text-xs text-forest-muted mt-1">{t('financialReportSubtitle')}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-surface-alt hover:bg-surface text-forest border border-surface-border font-bold rounded-xl text-xs flex items-center transition"
            >
              <Printer className="w-4 h-4 ml-1.5 mr-1.5" />
              {t('printReport')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#4A3B69] to-[#2D2147] text-white p-5 rounded-xl shadow-md border border-purple-300/20">
              <div className="text-xs font-bold text-purple-200">{t('instapayCollections')}</div>
              <div className="text-2xl font-black font-mono mt-2">
                {instapayRevenue.toLocaleString()} {t('currency')}
              </div>
              <div className="text-[11px] text-purple-300 mt-1">
                {centerInfo.payments.instapay.ipa}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8C3A40] to-[#5C1E23] text-white p-5 rounded-xl shadow-md border border-rose-300/20">
              <div className="text-xs font-bold text-rose-200">{t('vodafoneCollections')}</div>
              <div className="text-2xl font-black font-mono mt-2">
                {vodafoneRevenue.toLocaleString()} {t('currency')}
              </div>
              <div className="text-[11px] text-rose-200 mt-1">
                {centerInfo.payments.vodafoneCash.number}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#295066] to-[#163547] text-white p-5 rounded-xl shadow-md border border-sky-300/20">
              <div className="text-xs font-bold text-sky-200">{t('bankCollections')}</div>
              <div className="text-2xl font-black font-mono mt-2">
                {bankRevenue.toLocaleString()} {t('currency')}
              </div>
              <div className="text-[11px] text-sky-200 mt-1">
                {centerInfo.payments.bankTransfer.bankName}
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-surface-border shadow-xs overflow-hidden">
            <div className="p-4 bg-surface-alt border-b border-surface-border font-bold text-forest text-sm">
              {t('allTransactionsLog')}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-surface-alt/50 text-forest-muted font-bold border-b border-surface-border">
                  <tr>
                    <th className="p-3.5">{t('student')}</th>
                    <th className="p-3.5">{t('month')}</th>
                    <th className="p-3.5">{t('amount')}</th>
                    <th className="p-3.5">{t('paymentMethod')}</th>
                    <th className="p-3.5">{t('referenceNo')}</th>
                    <th className="p-3.5">{t('status')}</th>
                    <th className="p-3.5">{t('date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-surface-alt/70 transition">
                      <td className="p-3.5 font-bold text-forest">{p.studentName}</td>
                      <td className="p-3.5">{isRTL ? p.month : (p.monthEn || p.month)}</td>
                      <td className="p-3.5 font-bold font-mono text-forest">
                        {p.amount} {t('currency')}
                      </td>
                      <td className="p-3.5 font-semibold uppercase">{p.method}</td>
                      <td className="p-3.5 font-mono">{p.referenceNumber || '-'}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.status === 'paid' ? 'bg-brand-100 text-brand-800 border border-brand-200' : 'bg-gold-100 text-gold-800 border border-gold-200'
                        }`}>
                          {p.status === 'paid' ? t('paid') : t('pending')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-forest-muted">{p.paymentDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Center & Payment Settings */}
      {currentTab === 'center-settings' && (
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-forest">{t('navSettings')}</h3>
            <p className="text-xs text-forest-muted mt-1">
              تعديل أرقام فودافون كاش، معرف إنستاباي، والحساب البنكي التي تظهر لأولياء الأمور
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Vodafone Cash */}
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse text-rose-800 font-bold text-sm">
                <Smartphone className="w-5 h-5" />
                <span>{t('vodafoneCashTitle')}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">{t('walletNumber')}</label>
                  <input
                    type="text"
                    value={settingsForm.vfNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vfNumber: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">اسم صاحب المحفظة:</label>
                  <input
                    type="text"
                    value={settingsForm.vfOwner}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vfOwner: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">التعليمات:</label>
                <input
                  type="text"
                  value={settingsForm.vfInstructions}
                  onChange={(e) => setSettingsForm({ ...settingsForm, vfInstructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs focus:ring-brand-500"
                />
              </div>
            </div>

            {/* InstaPay */}
            <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse text-purple-800 font-bold text-sm">
                <CreditCard className="w-5 h-5" />
                <span>{t('instapayTitle')}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">{t('ipaAddress')}</label>
                  <input
                    type="text"
                    value={settingsForm.ipa}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ipa: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">رقم هاتف إنستاباي:</label>
                  <input
                    type="text"
                    value={settingsForm.ipaPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ipaPhone: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">اسم المستفيد في إنستاباي:</label>
                <input
                  type="text"
                  value={settingsForm.ipaOwner}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ipaOwner: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="p-5 rounded-2xl border border-sky-200 bg-sky-50/30 space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse text-sky-800 font-bold text-sm">
                <Building className="w-5 h-5" />
                <span>{t('bankTitle')}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">{t('bankName')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">{t('accountNumber')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankAcc}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankAcc: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold focus:ring-brand-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">{t('accountHolder')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankHolder}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankHolder: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">{t('iban')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankIban}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankIban: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 transition flex items-center"
              >
                <Save className="w-4 h-4 ml-1.5 mr-1.5" />
                <span>{t('save')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={`تعديل بيانات: ${editingStudent.studentName}`}
        >
          <form onSubmit={handleSaveStudent} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-forest mb-1">اسم الطالب:</label>
              <input
                type="text"
                value={editFormData.studentName}
                onChange={(e) => setEditFormData({ ...editFormData, studentName: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest mb-1">اسم ولي الأمر:</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs focus:ring-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('phone')}:</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('grade')}:</label>
                <input
                  type="text"
                  value={editFormData.grade}
                  onChange={(e) => setEditFormData({ ...editFormData, grade: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-forest mb-1">{t('password')}:</label>
              <input
                type="text"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold focus:ring-brand-500"
              />
            </div>

            <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-surface-alt hover:bg-surface text-forest-muted hover:text-forest rounded-xl text-xs font-bold border border-surface-border"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add New Group Modal */}
      {showAddGroupModal && (
        <Modal
          isOpen={showAddGroupModal}
          onClose={() => setShowAddGroupModal(false)}
          title={isRTL ? 'إضافة موعد ومجموعة دراسية جديدة لمس مارينا' : 'Add New Class Schedule & Group'}
        >
          <form onSubmit={handleCreateGroup} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                {isRTL ? 'اسم المجموعة:' : 'Group Name:'}
              </label>
              <input
                type="text"
                placeholder={isRTL ? 'مثال: ماث - الصف الثاني (مجموعة الأربعاء)' : 'e.g. Math - Grade 2 (Wednesday)'}
                value={newGroupForm.name}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('subject')}:</label>
                <select
                  value={newGroupForm.subject}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold"
                >
                  <option value="math">Math (ماث)</option>
                  <option value="english">English (لغة إنجليزية)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('grade')}:</label>
                <input
                  type="text"
                  placeholder="Primary 1, Primary 2, KG 2..."
                  value={newGroupForm.grade}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, grade: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('day')}:</label>
                <select
                  value={newGroupForm.day}
                  onChange={(e) => {
                    const d = e.target.value;
                    const enDays = {
                      'السبت': 'Saturday',
                      'الأحد': 'Sunday',
                      'الاثنين': 'Monday',
                      'الثلاثاء': 'Tuesday',
                      'الأربعاء': 'Wednesday',
                      'الخميس': 'Thursday'
                    };
                    setNewGroupForm({ ...newGroupForm, day: d, dayEn: enDays[d] || 'Saturday' });
                  }}
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold"
                >
                  <option value="السبت">السبت (Saturday)</option>
                  <option value="الأحد">الأحد (Sunday)</option>
                  <option value="الاثنين">الاثنين (Monday)</option>
                  <option value="الثلاثاء">الثلاثاء (Tuesday)</option>
                  <option value="الأربعاء">الأربعاء (Wednesday)</option>
                  <option value="الخميس">الخميس (Thursday)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('time')}:</label>
                <input
                  type="text"
                  placeholder="04:00 م - 05:30 م"
                  value={newGroupForm.time}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, time: e.target.value, timeEn: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  {isRTL ? 'الحد الأقصى للطلاب:' : 'Max Capacity:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newGroupForm.maxCapacity}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, maxCapacity: parseInt(e.target.value) || 12 })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-forest mb-1">{t('monthlyFee')} ({t('currency')}):</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={newGroupForm.monthlyFee}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, monthlyFee: parseFloat(e.target.value) || 450 })}
                  required
                  className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest mb-1">{t('location')}:</label>
              <input
                type="text"
                placeholder="قاعة 1 (السنتر الرئيسي)"
                value={newGroupForm.location}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, location: e.target.value, locationEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-surface-border bg-surface text-forest text-xs font-bold"
              />
            </div>

            <div className="pt-3 flex justify-end space-x-2 space-x-reverse border-t border-surface-border">
              <button
                type="button"
                onClick={() => setShowAddGroupModal(false)}
                className="px-4 py-2 bg-surface-alt hover:bg-surface text-forest-muted hover:text-forest rounded-xl text-xs font-bold border border-surface-border"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
              >
                {isRTL ? 'حفظ وإضافة المجموعة' : 'Save & Add Group'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
