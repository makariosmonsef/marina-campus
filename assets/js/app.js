/**
 * Main Application Orchestrator
 */
const App = {
    currentTab: "dashboard",

    init() {
        Store.init();

        // Subscribe to store updates for real-time reactivity
        Store.subscribe(() => {
            this.render();
        });

        // Initial render
        this.render();
    },

    navigate(tab) {
        this.currentTab = tab;
        this.render();
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    render() {
        const root = document.getElementById("app-root");
        if (!root) return;

        const currentUser = Store.getCurrentUser();

        // 1. Render Header
        let html = CommonUI.renderHeader(currentUser);

        // 2. Render Main Body Container
        html += `<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">`;

        if (!currentUser) {
            html += Auth.renderLanding();
        } else if (currentUser.role === "superadmin") {
            html += SuperAdminPortal.render(this.currentTab);
        } else if (currentUser.role === "admin" || currentUser.role === "coordinator") {
            html += CoordinatorPortal.render(this.currentTab);
        } else if (currentUser.role === "parent") {
            html += ParentPortal.render(this.currentTab);
        } else {
            html += Auth.renderLanding();
        }

        html += `</main>`;

        // 3. Render Mobile Navigation (if logged in)
        if (currentUser) {
            html += CommonUI.renderMobileNav(currentUser.role);
        }

        root.innerHTML = html;

        // Render Lucide SVG Icons
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    showUserMenu() {
        const user = Store.getCurrentUser();
        const content = `
        <div class="space-y-4 text-right">
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 space-x-reverse">
                <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
                    ${user ? user.avatar : '👤'}
                </div>
                <div>
                    <h4 class="font-extrabold text-slate-800 text-sm">${user ? (user.studentName || user.name) : 'زائر'}</h4>
                    <p class="text-xs text-slate-500 font-mono">اسم المستخدم: ${user ? user.username : '-'}</p>
                    <span class="text-[11px] font-bold text-indigo-600">${user ? user.title || user.role : ''}</span>
                </div>
            </div>

            <div class="space-y-2">
                <button onclick="App.showRoleSwitcherModal()" class="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between border border-slate-200">
                    <span>تبديل نوع الحساب (تجربة الأدوار)</span>
                    <i data-lucide="shuffle" class="w-4 h-4"></i>
                </button>
                <button onclick="App.resetDemoData()" class="w-full p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-between border border-amber-200">
                    <span>استعادة البيانات الافتراضية للسنتر (Reset Demo)</span>
                    <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                </button>
                <button onclick="App.logout()" class="w-full p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-between border border-rose-200">
                    <span>تسجيل الخروج</span>
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
        `;

        CommonUI.openModal("خيارات الحساب والمستخدم", content);
    },

    showRoleSwitcherModal() {
        const content = `
        <div class="space-y-4 text-right">
            <p class="text-xs text-slate-600 font-medium">يمكنك التبديل الفوري بين أدوار المنصة لاختبار جميع الوظائف:</p>

            <div class="space-y-3">
                <!-- Role 1: Super Admin -->
                <div onclick="Store.switchRole('superadmin'); CommonUI.closeModal(); CommonUI.toast('تم التبديل إلى حساب مس مارينا (سوبر أدمن)', 'success');" class="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 cursor-pointer transition flex items-center justify-between">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <span class="text-2xl">👩‍🏫</span>
                        <div>
                            <h4 class="font-bold text-slate-900 text-xs">مس مارينا (Super Admin)</h4>
                            <p class="text-[11px] text-purple-700">صاحبة السنتر، المعلمة، والتقارير المالية والتحصيل</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-purple-700">دخول ←</span>
                </div>

                <!-- Role 2: Coordinator -->
                <div onclick="Store.switchRole('admin'); CommonUI.closeModal(); CommonUI.toast('تم التبديل إلى حساب الكوردينيتور (أدمن)', 'success');" class="p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 cursor-pointer transition flex items-center justify-between">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <span class="text-2xl">👨‍💼</span>
                        <div>
                            <h4 class="font-bold text-slate-900 text-xs">كوردينيتور السنتر (Coordinator)</h4>
                            <p class="text-[11px] text-blue-700">ضبط المواعيد، تحضير الحصص، مراجعة التعويضات، والدعم</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-blue-700">دخول ←</span>
                </div>

                <!-- Role 3: Parent / Student -->
                <div onclick="Store.switchRole('parent', 'user-p1'); CommonUI.closeModal(); CommonUI.toast('تم التبديل إلى حساب ولي أمر يوسف', 'success');" class="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 cursor-pointer transition flex items-center justify-between">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <span class="text-2xl">👦</span>
                        <div>
                            <h4 class="font-bold text-slate-900 text-xs">ولي الأمر (يوسف أحمد - Primary 3)</h4>
                            <p class="text-[11px] text-emerald-700">متابعة الحضور، وسائل الدفع، وطلب الحصص التعويضية</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-emerald-700">دخول ←</span>
                </div>

                <!-- Role 4: Parent 2 (KG) -->
                <div onclick="Store.switchRole('parent', 'user-p2'); CommonUI.closeModal(); CommonUI.toast('تم التبديل إلى حساب ولي أمر ليلى (KG2)', 'success');" class="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition flex items-center justify-between">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <span class="text-2xl">👧</span>
                        <div>
                            <h4 class="font-bold text-slate-900 text-xs">ولي أمر ليلى (KG 2 - English)</h4>
                            <p class="text-[11px] text-slate-500">طالبة بمرحلة رياض الأطفال</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-slate-600">دخول ←</span>
                </div>
            </div>
        </div>
        `;

        CommonUI.openModal("التبديل بين أدوار المنصة", content);
    },

    resetDemoData() {
        if (confirm("هل تريد استعادة البيانات الافتراضية الأصلية ومسح البيانات المؤقتة؟")) {
            Store.resetToDefaults();
            CommonUI.closeModal();
            CommonUI.toast("تمت استعادة البيانات الافتراضية بنجاح", "info");
            this.render();
        }
    },

    logout() {
        Store.logout();
        CommonUI.closeModal();
        CommonUI.toast("تم تسجيل الخروج بنجاح", "info");
        this.render();
    }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
