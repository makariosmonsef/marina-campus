/**
 * Coordinator & Admin Portal Components (منظور كوردينيتور ومنسق السنتر)
 */
const CoordinatorPortal = {
    render(currentTab = "dashboard") {
        const user = Store.getCurrentUser();
        const students = Store.getStudents();
        const groups = Store.getGroups();
        const payments = Store.getPayments();
        const makeupRequests = Store.getMakeupRequests();
        const makeupSlots = Store.getMakeupSlots();
        const messages = Store.getMessages();
        const registrations = Store.getRegistrations();

        const pendingPayments = payments.filter(p => p.status === "pending_review");
        const pendingMakeups = makeupRequests.filter(r => r.status === "pending");
        const unreadMessages = messages.filter(m => !m.read && m.sender === "parent");

        return `
        <div class="space-y-6 pb-20">
            <!-- Top Coordinator Banner -->
            <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl md:text-4xl shadow-inner border border-white/30">
                            👨‍💼
                        </div>
                        <div>
                            <div class="flex items-center space-x-2 space-x-reverse flex-wrap">
                                <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">لوحة تحكم الكوردينيتور</h2>
                                <span class="bg-blue-500/40 text-blue-100 text-xs px-3 py-1 rounded-full font-bold border border-white/20">
                                    إدارة المواعيد وشؤون أولياء الأمور
                                </span>
                            </div>
                            <p class="text-indigo-100 text-sm mt-1 font-medium">مرحباً بك يا كوردينيتور السنتر • سنتر مس مارينا (Math & English)</p>
                            <div class="flex items-center space-x-2 space-x-reverse mt-2 text-xs">
                                <span class="bg-indigo-900/40 text-indigo-200 px-2.5 py-0.5 rounded-lg">
                                    الطلاب المسجلين: <strong class="text-white">${students.length}</strong>
                                </span>
                                <span class="bg-indigo-900/40 text-indigo-200 px-2.5 py-0.5 rounded-lg">
                                    المجموعات النشطة: <strong class="text-white">${groups.length}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Coordinator Quick Action Buttons -->
                    <div class="flex flex-wrap items-center gap-2">
                        <button onclick="CoordinatorPortal.openAddGroupModal()" class="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-xs md:text-sm shadow-md transition flex items-center">
                            <i data-lucide="plus-circle" class="w-4 h-4 ml-1.5 text-indigo-600"></i>
                            إضافة ميعاد / مجموعة
                        </button>
                        <button onclick="CoordinatorPortal.openAddStudentModal()" class="px-4 py-2.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white rounded-xl font-bold text-xs md:text-sm shadow-sm transition border border-white/20 flex items-center">
                            <i data-lucide="user-plus" class="w-4 h-4 ml-1.5"></i>
                            تسجيل طالب جديد
                        </button>
                    </div>
                </div>

                <!-- Desktop Navigation Tabs -->
                <div class="hidden md:flex items-center space-x-2 space-x-reverse mt-6 pt-6 border-t border-white/20 text-sm font-bold overflow-x-auto">
                    <button onclick="App.navigate('dashboard')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        نظرة عامة والمهام
                    </button>
                    <button onclick="App.navigate('groups-management')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'groups-management' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        تنظيم المواعيد والمجموعات (${groups.length})
                    </button>
                    <button onclick="App.navigate('attendance-manager')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'attendance-manager' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        تسجيل الحضور والغياب
                    </button>
                    <button onclick="App.navigate('makeup-requests')" class="px-4 py-2 rounded-xl transition whitespace-nowrap relative ${currentTab === 'makeup-requests' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        الحصص التعويضية
                        ${pendingMakeups.length > 0 ? `<span class="bg-rose-500 text-white text-[10px] px-2 py-0.2 rounded-full mr-1.5">${pendingMakeups.length}</span>` : ''}
                    </button>
                    <button onclick="App.navigate('payments-manager')" class="px-4 py-2 rounded-xl transition whitespace-nowrap relative ${currentTab === 'payments-manager' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        مراجعة المدفوعات
                        ${pendingPayments.length > 0 ? `<span class="bg-amber-400 text-slate-900 text-[10px] px-2 py-0.2 rounded-full mr-1.5">${pendingPayments.length}</span>` : ''}
                    </button>
                    <button onclick="App.navigate('messages-center')" class="px-4 py-2 rounded-xl transition whitespace-nowrap relative ${currentTab === 'messages-center' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        محادثات أولياء الأمور
                        ${unreadMessages.length > 0 ? `<span class="bg-emerald-400 text-slate-900 text-[10px] px-2 py-0.2 rounded-full mr-1.5">${unreadMessages.length}</span>` : ''}
                    </button>
                    <button onclick="App.navigate('registrations-manager')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'registrations-manager' ? 'bg-white text-indigo-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        طلبات الالتحاق (${registrations.length})
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div>
                ${this.renderActiveTab(currentTab, { students, groups, payments, makeupRequests, makeupSlots, messages, registrations, pendingPayments, pendingMakeups, unreadMessages })}
            </div>
        </div>
        `;
    },

    renderActiveTab(tab, data) {
        switch (tab) {
            case "groups-management":
                return this.renderGroupsTab(data);
            case "attendance-manager":
                return this.renderAttendanceTab(data);
            case "makeup-requests":
                return this.renderMakeupTab(data);
            case "payments-manager":
                return this.renderPaymentsTab(data);
            case "messages-center":
                return this.renderMessagesTab(data);
            case "registrations-manager":
                return this.renderRegistrationsTab(data);
            case "dashboard":
            default:
                return this.renderDashboardTab(data);
        }
    },

    // 1. Dashboard Tab
    renderDashboardTab({ students, groups, payments, makeupRequests, pendingPayments, pendingMakeups, unreadMessages, registrations }) {
        return `
        <div class="space-y-6">
            <!-- 4 KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Card 1: Students Count -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">إجمالي الطلاب</span>
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${students.length} <span class="text-sm font-medium text-slate-500">طالب</span></div>
                        <p class="text-xs text-blue-600 mt-1 font-semibold">مراحل KG والابتدائي</p>
                    </div>
                </div>

                <!-- Card 2: Pending Makeups -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">طلبات التعويض المعلقة</span>
                        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${pendingMakeups.length} <span class="text-sm font-medium text-slate-500">طلب</span></div>
                        <p class="text-xs ${pendingMakeups.length > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'} mt-1">
                            ${pendingMakeups.length > 0 ? 'تتطلب اعتماد وتسكين في موعد بديل' : 'جميع الطلبات معتمدة ✓'}
                        </p>
                    </div>
                </div>

                <!-- Card 3: Payments to review -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">إيصالات الدفع المعلقة</span>
                        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <i data-lucide="receipt" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${pendingPayments.length} <span class="text-sm font-medium text-slate-500">تحويل جديد</span></div>
                        <p class="text-xs ${pendingPayments.length > 0 ? 'text-amber-600 font-bold' : 'text-slate-500'} mt-1">
                            ${pendingPayments.length > 0 ? 'فودافون كاش / إنستاباي بانتظار التأكيد' : 'لا توجد دفعات معلقة'}
                        </p>
                    </div>
                </div>

                <!-- Card 4: Unread Inquiries -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">رسائل واستفسارات جديدة</span>
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <i data-lucide="message-square" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${unreadMessages.length} <span class="text-sm font-medium text-slate-500">رسالة</span></div>
                        <p class="text-xs ${unreadMessages.length > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'} mt-1">
                            ${unreadMessages.length > 0 ? 'أولياء أمور ينتظرون ردك' : 'تم الرد على الجميع'}
                        </p>
                    </div>
                </div>

            </div>

            <!-- Two Columns Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <!-- Left: Pending Make-up Requests Action Box -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <div class="p-2 rounded-xl bg-purple-50 text-purple-600">
                                <i data-lucide="clock" class="w-5 h-5"></i>
                            </div>
                            <h3 class="font-bold text-slate-800 text-base">طلبات تغيير المواعيد والحصص التعويضية العاجلة</h3>
                        </div>
                        <button onclick="App.navigate('makeup-requests')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                            عرض الكل ←
                        </button>
                    </div>

                    ${pendingMakeups.length > 0 ? `
                        <div class="space-y-3">
                            ${pendingMakeups.map(req => `
                                <div class="p-4 rounded-2xl border border-purple-100 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div class="flex items-center space-x-2 space-x-reverse">
                                            <span class="font-extrabold text-slate-900 text-sm">${req.studentName}</span>
                                            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">${req.grade}</span>
                                        </div>
                                        <div class="text-xs text-slate-600 mt-1">
                                            مادة: <strong class="text-slate-800">${req.subject}</strong> • هاتف: <span class="font-mono">${req.phone}</span>
                                        </div>
                                        <div class="text-xs text-purple-800 font-semibold mt-1">
                                            الموعد البديل المطلوب: ${req.targetTime} (${req.targetDate})
                                        </div>
                                        <div class="text-[11px] text-slate-500 mt-1">سبب الاعتذار: ${req.reason}</div>
                                    </div>
                                    <div class="flex sm:flex-col gap-2">
                                        <button onclick="CoordinatorPortal.approveMakeup('${req.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs">
                                            موافقة وتسكين ✓
                                        </button>
                                        <button onclick="CoordinatorPortal.rejectMakeup('${req.id}')" class="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl font-bold text-xs">
                                            اعتذار / موعد آخر
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                            ممتاز! لا توجد طلبات حصص تعويضية معلقة حالياً.
                        </div>
                    `}
                </div>

                <!-- Right: Pending Payments to Confirm Box -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <div class="p-2 rounded-xl bg-amber-50 text-amber-600">
                                <i data-lucide="wallet" class="w-5 h-5"></i>
                            </div>
                            <h3 class="font-bold text-slate-800 text-base">إيصالات وتحويلات تتطلب الاعتماد</h3>
                        </div>
                        <button onclick="App.navigate('payments-manager')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                            سجل الدفع كامل ←
                        </button>
                    </div>

                    ${pendingPayments.length > 0 ? `
                        <div class="space-y-3">
                            ${pendingPayments.map(p => `
                                <div class="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div class="flex items-center space-x-2 space-x-reverse">
                                            <span class="font-extrabold text-slate-900 text-sm">${p.studentName}</span>
                                            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">${p.month}</span>
                                        </div>
                                        <div class="text-xs text-slate-600 mt-1 font-semibold">
                                            المبلغ: <span class="font-bold text-slate-900 font-mono text-sm">${p.amount} ج</span> • الطريقة: ${p.method === 'vodafone_cash' ? 'فودافون كاش' : p.method === 'instapay' ? 'إنستاباي' : 'تحويل بنكي'}
                                        </div>
                                        <div class="text-[11px] font-mono text-slate-600 mt-1">المرجع: ${p.referenceNumber}</div>
                                        ${p.notes ? `<div class="text-[11px] text-slate-500 mt-0.5">${p.notes}</div>` : ''}
                                    </div>
                                    <div class="flex sm:flex-col gap-2">
                                        <button onclick="CoordinatorPortal.confirmPayment('${p.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs">
                                            تأكيد الاستلام ✓
                                        </button>
                                        <button onclick="CoordinatorPortal.contactParentForPayment('${p.studentId}')" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-xl font-bold text-xs">
                                            مراسلة ولي الأمر
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                            رائع! جميع إيصالات وتحويلات أولياء الأمور تم اعتمادها وتحديثها.
                        </div>
                    `}
                </div>

            </div>

            <!-- Quick Schedule Grid Preview for Coordinator -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-slate-800 text-base">جدول مجموعات السنتر (مس مارينا)</h3>
                    <button onclick="CoordinatorPortal.openAddGroupModal()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                        <i data-lucide="plus" class="w-4 h-4 ml-1"></i> إضافة مجموعة جديدة
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${groups.map(g => `
                        <div class="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition bg-slate-50/40">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded-md ${g.subject === 'math' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}">
                                    ${g.subjectName}
                                </span>
                                <span class="text-xs font-bold text-slate-500">${g.day}</span>
                            </div>
                            <h4 class="font-extrabold text-slate-900 text-sm mt-2">${g.name}</h4>
                            <div class="text-xs text-slate-600 mt-2 space-y-1">
                                <div>🕒 ${g.time}</div>
                                <div>📍 ${g.location}</div>
                                <div class="font-bold ${g.studentIds.length >= g.maxCapacity ? 'text-rose-600' : 'text-emerald-600'}">
                                    العدد: ${g.studentIds.length} من أصل ${g.maxCapacity} طلاب
                                </div>
                            </div>
                            <div class="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                                <button onclick="CoordinatorPortal.openGroupDetails('${g.id}')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                                    قائمة الطلاب (${g.studentIds.length})
                                </button>
                                <button onclick="CoordinatorPortal.openAttendanceModal('${g.id}')" class="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold">
                                    تحضير الحصة
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    },

    // 2. Groups & Schedule Management Tab
    renderGroupsTab({ groups, students }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">إدارة مواعيد السنتر والمجموعات</h3>
                    <p class="text-xs text-slate-500 mt-1">تحديد أيام الحصص، التوقيت، السعة الاستيعابية لكل جروب، وقائمة الطلاب المسجلين.</p>
                </div>
                <button onclick="CoordinatorPortal.openAddGroupModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center">
                    <i data-lucide="plus-circle" class="w-4 h-4 ml-1.5"></i>
                    إنشاء مجموعة / ميعاد جديد
                </button>
            </div>

            <!-- Groups Table -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">اسم المجموعة والمادة</th>
                                <th class="p-3">المرحلة</th>
                                <th class="p-3">اليوم والتوقيت</th>
                                <th class="p-3">المعلمة</th>
                                <th class="p-3">المكان</th>
                                <th class="p-3">الاشتراك</th>
                                <th class="p-3">الطلاب المسجلين</th>
                                <th class="p-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${groups.map(g => `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3">
                                        <div class="font-extrabold text-slate-900">${g.name}</div>
                                        <div class="text-[11px] text-indigo-600 font-semibold">${g.subjectName}</div>
                                    </td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded-md font-bold text-[11px] ${g.stage === 'kg' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                                            ${g.grade}
                                        </span>
                                    </td>
                                    <td class="p-3">
                                        <div class="font-bold text-slate-800">${g.day}</div>
                                        <div class="text-slate-500 font-mono text-[11px]">${g.time}</div>
                                    </td>
                                    <td class="p-3 text-slate-700 font-semibold">${g.teacher}</td>
                                    <td class="p-3 text-slate-600">${g.location}</td>
                                    <td class="p-3 font-bold font-mono text-slate-800">${g.monthlyFee} ج</td>
                                    <td class="p-3">
                                        <div class="flex items-center space-x-1.5 space-x-reverse">
                                            <span class="font-bold ${g.studentIds.length >= g.maxCapacity ? 'text-rose-600' : 'text-emerald-600'}">
                                                ${g.studentIds.length} / ${g.maxCapacity}
                                            </span>
                                            <button onclick="CoordinatorPortal.openGroupDetails('${g.id}')" class="text-xs text-indigo-600 hover:underline mr-1 font-semibold">
                                                [إدارة]
                                            </button>
                                        </div>
                                    </td>
                                    <td class="p-3">
                                        <div class="flex items-center space-x-1 space-x-reverse">
                                            <button onclick="CoordinatorPortal.openAttendanceModal('${g.id}')" class="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg" title="تحضير الحصة">
                                                <i data-lucide="check-square" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="CoordinatorPortal.openAssignStudentModal('${g.id}')" class="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg" title="إضافة طالب للمجموعة">
                                                <i data-lucide="user-plus" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="CoordinatorPortal.deleteGroup('${g.id}')" class="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg" title="حذف المجموعة">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // 3. Attendance Manager Tab (تسجيل الحضور والغياب)
    renderAttendanceTab({ groups, students }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">تحضير الحصص وتسجيل الحضور والغياب</h3>
                    <p class="text-xs text-slate-500 mt-1">اختر المجموعة واليوم لتسجيل الحضور، تسليم الواجب، وإضافة ملاحظات مس مارينا للطالب وولي أمره.</p>
                </div>
            </div>

            <!-- Group Selection for Attendance -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${groups.map(g => {
                    const groupStudents = students.filter(s => g.studentIds.includes(s.id));
                    return `
                    <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:border-indigo-400 transition flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold px-2 py-0.5 rounded-md ${g.subject === 'math' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}">
                                    ${g.subjectName}
                                </span>
                                <span class="text-xs font-bold text-slate-500">${g.day}</span>
                            </div>
                            <h4 class="font-black text-slate-900 mt-2 text-base">${g.name}</h4>
                            <div class="mt-2 text-xs text-slate-600 space-y-1">
                                <div>🕒 ${g.time}</div>
                                <div>👥 عدد الطلاب في المجموعة: <strong>${groupStudents.length} طلاب</strong></div>
                            </div>
                        </div>

                        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <button onclick="CoordinatorPortal.openAttendanceModal('${g.id}')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center">
                                <i data-lucide="check-square" class="w-4 h-4 ml-1.5"></i>
                                تسجيل حضور هذه المجموعة
                            </button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>

            <!-- Recent Attendance Log -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-200">
                    <h4 class="font-bold text-slate-800 text-sm">سجل آخر الحصص المسجلة بالسنتر</h4>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">اسم الطالب</th>
                                <th class="p-3">التاريخ واليوم</th>
                                <th class="p-3">عنوان الحصة</th>
                                <th class="p-3">حالة الحضور</th>
                                <th class="p-3">الواجب</th>
                                <th class="p-3">الملاحظات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${Store.getAttendance().slice(0, 10).map(att => {
                                const st = Store.getStudentById(att.studentId) || { studentName: "طالب" };
                                return `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3 font-bold text-slate-900">${st.studentName}</td>
                                    <td class="p-3 font-mono text-slate-700">${att.date} (${att.dayName || ''})</td>
                                    <td class="p-3 text-slate-800 font-semibold">${att.sessionTitle}</td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded-full font-bold text-[11px] ${att.status === 'attended' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                                            ${att.status === 'attended' ? 'حضر ✓' : 'غياب'}
                                        </span>
                                    </td>
                                    <td class="p-3 font-bold ${att.homeworkDone ? 'text-emerald-600' : 'text-slate-400'}">
                                        ${att.homeworkDone ? 'تم التسليم ✓' : 'لم يسلم'}
                                    </td>
                                    <td class="p-3 text-slate-500">${att.notes || '-'}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // 4. Make-up Sessions Manager Tab
    renderMakeupTab({ makeupRequests, makeupSlots }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">إدارة طلبات الحصص التعويضية والمواعيد البديلة</h3>
                    <p class="text-xs text-slate-500 mt-1">مراجعة طلبات أولياء الأمور للاعتذار عن الحصص واختيار مواعيد بديلة لمس مارينا.</p>
                </div>
                <button onclick="CoordinatorPortal.openAddMakeupSlotModal()" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center">
                    <i data-lucide="plus-circle" class="w-4 h-4 ml-1.5"></i>
                    إضافة موعد تعويضي متاح لمس مارينا
                </button>
            </div>

            <!-- Pending Requests Table -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="p-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
                    <h4 class="font-extrabold text-purple-900 text-sm">طلبات أولياء الأمور للتعويض (${makeupRequests.length})</h4>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">اسم الطالب والمرحلة</th>
                                <th class="p-3">المادة</th>
                                <th class="p-3">الموعد البديل المطلوب</th>
                                <th class="p-3">سبب الاعتذار</th>
                                <th class="p-3">الحالة</th>
                                <th class="p-3">هاتف ولي الأمر</th>
                                <th class="p-3">إجراء الكوردينيتور</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${makeupRequests.map(req => `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3">
                                        <div class="font-extrabold text-slate-900">${req.studentName}</div>
                                        <div class="text-[11px] text-slate-500">${req.grade}</div>
                                    </td>
                                    <td class="p-3 font-bold text-slate-800">${req.subject}</td>
                                    <td class="p-3">
                                        <div class="font-bold text-purple-800">${req.targetTime}</div>
                                        <div class="text-[11px] font-mono text-slate-500">${req.targetDate}</div>
                                    </td>
                                    <td class="p-3 text-slate-600 max-w-xs truncate">${req.reason}</td>
                                    <td class="p-3">
                                        <span class="px-2.5 py-1 rounded-full font-bold text-[11px] ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                                            ${req.status === 'approved' ? 'معتمد ✓' : req.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
                                        </span>
                                    </td>
                                    <td class="p-3 font-mono text-slate-700">${req.phone}</td>
                                    <td class="p-3">
                                        <div class="flex items-center space-x-1.5 space-x-reverse">
                                            ${req.status !== 'approved' ? `
                                                <button onclick="CoordinatorPortal.approveMakeup('${req.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs">
                                                    اعتماد
                                                </button>
                                            ` : ''}
                                            <button onclick="CoordinatorPortal.rejectMakeup('${req.id}')" class="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-[11px]">
                                                تعديل / رد
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Makeup Slots Available -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-bold text-slate-800 text-base">المواعيد الشاغرة المتاحة للحصص التعويضية مع مس مارينا</h4>
                    <span class="text-xs text-slate-500">${makeupSlots.length} مواعيد معلنة</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${makeupSlots.map(slot => `
                        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold px-2 py-0.5 rounded-md ${slot.subject === 'math' ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}">
                                        ${slot.subject === 'math' ? 'ماث' : 'إنجليزي'}
                                    </span>
                                    <span class="text-xs font-bold text-slate-500 font-mono">${slot.date}</span>
                                </div>
                                <h5 class="font-bold text-slate-900 mt-2 text-sm">${slot.grade}</h5>
                                <div class="text-xs text-slate-600 mt-1 font-semibold">${slot.day}: ${slot.time}</div>
                                <div class="text-[11px] text-slate-500 mt-1">${slot.note || ''}</div>
                            </div>
                            <div class="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                                <span class="text-xs font-bold ${slot.availableSeats > 0 ? 'text-emerald-700' : 'text-rose-600'}">
                                    شاغر: ${slot.availableSeats} / ${slot.maxSeats}
                                </span>
                                <button onclick="CoordinatorPortal.deleteMakeupSlot('${slot.id}')" class="text-rose-600 hover:text-rose-800 p-1" title="حذف الموعد">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    },

    // 5. Payments Manager Tab
    renderPaymentsTab({ payments }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">متابعة الاشتراكات والمدفوعات</h3>
                    <p class="text-xs text-slate-500 mt-1">تأكيد تحويلات فودافون كاش وإنستاباي والبنك، وتحديث حالة دفع كل طالب.</p>
                </div>
            </div>

            <!-- Invoices / Transactions Table -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">اسم الطالب</th>
                                <th class="p-3">الشهر</th>
                                <th class="p-3">المبلغ</th>
                                <th class="p-3">وسيلة الدفع</th>
                                <th class="p-3">رقم المرجع / المحفظة</th>
                                <th class="p-3">الحالة</th>
                                <th class="p-3">تاريخ الدفع / الملاحظات</th>
                                <th class="p-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${payments.map(p => `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3 font-extrabold text-slate-900">${p.studentName}</td>
                                    <td class="p-3 font-bold text-slate-700">${p.month}</td>
                                    <td class="p-3 font-bold font-mono text-sm text-slate-900">${p.amount} ج</td>
                                    <td class="p-3 font-semibold text-slate-700">
                                        ${p.method === 'vodafone_cash' ? '📱 فودافون كاش' : p.method === 'instapay' ? '⚡ إنستاباي' : p.method === 'bank' ? '🏦 بنكي' : '💵 كاش'}
                                    </td>
                                    <td class="p-3 font-mono text-slate-700">${p.referenceNumber || '-'}</td>
                                    <td class="p-3">
                                        <span class="px-2.5 py-1 rounded-full font-bold text-[11px] ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : p.status === 'pending_review' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                                            ${p.status === 'paid' ? 'مدفوع ومؤكد ✓' : p.status === 'pending_review' ? 'قيد المراجعة ⏳' : 'لم يسدد'}
                                        </span>
                                    </td>
                                    <td class="p-3 text-slate-500">
                                        <div>${p.paymentDate || '-'}</div>
                                        <div class="text-[11px] text-slate-400">${p.notes || ''}</div>
                                    </td>
                                    <td class="p-3">
                                        <div class="flex items-center space-x-1.5 space-x-reverse">
                                            ${p.status !== 'paid' ? `
                                                <button onclick="CoordinatorPortal.confirmPayment('${p.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs">
                                                    تأكيد الاستلام ✓
                                                </button>
                                            ` : `
                                                <span class="text-emerald-600 font-bold text-xs">معتمد</span>
                                            `}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // 6. Messages & Inquiries Center Tab
    renderMessagesTab({ students, messages }) {
        const selectedStudentId = CoordinatorPortal.activeChatStudentId || (students[0] ? students[0].id : null);
        const selectedStudent = Store.getStudentById(selectedStudentId);
        const currentStudentMessages = selectedStudentId ? Store.getMessages(selectedStudentId) : [];

        return `
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[650px]">
            
            <!-- Left: Students / Conversations List -->
            <div class="border-l border-slate-200 flex flex-col h-full bg-slate-50/50">
                <div class="p-4 border-b border-slate-200 bg-white">
                    <h4 class="font-extrabold text-slate-800 text-sm">محادثات أولياء الأمور</h4>
                    <p class="text-xs text-slate-500">اختر ولي الأمر للرد عليه مباشرة</p>
                </div>

                <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
                    ${students.map(st => {
                        const studentMsgs = messages.filter(m => m.studentId === st.id);
                        const lastMsg = studentMsgs[studentMsgs.length - 1];
                        const unread = studentMsgs.filter(m => !m.read && m.sender === 'parent').length;
                        const isSelected = st.id === selectedStudentId;

                        return `
                        <div onclick="CoordinatorPortal.selectChatStudent('${st.id}')" class="p-4 cursor-pointer transition flex items-start space-x-3 space-x-reverse ${isSelected ? 'bg-indigo-50/80 border-r-4 border-indigo-600' : 'hover:bg-slate-100/60'}">
                            <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                ${st.avatar || '👤'}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between">
                                    <h5 class="font-bold text-slate-900 text-xs truncate">${st.studentName}</h5>
                                    ${unread > 0 ? `
                                        <span class="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                                            ${unread}
                                        </span>
                                    ` : ''}
                                </div>
                                <div class="text-[11px] text-slate-500 truncate">${st.name}</div>
                                <div class="text-[11px] text-slate-400 truncate mt-1">
                                    ${lastMsg ? lastMsg.text : 'لا توجد رسائل'}
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Right: Active Chat Window -->
            <div class="md:col-span-2 flex flex-col h-full bg-white">
                ${selectedStudent ? `
                    <!-- Chat Header -->
                    <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
                                ${selectedStudent.avatar || '👦'}
                            </div>
                            <div>
                                <h4 class="font-extrabold text-slate-800 text-sm">${selectedStudent.studentName} (${selectedStudent.grade})</h4>
                                <div class="text-xs text-slate-500">ولي الأمر: ${selectedStudent.name} • هاتف: <span class="font-mono">${selectedStudent.phone}</span></div>
                            </div>
                        </div>
                        <button onclick="CoordinatorPortal.openStudentProfile('${selectedStudent.id}')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg bg-indigo-50">
                            ملف الطالب
                        </button>
                    </div>

                    <!-- Messages Stream -->
                    <div id="coordinator-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                        ${currentStudentMessages.length > 0 ? currentStudentMessages.map(msg => `
                            <div class="flex flex-col ${msg.sender === 'coordinator' ? 'items-start' : 'items-end'}">
                                <div class="max-w-md p-3.5 rounded-2xl text-xs md:text-sm ${msg.sender === 'coordinator' ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'}">
                                    <div class="font-bold text-[10px] mb-1 ${msg.sender === 'coordinator' ? 'text-indigo-200' : 'text-slate-400'}">
                                        ${msg.sender === 'coordinator' ? 'أنت (الكوردينيتور)' : 'ولي الأمر: ' + (msg.parentName || '')}
                                    </div>
                                    <p class="whitespace-pre-wrap leading-relaxed">${msg.text}</p>
                                </div>
                                <span class="text-[10px] text-slate-400 mt-1 px-1 font-mono">${msg.timestamp}</span>
                            </div>
                        `).join('') : `
                            <div class="p-8 text-center text-slate-400 text-xs">
                                لا توجد رسائل بعد مع هذا الطالب.
                            </div>
                        `}
                    </div>

                    <!-- Send Input Box -->
                    <div class="p-3 border-t border-slate-200 bg-white">
                        <form onsubmit="CoordinatorPortal.handleSendReply(event, '${selectedStudent.id}')" class="flex items-center space-x-2 space-x-reverse">
                            <input type="text" id="coord-chat-input" placeholder="اكتب ردك لولي الأمر هنا..." required class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <button type="submit" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs md:text-sm transition flex items-center shadow-md">
                                <span>إرسال الرد</span>
                                <i data-lucide="send" class="w-4 h-4 mr-1.5"></i>
                            </button>
                        </form>
                    </div>
                ` : `
                    <div class="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
                        يرجى اختيار طالب من القائمة لعرض المحادثة والرد عليه.
                    </div>
                `}
            </div>

        </div>
        `;
    },

    // 7. Registrations Tab
    renderRegistrationsTab({ registrations }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">طلبات الالتحاق والتسجيل الجديدة</h3>
                    <p class="text-xs text-slate-500 mt-1">الطلبات المقدمة عبر نموذج التسجيل على المنصة بانتظار التواصل وتسكين المجموعات.</p>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">اسم الطالب وولي الأمر</th>
                                <th class="p-3">رقم الهاتف / واتساب</th>
                                <th class="p-3">المرحلة</th>
                                <th class="p-3">المواد المطلوبة</th>
                                <th class="p-3">الأيام المفضلة</th>
                                <th class="p-3">تاريخ الطلب</th>
                                <th class="p-3">الحالة</th>
                                <th class="p-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${registrations.map(reg => `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3">
                                        <div class="font-extrabold text-slate-900">${reg.studentName}</div>
                                        <div class="text-[11px] text-slate-500">${reg.parentName}</div>
                                    </td>
                                    <td class="p-3 font-mono text-slate-800 font-bold">${reg.phone}</td>
                                    <td class="p-3 font-bold">${reg.grade}</td>
                                    <td class="p-3 text-indigo-700 font-semibold">${reg.subjects.join(' + ')}</td>
                                    <td class="p-3 text-slate-600">${reg.preferredDays.join(', ')}</td>
                                    <td class="p-3 text-slate-500 font-mono text-[11px]">${reg.createdAt}</td>
                                    <td class="p-3">
                                        <span class="px-2.5 py-1 rounded-full font-bold text-[11px] ${reg.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                            ${reg.status === 'accepted' ? 'تم القبول والتسكين ✓' : 'جديد قيد التواصل'}
                                        </span>
                                    </td>
                                    <td class="p-3">
                                        <div class="flex items-center space-x-1.5 space-x-reverse">
                                            <a href="https://wa.me/2${reg.phone}" target="_blank" class="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center">
                                                واتساب
                                            </a>
                                            <button onclick="CoordinatorPortal.acceptRegistration('${reg.id}')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px]">
                                                تسكين بمجموعة
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // ---------------- Action Handlers ---------------- //

    selectChatStudent(studentId) {
        CoordinatorPortal.activeChatStudentId = studentId;
        Store.markMessagesAsRead(studentId);
        App.render();
    },

    handleSendReply(e, studentId) {
        e.preventDefault();
        const input = document.getElementById("coord-chat-input");
        if (!input || !input.value.trim()) return;

        Store.sendMessage({
            studentId,
            sender: "coordinator",
            text: input.value.trim()
        });

        input.value = "";
        App.render();
        CommonUI.toast("تم إرسال رد الكوردينيتور لولي الأمر بنجاح", "success");

        setTimeout(() => {
            const chatBox = document.getElementById("coordinator-chat-messages");
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 50);
    },

    confirmPayment(paymentId) {
        Store.confirmPayment(paymentId, "paid", "تمت مراجعة التحويل واعتماده بنجاح");
        CommonUI.toast("تم اعتماد وتأكيد استلام الدفعة بنجاح", "success");
        App.render();
    },

    approveMakeup(requestId) {
        Store.updateMakeupRequestStatus(requestId, "approved", "تم اعتماد طلب الحصة التعويضية وتأكيد المقعد مع مس مارينا");
        CommonUI.toast("تم اعتماد الحصة التعويضية بنجاح", "success");
        App.render();
    },

    rejectMakeup(requestId) {
        const note = prompt("اكتب سبباً أو ملاحظة لولي الأمر (مثال: هذا الموعد اكتمل بالكامل، يرجى اختيار موعد آخر):");
        if (note !== null) {
            Store.updateMakeupRequestStatus(requestId, "rejected", note || "عفواً، الموعد غير متاح");
            CommonUI.toast("تم تحديث حالة الطلب وإرسال الملاحظة لولي الأمر", "info");
            App.render();
        }
    },

    deleteMakeupSlot(id) {
        if (confirm("هل أنت متأكد من حذف هذا الميعاد التعويضي؟")) {
            Store.deleteMakeupSlot(id);
            CommonUI.toast("تم حذف الموعد بنجاح", "info");
            App.render();
        }
    },

    deleteGroup(id) {
        if (confirm("هل أنت متأكد من حذف هذه المجموعة؟ سيتم إزالة الطلاب منها.")) {
            Store.deleteGroup(id);
            CommonUI.toast("تم حذف المجموعة بنجاح", "info");
            App.render();
        }
    },

    openAddGroupModal() {
        const content = `
        <form onsubmit="CoordinatorPortal.submitAddGroup(event)" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم المجموعة / الكود:</label>
                <input type="text" id="grp-name" placeholder="مثال: ماث - الصف الثالث (مجموعة السبت)" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المادة:</label>
                    <select id="grp-subject" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <option value="math">Math (ماث)</option>
                        <option value="english">English (لغة إنجليزية)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                    <select id="grp-grade" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
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

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">اليوم:</label>
                    <select id="grp-day" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <option value="السبت">السبت</option>
                        <option value="الأحد">الأحد</option>
                        <option value="الاثنين">الاثنين</option>
                        <option value="الثلاثاء">الثلاثاء</option>
                        <option value="الأربعاء">الأربعاء</option>
                        <option value="الخميس">الخميس</option>
                        <option value="الجمعة">الجمعة</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">التوقيت:</label>
                    <input type="text" id="grp-time" placeholder="مثال: 04:00 م - 05:30 م" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">أقصى سعة طلاب:</label>
                    <input type="number" id="grp-capacity" value="12" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">الاشتراك الشهري (ج):</label>
                    <input type="number" id="grp-fee" value="450" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">مكان الحصة (القاعة / الفرع):</label>
                <input type="text" id="grp-location" value="قاعة 1 (السنتر الرئيسي)" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs">
            </div>

            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md">
                    حفظ المجموعة
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal("إضافة ميعاد / مجموعة جديدة", content);
    },

    submitAddGroup(e) {
        e.preventDefault();
        const name = document.getElementById("grp-name").value;
        const subject = document.getElementById("grp-subject").value;
        const grade = document.getElementById("grp-grade").value;
        const day = document.getElementById("grp-day").value;
        const time = document.getElementById("grp-time").value;
        const maxCapacity = parseInt(document.getElementById("grp-capacity").value);
        const monthlyFee = parseFloat(document.getElementById("grp-fee").value);
        const location = document.getElementById("grp-location").value;

        Store.addGroup({
            name,
            subject,
            subjectName: subject === 'math' ? 'Math (ماث)' : 'English (إنجليزي)',
            grade,
            stage: grade.includes("KG") ? "kg" : "primary",
            day,
            time,
            maxCapacity,
            monthlyFee,
            location
        });

        CommonUI.closeModal();
        CommonUI.toast("تم إنشاء المجموعة وإضافتها للجدول بنجاح", "success");
        App.render();
    },

    openAddStudentModal() {
        const content = `
        <form onsubmit="CoordinatorPortal.submitAddStudent(event)" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم الطالب الرباعي:</label>
                <input type="text" id="std-name" placeholder="مثال: يوسف أحمد إبراهيم" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم ولي الأمر:</label>
                <input type="text" id="std-parent" placeholder="مثال: أحمد إبراهيم" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / واتساب:</label>
                    <input type="text" id="std-phone" placeholder="010xxxxxxxx" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                    <select id="std-grade" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
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

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">المواد المسجل بها مع مس مارينا:</label>
                <div class="flex items-center space-x-4 space-x-reverse pt-1">
                    <label class="flex items-center text-xs font-bold text-slate-800">
                        <input type="checkbox" id="std-sub-math" value="math" checked class="ml-2 rounded text-indigo-600">
                        Math (ماث)
                    </label>
                    <label class="flex items-center text-xs font-bold text-slate-800">
                        <input type="checkbox" id="std-sub-eng" value="english" checked class="ml-2 rounded text-indigo-600">
                        English (إنجليزي)
                    </label>
                </div>
            </div>

            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md">
                    إنشاء حساب الطالب
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal("تسجيل طالب جديد بالسنتر", content);
    },

    submitAddStudent(e) {
        e.preventDefault();
        const studentName = document.getElementById("std-name").value;
        const parentName = document.getElementById("std-parent").value;
        const phone = document.getElementById("std-phone").value;
        const grade = document.getElementById("std-grade").value;
        const hasMath = document.getElementById("std-sub-math").checked;
        const hasEng = document.getElementById("std-sub-eng").checked;

        const subjects = [];
        if (hasMath) subjects.push("math");
        if (hasEng) subjects.push("english");

        const res = Store.registerParentStudent({
            parentName,
            studentName,
            phone,
            password: "123",
            grade,
            subjects
        });

        CommonUI.closeModal();
        CommonUI.toast(`تم تسجيل الطالب بنجاح! اسم المستخدم: ${res.credentials.username} وكلمة المرور: 123`, "success");
        App.render();
    },

    openAttendanceModal(groupId) {
        const group = Store.getGroups().find(g => g.id === groupId);
        if (!group) return;
        const students = Store.getStudents().filter(s => group.studentIds.includes(s.id));

        const content = `
        <form onsubmit="CoordinatorPortal.submitAttendance(event, '${group.id}')" class="space-y-4 text-right">
            <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div class="font-bold text-indigo-900 text-xs">${group.name}</div>
                <div class="text-[11px] text-indigo-700">${group.day} - ${group.time}</div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">تاريخ الحصة:</label>
                    <input type="date" id="att-date" value="${new Date().toISOString().split('T')[0]}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">عنوان الدرس / الحصة:</label>
                    <input type="text" id="att-topic" value="درس اليوم ومتابعة الواجب" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-2">قائمة طلاب المجموعة:</label>
                ${students.length > 0 ? `
                    <div class="space-y-3 max-h-60 overflow-y-auto p-1">
                        ${students.map(st => `
                            <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                                <div>
                                    <span class="font-bold text-slate-900 text-xs">${st.studentName}</span>
                                    <span class="text-[10px] text-slate-500 block">${st.name}</span>
                                </div>
                                <div class="flex items-center space-x-2 space-x-reverse">
                                    <select id="att-st-${st.id}" class="p-1.5 rounded-lg border border-slate-300 text-xs font-bold">
                                        <option value="attended">حضر الحصة ✓</option>
                                        <option value="absent">غياب ✗</option>
                                    </select>
                                    <label class="text-[11px] flex items-center mr-2 font-semibold">
                                        <input type="checkbox" id="hw-st-${st.id}" checked class="ml-1">
                                        الواجب
                                    </label>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                        لا يوجد طلاب مسكنين في هذه المجموعة حالياً.
                    </div>
                `}
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظة عامة للحصة (تظهر لأولياء الأمور):</label>
                <input type="text" id="att-general-note" placeholder="مثال: تم شرح الوحدة بالكامل وتسليم شيت التمارين..." class="w-full p-2.5 rounded-xl border border-slate-200 text-xs">
            </div>

            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md">
                    حفظ سجل الحضور
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal(`تحضير حصة: ${group.name}`, content);
    },

    submitAttendance(e, groupId) {
        e.preventDefault();
        const group = Store.getGroups().find(g => g.id === groupId);
        const students = Store.getStudents().filter(s => group.studentIds.includes(s.id));
        const date = document.getElementById("att-date").value;
        const topic = document.getElementById("att-topic").value;
        const generalNote = document.getElementById("att-general-note").value;

        students.forEach(st => {
            const statusSelect = document.getElementById(`att-st-${st.id}`);
            const hwCheck = document.getElementById(`hw-st-${st.id}`);
            if (statusSelect) {
                Store.addAttendanceRecord({
                    studentId: st.id,
                    groupId: groupId,
                    date: date,
                    dayName: group.day,
                    sessionTitle: topic,
                    status: statusSelect.value,
                    homeworkDone: hwCheck ? hwCheck.checked : false,
                    notes: generalNote
                });
            }
        });

        CommonUI.closeModal();
        CommonUI.toast("تم تسجيل حضور الحصة بنجاح وحفظها في سجل الطلاب", "success");
        App.render();
    },

    openAssignStudentModal(groupId) {
        const group = Store.getGroups().find(g => g.id === groupId);
        const allStudents = Store.getStudents();
        const unassigned = allStudents.filter(s => !group.studentIds.includes(s.id));

        const content = `
        <div class="space-y-4 text-right">
            <p class="text-xs text-slate-600">اختر طالباً لتسكينه في مجموعة: <strong>${group.name}</strong></p>

            ${unassigned.length > 0 ? `
                <div class="space-y-2 max-h-60 overflow-y-auto">
                    ${unassigned.map(s => `
                        <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div>
                                <span class="font-bold text-slate-900 text-xs">${s.studentName}</span>
                                <span class="text-[10px] text-slate-500 block">${s.grade} • ${s.phone}</span>
                            </div>
                            <button onclick="CoordinatorPortal.assignStudent('${s.id}', '${group.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold">
                                تسكين هنا +
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="p-4 text-center text-slate-400 text-xs">
                    جميع الطلاب مسجلين بالفعل أو لا يوجد طلاب متاحين.
                </div>
            `}
        </div>
        `;

        CommonUI.openModal("إضافة طالب إلى المجموعة", content);
    },

    assignStudent(studentId, groupId) {
        Store.assignStudentToGroup(studentId, groupId);
        CommonUI.closeModal();
        CommonUI.toast("تم تسكين الطالب في المجموعة بنجاح", "success");
        App.render();
    },

    openGroupDetails(groupId) {
        const group = Store.getGroups().find(g => g.id === groupId);
        const students = Store.getStudents().filter(s => group.studentIds.includes(s.id));

        const content = `
        <div class="space-y-4 text-right">
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div>المجموعة: <strong class="text-slate-900">${group.name}</strong></div>
                <div>الموعد: <strong>${group.day} (${group.time})</strong></div>
                <div>المكان: <strong>${group.location}</strong></div>
                <div>السعة: <strong>${students.length} / ${group.maxCapacity}</strong></div>
            </div>

            <h5 class="font-bold text-slate-800 text-xs">الطلاب المسجلين (${students.length}):</h5>

            ${students.length > 0 ? `
                <div class="space-y-2">
                    ${students.map(s => `
                        <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                                <div class="font-bold text-slate-900 text-xs">${s.studentName}</div>
                                <div class="text-[10px] text-slate-500">${s.name} • ${s.phone}</div>
                            </div>
                            <button onclick="CoordinatorPortal.removeStudentFromGroup('${s.id}', '${group.id}')" class="text-xs text-rose-600 hover:text-rose-800 font-bold">
                                إزالة من المجموعة
                            </button>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="p-4 text-center text-slate-400 text-xs">لا يوجد طلاب في هذه المجموعة بعد.</div>
            `}
        </div>
        `;

        CommonUI.openModal(`تفاصيل المجموعة: ${group.name}`, content);
    },

    removeStudentFromGroup(studentId, groupId) {
        if (confirm("هل أنت متأكد من إزالة الطالب من هذه المجموعة؟")) {
            Store.removeStudentFromGroup(studentId, groupId);
            CommonUI.closeModal();
            CommonUI.toast("تمت إزالة الطالب من المجموعة", "info");
            App.render();
        }
    },

    openAddMakeupSlotModal() {
        const content = `
        <form onsubmit="CoordinatorPortal.submitAddMakeupSlot(event)" class="space-y-4 text-right">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المادة:</label>
                    <select id="mks-subject" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <option value="math">Math (ماث)</option>
                        <option value="english">English (إنجليزي)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                    <select id="mks-grade" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
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

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">اليوم:</label>
                    <select id="mks-day" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <option value="السبت">السبت</option>
                        <option value="الأحد">الأحد</option>
                        <option value="الاثنين">الاثنين</option>
                        <option value="الثلاثاء">الثلاثاء</option>
                        <option value="الأربعاء">الأربعاء</option>
                        <option value="الخميس">الخميس</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">التاريخ:</label>
                    <input type="date" id="mks-date" value="${new Date().toISOString().split('T')[0]}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">التوقيت:</label>
                    <input type="text" id="mks-time" placeholder="مثال: 05:00 م - 06:30 م" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">عدد المقاعد الشاغرة:</label>
                    <input type="number" id="mks-seats" value="4" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">ملاحظة / تفاصيل الحصة:</label>
                <input type="text" id="mks-note" placeholder="مثال: مراجعة وحل تدريبات مع مس مارينا" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs">
            </div>

            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md">
                    إضافة الموعد التعويضي
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal("إضافة موعد تعويضي متاح لمس مارينا", content);
    },

    submitAddMakeupSlot(e) {
        e.preventDefault();
        const subject = document.getElementById("mks-subject").value;
        const grade = document.getElementById("mks-grade").value;
        const day = document.getElementById("mks-day").value;
        const date = document.getElementById("mks-date").value;
        const time = document.getElementById("mks-time").value;
        const maxSeats = parseInt(document.getElementById("mks-seats").value);
        const note = document.getElementById("mks-note").value;

        Store.addMakeupSlot({
            subject,
            grade,
            day,
            date,
            time,
            maxSeats,
            availableSeats: maxSeats,
            note
        });

        CommonUI.closeModal();
        CommonUI.toast("تمت إضافة الموعد التعويضي بنجاح وسيظهر لأولياء الأمور", "success");
        App.render();
    },

    acceptRegistration(regId) {
        const reg = Store.getRegistrations().find(r => r.id === regId);
        if (!reg) return;

        Store.updateRegistrationStatus(regId, "accepted", "تم قبول الطالب والتواصل لتحديد المجموعة");
        CommonUI.toast("تم تحديث حالة طلب الالتحاق", "success");
        App.render();
    }
};

window.CoordinatorPortal = CoordinatorPortal;
