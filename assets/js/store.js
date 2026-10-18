/**
 * Store & State Management with LocalStorage persistence
 */
const Store = {
    STORAGE_KEY: "miss_marina_academy_db_v1",
    SESSION_KEY: "miss_marina_active_user_v1",

    data: null,
    currentUser: null,
    listeners: [],

    init() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this.data = JSON.parse(saved);
            } else {
                this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
                this.save();
            }

            const savedUser = localStorage.getItem(this.SESSION_KEY);
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            } else {
                // Default to Superadmin for initial preview or Coordinator
                this.currentUser = this.data.users.find(u => u.role === "coordinator" || u.role === "admin") || this.data.users[0];
                this.saveSession();
            }
        } catch (e) {
            console.error("Store init error, falling back to defaults", e);
            this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
            this.currentUser = this.data.users[0];
        }
    },

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            this.notify();
        } catch (e) {
            console.error("Failed to save to localStorage", e);
        }
    },

    saveSession() {
        if (this.currentUser) {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem(this.SESSION_KEY);
        }
    },

    resetToDefaults() {
        this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.save();
        this.setCurrentUser(this.data.users[0]);
    },

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    },

    notify() {
        this.listeners.forEach(fn => {
            try {
                fn(this.data);
            } catch (err) {
                console.error("Listener error", err);
            }
        });
    },

    // ---------------- AUTH & USERS ---------------- //
    getCurrentUser() {
        return this.currentUser;
    },

    setCurrentUser(user) {
        this.currentUser = user;
        this.saveSession();
        this.notify();
    },

    login(usernameOrPhone, password) {
        const cleanIdentifier = String(usernameOrPhone).trim().toLowerCase();
        const user = this.data.users.find(u => 
            (u.username.toLowerCase() === cleanIdentifier || u.phone === cleanIdentifier) &&
            u.password === password
        );
        if (user) {
            this.setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
    },

    logout() {
        this.currentUser = null;
        this.saveSession();
        this.notify();
    },

    switchRole(roleName, customId = null) {
        if (customId) {
            const found = this.data.users.find(u => u.id === customId);
            if (found) {
                this.setCurrentUser(found);
                return;
            }
        }
        const target = this.data.users.find(u => u.role === roleName);
        if (target) {
            this.setCurrentUser(target);
        }
    },

    registerParentStudent({ parentName, studentName, phone, password, grade, stage, subjects, preferredDay }) {
        // Generate unique username
        const baseUsername = studentName.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/gi, '') || "student";
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const username = `${baseUsername}${randomSuffix}`;
        const newUserId = `user-${Date.now()}`;

        const newUser = {
            id: newUserId,
            username: username,
            password: password || "123456",
            name: `${parentName} (ولي أمر ${studentName.split(" ")[0]})`,
            studentName: studentName,
            role: "parent",
            phone: phone,
            grade: grade,
            stage: stage || (grade.includes("KG") ? "kg" : "primary"),
            subjects: subjects || ["math"],
            avatar: stage === "kg" ? "👧" : "👦",
            groupIds: [],
            joinedDate: new Date().toISOString().split("T")[0]
        };

        this.data.users.push(newUser);

        // Also add a pending registration note for the coordinator to assign group
        this.data.registrations.unshift({
            id: `reg-${Date.now()}`,
            parentName,
            studentName,
            phone,
            stage: newUser.stage,
            grade,
            subjects,
            preferredDays: preferredDay ? [preferredDay] : ["حسب المتاح"],
            status: "pending",
            createdAt: new Date().toLocaleString("ar-EG"),
            userId: newUserId,
            notes: "تم إنشاء الحساب عبر صفحة التسجيل وفي انتظار تنسيق المجموعة مع الكوردينيتور"
        });

        // Add welcome message in chat
        this.data.messages.push({
            id: `msg-${Date.now()}`,
            studentId: newUserId,
            parentName: parentName,
            sender: "coordinator",
            text: `أهلاً بحضرتك يا فندم في سنتر مس مارينا! سعداء بانضمام البطل ${studentName}. أنا كوردينيتور السنتر ومع حضرتك لأي استفسار ولتنسيق المواعيد الأنسب لكم.`,
            timestamp: new Date().toLocaleString("ar-EG"),
            read: false
        });

        this.save();
        return { success: true, user: newUser, credentials: { username, password: newUser.password } };
    },

    // ---------------- STUDENTS ---------------- //
    getStudents() {
        return this.data.users.filter(u => u.role === "parent");
    },

    getStudentById(id) {
        return this.data.users.find(u => u.id === id);
    },

    updateStudent(studentId, updatedFields) {
        const idx = this.data.users.findIndex(u => u.id === studentId);
        if (idx !== -1) {
            this.data.users[idx] = { ...this.data.users[idx], ...updatedFields };
            if (this.currentUser && this.currentUser.id === studentId) {
                this.currentUser = { ...this.currentUser, ...updatedFields };
                this.saveSession();
            }
            this.save();
            return true;
        }
        return false;
    },

    // ---------------- GROUPS & SCHEDULE ---------------- //
    getGroups() {
        return this.data.groups;
    },

    addGroup(group) {
        const newGroup = {
            id: `grp-${Date.now()}`,
            teacher: "مس مارينا",
            studentIds: [],
            ...group
        };
        this.data.groups.push(newGroup);
        this.save();
        return newGroup;
    },

    updateGroup(id, updatedFields) {
        const idx = this.data.groups.findIndex(g => g.id === id);
        if (idx !== -1) {
            this.data.groups[idx] = { ...this.data.groups[idx], ...updatedFields };
            this.save();
            return true;
        }
        return false;
    },

    deleteGroup(id) {
        this.data.groups = this.data.groups.filter(g => g.id !== id);
        this.save();
    },

    assignStudentToGroup(studentId, groupId) {
        const group = this.data.groups.find(g => g.id === groupId);
        const student = this.data.users.find(u => u.id === studentId);
        if (group && student) {
            if (!group.studentIds.includes(studentId)) {
                group.studentIds.push(studentId);
            }
            if (!student.groupIds.includes(groupId)) {
                student.groupIds.push(groupId);
            }
            this.save();
            return true;
        }
        return false;
    },

    removeStudentFromGroup(studentId, groupId) {
        const group = this.data.groups.find(g => g.id === groupId);
        const student = this.data.users.find(u => u.id === studentId);
        if (group) {
            group.studentIds = group.studentIds.filter(id => id !== studentId);
        }
        if (student) {
            student.groupIds = student.groupIds.filter(id => id !== groupId);
        }
        this.save();
    },

    // ---------------- ATTENDANCE & SESSIONS ---------------- //
    getAttendance(studentId = null) {
        if (studentId) {
            return this.data.attendance.filter(a => a.studentId === studentId);
        }
        return this.data.attendance;
    },

    addAttendanceRecord(record) {
        const newRecord = {
            id: `att-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            homeworkDone: true,
            status: "attended",
            ...record
        };
        this.data.attendance.unshift(newRecord);
        this.save();
        return newRecord;
    },

    updateAttendanceStatus(id, status, notes = "") {
        const item = this.data.attendance.find(a => a.id === id);
        if (item) {
            item.status = status;
            if (notes) item.notes = notes;
            this.save();
            return true;
        }
        return false;
    },

    // ---------------- MAKE-UP SESSIONS (الحصص التعويضية) ---------------- //
    getMakeupSlots() {
        return this.data.makeupSlots;
    },

    addMakeupSlot(slot) {
        const newSlot = {
            id: `makeup-slot-${Date.now()}`,
            teacher: "مس مارينا",
            availableSeats: parseInt(slot.maxSeats || 4),
            maxSeats: parseInt(slot.maxSeats || 4),
            ...slot
        };
        this.data.makeupSlots.unshift(newSlot);
        this.save();
        return newSlot;
    },

    deleteMakeupSlot(id) {
        this.data.makeupSlots = this.data.makeupSlots.filter(s => s.id !== id);
        this.save();
    },

    getMakeupRequests(studentId = null) {
        if (studentId) {
            return this.data.makeupRequests.filter(r => r.studentId === studentId);
        }
        return this.data.makeupRequests;
    },

    createMakeupRequest({ studentId, missedGroupId, missedDate, reason, targetMakeupSlotId }) {
        const student = this.getStudentById(studentId);
        const slot = this.data.makeupSlots.find(s => s.id === targetMakeupSlotId);
        const group = this.data.groups.find(g => g.id === missedGroupId);

        if (!student || !slot) {
            return { success: false, message: "بيانات الطالب أو الحصة التعويضية غير صحيحة" };
        }

        if (slot.availableSeats <= 0) {
            return { success: false, message: "عفواً، لا توجد مقاعد شاغرة في هذه الحصة التعويضية" };
        }

        const newRequest = {
            id: `mkr-${Date.now()}`,
            studentId: student.id,
            studentName: student.studentName,
            parentName: student.name,
            phone: student.phone,
            missedGroupId: missedGroupId || (group ? group.id : ""),
            missedDate: missedDate || new Date().toISOString().split("T")[0],
            subject: group ? group.subjectName : (slot.subject === "math" ? "Math" : "English"),
            grade: student.grade,
            reason: reason || "اعتذار عن الحصة الأساسية وطلب موعد بديل",
            targetMakeupSlotId: slot.id,
            targetDate: slot.date,
            targetTime: `${slot.time} (${slot.day})`,
            status: "pending",
            coordinatorNote: "طلب جديد قيد مراجعة الكوردينيتور لتأكيد الحجز",
            requestedAt: new Date().toLocaleString("ar-EG")
        };

        this.data.makeupRequests.unshift(newRequest);

        // Update attendance status for the missed session if exists
        const attRecord = this.data.attendance.find(a => a.studentId === studentId && (a.date === missedDate || a.status === 'upcoming'));
        if (attRecord) {
            attRecord.status = "makeup_requested";
            attRecord.makeupRequested = true;
            attRecord.notes = `تم طلب حصة تعويضية: ${slot.day} ${slot.time}`;
        }

        this.save();
        return { success: true, request: newRequest };
    },

    updateMakeupRequestStatus(requestId, status, coordinatorNote = "") {
        const req = this.data.makeupRequests.find(r => r.id === requestId);
        if (!req) return false;

        const prevStatus = req.status;
        req.status = status;
        if (coordinatorNote) req.coordinatorNote = coordinatorNote;

        // If approved and wasn't approved before, decrement available seats in the makeup slot
        const slot = this.data.makeupSlots.find(s => s.id === req.targetMakeupSlotId);
        if (slot) {
            if (status === "approved" && prevStatus !== "approved") {
                slot.availableSeats = Math.max(0, slot.availableSeats - 1);
            } else if (prevStatus === "approved" && status !== "approved") {
                slot.availableSeats = Math.min(slot.maxSeats, slot.availableSeats + 1);
            }
        }

        // Notify parent via chat
        this.data.messages.push({
            id: `msg-${Date.now()}`,
            studentId: req.studentId,
            parentName: req.parentName,
            sender: "coordinator",
            text: status === "approved" 
                ? `تمت الموافقة على طلب الحصة التعويضية لمادة (${req.subject}) يوم ${req.targetTime}. في انتظار حضور البطل!`
                : `بخصوص طلب الحصة التعويضية: ${coordinatorNote || 'يرجى مراجعة الكوردينيتور لاختيار موعد آخر مناسب.'}`,
            timestamp: new Date().toLocaleString("ar-EG"),
            read: false
        });

        this.save();
        return true;
    },

    // ---------------- PAYMENTS & INVOICES ---------------- //
    getPayments(studentId = null) {
        if (studentId) {
            return this.data.payments.filter(p => p.studentId === studentId);
        }
        return this.data.payments;
    },

    submitPaymentNotice({ studentId, month, amount, method, referenceNumber, receiptNote, receiptBase64 }) {
        const student = this.getStudentById(studentId);
        if (!student) return { success: false, message: "الطالب غير موجود" };

        const newPayment = {
            id: `inv-${Date.now()}`,
            studentId: student.id,
            studentName: student.studentName,
            month: month || "اشتراك الشهر الحالي",
            amount: parseFloat(amount) || 450,
            subjects: student.subjects.map(s => s === 'math' ? 'Math (ماث)' : 'English (إنجليزي)'),
            method: method || "vodafone_cash",
            referenceNumber: referenceNumber || "REF-" + Math.floor(100000 + Math.random() * 900000),
            receiptImage: receiptBase64 || "",
            status: "pending_review",
            paymentDate: new Date().toLocaleString("ar-EG"),
            notes: receiptNote || "تم رفع إشعار التحويل من ولي الأمر وبانتظار اعتماد الكوردينيتور"
        };

        this.data.payments.unshift(newPayment);

        // Notify coordinator in messages
        this.data.messages.push({
            id: `msg-${Date.now()}`,
            studentId: student.id,
            parentName: student.name,
            sender: "parent",
            text: `تم تحويل مبلغ ${amount} ج عن طريق (${method}) لشهر ${month}. رقم المعاملة: ${referenceNumber || 'مرفق إشعار'}. برجاء التأكيد.`,
            timestamp: new Date().toLocaleString("ar-EG"),
            read: false
        });

        this.save();
        return { success: true, payment: newPayment };
    },

    confirmPayment(paymentId, status, notes = "") {
        const payment = this.data.payments.find(p => p.id === paymentId);
        if (!payment) return false;

        payment.status = status;
        if (notes) payment.notes = notes;
        payment.reviewedAt = new Date().toLocaleString("ar-EG");

        // Send confirmation chat
        this.data.messages.push({
            id: `msg-${Date.now()}`,
            studentId: payment.studentId,
            parentName: payment.studentName,
            sender: "coordinator",
            text: status === "paid" 
                ? `تم تأكيد استلام اشتراك شهر ${payment.month} بمبلغ ${payment.amount} ج بنجاح. شكراً لحضرتك!`
                : `تنبيه بشأن عملية الدفع لشهر ${payment.month}: ${notes || 'يرجى مراجعة إيصال التحويل مع الكوردينيتور.'}`,
            timestamp: new Date().toLocaleString("ar-EG"),
            read: false
        });

        this.save();
        return true;
    },

    updatePaymentSettings(settings) {
        this.data.centerInfo.payments = {
            ...this.data.centerInfo.payments,
            ...settings
        };
        this.save();
    },

    // ---------------- MESSAGING / CHAT ---------------- //
    getMessages(studentId = null) {
        if (studentId) {
            return this.data.messages.filter(m => m.studentId === studentId);
        }
        return this.data.messages;
    },

    sendMessage({ studentId, sender, text }) {
        const student = this.getStudentById(studentId);
        const newMsg = {
            id: `msg-${Date.now()}`,
            studentId: studentId,
            parentName: student ? student.name : "ولي الأمر",
            sender: sender || "coordinator",
            text: text.trim(),
            timestamp: new Date().toLocaleString("ar-EG", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
            read: sender === "parent" ? false : true
        };
        this.data.messages.push(newMsg);
        this.save();
        return newMsg;
    },

    markMessagesAsRead(studentId) {
        let changed = false;
        this.data.messages.forEach(m => {
            if (m.studentId === studentId && !m.read) {
                m.read = true;
                changed = true;
            }
        });
        if (changed) this.save();
    },

    // ---------------- REGISTRATIONS ---------------- //
    getRegistrations() {
        return this.data.registrations || [];
    },

    updateRegistrationStatus(id, status, notes = "") {
        const reg = (this.data.registrations || []).find(r => r.id === id);
        if (reg) {
            reg.status = status;
            if (notes) reg.notes = notes;
            this.save();
            return true;
        }
        return false;
    }
};

// Global helper access
window.Store = Store;
