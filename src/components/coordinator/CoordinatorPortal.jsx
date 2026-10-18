import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  RefreshCw, 
  Wallet, 
  MessageSquare, 
  PlusCircle, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Send, 
  UserPlus, 
  Check, 
  X, 
  Info,
  Layers
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const CoordinatorPortal = ({ currentTab, onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const { 
    data, 
    addGroup, 
    updateGroup, 
    deleteGroup, 
    assignStudentToGroup, 
    removeStudentFromGroup, 
    addAttendanceBatch, 
    addMakeupSlot, 
    deleteMakeupSlot, 
    updateMakeupRequestStatus, 
    confirmPayment, 
    sendMessage, 
    markMessagesAsRead, 
    updateRegistrationStatus 
  } = useStore();
  const { addToast } = useToast();

  const students = data.users.filter(u => u.role === 'parent');
  const groups = data.groups;
  const payments = data.payments;
  const makeupRequests = data.makeupRequests;
  const makeupSlots = data.makeupSlots;
  const messages = data.messages;
  const registrations = data.registrations || [];

  const pendingPayments = payments.filter(p => p.status === 'pending_review');
  const pendingMakeups = makeupRequests.filter(r => r.status === 'pending');
  const unreadMessages = messages.filter(m => !m.read && m.sender === 'parent');

  // Modals state
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupForm, setNewGroupForm] = useState({
    name: '', subject: 'math', grade: 'Primary 3 (الصف الثالث)', day: 'السبت', time: '04:00 م - 05:30 م', maxCapacity: 12, monthlyFee: 450, location: 'قاعة 1'
  });

  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotForm, setNewSlotForm] = useState({
    subject: 'math', grade: 'Primary 3 (الصف الثالث)', day: 'الخميس', date: new Date().toISOString().split('T')[0], time: '04:00 م - 05:30 م', maxSeats: 4, note: 'حصة تعويضية مع مس مارينا'
  });

  const [activeAttendanceGroup, setActiveAttendanceGroup] = useState(null);
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [sessionTopic, setSessionTopic] = useState('');

  const [activeGroupDetails, setActiveGroupDetails] = useState(null);
  const [selectedStudentToAssign, setSelectedStudentToAssign] = useState('');

  // Active chat student
  const [selectedChatStudentId, setSelectedChatStudentId] = useState(students[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  // ---------------- Handlers ---------------- //
  const handleCreateGroup = (e) => {
    e.preventDefault();
    addGroup({
      name: newGroupForm.name,
      nameEn: newGroupForm.name,
      subject: newGroupForm.subject,
      subjectName: newGroupForm.subject === 'math' ? 'Math (ماث)' : 'English (إنجليزي)',
      subjectNameEn: newGroupForm.subject === 'math' ? 'Math' : 'English',
      grade: newGroupForm.grade,
      stage: newGroupForm.grade.includes('KG') ? 'kg' : 'primary',
      day: newGroupForm.day,
      time: newGroupForm.time,
      maxCapacity: parseInt(newGroupForm.maxCapacity),
      monthlyFee: parseFloat(newGroupForm.monthlyFee),
      location: newGroupForm.location
    });
    addToast('تم إنشاء المجموعة والميعاد بنجاح', 'success');
    setShowAddGroupModal(false);
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    addMakeupSlot({
      subject: newSlotForm.subject,
      grade: newSlotForm.grade,
      day: newSlotForm.day,
      date: newSlotForm.date,
      time: newSlotForm.time,
      maxSeats: parseInt(newSlotForm.maxSeats),
      note: newSlotForm.note,
      noteEn: newSlotForm.note
    });
    addToast('تمت إضافة الموعد التعويضي الشاغر بنجاح', 'success');
    setShowAddSlotModal(false);
  };

  const handleOpenAttendance = (group) => {
    const enrolled = students.filter(s => group.studentIds.includes(s.id));
    setActiveAttendanceGroup(group);
    setSessionTopic(`${group.subjectName} - حصة ${new Date().toLocaleDateString('ar-EG')}`);
    setAttendanceSheet(enrolled.map(s => ({
      studentId: s.id,
      studentName: s.studentName,
      status: 'attended',
      homeworkDone: true,
      notes: ''
    })));
  };

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    const dateStr = new Date().toISOString().split('T')[0];
    const records = attendanceSheet.map(item => ({
      id: `att-${Date.now()}-${item.studentId}`,
      studentId: item.studentId,
      groupId: activeAttendanceGroup.id,
      date: dateStr,
      dayName: activeAttendanceGroup.day,
      dayNameEn: activeAttendanceGroup.dayEn || activeAttendanceGroup.day,
      sessionTitle: sessionTopic,
      status: item.status,
      homeworkDone: item.homeworkDone,
      notes: item.notes || 'حضر الحصة وتم تسجيل الملاحظات'
    }));
    addAttendanceBatch(records);
    addToast('تم تسجيل الحضور وتحديث السجل لجميع الطلاب بنجاح', 'success');
    setActiveAttendanceGroup(null);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatStudentId) return;
    sendMessage({
      studentId: selectedChatStudentId,
      sender: 'coordinator',
      text: replyText
    });
    setReplyText('');
    addToast('تم إرسال الرسالة إلى ولي الأمر', 'success');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Coordinator Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl md:text-4xl shadow-inner border border-white/30 shrink-0">
              👨‍💼
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse flex-wrap">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {t('coordinatorTitle')}
                </h2>
                <span className="bg-blue-500/40 text-blue-100 text-xs px-3 py-1 rounded-full font-bold border border-white/20">
                  {t('coordinatorBadge')}
                </span>
              </div>
              <p className="text-indigo-100 text-sm mt-1 font-medium">
                {t('coordinatorWelcome')}
              </p>
              <div className="flex items-center space-x-2 space-x-reverse mt-2 text-xs flex-wrap gap-1">
                <span className="bg-indigo-900/40 text-indigo-200 px-2.5 py-0.5 rounded-lg">
                  {t('enrolledStudents')}: <strong className="text-white">{students.length}</strong>
                </span>
                <span className="bg-indigo-900/40 text-indigo-200 px-2.5 py-0.5 rounded-lg">
                  {t('groupsCount')}: <strong className="text-white">{groups.length}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddGroupModal(true)}
              className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl font-bold text-xs md:text-sm shadow-md transition flex items-center"
            >
              <PlusCircle className="w-4 h-4 ml-1.5 mr-1.5 text-indigo-600" />
              {t('addNewGroupBtn')}
            </button>
            <button
              onClick={() => setShowAddSlotModal(true)}
              className="px-4 py-2.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white rounded-2xl font-bold text-xs md:text-sm shadow-sm transition border border-white/20 flex items-center"
            >
              <Clock className="w-4 h-4 ml-1.5 mr-1.5" />
              + موعد تعويضي
            </button>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center space-x-2 space-x-reverse mt-6 pt-6 border-t border-white/20 text-sm font-bold overflow-x-auto">
          {[
            { id: 'dashboard', label: t('navOverview') },
            { id: 'groups-management', label: `${t('navGroups')} (${groups.length})` },
            { id: 'attendance-manager', label: t('navAttendance') },
            { id: 'makeup-requests', label: t('navMakeups'), count: pendingMakeups.length, countColor: 'bg-rose-500' },
            { id: 'payments-manager', label: t('navPayments'), count: pendingPayments.length, countColor: 'bg-amber-400 text-slate-900' },
            { id: 'messages-center', label: t('navMessages'), count: unreadMessages.length, countColor: 'bg-emerald-400 text-slate-900' },
            { id: 'registrations-manager', label: `${t('navRegistrations')} (${registrations.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center ${
                currentTab === tab.id
                  ? 'bg-white text-indigo-900 shadow-md font-black'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-2 py-0.2 rounded-full mr-1.5 ml-1.5 font-bold ${tab.countColor}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Dashboard Tasks Overview */}
      {(currentTab === 'dashboard' || !currentTab) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('totalStudents')}</span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{students.length}</div>
                <p className="text-xs text-blue-600 mt-1 font-semibold">{t('kgStage')} & {t('primaryStage')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('pendingMakeupsCount')}</span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{pendingMakeups.length}</div>
                <p className={`text-xs mt-1 font-bold ${pendingMakeups.length > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {pendingMakeups.length > 0 ? t('pendingMakeupsDescNeedsAction') : t('pendingMakeupsDescAllDone')}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('pendingReceiptsCount')}</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{pendingPayments.length}</div>
                <p className="text-xs text-amber-600 mt-1 font-semibold">{t('pendingReceiptsDesc')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{t('newInquiriesCount')}</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">{unreadMessages.length}</div>
                <p className="text-xs text-emerald-600 mt-1 font-semibold">{t('newInquiriesDesc')}</p>
              </div>
            </div>
          </div>

          {/* Pending Make-ups & Payments Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Make-ups */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{t('urgentMakeupsTitle')}</h3>
                </div>
                <button onClick={() => onNavigate('makeup-requests')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                  {t('viewAll')}
                </button>
              </div>

              {pendingMakeups.length > 0 ? (
                <div className="space-y-3">
                  {pendingMakeups.map(req => (
                    <div key={req.id} className="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="font-extrabold text-slate-900 text-sm">{req.studentName}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">{req.grade}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          المادة: <strong className="text-slate-800">{req.subject}</strong> • هاتف: <span className="font-mono">{req.phone}</span>
                        </div>
                        <div className="text-xs text-purple-800 font-semibold mt-1">
                          الموعد المطلوب: {req.targetTime}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{req.reason}</div>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => {
                            updateMakeupRequestStatus(req.id, 'approved', 'تم اعتماد الموعد وتسكين الطالب');
                            addToast(t('toastMakeupApproved'), 'success');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                        >
                          {t('approveAndAssign')}
                        </button>
                        <button
                          onClick={() => {
                            const note = window.prompt('سبب الاعتذار أو تحديد موعد آخر:', 'يرجى مراجعة الكوردينيتور لاختيار موعد آخر');
                            if (note !== null) {
                              updateMakeupRequestStatus(req.id, 'rejected', note);
                              addToast('تم تحديث حالة الطلب', 'info');
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl font-bold text-xs"
                        >
                          {t('apologizeOrReschedule')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                  {t('noPendingMakeups')}
                </div>
              )}
            </div>

            {/* Urgent Payments Review */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{t('urgentPaymentsTitle')}</h3>
                </div>
                <button onClick={() => onNavigate('payments-manager')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                  {t('viewAll')}
                </button>
              </div>

              {pendingPayments.length > 0 ? (
                <div className="space-y-3">
                  {pendingPayments.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="font-extrabold text-slate-900 text-sm">{p.studentName}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">{p.month}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-semibold">
                          {t('amount')}: <span className="font-bold text-slate-900 font-mono text-sm">{p.amount} {t('currency')}</span> • {p.method}
                        </div>
                        <div className="text-[11px] font-mono text-slate-600 mt-1">المرجع: {p.referenceNumber}</div>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => {
                            confirmPayment(p.id, 'paid', 'تم التحقق من التحويل وتأكيد الاشتراك');
                            addToast(t('toastPaymentConfirmed'), 'success');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                        >
                          {t('confirmReceipt')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedChatStudentId(p.studentId);
                            onNavigate('messages-center');
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-xl font-bold text-xs"
                        >
                          {t('contactParent')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                  {t('noPendingPayments')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Groups & Schedule Management */}
      {currentTab === 'groups-management' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">{t('navGroups')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                تحديد مواعيد الحصص الأسبوعية، القاعات، السعة القصوى، وقائمة الطلاب
              </p>
            </div>
            <button
              onClick={() => setShowAddGroupModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md flex items-center transition"
            >
              <PlusCircle className="w-4 h-4 ml-1.5 mr-1.5" />
              {t('addNewGroupBtn')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(g => (
              <div key={g.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:border-indigo-300 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      g.subject === 'math' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'
                    }`}>
                      {g.subjectName}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">{g.day}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mt-2">{g.name}</h4>
                  <div className="text-xs text-slate-600 mt-2 space-y-1">
                    <div>🕒 {g.time}</div>
                    <div>📍 {g.location}</div>
                    <div className="font-bold text-indigo-700">
                      الاشتراك: {g.monthlyFee} {t('currency')}
                    </div>
                    <div className={`font-bold ${g.studentIds.length >= g.maxCapacity ? 'text-rose-600' : 'text-emerald-600'}`}>
                      المقاعد: {g.studentIds.length} من أصل {g.maxCapacity} طلاب
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveGroupDetails(g)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    الطلاب ({g.studentIds.length})
                  </button>
                  <button
                    onClick={() => handleOpenAttendance(g)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center"
                  >
                    <CheckSquare className="w-3.5 h-3.5 ml-1 mr-1" />
                    {t('takeAttendanceBtn')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Attendance Manager */}
      {currentTab === 'attendance-manager' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">{t('navAttendance')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                اختر أي مجموعة لتحضير الطلاب وتسجيل الواجب والملاحظات
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(g => (
              <div key={g.id} className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 font-mono">{g.day} • {g.time}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{g.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{g.studentIds.length} طلاب مسجلين</p>
                </div>
                <button
                  onClick={() => handleOpenAttendance(g)}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center"
                >
                  <CheckSquare className="w-4 h-4 ml-1.5 mr-1.5" />
                  تحضير حصة المجموعة
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Make-up Requests & Vacant Slots */}
      {currentTab === 'makeup-requests' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">{t('navMakeups')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                إدارة طلبات الحصص التعويضية والمواعيد البديلة الشاغرة لمس مارينا
              </p>
            </div>
            <button
              onClick={() => setShowAddSlotModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs shadow-md flex items-center transition"
            >
              <PlusCircle className="w-4 h-4 ml-1.5 mr-1.5" />
              إضافة ميعاد تعويضي شاغر
            </button>
          </div>

          {/* Pending Makeups */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm">
              طلبات أولياء الأمور للاعتذار والتعويض ({makeupRequests.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">{t('student')}</th>
                    <th className="p-3.5">{t('grade')}</th>
                    <th className="p-3.5">{t('subjects')}</th>
                    <th className="p-3.5">الموعد البديل</th>
                    <th className="p-3.5">السبب</th>
                    <th className="p-3.5">{t('status')}</th>
                    <th className="p-3.5">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {makeupRequests.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{r.studentName}</td>
                      <td className="p-3.5">{r.grade}</td>
                      <td className="p-3.5 font-semibold">{r.subject}</td>
                      <td className="p-3.5 text-purple-700 font-bold">{r.targetTime}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{r.reason}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status === 'approved' ? t('approved') : t('pending')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {r.status === 'pending' ? (
                          <div className="flex space-x-1.5 space-x-reverse">
                            <button
                              onClick={() => {
                                updateMakeupRequestStatus(r.id, 'approved', 'تمت الموافقة وتسكين الطالب');
                                addToast(t('toastMakeupApproved'), 'success');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-xs"
                            >
                              موافقة
                            </button>
                            <button
                              onClick={() => {
                                const note = window.prompt('سبب الرفض:');
                                if (note) updateMakeupRequestStatus(r.id, 'rejected', note);
                              }}
                              className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-bold text-xs"
                            >
                              رفض
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold">{r.coordinatorNote || 'معتمد'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Available Slots */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-800 text-base">المواعيد التعويضية الشاغرة المتاحة للحجز</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {makeupSlots.map(s => (
                <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase">
                        {s.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-600 font-mono">{s.day} ({s.date})</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-2">{s.grade}</div>
                    <div className="text-xs text-slate-600 font-mono mt-1">{s.time}</div>
                    <div className="text-xs text-purple-700 font-bold mt-2">
                      {s.availableSeats} {t('seats')} متاحة من أصل {s.maxSeats}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{s.note}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => {
                        if (window.confirm('هل تريد حذف هذا الموعد التعويضي؟')) {
                          deleteMakeupSlot(s.id);
                          addToast('تم حذف الموعد التعويضي', 'info');
                        }
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Payments Review */}
      {currentTab === 'payments-manager' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-black text-slate-800">{t('navPayments')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              مراجعة إيصالات التحويل وأرقام المعاملات الصادرة من أولياء الأمور واعتمادها
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">{t('student')}</th>
                    <th className="p-3.5">{t('month')}</th>
                    <th className="p-3.5">{t('amount')}</th>
                    <th className="p-3.5">{t('paymentMethod')}</th>
                    <th className="p-3.5">{t('referenceNo')}</th>
                    <th className="p-3.5">{t('status')}</th>
                    <th className="p-3.5">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{p.studentName}</td>
                      <td className="p-3.5">{p.month}</td>
                      <td className="p-3.5 font-bold font-mono text-slate-900">{p.amount} {t('currency')}</td>
                      <td className="p-3.5 font-semibold">{p.method}</td>
                      <td className="p-3.5 font-mono">{p.referenceNumber}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status === 'paid' ? t('paid') : t('pending')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {p.status === 'pending_review' ? (
                          <button
                            onClick={() => {
                              confirmPayment(p.id, 'paid', 'تم التحقق من التحويل وتأكيد الاشتراك');
                              addToast(t('toastPaymentConfirmed'), 'success');
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                          >
                            {t('confirmReceipt')}
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold">معتمد ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Live Parent Messages Center */}
      {currentTab === 'messages-center' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          {/* Students Chat List */}
          <div className="border-b md:border-b-0 md:border-l border-slate-200 p-4 space-y-2 bg-slate-50/50">
            <h4 className="font-extrabold text-slate-800 text-sm mb-3">محادثات أولياء الأمور</h4>
            <div className="space-y-1.5">
              {students.map(st => {
                const unread = messages.filter(m => m.studentId === st.id && !m.read && m.sender === 'parent').length;
                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedChatStudentId(st.id);
                      markMessagesAsRead(st.id);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition flex items-center justify-between ${
                      selectedChatStudentId === st.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{st.studentName}</div>
                      <div className={`text-[10px] ${selectedChatStudentId === st.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {st.name}
                      </div>
                    </div>
                    {unread > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unread}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Messages Panel */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 bg-white">
            <div className="space-y-3 overflow-y-auto max-h-[420px] p-2">
              {messages.filter(m => m.studentId === selectedChatStudentId).length > 0 ? (
                messages.filter(m => m.studentId === selectedChatStudentId).map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === 'coordinator' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'coordinator'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold block mb-1 opacity-75">
                        {m.sender === 'coordinator' ? 'كوردينيتور السنتر' : m.parentName}
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
                  لا توجد رسائل سابقة. اكتب رداً للبدء في التواصل.
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك لولي الأمر هنا..."
                className="flex-1 p-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center"
              >
                <Send className="w-4 h-4 ml-1 mr-1" />
                <span>{t('send')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 7: Registrations Manager */}
      {currentTab === 'registrations-manager' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xl font-black text-slate-800">{t('navRegistrations')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              طلبات الالتحاق الجديدة المسجلة عبر الموقع لمتابعتها وتسكينها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map(reg => (
              <div key={reg.id} className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm">{reg.studentName}</h4>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    reg.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>ولي الأمر: <strong>{reg.parentName}</strong></div>
                  <div>الهاتف: <span className="font-mono">{reg.phone}</span></div>
                  <div>المرحلة: <strong className="text-indigo-700">{reg.grade}</strong></div>
                  <div>المواد: {reg.subjects.join(' + ')}</div>
                  <div className="text-slate-500 text-[11px] mt-1">{reg.notes}</div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2 space-x-reverse">
                  <button
                    onClick={() => {
                      updateRegistrationStatus(reg.id, 'accepted', 'تم قبول الطالب والتواصل لتحديد المجموعة');
                      addToast('تم قبول وتأكيد طلب الالتحاق', 'success');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    قبول وتسكين ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <Modal
          isOpen={showAddGroupModal}
          onClose={() => setShowAddGroupModal(false)}
          title="إنشاء مجموعة وميعاد جديد لمس مارينا"
        >
          <form onSubmit={handleCreateGroup} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المجموعة:</label>
              <input
                type="text"
                placeholder="مثال: ماث - رابعة ابتدائي (مجموعة الأحد)"
                value={newGroupForm.name}
                onChange={(e) => setNewGroupForm({ ...newGroupForm, name: e.target.value })}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المادة:</label>
                <select
                  value={newGroupForm.subject}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="math">Math (ماث)</option>
                  <option value="english">English (لغة إنجليزية)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('grade')}:</label>
                <select
                  value={newGroupForm.grade}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, grade: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="KG 1">KG 1</option>
                  <option value="KG 2">KG 2</option>
                  <option value="Primary 1 (الصف الأول)">Primary 1 (الصف الأول)</option>
                  <option value="Primary 2 (الصف الثاني)">Primary 2 (الصف الثاني)</option>
                  <option value="Primary 3 (الصف الثالث)">Primary 3 (الصف الثالث)</option>
                  <option value="Primary 4 (الصف الرابع)">Primary 4 (الصف الرابع)</option>
                  <option value="Primary 5 (الصف الخامس)">Primary 5 (الصف الخامس)</option>
                  <option value="Primary 6 (الصف السادس)">Primary 6 (الصف السادس)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اليوم:</label>
                <select
                  value={newGroupForm.day}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, day: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="السبت">السبت</option>
                  <option value="الأحد">الأحد</option>
                  <option value="الاثنين">الاثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوقت:</label>
                <input
                  type="text"
                  value={newGroupForm.time}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, time: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">السعة القصوى (طلاب):</label>
                <input
                  type="number"
                  value={newGroupForm.maxCapacity}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, maxCapacity: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاشتراك الشهري (ج):</label>
                <input
                  type="number"
                  value={newGroupForm.monthlyFee}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, monthlyFee: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>
            </div>
            <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setShowAddGroupModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                إنشاء المجموعة
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Make-up Slot Modal */}
      {showAddSlotModal && (
        <Modal
          isOpen={showAddSlotModal}
          onClose={() => setShowAddSlotModal(false)}
          title="إضافة موعد تعويضي متاح لمس مارينا"
        >
          <form onSubmit={handleCreateSlot} className="space-y-4 text-start">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المادة:</label>
                <select
                  value={newSlotForm.subject}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="math">Math (ماث)</option>
                  <option value="english">English (إنجليزي)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('grade')}:</label>
                <select
                  value={newSlotForm.grade}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, grade: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="KG 1">KG 1</option>
                  <option value="KG 2">KG 2</option>
                  <option value="Primary 1 (الصف الأول)">Primary 1 (الصف الأول)</option>
                  <option value="Primary 2 (الصف الثاني)">Primary 2 (الصف الثاني)</option>
                  <option value="Primary 3 (الصف الثالث)">Primary 3 (الصف الثالث)</option>
                  <option value="Primary 4 (الصف الرابع)">Primary 4 (الصف الرابع)</option>
                  <option value="Primary 5 (الصف الخامس)">Primary 5 (الصف الخامس)</option>
                  <option value="Primary 6 (الصف السادس)">Primary 6 (الصف السادس)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اليوم:</label>
                <select
                  value={newSlotForm.day}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, day: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="السبت">السبت</option>
                  <option value="الأحد">الأحد</option>
                  <option value="الاثنين">الاثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('date')}:</label>
                <input
                  type="date"
                  value={newSlotForm.date}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, date: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوقت:</label>
                <input
                  type="text"
                  value={newSlotForm.time}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, time: e.target.value })}
                  placeholder="05:00 م - 06:30 م"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المقاعد المتاحة:</label>
                <input
                  type="number"
                  value={newSlotForm.maxSeats}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, maxSeats: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل وملاحظة الحصة:</label>
              <input
                type="text"
                value={newSlotForm.note}
                onChange={(e) => setNewSlotForm({ ...newSlotForm, note: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setShowAddSlotModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                إضافة الموعد
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Attendance Sheet Modal */}
      {activeAttendanceGroup && (
        <Modal
          isOpen={!!activeAttendanceGroup}
          onClose={() => setActiveAttendanceGroup(null)}
          title={`تحضير حصة: ${activeAttendanceGroup.name}`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveAttendance} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان / موضوع الدرس:</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">اسم الطالب</th>
                    <th className="p-3">{t('status')}</th>
                    <th className="p-3">تسليم الواجب</th>
                    <th className="p-3">{t('notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceSheet.map((item, idx) => (
                    <tr key={item.studentId} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{item.studentName}</td>
                      <td className="p-3">
                        <select
                          value={item.status}
                          onChange={(e) => {
                            const updated = [...attendanceSheet];
                            updated[idx].status = e.target.value;
                            setAttendanceSheet(updated);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                        >
                          <option value="attended">حاضر ✓</option>
                          <option value="absent">غائب ✕</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={item.homeworkDone}
                          onChange={(e) => {
                            const updated = [...attendanceSheet];
                            updated[idx].homeworkDone = e.target.checked;
                            setAttendanceSheet(updated);
                          }}
                          className="rounded text-indigo-600 ml-2 mr-2"
                        />
                        <span className="text-xs font-semibold">{item.homeworkDone ? 'تم التسليم' : 'لم يسلم'}</span>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => {
                            const updated = [...attendanceSheet];
                            updated[idx].notes = e.target.value;
                            setAttendanceSheet(updated);
                          }}
                          placeholder="ملاحظات تفاعل الطالب..."
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setActiveAttendanceGroup(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                حفظ كشف الحضور
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Group Details & Student Assignment Modal */}
      {activeGroupDetails && (
        <Modal
          isOpen={!!activeGroupDetails}
          onClose={() => setActiveGroupDetails(null)}
          title={`إدارة طلاب مجموعة: ${activeGroupDetails.name}`}
        >
          <div className="space-y-4 text-start">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div>الموعد: <strong>{activeGroupDetails.day} ({activeGroupDetails.time})</strong></div>
              <div>السعة: <strong>{activeGroupDetails.studentIds.length} / {activeGroupDetails.maxCapacity}</strong></div>
            </div>

            {/* Assign New Student Dropdown */}
            <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-2">
              <select
                value={selectedStudentToAssign}
                onChange={(e) => setSelectedStudentToAssign(e.target.value)}
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                <option value="">-- اختر طالباً لتسكينه هنا --</option>
                {students
                  .filter(s => !activeGroupDetails.studentIds.includes(s.id))
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.studentName} ({s.grade})
                    </option>
                  ))}
              </select>
              <button
                onClick={() => {
                  if (selectedStudentToAssign) {
                    assignStudentToGroup(selectedStudentToAssign, activeGroupDetails.id);
                    addToast('تم تسكين الطالب في المجموعة', 'success');
                    setSelectedStudentToAssign('');
                  }
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                تسكين +
              </button>
            </div>

            {/* Currently Enrolled Students */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <h5 className="font-bold text-slate-800 text-xs">الطلاب المقيدين حالياً ({activeGroupDetails.studentIds.length}):</h5>
              {students.filter(s => activeGroupDetails.studentIds.includes(s.id)).map(st => (
                <div key={st.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{st.studentName}</div>
                    <div className="text-[10px] text-slate-500">{st.name} • {st.phone}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد إزالة الطالب من هذه المجموعة؟')) {
                        removeStudentFromGroup(st.id, activeGroupDetails.id);
                        addToast('تمت إزالة الطالب من المجموعة', 'info');
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                  >
                    إزالة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
