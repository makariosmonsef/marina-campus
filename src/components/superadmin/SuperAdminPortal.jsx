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
  Smartphone
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

  return (
    <div className="space-y-6 pb-20">
      {/* Top Super Admin Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-3xl md:text-4xl shadow-lg ring-4 ring-white/10 shrink-0">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse flex-wrap">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {t('superAdminTitle')}
                </h2>
                <span className="bg-amber-400 text-slate-950 text-xs px-3 py-1 rounded-full font-black">
                  {t('superAdminBadge')}
                </span>
              </div>
              <p className="text-purple-200 text-sm mt-1 font-medium">
                {t('centerTagline')}
              </p>
              <div className="flex items-center space-x-3 space-x-reverse mt-2 text-xs flex-wrap gap-1">
                <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-lg">
                  {t('mathStudents')}: <strong className="text-amber-300 font-bold">{mathStudents}</strong>
                </span>
                <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-lg">
                  {t('engStudents')}: <strong className="text-pink-300 font-bold">{engStudents}</strong>
                </span>
                <span className="bg-white/10 text-purple-200 px-3 py-1 rounded-lg">
                  {t('groupsCount')}: <strong className="text-emerald-300 font-bold">{groups.length}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Financial Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-start min-w-[200px]">
            <span className="text-xs text-purple-200 font-bold block">
              {t('collectedRevenue')}:
            </span>
            <div className="text-2xl md:text-3xl font-black text-amber-300 font-mono mt-1">
              {totalRevenue.toLocaleString()} {t('currency')}
            </div>
            <span className="text-[11px] text-purple-300 mt-1 block">
              {t('pendingRevenue')}: {pendingRevenue} {t('currency')}
            </span>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center space-x-2 space-x-reverse mt-6 pt-6 border-t border-white/20 text-sm font-bold overflow-x-auto">
          {[
            { id: 'dashboard', label: t('navOverview') },
            { id: 'students-list', label: `${t('navStudents')} (${students.length})` },
            { id: 'financial-reports', label: t('navFinancial') },
            { id: 'groups-management', label: t('navGroups') },
            { id: 'center-settings', label: t('navSettings') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                currentTab === tab.id
                  ? 'bg-white text-purple-900 shadow-md font-black'
                  : 'text-white/80 hover:bg-white/10'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('totalStudents')}</span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">
                  {students.length} <span className="text-sm font-medium text-slate-500">{t('student')}</span>
                </div>
                <p className="text-xs text-purple-600 mt-1 font-semibold">
                  Math: {mathStudents} • English: {engStudents}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('collectedRevenue')}</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {totalRevenue.toLocaleString()} {t('currency')}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  InstaPay, Vodafone Cash, Bank
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('occupancyRate')}</span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{occupancyRate}%</div>
                <p className="text-xs text-slate-500 mt-1">
                  {totalOccupied} {t('seatsOccupiedOf')} {totalCapacity}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('activeGroups')}</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">
                  {groups.length} <span className="text-sm font-medium text-slate-500">{t('groupsCount')}</span>
                </div>
                <p className="text-xs text-amber-600 mt-1 font-semibold">
                  KG & Primary
                </p>
              </div>
            </div>
          </div>

          {/* Master Timetable Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-800 text-lg">
                  {t('weeklyScheduleHeader')}
                </h3>
                <button 
                  onClick={() => onNavigate('groups-management')} 
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                >
                  {t('navGroups')} →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groups.map(g => (
                  <div
                    key={g.id}
                    className={`p-4 rounded-2xl border ${
                      g.subject === 'math'
                        ? 'border-indigo-100 bg-indigo-50/40'
                        : 'border-pink-100 bg-pink-50/40'
                    } flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          g.subject === 'math' ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'
                        }`}>
                          {g.subject === 'math' ? 'Math' : 'English'}
                        </span>
                        <span className="text-xs font-bold text-slate-600 font-mono">
                          {isRTL ? g.day : (g.dayEn || g.day)}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-2 text-sm">
                        {isRTL ? g.name : (g.nameEn || g.name)}
                      </h4>
                      <div className="text-xs text-slate-600 mt-1 font-mono">
                        {isRTL ? g.time : (g.timeEn || g.time)}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {t('monthlyFee')}: {g.monthlyFee} {t('currency')}
                      </span>
                      <span className="font-bold text-indigo-700">
                        {g.studentIds.length} {t('enrolledStudents')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coordinator Monitoring Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-800 text-base">
                    {t('coordinatorFollowUp')}
                  </h3>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">تسكين الحصص التعويضية:</span>
                    <span className="text-xs font-bold text-purple-700">{t('coordinatorStatusActive')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{t('coordinatorInquiries')}:</span>
                    <span className="text-xs font-bold text-emerald-700">{t('coordinatorInquiriesFast')}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{t('coordinatorPaymentAudit')}:</span>
                    <span className="text-xs font-bold text-blue-700">{t('coordinatorPaymentUpToDate')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('center-settings')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs transition"
                >
                  {t('editPaymentSettingsBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Students Directory */}
      {currentTab === 'students-list' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">{t('navStudents')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                سجل الطلاب وأولياء الأمور المقيدين في سنتر مس مارينا
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold">
              {students.length} {t('student')}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-100">
                  {students.map(st => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-extrabold text-slate-900 flex items-center space-x-2 space-x-reverse">
                        <span className="text-lg">{st.avatar || '👦'}</span>
                        <span>{st.studentName}</span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-semibold">{st.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-blue-100 text-blue-800">
                          {st.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-800 font-semibold">
                        {st.subjects.map(s => s === 'math' ? t('math') : t('english')).join(' + ')}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">{st.phone}</td>
                      <td className="p-3.5 font-mono text-slate-800 font-bold">{st.username}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleOpenEditStudent(st)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center space-x-1 space-x-reverse"
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
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">{t('financialReportTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('financialReportSubtitle')}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center transition"
            >
              <Printer className="w-4 h-4 ml-1.5 mr-1.5" />
              {t('printReport')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-5 rounded-3xl shadow-md">
              <div className="text-xs font-bold text-purple-200">{t('instapayCollections')}</div>
              <div className="text-2xl font-black font-mono mt-2">
                {instapayRevenue.toLocaleString()} {t('currency')}
              </div>
              <div className="text-[11px] text-purple-300 mt-1">
                {centerInfo.payments.instapay.ipa}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-md">
              <div className="text-xs font-bold text-rose-200">{t('vodafoneCollections')}</div>
              <div className="text-2xl font-black font-mono mt-2">
                {vodafoneRevenue.toLocaleString()} {t('currency')}
              </div>
              <div className="text-[11px] text-rose-200 mt-1">
                {centerInfo.payments.vodafoneCash.number}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-5 rounded-3xl shadow-md">
              <div className="text-xs font-bold text-sky-200">{t('bankCollections')}</div>
              <div className="text-2xl font-black font-mono mt-2">
                {bankRevenue.toLocaleString()} {t('currency')}
              </div>
              <div className="text-[11px] text-sky-200 mt-1">
                {centerInfo.payments.bankTransfer.bankName}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm">
              {t('allTransactionsLog')}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{p.studentName}</td>
                      <td className="p-3.5">{isRTL ? p.month : (p.monthEn || p.month)}</td>
                      <td className="p-3.5 font-bold font-mono text-slate-900">
                        {p.amount} {t('currency')}
                      </td>
                      <td className="p-3.5 font-semibold uppercase">{p.method}</td>
                      <td className="p-3.5 font-mono">{p.referenceNumber || '-'}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status === 'paid' ? t('paid') : t('pending')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">{p.paymentDate || '-'}</td>
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-800">{t('navSettings')}</h3>
            <p className="text-xs text-slate-500 mt-1">
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('walletNumber')}</label>
                  <input
                    type="text"
                    value={settingsForm.vfNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vfNumber: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم صاحب المحفظة:</label>
                  <input
                    type="text"
                    value={settingsForm.vfOwner}
                    onChange={(e) => setSettingsForm({ ...settingsForm, vfOwner: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التعليمات:</label>
                <input
                  type="text"
                  value={settingsForm.vfInstructions}
                  onChange={(e) => setSettingsForm({ ...settingsForm, vfInstructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('ipaAddress')}</label>
                  <input
                    type="text"
                    value={settingsForm.ipa}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ipa: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف إنستاباي:</label>
                  <input
                    type="text"
                    value={settingsForm.ipaPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ipaPhone: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستفيد في إنستاباي:</label>
                <input
                  type="text"
                  value={settingsForm.ipaOwner}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ipaOwner: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('bankName')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('accountNumber')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankAcc}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankAcc: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('accountHolder')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankHolder}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankHolder: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('iban')}</label>
                  <input
                    type="text"
                    value={settingsForm.bankIban}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankIban: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطالب:</label>
              <input
                type="text"
                value={editFormData.studentName}
                onChange={(e) => setEditFormData({ ...editFormData, studentName: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم ولي الأمر:</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('phone')}:</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('grade')}:</label>
                <input
                  type="text"
                  value={editFormData.grade}
                  onChange={(e) => setEditFormData({ ...editFormData, grade: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('password')}:</label>
              <input
                type="text"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
              />
            </div>

            <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
