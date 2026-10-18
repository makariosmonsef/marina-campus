/**
 * Auth & Public Registration Component
 */
const Auth = {
    renderLanding() {
        return `
        <div class="space-y-12 py-8">
            <!-- Hero Section -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 text-white p-8 md:p-14 shadow-2xl">
                <div class="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                    <div class="inline-flex items-center space-x-2 space-x-reverse px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold shadow-sm">
                        <span>✨ مرحباً بكم في صرح التأسيس والتفوق</span>
                        <span>•</span>
                        <span>مس مارينا (Math & English)</span>
                    </div>

                    <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                        منصة وسنتر <span class="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">مس مارينا التعليمي</span>
                    </h1>

                    <p class="text-sm md:text-lg text-purple-200 leading-relaxed font-medium max-w-2xl mx-auto">
                        تأسيس قوي ومتابعة دراسية دقيقة لمراحل رياض الأطفال (KG) والابتدائي في مادتي الماث واللغة الإنجليزية مع نظام ذكي لمتابعة الحضور، المصروفات، وحجز الحصص التعويضية.
                    </p>

                    <!-- CTAs -->
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button onclick="Auth.openRegisterModal()" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center">
                            <i data-lucide="user-plus" class="w-5 h-5 ml-2"></i>
                            تسجيل طالب جديد الآن (ولي الأمر)
                        </button>
                        <button onclick="Auth.openLoginModal()" class="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl backdrop-blur-md border border-white/20 transition flex items-center justify-center">
                            <i data-lucide="log-in" class="w-5 h-5 ml-2"></i>
                            تسجيل الدخول إلى حسابك
                        </button>
                    </div>

                    <!-- 3 Roles Demo Shortcuts Pills -->
                    <div class="pt-8 border-t border-white/10 text-xs text-purple-300">
                        <span class="block mb-2 font-semibold">أو جرب المنصة مباشرة كـ:</span>
                        <div class="flex flex-wrap items-center justify-center gap-2">
                            <button onclick="Auth.quickLogin('marina')" class="px-3 py-1.5 bg-purple-500/30 hover:bg-purple-500/50 rounded-xl text-purple-200 border border-purple-400/30 font-bold transition">
                                👑 مس مارينا (سوبر أدمن)
                            </button>
                            <button onclick="Auth.quickLogin('coordinator')" class="px-3 py-1.5 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl text-blue-200 border border-blue-400/30 font-bold transition">
                                👨‍💼 كوردينيتور السنتر (أدمن)
                            </button>
                            <button onclick="Auth.quickLogin('youssef')" class="px-3 py-1.5 bg-emerald-500/30 hover:bg-emerald-500/50 rounded-xl text-emerald-200 border border-emerald-400/30 font-bold transition">
                                👦 ولي أمر يوسف (طالب)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Highlights Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                        <i data-lucide="calendar" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">مواعيد وحصص مرنة</h3>
                    <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                        معرفة مواعيد الحصص الأسبوعية، مع إمكانية الاعتذار واختيار حصة تعويضية من بين المواعيد الشاغرة لمس مارينا بكل سلاسة.
                    </p>
                </div>

                <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        <i data-lucide="credit-card" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">طرق دفع سهلة وفورية</h3>
                    <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                        دفع المصروفات الشهرية عبر فودافون كاش، إنستاباي (InstaPay)، أو التحويل البنكي مع إمكانية رفع إيصال التحويل للاعتماد الفوري.
                    </p>
                </div>

                <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                        <i data-lucide="message-circle" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">تواصل مباشر مع الكوردينيتور</h3>
                    <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                        شات فوري ومباشر مع منسق السنتر للاستفسار عن أي تفاصيل، تبديل المواعيد، أو متابعة تقييمات الطفل مع مس مارينا.
                    </p>
                </div>

            </div>
        </div>
        `;
    },

    openLoginModal() {
        const content = `
        <form onsubmit="Auth.handleLogin(event)" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم أو رقم الهاتف:</label>
                <input type="text" id="login-identifier" placeholder="مثال: youssef أو رقم الهاتف" required class="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
                <input type="password" id="login-password" placeholder="أدخل كلمة المرور (افتراضياً: 123)" required class="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <!-- Quick Demo Accounts Shortcuts -->
            <div class="pt-2">
                <span class="text-[11px] font-bold text-slate-400 block mb-2">تسجيل دخول سريع للتجربة:</span>
                <div class="grid grid-cols-3 gap-2">
                    <button type="button" onclick="Auth.fillLogin('marina', '123')" class="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200">
                        مس مارينا 👑
                    </button>
                    <button type="button" onclick="Auth.fillLogin('coordinator', '123')" class="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200">
                        الكوردينيتور 👨‍💼
                    </button>
                    <button type="button" onclick="Auth.fillLogin('youssef', '123')" class="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        ولي أمر يوسف 👦
                    </button>
                </div>
            </div>

            <div class="pt-4 flex justify-between items-center border-t border-slate-100">
                <button type="button" onclick="Auth.openRegisterModal()" class="text-xs font-bold text-indigo-600 hover:underline">
                    حساب جديد؟ سجل الآن
                </button>
                <div class="flex space-x-2 space-x-reverse">
                    <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                        إلغاء
                    </button>
                    <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md">
                        دخول
                    </button>
                </div>
            </div>
        </form>
        `;

        CommonUI.openModal("تسجيل الدخول إلى منصة سنتر مس مارينا", content);
    },

    fillLogin(username, password) {
        const idInput = document.getElementById("login-identifier");
        const passInput = document.getElementById("login-password");
        if (idInput && passInput) {
            idInput.value = username;
            passInput.value = password;
        }
    },

    handleLogin(e) {
        e.preventDefault();
        const idInput = document.getElementById("login-identifier").value;
        const passInput = document.getElementById("login-password").value;

        const res = Store.login(idInput, passInput);
        if (res.success) {
            CommonUI.closeModal();
            CommonUI.toast(`مرحباً بك يا ${res.user.studentName || res.user.name}`, "success");
            App.currentTab = "dashboard";
            App.render();
        } else {
            CommonUI.toast(res.message, "error");
        }
    },

    quickLogin(username) {
        const res = Store.login(username, "123");
        if (res.success) {
            CommonUI.toast(`تم تسجيل الدخول كـ: ${res.user.studentName || res.user.name}`, "success");
            App.currentTab = "dashboard";
            App.render();
        }
    },

    openRegisterModal() {
        const content = `
        <form onsubmit="Auth.handleRegister(event)" class="space-y-4 text-right">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم الطالب أو الطفل بالكامل:</label>
                <input type="text" id="reg-student-name" placeholder="مثال: يوسف أحمد إبراهيم" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">اسم ولي الأمر:</label>
                <input type="text" id="reg-parent-name" placeholder="مثال: أحمد إبراهيم" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / واتساب:</label>
                    <input type="text" id="reg-phone" placeholder="010xxxxxxxx" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                    <select id="reg-grade" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <option value="KG 1">رياض أطفال (KG 1)</option>
                        <option value="KG 2">رياض أطفال (KG 2)</option>
                        <option value="Primary 1 (الصف الأول)">Primary 1 (الصف الأول الابتدائي)</option>
                        <option value="Primary 2 (الصف الثاني)">Primary 2 (الصف الثاني الابتدائي)</option>
                        <option value="Primary 3 (الصف الثالث)">Primary 3 (الصف الثالث الابتدائي)</option>
                        <option value="Primary 4 (الصف الرابع)">Primary 4 (الصف الرابع الابتدائي)</option>
                        <option value="Primary 5 (الصف الخامس)">Primary 5 (الصف الخامس الابتدائي)</option>
                        <option value="Primary 6 (الصف السادس)">Primary 6 (الصف السادس الابتدائي)</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">المواد المراد التسجيل بها مع مس مارينا:</label>
                <div class="grid grid-cols-2 gap-3 pt-1">
                    <label class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100">
                        <input type="checkbox" id="reg-math" checked class="ml-2 rounded text-indigo-600">
                        <div>
                            <span class="text-xs font-bold text-slate-900 block">Math (ماث)</span>
                            <span class="text-[10px] text-slate-500">تأسيس وحساب ذهني ومنهج</span>
                        </div>
                    </label>
                    <label class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center cursor-pointer hover:bg-slate-100">
                        <input type="checkbox" id="reg-eng" checked class="ml-2 rounded text-indigo-600">
                        <div>
                            <span class="text-xs font-bold text-slate-900 block">English (إنجليزي)</span>
                            <span class="text-[10px] text-slate-500">Phonics، محادثة ومنهج</span>
                        </div>
                    </label>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">اليوم المفضل للحصة (إن وجد):</label>
                    <select id="reg-preferred-day" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <option value="السبت">السبت</option>
                        <option value="الأحد">الأحد</option>
                        <option value="الاثنين">الاثنين</option>
                        <option value="الثلاثاء">الثلاثاء</option>
                        <option value="الأربعاء">الأربعاء</option>
                        <option value="الخميس">الخميس</option>
                        <option value="حسب المتاح">حسب المتاح مع مس مارينا</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">اختر كلمة مرور للحساب:</label>
                    <input type="password" id="reg-password" value="123" required class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold">
                </div>
            </div>

            <div class="pt-4 flex justify-between items-center border-t border-slate-100">
                <button type="button" onclick="Auth.openLoginModal()" class="text-xs font-bold text-indigo-600 hover:underline">
                    لديك حساب بالفعل؟ تسجيل الدخول
                </button>
                <div class="flex space-x-2 space-x-reverse">
                    <button type="button" onclick="CommonUI.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                        إلغاء
                    </button>
                    <button type="submit" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md">
                        إنشاء الحساب والدخول
                    </button>
                </div>
            </div>
        </form>
        `;

        CommonUI.openModal("تسجيل طالب جديد في سنتر مس مارينا", content);
    },

    handleRegister(e) {
        e.preventDefault();
        const studentName = document.getElementById("reg-student-name").value;
        const parentName = document.getElementById("reg-parent-name").value;
        const phone = document.getElementById("reg-phone").value;
        const grade = document.getElementById("reg-grade").value;
        const password = document.getElementById("reg-password").value;
        const preferredDay = document.getElementById("reg-preferred-day").value;
        const hasMath = document.getElementById("reg-math").checked;
        const hasEng = document.getElementById("reg-eng").checked;

        const subjects = [];
        if (hasMath) subjects.push("math");
        if (hasEng) subjects.push("english");

        if (subjects.length === 0) {
            CommonUI.toast("يرجى اختيار مادة واحدة على الأقل (ماث أو إنجليزي)", "warning");
            return;
        }

        const res = Store.registerParentStudent({
            parentName,
            studentName,
            phone,
            password,
            grade,
            subjects,
            preferredDay
        });

        if (res.success) {
            Store.setCurrentUser(res.user);
            CommonUI.closeModal();
            CommonUI.toast(`تم إنشاء الحساب بنجاح! اسم الدخول: ${res.credentials.username}`, "success");
            App.currentTab = "dashboard";
            App.render();
        }
    }
};

window.Auth = Auth;
