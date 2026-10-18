import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { 
  Calendar, 
  CheckCircle, 
  Wallet, 
  RefreshCw, 
  Copy, 
  Check, 
  Send, 
  Smartphone, 
  CreditCard, 
  Building, 
  ClipboardCheck,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const ParentPortal = ({ currentTab, onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const { 
    currentUser, 
    data, 
    createMakeupRequest, 
    submitPaymentNotice, 
    sendMessage 
  } = useStore();
  const { addToast } = useToast();

  const student = currentUser;
  const centerInfo = data.centerInfo;
  const myGroups = data.groups.filter(g => (student?.groupIds || []).includes(g.id));
  const myAttendance = data.attendance.filter(a => a.studentId === student?.id);
  const myPayments = data.payments.filter(p => p.studentId === student?.id);
  const myMakeupRequests = data.makeupRequests.filter(r => r.studentId === student?.id);
  const myMessages = data.messages.filter(m => m.studentId === student?.id);
  const makeupSlots = data.makeupSlots;

  // Modals & form state
  const [showMakeupModal, setShowMakeupModal] = useState(false);
  const [selectedMakeupSlotId, setSelectedMakeupSlotId] = useState(makeupSlots[0]?.id || '');
  const [makeupReason, setMakeupReason] = useState('');
  const [missedGroupId, setMissedGroupId] = useState(myGroups[0]?.id || '');

  // Payment notice form state
  const [payMonth, setPayMonth] = useState('أكتوبر 2026');
  const [payAmount, setPayAmount] = useState('900');
  const [payMethod, setPayMethod] = useState('instapay');
  const [payRef, setPayRef] = useState('');
  const [payNote, setPayNote] = useState('');

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState('');
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(t('copied'), 'success');
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const handleBookMakeup = (e) => {
    e.preventDefault();
    if (!selectedMakeupSlotId) return;

    const res = createMakeupRequest({
      studentId: student.id,
      missedGroupId,
      missedDate: new Date().toISOString().split('T')[0],
      reason: makeupReason || 'اعتذار عن الحصة الأساسية لظرف خاص',
      targetMakeupSlotId: selectedMakeupSlotId
    });

    if (res.success) {
      addToast(t('toastMakeupCreated'), 'success');
      setShowMakeupModal(false);
      setMakeupReason('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleSubmitPaymentNotice = (e) => {
    e.preventDefault();
    const res = submitPaymentNotice({
      studentId: student.id,
      month: payMonth,
      amount: payAmount,
      method: payMethod,
      referenceNumber: payRef,
      receiptNote: payNote
    });

    if (res.success) {
      addToast(t('toastPaymentSubmitted'), 'success');
      setPayRef('');
      setPayNote('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendMessage({
      studentId: student.id,
      sender: 'parent',
      text: chatInput
    });
    setChatInput('');
    addToast(t('toastMessageSent'), 'success');
  };

  const attendedCount = myAttendance.filter(a => a.status === 'attended').length;
  const absentCount = myAttendance.filter(a => a.status === 'absent' || a.status === 'makeup_requested').length;
  const latestPayment = myPayments[0] || null;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Parent Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl md:text-4xl shadow-inner border border-white/30 shrink-0">
              {student.avatar || '👦'}
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse flex-wrap">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {student.studentName}
                </h2>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm border border-white/20">
                  {student.grade}
                </span>
              </div>
              <p className="text-emerald-100 text-sm mt-1 font-medium">
                ولي الأمر: {student.name} • {t('studentCode')}: <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-xs font-bold">{student.username}</span>
              </p>
              <div className="flex items-center space-x-2 space-x-reverse mt-2 text-xs flex-wrap gap-1">
                <span className="bg-emerald-800/40 text-emerald-100 px-2.5 py-0.5 rounded-lg">
                  المواد: {student.subjects.map(s => s === 'math' ? t('math') : t('english')).join(' + ')}
                </span>
                <span className="bg-emerald-800/40 text-emerald-100 px-2.5 py-0.5 rounded-lg">
                  مع مس مارينا 👩‍🏫
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowMakeupModal(true)}
              className="px-4 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl font-bold text-xs md:text-sm shadow-md transition flex items-center"
            >
              <RefreshCw className="w-4 h-4 ml-1.5 mr-1.5 text-emerald-600" />
              {t('requestMakeupClassBtn')}
            </button>
            <button
              onClick={() => onNavigate('parent-payments')}
              className="px-4 py-2.5 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs md:text-sm shadow-sm transition border border-white/20 flex items-center"
            >
              <CreditCard className="w-4 h-4 ml-1.5 mr-1.5" />
              {t('viewPaymentMethodsBtn')}
            </button>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center space-x-2 space-x-reverse mt-6 pt-6 border-t border-white/20 text-sm font-bold overflow-x-auto">
          {[
            { id: 'dashboard', label: t('navOverview') },
            { id: 'parent-schedule', label: t('navMySchedule') },
            { id: 'parent-attendance', label: t('navMyAttendance') },
            { id: 'parent-payments', label: t('navMyPayments') },
            { id: 'parent-makeup', label: `${t('navRequestMakeup')} (${myMakeupRequests.length})` },
            { id: 'parent-chat', label: t('navCoordinatorChat') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                currentTab === tab.id
                  ? 'bg-white text-emerald-800 shadow-md font-black'
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
                <span className="text-xs font-bold text-slate-400">{t('registeredGroups')}</span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{myGroups.length}</div>
                <p className="text-xs text-indigo-600 mt-1 font-semibold">{myGroups.map(g => g.day).join(' و ')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('attendanceStatus')}</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{attendedCount} {t('classesAttended')}</div>
                <p className="text-xs text-slate-500 mt-1">
                  {t('absenceCount')} <span className="text-rose-600 font-bold">{absentCount}</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('subscriptionStatus')}</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                {latestPayment ? (
                  <div>
                    <span className={`text-base font-black ${
                      latestPayment.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {latestPayment.status === 'paid' ? t('paid') : t('pending')}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      {latestPayment.amount} {t('currency')} ({latestPayment.method})
                    </p>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-slate-500">لا توجد اشتراكات</div>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('navMakeups')}</span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{myMakeupRequests.length}</div>
                <p className="text-xs text-purple-600 mt-1 font-semibold">حصص تعويضية مسجلة</p>
              </div>
            </div>
          </div>

          {/* Schedule & Upcoming Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-base mb-4">
                {t('parentScheduleTitle')}
              </h3>
              <div className="space-y-3">
                {myGroups.map(g => (
                  <div key={g.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                        {g.subjectName}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">{g.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">🕒 {g.day} ({g.time}) • 📍 {g.location}</p>
                    </div>
                    <span className="text-xs font-black text-slate-700 font-mono">
                      {g.monthlyFee} {t('currency')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Snapshot */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-800 text-base">
                  {t('parentAttendanceTitle')}
                </h3>
                <button onClick={() => onNavigate('parent-attendance')} className="text-xs font-bold text-emerald-600 hover:text-emerald-800">
                  {t('viewAll')}
                </button>
              </div>

              <div className="space-y-2.5">
                {myAttendance.slice(0, 4).map(a => (
                  <div key={a.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{a.sessionTitle}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{a.dayName} ({a.date})</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{a.notes}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      a.status === 'attended' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {a.status === 'attended' ? t('attended') : t('absent')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Schedule */}
      {currentTab === 'parent-schedule' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-slate-800">{t('parentScheduleTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGroups.map(g => (
              <div key={g.id} className="p-5 rounded-3xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white">
                    {g.subjectName}
                  </span>
                  <span className="text-xs font-bold text-slate-600 font-mono">{g.day}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{g.name}</h4>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <div>🕒 التوقيت: <strong>{g.time}</strong></div>
                  <div>📍 القاعة: <strong>{g.location}</strong></div>
                  <div>👩‍🏫 المعلمة: <strong>{g.teacher}</strong></div>
                  <div>💰 الاشتراك: <strong>{g.monthlyFee} {t('currency')} شهرياً</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Attendance & Homework Details */}
      {currentTab === 'parent-attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-black text-slate-800">{t('parentAttendanceTitle')}</h3>
            <p className="text-xs text-slate-500 mt-1">متابعة دقيقة لكل حصة سابقة وملاحظات مس مارينا على مستوى الطفل</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">{t('date')}</th>
                    <th className="p-3.5">{t('sessionTitle')}</th>
                    <th className="p-3.5">{t('status')}</th>
                    <th className="p-3.5">{t('homeworkStatus')}</th>
                    <th className="p-3.5">{t('teacherNotes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAttendance.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono text-slate-600">{a.dayName} {a.date}</td>
                      <td className="p-3.5 font-bold text-slate-900">{a.sessionTitle}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          a.status === 'attended' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {a.status === 'attended' ? t('attended') : t('absent')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {a.homeworkDone ? (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <Check className="w-3.5 h-3.5 ml-1 mr-1" />
                            {t('homeworkCompleted')}
                          </span>
                        ) : (
                          <span className="text-rose-500 font-bold">
                            {t('homeworkMissing')}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{a.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Payments & Tuition Options */}
      {currentTab === 'parent-payments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-black text-slate-800">{t('parentPaymentsTitle')}</h3>
            <p className="text-xs text-slate-500 mt-1">طرق الدفع المعتمدة لدى سنتر مس مارينا مع إمكانية النسخ السريع ورفع إشعار السداد</p>
          </div>

          {/* Payment Method Cards with Instant Copy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vodafone Cash */}
            <div className="bg-gradient-to-br from-rose-50 to-red-100/60 p-5 rounded-3xl border border-rose-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 space-x-reverse text-rose-700 font-bold text-sm mb-2">
                  <Smartphone className="w-5 h-5 shrink-0" />
                  <span>{t('vodafoneCashTitle')}</span>
                </div>
                <div className="text-xs text-slate-600 mb-2">
                  صاحب المحفظة: <strong>{centerInfo.payments.vodafoneCash.ownerName}</strong>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-rose-200 flex items-center justify-between">
                  <span className="font-mono font-black text-rose-950 text-base">
                    {centerInfo.payments.vodafoneCash.number}
                  </span>
                  <button
                    onClick={() => handleCopy(centerInfo.payments.vodafoneCash.number, 'vf')}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition"
                    title={t('copy')}
                  >
                    {copiedKey === 'vf' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-rose-800 mt-3 font-medium">
                {centerInfo.payments.vodafoneCash.instructions}
              </p>
            </div>

            {/* InstaPay */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100/60 p-5 rounded-3xl border border-purple-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 space-x-reverse text-purple-700 font-bold text-sm mb-2">
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span>{t('instapayTitle')}</span>
                </div>
                <div className="text-xs text-slate-600 mb-2">
                  المستفيد: <strong>{centerInfo.payments.instapay.ownerName}</strong>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="font-mono font-black text-purple-950 text-xs sm:text-sm truncate">
                    {centerInfo.payments.instapay.ipa}
                  </span>
                  <button
                    onClick={() => handleCopy(centerInfo.payments.instapay.ipa, 'ipa')}
                    className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition shrink-0 ml-1 mr-1"
                    title={t('copy')}
                  >
                    {copiedKey === 'ipa' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-purple-800 mt-3 font-medium">
                {centerInfo.payments.instapay.instructions}
              </p>
            </div>

            {/* Bank Transfer */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-100/60 p-5 rounded-3xl border border-sky-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 space-x-reverse text-sky-700 font-bold text-sm mb-2">
                  <Building className="w-5 h-5 shrink-0" />
                  <span>{t('bankTitle')}</span>
                </div>
                <div className="text-xs text-slate-600 mb-1">
                  الحساب: <strong>{centerInfo.payments.bankTransfer.accountHolder}</strong>
                </div>
                <div className="p-2.5 bg-white rounded-2xl border border-sky-200 flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-sky-950 text-xs">
                    {centerInfo.payments.bankTransfer.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(centerInfo.payments.bankTransfer.accountNumber, 'bank')}
                    className="p-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl transition"
                    title={t('copy')}
                  >
                    {copiedKey === 'bank' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-2 bg-white rounded-2xl border border-sky-200 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-700 truncate">
                    {centerInfo.payments.bankTransfer.iban}
                  </span>
                  <button
                    onClick={() => handleCopy(centerInfo.payments.bankTransfer.iban, 'iban')}
                    className="p-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl transition shrink-0 ml-1 mr-1"
                    title={t('copy')}
                  >
                    {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-sky-800 mt-2 font-medium">
                {centerInfo.payments.bankTransfer.instructions}
              </p>
            </div>
          </div>

          {/* Submit Transfer Notice Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-base">{t('submitPaymentProof')}</h4>
            <p className="text-xs text-slate-500">{t('transferNoticeInfo')}</p>

            <form onSubmit={handleSubmitPaymentNotice} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('transferAmount')}</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('selectedMonth')}</label>
                <select
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="أكتوبر 2026">أكتوبر 2026</option>
                  <option value="نوفمبر 2026">نوفمبر 2026</option>
                  <option value="ديسمبر 2026">ديسمبر 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('paymentMethod')}:</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="instapay">إنستاباي (InstaPay)</option>
                  <option value="vodafone_cash">فودافون كاش (Vodafone Cash)</option>
                  <option value="bank">تحويل بنكي (Bank Transfer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('transactionRef')}</label>
                <input
                  type="text"
                  placeholder="مثال: IPN-998822 أو رقم المحفظة"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات التحويل:</label>
                <input
                  type="text"
                  placeholder="مثال: تم التحويل من حساب فودافون كاش رقم 010xxxx"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition"
                >
                  {t('submitNoticeBtn')}
                </button>
              </div>
            </form>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm">
              سجل فواتير واشتراكات الطالب
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">{t('month')}</th>
                    <th className="p-3.5">{t('amount')}</th>
                    <th className="p-3.5">{t('paymentMethod')}</th>
                    <th className="p-3.5">{t('referenceNo')}</th>
                    <th className="p-3.5">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{p.month}</td>
                      <td className="p-3.5 font-bold font-mono text-slate-900">{p.amount} {t('currency')}</td>
                      <td className="p-3.5 font-semibold uppercase">{p.method}</td>
                      <td className="p-3.5 font-mono">{p.referenceNumber}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status === 'paid' ? t('paid') : t('pending')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Make-up Booking & History */}
      {currentTab === 'parent-makeup' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">{t('parentMakeupTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                اعتذر عن الحصة الأساسية واختر موعداً تعويضياً من المقاعد الشاغرة لمس مارينا
              </p>
            </div>
            <button
              onClick={() => setShowMakeupModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center"
            >
              <RefreshCw className="w-4 h-4 ml-1.5 mr-1.5" />
              {t('requestMakeupClassBtn')}
            </button>
          </div>

          {/* Current makeup requests */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm">
              سجل طلبات الحصص التعويضية الخاصة بك ({myMakeupRequests.length})
            </div>
            {myMakeupRequests.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {myMakeupRequests.map(r => (
                  <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">مادة {r.subject}</div>
                      <div className="text-xs text-purple-700 font-bold mt-0.5">الموعد البديل: {r.targetTime}</div>
                      <div className="text-[11px] text-slate-500 mt-1">السبب: {r.reason}</div>
                      {r.coordinatorNote && (
                        <div className="text-xs text-indigo-700 mt-1 font-semibold">رد الكوردينيتور: {r.coordinatorNote}</div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status === 'approved' ? t('approved') : t('pending')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                لا توجد طلبات تعويض سابقة.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Live Coordinator Chat */}
      {currentTab === 'parent-chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{t('parentChatTitle')}</h4>
              <p className="text-[11px] text-slate-500">تواصل مباشر مع منسق السنتر للاستفسارات وتعديل المواعيد</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {myMessages.length > 0 ? (
              myMessages.map(m => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'parent' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'parent'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold block mb-1 opacity-75">
                      {m.sender === 'parent' ? student.name : 'كوردينيتور سنتر مس مارينا'}
                    </span>
                    {m.text}
                    <span className="text-[9px] block text-end mt-1 opacity-70 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                مرحباً بك! اكتب أي استفسار هنا وسيقوم الكوردينيتور بالرد الفوري عليك.
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center"
            >
              <Send className="w-4 h-4 ml-1 mr-1" />
              <span>{t('send')}</span>
            </button>
          </form>
        </div>
      )}

      {/* Book Make-up Session Modal */}
      {showMakeupModal && (
        <Modal
          isOpen={showMakeupModal}
          onClose={() => setShowMakeupModal(false)}
          title={t('requestMakeupClassBtn')}
        >
          <form onSubmit={handleBookMakeup} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الحصة الأساسية المراد الاعتذار عنها:</label>
              <select
                value={missedGroupId}
                onChange={(e) => setMissedGroupId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                {myGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} - {g.day} ({g.time})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('apologyReason')}</label>
              <input
                type="text"
                placeholder="مثال: ظرف سفر عائلي أو وعكة صحية طارئة"
                value={makeupReason}
                onChange={(e) => setMakeupReason(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('chooseMakeupSlot')}</label>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {makeupSlots.map(slot => (
                  <label
                    key={slot.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      selectedMakeupSlotId === slot.id
                        ? 'bg-purple-50 border-purple-300 text-purple-950 ring-2 ring-purple-200'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="radio"
                        name="makeupSlot"
                        value={slot.id}
                        checked={selectedMakeupSlotId === slot.id}
                        onChange={() => setSelectedMakeupSlotId(slot.id)}
                        className="text-purple-600 focus:ring-purple-500 ml-2 mr-2"
                      />
                      <div>
                        <div className="font-bold text-xs">{slot.day} ({slot.time})</div>
                        <div className="text-[11px] text-slate-500 font-semibold">{slot.grade} • {slot.note}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-700 font-mono">
                      {slot.availableSeats} {t('seats')} متاحة
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setShowMakeupModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                {t('confirmMakeupBooking')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
