/**
 * Super Admin Portal Components (منظور مس مارينا - صاحبة السنتر والمعلمة)
 */
const SuperAdminPortal = {
    render(currentTab = "dashboard") {
        const students = Store.getStudents();
        const groups = Store.getGroups();
        const payments = Store.getPayments();
        const makeupSlots = Store.getMakeupSlots();
        const centerInfo = Store.data.centerInfo;

        const totalRevenue = payments
            .filter(p => p.status === "paid")
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        const pendingRevenue = payments
            .filter(p => p.status === "pending_review")
            .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

        const mathStudents = students.filter(s => s.subjects && s.subjects.includes("math")).length;
        const engStudents = students.filter(s => s.subjects && s.subjects.includes("english")).length;

        return `
        <div class="space-y-6 pb-20">
            <!-- Top Super Admin Banner -->
            <div class="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                <div class="absolute -left-10 -bottom-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-3xl md:text-4xl shadow-lg ring-4 ring-white/10">
                            👩‍🏫
                        </div>
                        <div>
                            <div class="flex items-center space-x-2 space-x-reverse flex-wrap">
                                <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">لوحة تحكم السوبر أدمن (مس مارينا)</h2>
                                <span class="bg-amber-400 text-slate-950 text-xs px-3 py-1 rounded-full font-black">
                                    👑 الإدارة العامة والمالية
                                </span>
                            </div>
                            <p class="text-purple-200 text-sm mt-1 font-medium">أكاديمية مس مارينا • تدريس مادتي الماث (Math) واللغة الإنجليزية (English)</p>
                            <div class="flex items-center space-x-3 space-x-reverse mt-2 text-xs">
                                <span class="bg-white/10 text-purple-200 px-3 py-1 rounded-lg">
                                    طلاب الماث: <strong class="text-amber-300 font-bold">${mathStudents}</strong>
                                </span>
                                <span class="bg-white/10 text-purple-200 px-3 py-1 rounded-lg">
                                    طلاب الإنجليزي: <strong class="text-pink-300 font-bold">${engStudents}</strong>
                                </span>
                                <span class="bg-white/10 text-purple-200 px-3 py-1 rounded-lg">
                                    المجموعات: <strong class="text-emerald-300 font-bold">${groups.length}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Financial Stats -->
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right min-w-[200px]">
                        <span class="text-xs text-purple-200 font-bold">إجمالي الإيرادات المحصلة:</span>
                        <div class="text-2xl md:text-3xl font-black text-amber-300 font-mono mt-1">${totalRevenue.toLocaleString()} ج</div>
                        <span class="text-[11px] text-purple-300 mt-1 block">معلق للمراجعة: ${pendingRevenue} ج</span>
                    </div>
                </div>

                <!-- Desktop Navigation Tabs -->
                <div class="hidden md:flex items-center space-x-2 space-x-reverse mt-6 pt-6 border-t border-white/20 text-sm font-bold overflow-x-auto">
                    <button onclick="App.navigate('dashboard')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'dashboard' ? 'bg-white text-purple-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        نظرة عامة والتقارير
                    </button>
                    <button onclick="App.navigate('students-list')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'students-list' ? 'bg-white text-purple-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        دليل الطلاب وأولياء الأمور (${students.length})
                    </button>
                    <button onclick="App.navigate('financial-reports')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'financial-reports' ? 'bg-white text-purple-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        التقارير المالية والتحصيل
                    </button>
                    <button onclick="App.navigate('groups-management')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'groups-management' ? 'bg-white text-purple-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        جدول المعلمة والمجموعات
                    </button>
                    <button onclick="App.navigate('makeup-slots-manager')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'makeup-slots-manager' ? 'bg-white text-purple-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        المواعيد التعويضية الشاغرة (${makeupSlots.length})
                    </button>
                    <button onclick="App.navigate('center-settings')" class="px-4 py-2 rounded-xl transition whitespace-nowrap ${currentTab === 'center-settings' ? 'bg-white text-purple-900 shadow-md' : 'text-white/80 hover:bg-white/10'}">
                        إعدادات السنتر ووسائل الدفع
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div>
                ${this.renderActiveTab(currentTab, { students, groups, payments, makeupSlots, centerInfo, totalRevenue, pendingRevenue, mathStudents, engStudents })}
            </div>
        </div>
        `;
    },

    renderActiveTab(tab, data) {
        switch (tab) {
            case "students-list":
                return this.renderStudentsTab(data);
            case "financial-reports":
                return this.renderFinancialTab(data);
            case "makeup-slots-manager":
                return this.renderMakeupSlotsTab(data);
            case "center-settings":
                return this.renderSettingsTab(data);
            case "groups-management":
                return CoordinatorPortal.renderGroupsTab(data);
            case "dashboard":
            default:
                return this.renderDashboardTab(data);
        }
    },

    // 1. Super Admin Dashboard Tab
    renderDashboardTab({ students, groups, payments, totalRevenue, pendingRevenue, mathStudents, engStudents }) {
        const totalCapacity = groups.reduce((acc, g) => acc + g.maxCapacity, 0);
        const totalOccupied = groups.reduce((acc, g) => acc + g.studentIds.length, 0);
        const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

        return `
        <div class="space-y-6">
            <!-- 4 Main KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">إجمالي طلاب السنتر</span>
                        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${students.length} <span class="text-sm font-medium text-slate-500">طالب</span></div>
                        <p class="text-xs text-purple-600 mt-1 font-semibold">ماث: ${mathStudents} • إنجليزي: ${engStudents}</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">الإيرادات المحصلة</span>
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <i data-lucide="dollar-sign" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-emerald-700 font-mono">${totalRevenue.toLocaleString()} ج</div>
                        <p class="text-xs text-slate-500 mt-1 font-semibold">فودافون كاش، إنستاباي، والبنك</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">نسبة الإشغال في المجموعات</span>
                        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <i data-lucide="pie-chart" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${occupancyRate}%</div>
                        <p class="text-xs text-slate-500 mt-1">${totalOccupied} مقعد محجوز من أصل ${totalCapacity}</p>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">المجموعات النشطة لمس مارينا</span>
                        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <i data-lucide="book-open" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="text-2xl font-black text-slate-800">${groups.length} <span class="text-sm font-medium text-slate-500">مجموعات</span></div>
                        <p class="text-xs text-amber-600 mt-1 font-semibold">موزعة على مدار أيام الأسبوع</p>
                    </div>
                </div>

            </div>

            <!-- 2 Big Section Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <!-- Master Timetable Overview -->
                <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-extrabold text-slate-800 text-lg">جدول حصص مس مارينا الأسبوعي (Math & English)</h3>
                        <button onclick="CoordinatorPortal.openAddGroupModal()" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold">
                            + إضافة موعد جديد
                        </button>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${groups.map(g => `
                            <div class="p-4 rounded-2xl border ${g.subject === 'math' ? 'border-indigo-100 bg-indigo-50/40' : 'border-pink-100 bg-pink-50/40'} flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-bold px-2 py-0.5 rounded-md ${g.subject === 'math' ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}">
                                            ${g.subject === 'math' ? 'Math' : 'English'}
                                        </span>
                                        <span class="text-xs font-bold text-slate-600 font-mono">${g.day}</span>
                                    </div>
                                    <h4 class="font-bold text-slate-900 mt-2 text-sm">${g.name}</h4>
                                    <div class="text-xs text-slate-600 mt-1 font-mono">${g.time}</div>
                                </div>
                                <div class="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                    <span class="font-bold text-slate-700">الاشتراك: ${g.monthlyFee} ج</span>
                                    <span class="font-bold text-indigo-700">${g.studentIds.length} طلاب مسجلين</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Coordinator & Operations Health -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-extrabold text-slate-800 text-base">متابعة شؤون الكوردينيتور</h3>
                            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <p class="text-xs text-slate-500 mb-4">متابعة أداء المنسق في الرد على أولياء الأمور وتسكين الحصص التعويضية:</p>

                        <div class="space-y-3">
                            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <span class="text-xs font-bold text-slate-700">تسكين الحصص التعويضية:</span>
                                <span class="text-xs font-bold text-purple-700">نشط وتلقائي</span>
                            </div>
                            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <span class="text-xs font-bold text-slate-700">الرد على الاستفسارات:</span>
                                <span class="text-xs font-bold text-emerald-700">فوري ومستمر</span>
                            </div>
                            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <span class="text-xs font-bold text-slate-700">مراجعة إيصالات الدفع:</span>
                                <span class="text-xs font-bold text-blue-700">محدث أولاً بأول</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-100">
                        <button onclick="App.navigate('center-settings')" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition">
                            تعديل بيانات الحسابات وأرقام التحويل
                        </button>
                    </div>
                </div>

            </div>
        </div>
        `;
    },

    // 2. Students & Academic Directory Tab
    renderStudentsTab({ students, groups }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">سجل الطلاب وأولياء الأمور</h3>
                    <p class="text-xs text-slate-500 mt-1">قائمة بجميع الطلاب المسجلين مع مس مارينا، مراحلهم الدراسية، أرقام التواصل، وبيانات الحساب.</p>
                </div>
                <button onclick="CoordinatorPortal.openAddStudentModal()" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center">
                    <i data-lucide="user-plus" class="w-4 h-4 ml-1.5"></i>
                    إضافة طالب جديد
                </button>
            </div>

            <!-- Students Table -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">اسم الطالب والطفل</th>
                                <th class="p-3">ولي الأمر</th>
                                <th class="p-3">المرحلة</th>
                                <th class="p-3">المواد</th>
                                <th class="p-3">رقم الهاتف</th>
                                <th class="p-3">اسم الدخول والباسورد</th>
                                <th class="p-3">المجموعات المسكن بها</th>
                                <th class="p-3">إجراء</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${students.map(st => {
                                const stGroups = groups.filter(g => (st.groupIds || []).includes(g.id));
                                return `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3 font-extrabold text-slate-900 flex items-center space-x-2 space-x-reverse">
                                        <span class="text-lg">${st.avatar || '👦'}</span>
                                        <span>${st.studentName}</span>
                                    </td>
                                    <td class="p-3 text-slate-700 font-semibold">${st.name}</td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded-md font-bold text-[11px] ${st.stage === 'kg' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                                            ${st.grade}
                                        </span>
                                    </td>
                                    <td class="p-3 text-slate-800 font-semibold">
                                        ${st.subjects.map(s => s === 'math' ? 'ماث' : 'إنجليزي').join(' + ')}
                                    </td>
                                    <td class="p-3 font-mono text-slate-700">${st.phone}</td>
                                    <td class="p-3">
                                        <span class="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">${st.username}</span>
                                        <span class="text-[10px] text-slate-400 font-mono block">باسورد: ${st.password}</span>
                                    </td>
                                    <td class="p-3 text-slate-600">
                                        ${stGroups.length > 0 ? stGroups.map(g => `<span class="inline-block bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] m-0.5 font-semibold">${g.name}</span>`).join('') : '<span class="text-rose-500 font-bold text-[10px]">غير مسكن بمجموعة</span>'}
                                    </td>
                                    <td class="p-3">
                                        <button onclick="SuperAdminPortal.openEditStudent('${st.id}')" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px]">
                                            تعديل
                                        </button>
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

    // 3. Financial Reports Tab
    renderFinancialTab({ payments, totalRevenue, pendingRevenue }) {
        const vodafoneRevenue = payments.filter(p => p.status === 'paid' && p.method === 'vodafone_cash').reduce((sum, p) => sum + p.amount, 0);
        const instapayRevenue = payments.filter(p => p.status === 'paid' && p.method === 'instapay').reduce((sum, p) => sum + p.amount, 0);
        const bankRevenue = payments.filter(p => p.status === 'paid' && p.method === 'bank').reduce((sum, p) => sum + p.amount, 0);

        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-black text-slate-800">التقرير المالي وحسابات السنتر</h3>
                    <p class="text-xs text-slate-500 mt-1">تفاصيل إيرادات مس مارينا حسب وسيلة الدفع (إنستاباي، فودافون كاش، والبنك).</p>
                </div>
                <button onclick="window.print()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center">
                    <i data-lucide="printer" class="w-4 h-4 ml-1.5"></i>
                    طباعة التقرير
                </button>
            </div>

            <!-- Revenue Breakdown by Payment Method -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div class="bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-5 rounded-2xl shadow-md">
                    <div class="text-xs font-bold text-purple-200">تحصيلات إنستاباي (InstaPay)</div>
                    <div class="text-2xl font-black font-mono mt-2">${instapayRevenue.toLocaleString()} ج</div>
                    <div class="text-[11px] text-purple-300 mt-1">حساب: ${Store.data.centerInfo.payments.instapay.ipa}</div>
                </div>

                <div class="bg-gradient-to-br from-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-md">
                    <div class="text-xs font-bold text-rose-200">تحصيلات فودافون كاش</div>
                    <div class="text-2xl font-black font-mono mt-2">${vodafoneRevenue.toLocaleString()} ج</div>
                    <div class="text-[11px] text-rose-200 mt-1">محفظة: ${Store.data.centerInfo.payments.vodafoneCash.number}</div>
                </div>

                <div class="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-5 rounded-2xl shadow-md">
                    <div class="text-xs font-bold text-sky-200">تحصيلات التحويل البنكي (NBE)</div>
                    <div class="text-2xl font-black font-mono mt-2">${bankRevenue.toLocaleString()} ج</div>
                    <div class="text-[11px] text-sky-200 mt-1">البنك الأهلي المصري</div>
                </div>

            </div>

            <!-- Financial Log -->
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-sm">
                    كشف حساب كل الاشتراكات والحوالات
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3">الطالب</th>
                                <th class="p-3">الشهر</th>
                                <th class="p-3">المبلغ</th>
                                <th class="p-3">الطريقة</th>
                                <th class="p-3">المرجع</th>
                                <th class="p-3">الحالة</th>
                                <th class="p-3">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${payments.map(p => `
                                <tr class="hover:bg-slate-50/80 transition">
                                    <td class="p-3 font-bold text-slate-900">${p.studentName}</td>
                                    <td class="p-3">${p.month}</td>
                                    <td class="p-3 font-bold font-mono text-slate-900">${p.amount} ج</td>
                                    <td class="p-3 font-semibold">${p.method}</td>
                                    <td class="p-3 font-mono">${p.referenceNumber || '-'}</td>
                                    <td class="p-3">
                                        <span class="px-2 py-0.5 rounded-full font-bold text-[11px] ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                            ${p.status === 'paid' ? 'مدفوع ✓' : 'معلق'}
                                        </span>
                                    </td>
                                    <td class="p-3 font-mono text-slate-500">${p.paymentDate || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    },

    // 4. Make-up Slots Manager Tab
    renderMakeupSlotsTab({ makeupSlots }) {
        return CoordinatorPortal.renderMakeupTab({ makeupRequests: Store.getMakeupRequests(), makeupSlots });
    },

    // 5. Center Settings & Payment Details Configuration Tab
    renderSettingsTab({ centerInfo }) {
        return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <h3 class="text-xl font-black text-slate-800 mb-1">إعدادات وسائل الدفع وبيانات السنتر</h3>
                <p class="text-xs text-slate-500 mb-6">أي تعديل هنا سينعكس فوراً في صفحة أولياء الأمور عند الدفع.</p>

                <form onsubmit="SuperAdminPortal.saveSettings(event)" class="space-y-6">
                    <!-- Vodafone Cash Section -->
                    <div class="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-3">
                        <div class="flex items-center space-x-2 space-x-reverse text-rose-800 font-bold text-sm">
                            <span>📱 بيانات فودافون كاش:</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">رقم المحفظة:</label>
                                <input type="text" id="set-vf-number" value="${centerInfo.payments.vodafoneCash.number}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">اسم صاحب المحفظة:</label>
                                <input type="text" id="set-vf-owner" value="${centerInfo.payments.vodafoneCash.ownerName}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">تعليمات التحويل لأولياء الأمور:</label>
                            <input type="text" id="set-vf-instructions" value="${centerInfo.payments.vodafoneCash.instructions}" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs">
                        </div>
                    </div>

                    <!-- InstaPay Section -->
                    <div class="p-5 rounded-2xl border border-purple-200 bg-purple-50/30 space-y-3">
                        <div class="flex items-center space-x-2 space-x-reverse text-purple-800 font-bold text-sm">
                            <span>⚡ بيانات إنستاباي (InstaPay):</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">عنوان الدفع اللحظي (IPA):</label>
                                <input type="text" id="set-ipa" value="${centerInfo.payments.instapay.ipa}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">رقم هاتف إنستاباي:</label>
                                <input type="text" id="set-ipa-phone" value="${centerInfo.payments.instapay.phone}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">اسم المستفيد كما يظهر في إنستاباي:</label>
                            <input type="text" id="set-ipa-owner" value="${centerInfo.payments.instapay.ownerName}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold">
                        </div>
                    </div>

                    <!-- Bank Account Section -->
                    <div class="p-5 rounded-2xl border border-sky-200 bg-sky-50/30 space-y-3">
                        <div class="flex items-center space-x-2 space-x-reverse text-sky-800 font-bold text-sm">
                            <span>🏦 بيانات الحساب البنكي:</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">اسم البنك:</label>
                                <input type="text" id="set-bank-name" value="${centerInfo.payments.bankTransfer.bankName}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">رقم الحساب:</label>
                                <input type="text" id="set-bank-acc" value="${centerInfo.payments.bankTransfer.accountNumber}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">اسم المستفيد بالكامل:</label>
                                <input type="text" id="set-bank-holder" value="${centerInfo.payments.bankTransfer.accountHolder}" required class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">رقم الآيبان (IBAN):</label>
                                <input type="text" id="set-bank-iban" value="${centerInfo.payments.bankTransfer.iban}" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono">
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-2 space-x-reverse pt-4">
                        <button type="submit" class="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-md">
                            حفظ إعدادات وسائل الدفع
                        </button>
                    </div>
                </form>
            </div>
        </div>
        `;
    },

    saveSettings(e) {
        e.preventDefault();
        const vfNumber = document.getElementById("set-vf-number").value;
        const vfOwner = document.getElementById("set-vf-owner").value;
        const vfInstructions = document.getElementById("set-vf-instructions").value;

        const ipa = document.getElementById("set-ipa").value;
        const ipaPhone = document.getElementById("set-ipa-phone").value;
        const ipaOwner = document.getElementById("set-ipa-owner").value;

        const bankName = document.getElementById("set-bank-name").value;
        const bankAcc = document.getElementById("set-bank-acc").value;
        const bankHolder = document.getElementById("set-bank-holder").value;
        const bankIban = document.getElementById("set-bank-iban").value;

        Store.updatePaymentSettings({
            vodafoneCash: { number: vfNumber, ownerName: vfOwner, instructions: vfInstructions },
            instapay: { ipa: ipa, phone: ipaPhone, ownerName: ipaOwner, instructions: "تحويل فوري" },
            bankTransfer: { bankName, accountNumber: bankAcc, accountHolder: bankHolder, iban: bankIban, instructions: "تحويل بنكي" }
        });

        CommonUI.toast("تم حفظ وتحديث وسائل الدفع بنجاح", "success");
        App.render();
    },

    openEditStudent(studentId) {
        const student = Store.getStudentById(studentId);
        if (!student) return;

        const content = `
        <form onsubmit="SuperAdminPortal.submitEditStudent(event, '${student.id}')" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم الطالب:</label>
                <input type="text" id="edit-std-name" value="${student.studentName}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم ولي الأمر:</label>
                <input type="text" id="edit-parent-name" value="${student.name}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف:</label>
                    <input type="text" id="edit-phone" value="${student.phone}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المرحلة:</label>
                    <input type="text" id="edit-grade" value="${student.grade}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs">
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
                <input type="text" id="edit-pass" value="${student.password}" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
            </div>
            <div class="pt-3 flex justify-end space-x-2 space-x-reverse">
                <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    إلغاء
                </button>
                <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md">
                    حفظ التعديلات
                </button>
            </div>
        </form>
        `;

        CommonUI.openModal(`تعديل بيانات: ${student.studentName}`, content);
    },

    submitEditStudent(e, studentId) {
        e.preventDefault();
        const studentName = document.getElementById("edit-std-name").value;
        const parentName = document.getElementById("edit-parent-name").value;
        const phone = document.getElementById("edit-phone").value;
        const grade = document.getElementById("edit-grade").value;
        const password = document.getElementById("edit-pass").value;

        Store.updateStudent(studentId, {
            studentName,
            name: parentName,
            phone,
            grade,
            password
        });

        CommonUI.closeModal();
        CommonUI.toast("تم حفظ بيانات الطالب بنجاح", "success");
        App.render();
    }
};

window.SuperAdminPortal = SuperAdminPortal;
