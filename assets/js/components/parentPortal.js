/**
 * Parent & Student Portal Components (منظور ولي الأمر والطالب)
 */
const ParentPortal = {
    render(currentTab = "dashboard") {
        const user = Store.getCurrentUser();
        if (!user || user.role !== "parent") {
            return `<div class="p-8 text-center text-slate-500">يرجى تسجيل الدخول كولي أمر لعرض هذه الصفحة.</div>`;
        }

        const student = user;
        const myGroups = Store.getGroups().filter(g => (student.groupIds || []).includes(g.id));
        const myAttendance = Store.getAttendance(student.id);
        const myPayments = Store.getPayments(student.id);
        const myMakeupRequests = Store.getMakeupRequests(student.id);
        const myMessages = Store.getMessages(student.id);

        return `
        <div class="space-y-6 pb-20">
            <!-- Top Parent Banner -->
            <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div class="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl md:text-4xl shadow-inner border border-white/30">
                            ${student.avatar || '👦'}
                        </div>
                        <div>
                            <div class="flex items-center space-x-2 space-x-reverse flex-wrap">
                                <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">${student.studentName}</h2>
                                <span class="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm border border-white/20">
                                    ${student.grade}
                                </span>
                            </div>
                            <p class="text-emerald-100 text-sm mt-1 font-medium">ولي الأمر: ${student.name} • كود الطالب: <span class="font-mono bg-black/20 px-2 py-0.5 rounded text-xs font-bold">${student.username}</span></p>
                            <div class="flex items-center space-x-2 space-x-reverse mt-2">
                                <span class="text-xs bg-emerald-800/40 text-emerald-100 px-2.5 py-0.5 rounded-lg">
                                    المواد: ${student.subjects.map(s => s === 'math' ? '🔢 ماث (Math)' : '📖 إنجليزي (English)').join(' + ')}
                                </span>
                                <span class="text-xs bg-emerald-800/40 text-emerald-100 px-2.5 py-0.5 rounded-lg">
                                    مع مس مارينا 👩‍🏫
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Action Buttons -->
                    <div class="flex flex-wrap items-center gap-2">
                        <button onclick="ParentPortal.openMakeupModal()" class="px-4 py-2.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold text-xs md:text-sm shadow-md transition flex items-center">
                            <i data-lucide="refresh-cw" class="w-4 h-4 ml-1.5 text-emerald-600"></i>
                            طلب حصة تعويضية
                        </button>
                        <button onclick="App.navigate('parent-payments')" class="px-4 py-2.5 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs md:text-sm shadow-sm transition border border-white/20 flex items-center">
                            <i data-lucide="credit-card" class="w-4 h-4 ml-1.5"></i>
                            طرق الدفع والاشتراك
                        </button>
                    </div>
                </div>

                <!-- Tabs navigation for desktop -->
                <div class="hidden md:flex items-center space-x-2 space-x-reverse mt-6 pt-6 border-t border-white/20 text-sm font-bold">
                    <button onclick="App.navigate('dashboard')" class="px-4 py-2 rounded-xl transition ${currentTab === 'dashboard' ? 'bg-white text-emerald-800 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        نظرة عامة
                    </button>
                    <button onclick="App.navigate('parent-schedule')" class="px-4 py-2 rounded-xl transition ${currentTab === 'parent-schedule' ? 'bg-white text-emerald-800 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        جدول الحصص والمواعيد
                    </button>
                    <button onclick="App.navigate('parent-attendance')" class="px-4 py-2 rounded-xl transition ${currentTab === 'parent-attendance' ? 'bg-white text-emerald-800 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        سجل الحضور والغياب
                    </button>
                    <button onclick="App.navigate('parent-payments')" class="px-4 py-2 rounded-xl transition ${currentTab === 'parent-payments' ? 'bg-white text-emerald-800 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        المصروفات ووسائل الدفع
                    </button>
                    <button onclick="App.navigate('parent-makeup')" class="px-4 py-2 rounded-xl transition ${currentTab === 'parent-makeup' ? 'bg-white text-emerald-800 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        الحصص التعويضية (${myMakeupRequests.length})
                    </button>
                    <button onclick="App.navigate('parent-chat')" class="px-4 py-2 rounded-xl transition relative ${currentTab === 'parent-chat' ? 'bg-white text-emerald-800 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        محادثة الكوردينيتور
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div>
                ${this.renderActiveTab(currentTab, { student, myGroups, myAttendance, myPayments, myMakeupRequests, myMessages })}
            </div>
        </div>
        `;
    },

    renderActiveTab(tab, data) {
        switch (tab) {
            case "parent-schedule":
                return this.renderScheduleTab(data);
            case "parent-attendance":
                return this.renderAttendanceTab(data);
            case "parent-payments":
                return this.renderPaymentsTab(data);
            case "parent-makeup":
                return this.renderMakeupTab(data);
            case "parent-chat":
                return this.renderChatTab(data);
            case "dashboard":
            default:
                return this.renderDashboardTab(data);
        }
    },

    // 1. Dashboard Overview Tab
    renderDashboardTab({ student, myGroups, myAttendance, myPayments, myMakeupRequests, myMessages }) {
        const attendedCount = myAttendance.filter(a => a.status === 'attended').length;
        const absentCount = myAttendance.filter(a => a.status === 'absent' || a.status === 'makeup_requested').length;
        const latestPayment = myPayments[0] || null;
        const upcomingSession = myAttendance.find(a => a.status === 'upcoming') || {
            dayName: "السبت القادم",
            date: "2026-10-24",
            sessionTitle: "حصة الماث الأسبوعية",
            notes: "حسب جدول المجموعات المسجل به"
        };

        return `
        <div class="space-y-6">
            <!-- 3 Summary Highlight Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Card 1: My Schedule / Groups -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">المجموعات المسجلة</span>
                        <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <i data-lucide="book-open" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${myGroups.length} <span class="text-sm font-medium text-slate-500">مجموعات</span></div>
                        <p class="text-xs text-indigo-600 mt-1 font-semibold">${myGroups.map(g => g.day).join(' و ')}</p>
                    </div>
                </div>

                <!-- Card 2: Attendance Status -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">حالة الحضور</span>
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <i data-lucide="check-circle" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${attendedCount} <span class="text-sm font-medium text-slate-500">حصة حضرها</span></div>
                        <p class="text-xs text-slate-500 mt-1">الغياب: <span class="text-rose-600 font-bold">${absentCount}</span> • تعويضي: <span class="text-amber-600 font-bold">${myMakeupRequests.length}</span></p>
                    </div>
                </div>

                <!-- Card 3: Payment Status -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">حالة الاشتراك والمصاريف</span>
                        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <i data-lucide="wallet" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        ${latestPayment ? `
                            <div class="flex items-center space-x-2 space-x-reverse">
                                <span class="text-lg font-black ${latestPayment.status === 'paid' ? 'text-emerald-600' : latestPayment.status === 'pending_review' ? 'text-amber-600' : 'text-rose-600'}">
                                    ${latestPayment.status === 'paid' ? 'تم سداد أكتوبر' : latestPayment.status === 'pending_review' ? 'إيصال قيد المراجعة' : 'مطلوب السداد'}
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">${latestPayment.month}: ${latestPayment.amount} ج (${latestPayment.method})</p>
                        ` : `
                            <div class="text-lg font-black text-slate-600">لا توجد فواتير</div>
                        `}
                    </div>
                </div>

                <!-- Card 4: Make-up Status -->
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">الحصص التعويضية</span>
                        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <i data-lucide="refresh-cw" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${myMakeupRequests.filter(r => r.status === 'approved').length} <span class="text-sm font-medium text-purple-600">معتمدة</span></div>
                        <p class="text-xs text-slate-500 mt-1">طلبات معلقة: <span class="text-amber-600 font-bold">${myMakeupRequests.filter(r => r.status === 'pending').length}</span></p>
                    </div>
                </div>

            </div>

            <!-- Next Session & Direct Actions -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Left: Next Session Detail Box -->
                <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <div class="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <i data-lucide="calendar" class="w-5 h-5"></i>
                            </div>
                            <h3 class="font-extrabold text-slate-800 text-lg">الحصة القادمة وجدول الأسبوع</h3>
                        </div>
                        <button onclick="App.navigate('parent-schedule')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                            عرض الجدول كاملاً ←
                        </button>
                    </div>

                    ${myGroups.length > 0 ? `
                        <div class="space-y-3">
                            ${myGroups.map(group => `
                                <div class="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div class="flex items-start space-x-3 space-x-reverse">
                                        <div class="w-12 h-12 rounded-2xl ${group.subject === 'math' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'} flex items-center justify-center text-xl font-bold flex-shrink-0">
                                            ${group.subject === 'math' ? '🧮' : '📖'}
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-slate-900">${group.name}</h4>
                                            <div class="text-xs text-slate-500 flex items-center space-x-3 space-x-reverse mt-1">
                                                <span class="flex items-center text-slate-700 font-medium">
                                                    <i data-lucide="clock" class="w-3.5 h-3.5 ml-1 text-slate-400"></i>
                                                    ${group.day}: ${group.time}
                                                </span>
                                                <span class="flex items-center text-slate-700 font-medium">
                                                    <i data-lucide="map-pin" class="w-3.5 h-3.5 ml-1 text-slate-400"></i>
                                                    ${group.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-2 space-x-reverse">
                                        <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                            أسبوعياً مع مس مارينا
                                        </span>
                                        <button onclick="ParentPortal.openMakeupModal('${group.id}')" class="text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-xs">
                                            اعتذار / تعويض
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p class="text-slate-500 text-sm">لم يتم تعيين مجموعة بعد. الكوردينيتور سيقوم بالتواصل معك لتحديد الميعاد الأنسب.</p>
                            <button onclick="App.navigate('parent-chat')" class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                                تواصل مع الكوردينيتور الآن
                            </button>
                        </div>
                    `}

                    <!-- Need Help Banner -->
                    <div class="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <span class="text-2xl">💡</span>
                            <div>
                                <h5 class="text-xs font-bold text-blue-900">مش هتقدر تحضر الحصة الأساسية؟</h5>
                                <p class="text-[11px] text-blue-700">يمكنك الاعتذار مسبقاً واختيار حصة تعويضية من المواعيد المتاحة لمس مارينا بكل سهولة.</p>
                            </div>
                        </div>
                        <button onclick="ParentPortal.openMakeupModal()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm whitespace-nowrap">
                            حجز تعويض
                        </button>
                    </div>
                </div>

                <!-- Right: Quick Payment Channels -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-2 space-x-reverse">
                                <div class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                    <i data-lucide="credit-card" class="w-5 h-5"></i>
                                </div>
                                <h3 class="font-extrabold text-slate-800 text-lg">طرق دفع السنتر</h3>
                            </div>
                            <span class="text-[10px] bg-slate-100 font-bold text-slate-600 px-2 py-0.5 rounded-md">مباشر</span>
                        </div>

                        <p class="text-xs text-slate-500 mb-4 font-medium">اختر الطريقة الأنسب لك وسجل التحويل لتأكيده فوراً:</p>

                        <div class="space-y-3">
                            <!-- Vodafone Cash -->
                            <div class="p-3 rounded-2xl border border-rose-100 bg-rose-50/50 flex items-center justify-between">
                                <div class="flex items-center space-x-2 space-x-reverse">
                                    <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs">
                                        VF
                                    </div>
                                    <div>
                                        <div class="text-xs font-bold text-slate-800">فودافون كاش</div>
                                        <div class="text-xs font-mono font-bold text-rose-700">${Store.data.centerInfo.payments.vodafoneCash.number}</div>
                                    </div>
                                </div>
                                <button onclick="ParentPortal.copyText('${Store.data.centerInfo.payments.vodafoneCash.number}', 'تم نسخ رقم فودافون كاش')" class="p-1.5 rounded-lg bg-white text-slate-600 hover:text-rose-600 border border-slate-200 shadow-xs" title="نسخ الرقم">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <!-- InstaPay -->
                            <div class="p-3 rounded-2xl border border-purple-100 bg-purple-50/50 flex items-center justify-between">
                                <div class="flex items-center space-x-2 space-x-reverse">
                                    <div class="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xs">
                                        IPN
                                    </div>
                                    <div>
                                        <div class="text-xs font-bold text-slate-800">إنستاباي (InstaPay)</div>
                                        <div class="text-xs font-mono font-bold text-purple-800">${Store.data.centerInfo.payments.instapay.ipa}</div>
                                    </div>
                                </div>
                                <button onclick="ParentPortal.copyText('${Store.data.centerInfo.payments.instapay.ipa}', 'تم نسخ معرف إنستاباي')" class="p-1.5 rounded-lg bg-white text-slate-600 hover:text-purple-600 border border-slate-200 shadow-xs" title="نسخ المعرف">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <!-- Bank Account -->
                            <div class="p-3 rounded-2xl border border-sky-100 bg-sky-50/50 flex items-center justify-between">
                                <div class="flex items-center space-x-2 space-x-reverse">
                                    <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                                        NBE
                                    </div>
                                    <div>
                                        <div class="text-xs font-bold text-slate-800">البنك الأهلي المصري</div>
                                        <div class="text-[11px] font-mono font-bold text-sky-800">${Store.data.centerInfo.payments.bankTransfer.accountNumber}</div>
                                    </div>
                                </div>
                                <button onclick="ParentPortal.copyText('${Store.data.centerInfo.payments.bankTransfer.accountNumber}', 'تم نسخ رقم الحساب البنكي')" class="p-1.5 rounded-lg bg-white text-slate-600 hover:text-sky-600 border border-slate-200 shadow-xs" title="نسخ الرقم">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-100">
                        <button onclick="ParentPortal.openPaymentProofModal()" class="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center">
                            <i data-lucide="upload" class="w-4 h-4 ml-1.5"></i>
                            تسجيل التحويل ورفع الإيصال
                        </button>
                    </div>
                </div>

            </div>
        </div>
        `;
    },

    // 2. Schedule Tab (جدول المواعيد)
    renderScheduleTab({ student, myGroups }) {
        const allGroups = Store.getGroups().filter(g => g.grade === student.grade || g.stage === student.stage);

        return `
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <div>
                    <h3 class="text-xl font-black text-slate-800">مواعيد الحصص الأسبوعية للطالب (${student.studentName})</h3>
                    <p class="text-xs text-slate-500 mt-1">توضح هذه الصفحة المواعيد الأساسية المحجوزة لك مع مس مارينا، والمواعيد الأخرى المتاحة لمرحلتك (${student.grade})</p>
                </div>
                <button onclick="App.navigate('parent-makeup')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center shadow-sm">
                    <i data-lucide="calendar" class="w-4 h-4 ml-1.5"></i>
                    عرض الحصص التعويضية المتاحة
                </button>
            </div>

            <!-- Enrolled Classes -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h4 class="font-bold text-slate-900 text-base mb-4 flex items-center">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2"></span>
                    حصصك الرسمية المسجل بها حالياً:
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${myGroups.map(group => `
                        <div class="p-5 rounded-2xl border-2 ${group.subject === 'math' ? 'border-indigo-100 bg-indigo-50/30' : 'border-pink-100 bg-pink-50/30'} flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold px-2.5 py-1 rounded-lg ${group.subject === 'math' ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}">
                                        ${group.subjectName}
                                    </span>
                                    <span class="text-xs font-bold text-slate-500">حصة أسبوعياً</span>
                                </div>
                                <h5 class="text-lg font-black text-slate-800 mt-3">${group.name}</h5>
                                <div class="mt-3 space-y-1.5 text-xs text-slate-600">
                                    <div class="flex items-center">
                                        <i data-lucide="calendar" class="w-4 h-4 ml-2 text-slate-400"></i>
                                        <span class="font-bold text-slate-800">اليوم:</span> ${group.day}
                                    </div>
                                    <div class="flex items-center">
                                        <i data-lucide="clock" class="w-4 h-4 ml-2 text-slate-400"></i>
                                        <span class="font-bold text-slate-800">التوقيت:</span> ${group.time}
                                    </div>
                                    <div class="flex items-center">
                                        <i data-lucide="user" class="w-4 h-4 ml-2 text-slate-400"></i>
                                        <span class="font-bold text-slate-800">المعلمة:</span> ${group.teacher} (مس مارينا)
                                    </div>
                                    <div class="flex items-center">
                                        <i data-lucide="map-pin" class="w-4 h-4 ml-2 text-slate-400"></i>
                                        <span class="font-bold text-slate-800">المكان:</span> ${group.location}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                                <span class="text-xs text-slate-500">الاشتراك الشهري: <strong class="text-slate-800">${group.monthlyFee} ج</strong></span>
                                <button onclick="ParentPortal.openMakeupModal('${group.id}')" class="px-3 py-1.5 bg-white border border-slate-300 hover:border-purple-600 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-bold transition shadow-xs">
                                    اعتذار وطلب تعويض
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Other groups available for this stage (KG or Primary) -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h4 class="font-bold text-slate-900 text-base mb-2">مواعيد ومجموعات أخرى متوفرة لمرحلتك (${student.grade}):</h4>
                <p class="text-xs text-slate-500 mb-4">إذا كنت ترغب في تغيير ميعادك الأساسي لميعاد آخر، يمكنك مراسلة الكوردينيتور لتعديله فوراً.</p>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">المجموعة والمادة</th>
                                <th class="p-3">اليوم</th>
                                <th class="p-3">التوقيت</th>
                                <th class="p-3">المعلمة</th>
                                <th class="p-3">السعة الاستيعابية</th>
                                <th class="p-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${allGroups.map(g => `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3 font-bold text-slate-800">${g.name}</td>
                                    <td class="p-3 text-slate-700 font-semibold">${g.day}</td>
                                    <td class="p-3 text-slate-600 font-mono">${g.time}</td>
                                    <td class="p-3 text-slate-600">${g.teacher}</td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${g.studentIds.length >= g.maxCapacity ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                                            ${g.studentIds.length} / ${g.maxCapacity} طلاب
                                        </span>
                                    </td>
                                    <td class="p-3">
                                        ${g.studentIds.includes(student.id) ? `
                                            <span class="text-emerald-600 font-bold">مجموعتك الحالية ✓</span>
                                        ` : `
                                            <button onclick="ParentPortal.requestGroupSwitch('${g.id}', '${g.name}')" class="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-indigo-700 rounded-lg font-bold text-[11px] transition">
                                                طلب تحويل هنا
                                            </button>
                                        `}
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

    // 3. Attendance Tab (سجل الحضور والغياب)
    renderAttendanceTab({ student, myAttendance }) {
        const attended = myAttendance.filter(a => a.status === 'attended');
        const absent = myAttendance.filter(a => a.status === 'absent' || a.status === 'makeup_requested');

        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">سجل الحضور والغياب للطفل (${student.studentName})</h3>
                    <p class="text-xs text-slate-500 mt-1">يمكنك متابعة هل تم حضور الحصة وملاحظات مس مارينا وتقييم الواجب المنزلي.</p>
                </div>
                <div class="flex items-center space-x-3 space-x-reverse text-xs font-bold">
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">حضر: ${attended.length}</span>
                    <span class="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800">غاب / اعتذر: ${absent.length}</span>
                </div>
            </div>

            <!-- Attendance List -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 flex justify-between items-center">
                    <span>تفاصيل الحصص السابقة والقادمة</span>
                    <span>إجمالي الحصص المسجلة: ${myAttendance.length}</span>
                </div>

                <div class="divide-y divide-slate-100">
                    ${myAttendance.map(att => {
                        const statusConfig = {
                            attended: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'حضر الحصة ✓', icon: 'check-circle' },
                            absent: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'غياب / اعتذار', icon: 'x-circle' },
                            makeup_requested: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'طلب تعويض', icon: 'refresh-cw' },
                            upcoming: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'حصة قادمة', icon: 'clock' }
                        }[att.status] || { bg: 'bg-slate-50 text-slate-700', text: att.status, icon: 'info' };

                        return `
                        <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                            <div class="flex items-start space-x-3 space-x-reverse">
                                <div class="w-10 h-10 rounded-xl ${statusConfig.bg} border flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="${statusConfig.icon}" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <div class="flex items-center space-x-2 space-x-reverse">
                                        <h4 class="font-bold text-slate-800 text-sm">${att.sessionTitle}</h4>
                                        <span class="text-xs px-2.5 py-0.5 rounded-full font-bold border ${statusConfig.bg}">
                                            ${statusConfig.text}
                                        </span>
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1 flex items-center space-x-4 space-x-reverse">
                                        <span>📅 ${att.dayName} (${att.date})</span>
                                        ${att.homeworkDone !== null ? `
                                            <span class="${att.homeworkDone ? 'text-emerald-600' : 'text-rose-600'} font-bold">
                                                الواجب: ${att.homeworkDone ? 'مكتمل وممتاز ✓' : 'لم يسلم الواجب ✗'}
                                            </span>
                                        ` : ''}
                                    </div>
                                    ${att.notes ? `
                                        <div class="mt-2 text-xs bg-slate-100 p-2 rounded-xl text-slate-700 font-medium border border-slate-200/60">
                                            💬 ملاحظة مس مارينا: ${att.notes}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="flex items-center space-x-2 space-x-reverse">
                                ${att.status === 'upcoming' ? `
                                    <button onclick="ParentPortal.openMakeupModal('', '${att.date}')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs">
                                        اعتذار عن الحصة وطلب تعويض
                                    </button>
                                ` : att.status === 'absent' ? `
                                    <button onclick="ParentPortal.openMakeupModal('', '${att.date}')" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs">
                                        اختيار موعد تعويضي
                                    </button>
                                ` : `
                                    <span class="text-xs text-emerald-600 font-bold">تم تسجيل الحضور</span>
                                `}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        `;
    },

    // 4. Payments Tab (المصروفات ووسائل الدفع)
    renderPaymentsTab({ student, myPayments }) {
        const paymentsConfig = Store.data.centerInfo.payments;

        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">الاشتراكات والمصروفات المدرسية</h3>
                    <p class="text-xs text-slate-500 mt-1">تتبع دفع الاشتراكات الشهرية مع مس مارينا وتفاصيل الدفع عبر فودافون كاش، إنستاباي، والتحويل البنكي.</p>
                </div>
                <button onclick="ParentPortal.openPaymentProofModal()" class="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs shadow-md hover:from-emerald-700 hover:to-teal-700 flex items-center">
                    <i data-lucide="upload" class="w-4 h-4 ml-1.5"></i>
                    تسجيل دفعة / رفع إيصال تحويل
                </button>
            </div>

            <!-- PAYMENT CHANNELS - HIGH EMPHASIS (As requested by user) -->
            <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-xs uppercase font-extrabold tracking-wider text-indigo-400">بيانات تحويل المصروفات الرسمية</span>
                            <h4 class="text-xl md:text-2xl font-black text-white mt-1">وسائل الدفع المعتمدة لسنتر مس مارينا</h4>
                        </div>
                        <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                            💳
                        </div>
                    </div>
                    <p class="text-xs text-indigo-200 max-w-2xl mb-6">يمكنك التحويل بسهولة عبر أي من الطرق التالية، وبمجرد التحويل اضغط على زر "رفع الإيصال" ليتم اعتماده فوراً بواسطة الكوردينيتور وتحديث حسابك.</p>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        <!-- 1. InstaPay Box -->
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:border-purple-400/50 transition">
                            <div class="flex items-center justify-between mb-3">
                                <span class="px-2.5 py-0.5 rounded-md bg-purple-500 text-white text-[11px] font-black">InstaPay (إنستاباي)</span>
                                <i data-lucide="zap" class="w-4 h-4 text-purple-300"></i>
                            </div>
                            <div class="text-xs text-slate-300 font-medium">عنوان الدفع اللحظي (IPA):</div>
                            <div class="mt-1 font-mono font-black text-sm text-amber-300 bg-black/30 p-2 rounded-xl flex items-center justify-between border border-white/10">
                                <span>${paymentsConfig.instapay.ipa}</span>
                                <button onclick="ParentPortal.copyText('${paymentsConfig.instapay.ipa}', 'تم نسخ معرف إنستاباي')" class="text-white hover:text-amber-300" title="نسخ">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div class="mt-2 text-[11px] text-slate-300">
                                أو على الهاتف: <strong class="text-white font-mono">${paymentsConfig.instapay.phone}</strong>
                            </div>
                            <div class="mt-1 text-[11px] text-emerald-300 font-medium">اسم المستفيد: ${paymentsConfig.instapay.ownerName}</div>
                        </div>

                        <!-- 2. Vodafone Cash Box -->
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:border-rose-400/50 transition">
                            <div class="flex items-center justify-between mb-3">
                                <span class="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-black">فودافون كاش (Vodafone Cash)</span>
                                <i data-lucide="smartphone" class="w-4 h-4 text-rose-300"></i>
                            </div>
                            <div class="text-xs text-slate-300 font-medium">رقم المحفظة الإلكترونية:</div>
                            <div class="mt-1 font-mono font-black text-base text-rose-300 bg-black/30 p-2 rounded-xl flex items-center justify-between border border-white/10">
                                <span>${paymentsConfig.vodafoneCash.number}</span>
                                <button onclick="ParentPortal.copyText('${paymentsConfig.vodafoneCash.number}', 'تم نسخ رقم فودافون كاش')" class="text-white hover:text-rose-300" title="نسخ">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div class="mt-2 text-[11px] text-slate-300">اسم صاحب المحفظة: <strong class="text-white">${paymentsConfig.vodafoneCash.ownerName}</strong></div>
                            <div class="mt-1 text-[11px] text-slate-400">${paymentsConfig.vodafoneCash.instructions}</div>
                        </div>

                        <!-- 3. Bank Account Box -->
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:border-sky-400/50 transition">
                            <div class="flex items-center justify-between mb-3">
                                <span class="px-2.5 py-0.5 rounded-md bg-sky-600 text-white text-[11px] font-black">الحساب البنكي (NBE)</span>
                                <i data-lucide="landmark" class="w-4 h-4 text-sky-300"></i>
                            </div>
                            <div class="text-xs text-slate-300 font-medium">${paymentsConfig.bankTransfer.bankName}:</div>
                            <div class="mt-1 font-mono font-black text-xs text-sky-200 bg-black/30 p-2 rounded-xl flex items-center justify-between border border-white/10">
                                <span class="truncate ml-1">${paymentsConfig.bankTransfer.accountNumber}</span>
                                <button onclick="ParentPortal.copyText('${paymentsConfig.bankTransfer.accountNumber}', 'تم نسخ رقم الحساب البنكي')" class="text-white hover:text-sky-300" title="نسخ">
                                    <i data-lucide="copy" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div class="mt-2 text-[11px] text-slate-300">المستفيد: <strong class="text-white">${paymentsConfig.bankTransfer.accountHolder}</strong></div>
                            <div class="mt-1 text-[10px] text-slate-400 font-mono">IBAN: ${paymentsConfig.bankTransfer.iban}</div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Invoices History -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h4 class="font-bold text-slate-800 text-sm">سجل الفواتير والاشتراكات الشهرية</h4>
                    <span class="text-xs text-slate-500">حساب الطالب: ${student.studentName}</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">الشهر</th>
                                <th class="p-3">المواد</th>
                                <th class="p-3">المبلغ</th>
                                <th class="p-3">طريقة الدفع</th>
                                <th class="p-3">الحالة</th>
                                <th class="p-3">تاريخ الدفع / الملاحظات</th>
                                <th class="p-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${myPayments.map(p => {
                                const statusMap = {
                                    paid: { text: "تم السداد بنجاح ✓", bg: "bg-emerald-100 text-emerald-800" },
                                    pending_review: { text: "قيد مراجعة الكوردينيتور ⏳", bg: "bg-amber-100 text-amber-800" },
                                    unpaid: { text: "لم يتم الدفع بعد ✗", bg: "bg-rose-100 text-rose-800" },
                                    overdue: { text: "متأخر", bg: "bg-red-100 text-red-800" }
                                };
                                const st = statusMap[p.status] || { text: p.status, bg: "bg-slate-100 text-slate-800" };

                                return `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3 font-bold text-slate-900">${p.month}</td>
                                    <td class="p-3 text-slate-600">${p.subjects ? p.subjects.join(', ') : 'اشتراك شهري'}</td>
                                    <td class="p-3 font-bold text-slate-900 text-sm font-mono">${p.amount} ج</td>
                                    <td class="p-3 font-semibold text-slate-700">
                                        ${p.method === 'vodafone_cash' ? '📱 فودافون كاش' : p.method === 'instapay' ? '⚡ إنستاباي' : p.method === 'bank' ? '🏦 تحويل بنكي' : '💵 كاش بالسنتر'}
                                    </td>
                                    <td class="p-3">
                                        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${st.bg}">
                                            ${st.text}
                                        </span>
                                    </td>
                                    <td class="p-3 text-slate-500 max-w-xs">
                                        <div>${p.paymentDate || 'لم يسجل'}</div>
                                        <div class="text-[11px] text-slate-400 truncate">${p.notes || ''}</div>
                                    </td>
                                    <td class="p-3">
                                        ${p.status === 'unpaid' ? `
                                            <button onclick="ParentPortal.openPaymentProofModal('${p.month}', ${p.amount})" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs">
                                                سداد الآن
                                            </button>
                                        ` : `
                                            <span class="text-xs text-slate-400 font-mono">${p.referenceNumber || 'معتمد'}</span>
                                        `}
                                    </td>
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

    // 5. Make-up Sessions Tab (الحصص التعويضية)
    renderMakeupTab({ student, myMakeupRequests }) {
        const availableSlots = Store.getMakeupSlots();

        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">نظام الحصص التعويضية (Make-up Classes)</h3>
                    <p class="text-xs text-slate-500 mt-1">في حال تعذر الحضور للحصة الأسبوعية، توفر مس مارينا حصصاً تعويضية بديلة في مواعيد شاغرة.</p>
                </div>
                <button onclick="ParentPortal.openMakeupModal()" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center">
                    <i data-lucide="plus-circle" class="w-4 h-4 ml-1.5"></i>
                    تقديم طلب حصة تعويضية جديدة
                </button>
            </div>

            <!-- Available slots for Miss Marina -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h4 class="font-extrabold text-slate-800 text-base">المواعيد الشاغرة المتاحة مع مس مارينا</h4>
                        <p class="text-xs text-slate-500">اختر من المواعيد التالية المناسبة لمرحلة طفلك (${student.grade}):</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${availableSlots.map(slot => {
                        const isMatch = slot.grade === student.grade;
                        return `
                        <div class="p-5 rounded-2xl border ${isMatch ? 'border-purple-200 bg-purple-50/40' : 'border-slate-200 bg-slate-50/40'} flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold px-2 py-0.5 rounded-md ${slot.subject === 'math' ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}">
                                        ${slot.subject === 'math' ? 'Math (ماث)' : 'English (إنجليزي)'}
                                    </span>
                                    <span class="text-xs font-bold text-slate-500 font-mono">${slot.date}</span>
                                </div>
                                <h5 class="font-bold text-slate-900 mt-2">${slot.grade}</h5>
                                <div class="mt-2 text-xs text-slate-600 space-y-1">
                                    <div class="font-semibold text-slate-800">🕒 ${slot.day}: ${slot.time}</div>
                                    <div>👩‍🏫 المعلمة: ${slot.teacher}</div>
                                    <div class="text-[11px] text-slate-500">${slot.note || ''}</div>
                                </div>
                            </div>

                            <div class="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                <span class="text-xs font-bold ${slot.availableSeats > 0 ? 'text-emerald-700' : 'text-rose-600'}">
                                    ${slot.availableSeats > 0 ? `متبقي ${slot.availableSeats} مقاعد` : 'مكتمل بالكامل'}
                                </span>
                                <button ${slot.availableSeats <= 0 ? 'disabled' : ''} onclick="ParentPortal.bookSpecificSlot('${slot.id}')" class="px-3 py-1.5 rounded-xl font-bold text-xs transition ${slot.availableSeats > 0 ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}">
                                    حجز هذا الموعد
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Previous Makeup Requests -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-200">
                    <h4 class="font-bold text-slate-800 text-sm">طلبات التعويض السابقة وحالتها</h4>
                </div>
                ${myMakeupRequests.length > 0 ? `
                    <div class="divide-y divide-slate-100">
                        ${myMakeupRequests.map(req => `
                            <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                                <div>
                                    <div class="flex items-center space-x-2 space-x-reverse">
                                        <span class="font-bold text-slate-900 text-sm">مادة: ${req.subject}</span>
                                        <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                                            ${req.status === 'approved' ? 'تمت الموافقة وتأكيد المقعد ✓' : req.status === 'pending' ? 'قيد مراجعة الكوردينيتور ⏳' : 'مرفوض / غير متاح'}
                                        </span>
                                    </div>
                                    <div class="text-xs text-slate-600 mt-1">
                                        📅 الموعد التعويضي المختار: <strong class="text-purple-700">${req.targetTime} (${req.targetDate})</strong>
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1">
                                        السبب: ${req.reason}
                                    </div>
                                    ${req.coordinatorNote ? `
                                        <div class="mt-2 text-xs bg-slate-100 p-2 rounded-xl text-slate-700 font-medium">
                                            رد الكوردينيتور: ${req.coordinatorNote}
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="text-xs text-slate-400">
                                    تاريخ الطلب: ${req.requestedAt}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="p-8 text-center text-slate-400 text-xs">
                        لا توجد طلبات حصص تعويضية مسجلة حتى الآن.
                    </div>
                `}
            </div>
        </div>
        `;
    },

    // 6. Chat with Coordinator Tab (محادثة الكوردينيتور)
    renderChatTab({ student, myMessages }) {
        return `
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <!-- Chat Header -->
            <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                        👨‍💼
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-sm">محادثة كوردينيتور السنتر (الدعم وتنسيق المواعيد)</h4>
                        <p class="text-[11px] text-emerald-600 font-semibold flex items-center">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 ml-1 inline-block animate-pulse"></span>
                            متصل الآن للرد على استفسارات أولياء الأمور
                        </p>
                    </div>
                </div>
                <span class="text-xs text-slate-500">طالب: ${student.studentName}</span>
            </div>

            <!-- Messages Area -->
            <div id="parent-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                ${myMessages.length > 0 ? myMessages.map(msg => `
                    <div class="flex flex-col ${msg.sender === 'parent' ? 'items-start' : 'items-end'}">
                        <div class="max-w-md p-3.5 rounded-2xl text-xs md:text-sm ${msg.sender === 'parent' ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'}">
                            <div class="font-bold text-[10px] mb-1 ${msg.sender === 'parent' ? 'text-emerald-100' : 'text-slate-400'}">
                                ${msg.sender === 'parent' ? 'أنت (ولي الأمر)' : 'كوردينيتور السنتر'}
                            </div>
                            <p class="whitespace-pre-wrap leading-relaxed">${msg.text}</p>
                        </div>
                        <span class="text-[10px] text-slate-400 mt-1 px-1 font-mono">${msg.timestamp}</span>
                    </div>
                `).join('') : `
                    <div class="p-8 text-center text-slate-400 text-xs">
                        لا توجد رسائل سابقة. يمكنك كتابة أي استفسار أو طلب خاص وسيقوم الكوردينيتور بالرد عليك فوراً.
                    </div>
                `}
            </div>

            <!-- Input Area -->
            <div class="p-3 bg-white border-t border-slate-200">
                <form onsubmit="ParentPortal.handleSendMessage(event)" class="flex items-center space-x-2 space-x-reverse">
                    <input type="text" id="parent-chat-input" placeholder="اكتب استفسارك هنا (مثلاً: بخصوص ميعاد السبت القادم أو تغيير الجروب)..." required class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs md:text-sm transition flex items-center shadow-md">
                        <span>إرسال</span>
                        <i data-lucide="send" class="w-4 h-4 mr-1.5"></i>
                    </button>
                </form>
            </div>
        </div>
        `;
    },

    // ---------------- Action Handlers & Modals ---------------- //

    copyText(text, successMsg) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                CommonUI.toast(successMsg || "تم النسخ بنجاح", "success");
            });
        } else {
            // fallback
            const input = document.createElement("input");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            CommonUI.toast(successMsg || "تم النسخ بنجاح", "success");
        }
    },

    openMakeupModal(defaultGroupId = "", defaultDate = "") {
        const student = Store.getCurrentUser();
        const availableSlots = Store.getMakeupSlots();
        const myGroups = Store.getGroups().filter(g => (student.groupIds || []).includes(g.id));

        const content = `
        <form id="makeup-form" onsubmit="ParentPortal.submitMakeupRequest(event)" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">الحصة التي ستعتذر عنها:</label>
                <select id="makeup-group-id" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold">
                    ${myGroups.map(g => `
                        <option value="${g.id}" ${defaultGroupId === g.id ? 'selected' : ''}>${g.name} - (${g.day}: ${g.time})</option>
                    `).join('')}
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">تاريخ الحصة المعتذر عنها:</label>
                <input type="date" id="makeup-missed-date" value="${defaultDate || new Date().toISOString().split('T')[0]}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">سبب الاعتذار:</label>
                <textarea id="makeup-reason" rows="2" placeholder="مثال: ظروف سفر عائلي، أو تعب مفاجئ..." required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs"></textarea>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اختر الموعد التعويضي المناسب لك مع مس مارينا:</label>
                <select id="makeup-slot-id" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold">
                    ${availableSlots.filter(s => s.availableSeats > 0).map(s => `
                        <option value="${s.id}">
                            ${s.subject === 'math' ? 'ماث' : 'إنجليزي'} - ${s.grade} (${s.day} ${s.date} من ${s.time}) [متبقي ${s.availableSeats} مقاعد]
                        </option>
                    `).join('')}
                </select>
            </div>

            <div class="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-800">
                📌 بمجرد إرسال الطلب، سيتم حجزه ومراجعته من قِبل كوردينيتور السنتر وتأكيد المقعد لطفلك.
            </div>

            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md">
                    تأكيد حجز الموعد التعويضي
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal("طلب حصة تعويضية جديدة", content);
    },

    submitMakeupRequest(e) {
        e.preventDefault();
        const student = Store.getCurrentUser();
        const missedGroupId = document.getElementById("makeup-group-id").value;
        const missedDate = document.getElementById("makeup-missed-date").value;
        const reason = document.getElementById("makeup-reason").value;
        const targetMakeupSlotId = document.getElementById("makeup-slot-id").value;

        const res = Store.createMakeupRequest({
            studentId: student.id,
            missedGroupId,
            missedDate,
            reason,
            targetMakeupSlotId
        });

        if (res.success) {
            CommonUI.closeModal();
            CommonUI.toast("تم إرسال طلب الحصة التعويضية بنجاح إلى الكوردينيتور", "success");
            App.render();
        } else {
            CommonUI.toast(res.message, "error");
        }
    },

    bookSpecificSlot(slotId) {
        this.openMakeupModal();
        setTimeout(() => {
            const select = document.getElementById("makeup-slot-id");
            if (select) select.value = slotId;
        }, 100);
    },

    openPaymentProofModal(defaultMonth = "اشتراك الشهر الحالي", defaultAmount = 450) {
        const student = Store.getCurrentUser();
        const content = `
        <form id="payment-proof-form" onsubmit="ParentPortal.submitPaymentProof(event)" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم الطالب:</label>
                <input type="text" value="${student.studentName} (${student.grade})" disabled class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">شهر الاشتراك:</label>
                    <input type="text" id="pay-month" value="${defaultMonth}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المبلغ المحول (جنيه):</label>
                    <input type="number" id="pay-amount" value="${defaultAmount}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono">
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">طريقة الدفع التي تم التحويل بها:</label>
                <select id="pay-method" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                    <option value="vodafone_cash">📱 فودافون كاش (${Store.data.centerInfo.payments.vodafoneCash.number})</option>
                    <option value="instapay">⚡ تطبيق إنستاباي (${Store.data.centerInfo.payments.instapay.ipa})</option>
                    <option value="bank">🏦 تحويل بنكي / حساب السنتر</option>
                    <option value="cash">💵 نقداً بالسنتر مع الكوردينيتور</option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">رقم المعاملة / المرجع أو رقم الهاتف المحول منه:</label>
                <input type="text" id="pay-ref" placeholder="مثال: رقم العملية أو رقم محفظتك التي حولت منها" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">صورة إيصال التحويل (Screenshot) أو ملاحظة:</label>
                <input type="file" id="pay-receipt-file" accept="image/*" class="w-full p-2 rounded-xl border border-slate-200 text-xs">
                <textarea id="pay-note" rows="2" placeholder="ملاحظة إضافية للكوردينيتور إن وجدت..." class="w-full mt-2 p-2 rounded-xl border border-slate-200 text-xs"></textarea>
            </div>

            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md">
                    إرسال لتأكيد الدفع
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal("تسجيل سداد ورفع إشعار تحويل", content);
    },

    submitPaymentProof(e) {
        e.preventDefault();
        const student = Store.getCurrentUser();
        const month = document.getElementById("pay-month").value;
        const amount = document.getElementById("pay-amount").value;
        const method = document.getElementById("pay-method").value;
        const ref = document.getElementById("pay-ref").value;
        const note = document.getElementById("pay-note").value;

        Store.submitPaymentNotice({
            studentId: student.id,
            month,
            amount,
            method,
            referenceNumber: ref,
            receiptNote: note
        });

        CommonUI.closeModal();
        CommonUI.toast("تم إرسال إشعار التحويل للكوردينيتور وسيقوم بالمراجعة والتأكيد فوراً", "success");
        App.render();
    },

    handleSendMessage(e) {
        e.preventDefault();
        const input = document.getElementById("parent-chat-input");
        const student = Store.getCurrentUser();
        if (!input || !input.value.trim()) return;

        Store.sendMessage({
            studentId: student.id,
            sender: "parent",
            text: input.value.trim()
        });

        input.value = "";
        App.render();
        CommonUI.toast("تم إرسال رسالتك للكوردينيتور", "info");

        // Scroll to bottom
        setTimeout(() => {
            const chatBox = document.getElementById("parent-chat-messages");
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 50);
    },

    requestGroupSwitch(targetGroupId, groupName) {
        const student = Store.getCurrentUser();
        Store.sendMessage({
            studentId: student.id,
            sender: "parent",
            text: `مرحباً، أود الاستفسار عن إمكانية نقل موعد الطالب ${student.studentName} إلى المجموعة: (${groupName}). برجاء إفادتي بإمكانية ذلك.`
        });
        CommonUI.toast("تم إرسال طلب تغيير الموعد للكوردينيتور في الرسائل", "success");
        App.navigate("parent-chat");
    }
};

window.ParentPortal = ParentPortal;
