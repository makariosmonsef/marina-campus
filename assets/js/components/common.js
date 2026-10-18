/**
 * Common UI Components & Utilities
 */
const CommonUI = {
    // Show Toast Notification
    toast(message, type = "success") {
        const container = document.getElementById("toast-container") || this.createToastContainer();
        const toastEl = document.createElement("div");
        
        const bgColors = {
            success: "bg-emerald-600 text-white",
            error: "bg-rose-600 text-white",
            warning: "bg-amber-500 text-white",
            info: "bg-sky-600 text-white"
        };
        const icons = {
            success: `<i data-lucide="check-circle-2" class="w-5 h-5 ml-2"></i>`,
            error: `<i data-lucide="alert-octagon" class="w-5 h-5 ml-2"></i>`,
            warning: `<i data-lucide="alert-triangle" class="w-5 h-5 ml-2"></i>`,
            info: `<i data-lucide="info" class="w-5 h-5 ml-2"></i>`
        };

        toastEl.className = `flex items-center px-4 py-3 rounded-xl shadow-xl transition-all transform duration-300 translate-y-2 opacity-0 text-sm font-medium ${bgColors[type] || bgColors.success}`;
        toastEl.innerHTML = `
            <div class="flex items-center">
                ${icons[type] || icons.success}
                <span>${message}</span>
            </div>
            <button class="mr-3 text-white/80 hover:text-white" onclick="this.parentElement.remove()">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;

        container.appendChild(toastEl);
        if (window.lucide) lucide.createIcons();

        // Animate in
        requestAnimationFrame(() => {
            toastEl.classList.remove("translate-y-2", "opacity-0");
        });

        // Auto remove
        setTimeout(() => {
            toastEl.classList.add("opacity-0", "translate-y-2");
            setTimeout(() => toastEl.remove(), 300);
        }, 4000);
    },

    createToastContainer() {
        const c = document.createElement("div");
        c.id = "toast-container";
        c.className = "fixed bottom-5 left-5 z-50 flex flex-col space-y-2 pointer-events-auto max-w-sm w-full";
        document.body.appendChild(c);
        return c;
    },

    // Modal Manager
    openModal(title, contentHtml, footerHtml = "") {
        const modalBackdrop = document.getElementById("global-modal");
        const modalTitle = document.getElementById("global-modal-title");
        const modalBody = document.getElementById("global-modal-body");
        const modalFooter = document.getElementById("global-modal-footer");

        if (modalBackdrop && modalTitle && modalBody) {
            modalTitle.innerText = title;
            modalBody.innerHTML = contentHtml;
            if (modalFooter) {
                modalFooter.innerHTML = footerHtml;
                modalFooter.style.display = footerHtml ? "flex" : "none";
            }
            modalBackdrop.classList.remove("hidden");
            modalBackdrop.classList.add("flex");
            if (window.lucide) lucide.createIcons();
        }
    },

    closeModal() {
        const modalBackdrop = document.getElementById("global-modal");
        if (modalBackdrop) {
            modalBackdrop.classList.add("hidden");
            modalBackdrop.classList.remove("flex");
        }
    },

    // Navigation Header with Quick Role Switching
    renderHeader(currentUser) {
        const user = currentUser || { role: "guest", name: "زائر" };
        const unreadCount = Store.getMessages().filter(m => !m.read && m.sender === "parent").length;
        const pendingPaymentsCount = Store.getPayments().filter(p => p.status === "pending_review").length;
        const pendingMakeupCount = Store.getMakeupRequests().filter(r => r.status === "pending").length;

        const roleBadges = {
            superadmin: `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">👑 سوبر أدمن (مس مارينا)</span>`,
            admin: `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">🛠️ كوردينيتور السنتر (أدمن)</span>`,
            parent: `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">👨‍👧 ولي أمر / طالب</span>`
        };

        return `
        <header class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                
                <!-- Logo & Brand -->
                <div class="flex items-center space-x-3 space-x-reverse cursor-pointer" onclick="App.navigate('dashboard')">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 ring-2 ring-purple-100">
                        <i data-lucide="graduation-cap" class="w-7 h-7"></i>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <h1 class="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">سنتر مس مارينا التعليمي</h1>
                            <span class="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md font-bold">Math & English</span>
                        </div>
                        <p class="text-xs text-slate-500 font-medium">مراحل رياض الأطفال (KG) والابتدائي (Primary)</p>
                    </div>
                </div>

                <!-- Center: Quick Role Switcher (For Pair Programming / Demo & Testing) -->
                <div class="hidden lg:flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <span class="text-xs text-slate-500 px-2 font-semibold">تبديل الحساب للتجربة:</span>
                    <button onclick="Store.switchRole('superadmin')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${user.role === 'superadmin' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-purple-600 hover:bg-white'}">
                        👑 مس مارينا (سوبر أدمن)
                    </button>
                    <button onclick="Store.switchRole('admin')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${user.role === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-blue-600 hover:bg-white'}">
                        👨‍💼 الكوردينيتور (أدمن)
                        ${(pendingPaymentsCount + pendingMakeupCount + unreadCount) > 0 ? `<span class="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1 animate-pulse"></span>` : ''}
                    </button>
                    <button onclick="Store.switchRole('parent', 'user-p1')" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${user.role === 'parent' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-emerald-600 hover:bg-white'}">
                        👦 ولي الأمر (يوسف أحمد)
                    </button>
                </div>

                <!-- Right Side Actions & Profile -->
                <div class="flex items-center space-x-3 space-x-reverse">
                    
                    ${user.role === 'admin' || user.role === 'superadmin' ? `
                        <!-- Pending notifications -->
                        <div class="relative">
                            <button onclick="App.navigate('makeup-requests')" title="الطلبات المعلقة" class="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 relative transition">
                                <i data-lucide="bell" class="w-5 h-5"></i>
                                ${(pendingMakeupCount + pendingPaymentsCount) > 0 ? `
                                    <span class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                                        ${pendingMakeupCount + pendingPaymentsCount}
                                    </span>
                                ` : ''}
                            </button>
                        </div>
                    ` : ''}

                    <!-- User Card & Menu -->
                    <div class="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 pr-3">
                        <div class="text-right ml-3 hidden sm:block">
                            <div class="text-xs font-bold text-slate-800 leading-tight">${user.studentName || user.name}</div>
                            <div class="text-[11px] text-slate-500">${roleBadges[user.role] || user.role}</div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-lg shadow-sm">
                            ${user.avatar || '👤'}
                        </div>
                        <button onclick="App.showUserMenu()" class="text-slate-400 hover:text-slate-600 p-1 mr-1">
                            <i data-lucide="chevron-down" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Logout / Switch modal trigger on mobile -->
                    <button onclick="App.showRoleSwitcherModal()" class="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center">
                        <i data-lucide="user-check" class="w-4 h-4 ml-1"></i>
                        <span>تبديل</span>
                    </button>
                </div>

            </div>
        </header>
        `;
    },

    // Bottom Navigation Bar for Mobile
    renderMobileNav(role) {
        let items = [];
        if (role === 'parent') {
            items = [
                { id: 'dashboard', label: 'الرئيسية', icon: 'home' },
                { id: 'parent-schedule', label: 'مواعيدي', icon: 'calendar' },
                { id: 'parent-attendance', label: 'الحضور', icon: 'clipboard-check' },
                { id: 'parent-payments', label: 'الدفع والمصاريف', icon: 'credit-card' },
                { id: 'parent-makeup', label: 'حصة تعويضية', icon: 'refresh-cw' },
                { id: 'parent-chat', label: 'الكوردينيتور', icon: 'message-circle' }
            ];
        } else if (role === 'admin') {
            items = [
                { id: 'dashboard', label: 'اللوحة', icon: 'layout-dashboard' },
                { id: 'groups-management', label: 'المواعيد', icon: 'calendar' },
                { id: 'attendance-manager', label: 'تحضير الحصص', icon: 'check-square' },
                { id: 'payments-manager', label: 'المدفوعات', icon: 'wallet' },
                { id: 'makeup-requests', label: 'التعويضات', icon: 'refresh-cw' },
                { id: 'messages-center', label: 'المحادثات', icon: 'message-square' }
            ];
        } else {
            // superadmin
            items = [
                { id: 'dashboard', label: 'الرئيسية', icon: 'layout-dashboard' },
                { id: 'groups-management', label: 'كل المجموعات', icon: 'layers' },
                { id: 'students-list', label: 'الطلاب', icon: 'users' },
                { id: 'financial-reports', label: 'المالية', icon: 'dollar-sign' },
                { id: 'makeup-slots-manager', label: 'المواعيد المتاحة', icon: 'clock' },
                { id: 'center-settings', label: 'بيانات السنتر', icon: 'settings' }
            ];
        }

        return `
        <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-2 px-3 shadow-lg flex justify-around items-center">
            ${items.map(item => `
                <button onclick="App.navigate('${item.id}')" class="flex flex-col items-center justify-center text-xs font-semibold py-1 px-2 rounded-xl transition ${App.currentTab === item.id ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-500 hover:text-slate-900'}">
                    <i data-lucide="${item.icon}" class="w-5 h-5 mb-1"></i>
                    <span class="text-[10px]">${item.label}</span>
                </button>
            `).join('')}
        </nav>
        `;
    }
};

window.CommonUI = CommonUI;
