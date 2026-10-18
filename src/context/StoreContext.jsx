import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_DATA } from '../data/initialData';

const StoreContext = createContext();

const STORAGE_KEY = "miss_marina_academy_db_v2";
const SESSION_KEY = "miss_marina_active_user_v2";

export const StoreProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    }
    // Default to Coordinator or Super Admin for preview
    const initialUsers = INITIAL_DATA.users;
    return initialUsers.find(u => u.role === "admin" || u.role === "coordinator") || initialUsers[0];
  });

  // Sync data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data to localStorage", e);
    }
  }, [data]);

  // Sync user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  }, [currentUser]);

  // ---------------- AUTH ---------------- //
  const login = useCallback((identifier, password) => {
    const cleanId = String(identifier).trim().toLowerCase();
    const user = data.users.find(u =>
      (u.username.toLowerCase() === cleanId || u.phone === cleanId) &&
      u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
  }, [data.users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const switchRole = useCallback((roleName, customId = null) => {
    if (customId) {
      const found = data.users.find(u => u.id === customId);
      if (found) {
        setCurrentUser(found);
        return;
      }
    }
    const target = data.users.find(u => u.role === roleName);
    if (target) {
      setCurrentUser(target);
    }
  }, [data.users]);

  const resetToDefaults = useCallback(() => {
    const fresh = JSON.parse(JSON.stringify(INITIAL_DATA));
    setData(fresh);
    setCurrentUser(fresh.users[0]);
  }, []);

  // ---------------- REGISTRATION ---------------- //
  const registerParentStudent = useCallback(({ parentName, studentName, phone, password, grade, stage, subjects, preferredDay }) => {
    const baseUsername = studentName.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/gi, '') || "student";
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const username = `${baseUsername}${randomSuffix}`;
    const newUserId = `user-${Date.now()}`;

    const newUser = {
      id: newUserId,
      username,
      password: password || "123456",
      name: `${parentName} (ولي أمر ${studentName.split(" ")[0]})`,
      nameEn: `${parentName} (Parent)`,
      studentName,
      studentNameEn: studentName,
      role: "parent",
      phone,
      grade,
      stage: stage || (grade.includes("KG") ? "kg" : "primary"),
      subjects: subjects || ["math"],
      avatar: (grade.includes("KG")) ? "👧" : "👦",
      groupIds: [],
      joinedDate: new Date().toISOString().split("T")[0]
    };

    const newReg = {
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
      notes: "تم إنشاء الحساب عبر صفحة التسجيل وفي انتظار تنسيق المجموعة"
    };

    const welcomeMsg = {
      id: `msg-${Date.now()}`,
      studentId: newUserId,
      parentName,
      sender: "coordinator",
      text: `أهلاً بحضرتك في سنتر مس مارينا! سعداء بانضمام البطل ${studentName}. أنا كوردينيتور السنتر ومع حضرتك لتنسيق المواعيد الأنسب لكم.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      registrations: [newReg, ...prev.registrations],
      messages: [...prev.messages, welcomeMsg]
    }));

    return { success: true, user: newUser, credentials: { username, password: newUser.password } };
  }, []);

  // ---------------- STUDENTS ---------------- //
  const getStudents = useCallback(() => {
    return data.users.filter(u => u.role === "parent");
  }, [data.users]);

  const updateStudent = useCallback((studentId, fields) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === studentId ? { ...u, ...fields } : u)
    }));
    setCurrentUser(prev => prev && prev.id === studentId ? { ...prev, ...fields } : prev);
  }, []);

  // ---------------- GROUPS ---------------- //
  const addGroup = useCallback((groupData) => {
    const newGroup = {
      id: `grp-${Date.now()}`,
      teacher: "مس مارينا",
      studentIds: [],
      ...groupData
    };
    setData(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup]
    }));
    return newGroup;
  }, []);

  const updateGroup = useCallback((groupId, fields) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, ...fields } : g)
    }));
  }, []);

  const deleteGroup = useCallback((groupId) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== groupId)
    }));
  }, []);

  const assignStudentToGroup = useCallback((studentId, groupId) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => {
        if (g.id === groupId && !g.studentIds.includes(studentId)) {
          return { ...g, studentIds: [...g.studentIds, studentId] };
        }
        return g;
      }),
      users: prev.users.map(u => {
        if (u.id === studentId && !u.groupIds.includes(groupId)) {
          return { ...u, groupIds: [...u.groupIds, groupId] };
        }
        return u;
      })
    }));
  }, []);

  const removeStudentFromGroup = useCallback((studentId, groupId) => {
    setData(prev => ({
      ...prev,
      groups: prev.groups.map(g => {
        if (g.id === groupId) {
          return { ...g, studentIds: g.studentIds.filter(id => id !== studentId) };
        }
        return g;
      }),
      users: prev.users.map(u => {
        if (u.id === studentId) {
          return { ...u, groupIds: u.groupIds.filter(id => id !== groupId) };
        }
        return u;
      })
    }));
  }, []);

  // ---------------- ATTENDANCE ---------------- //
  const addAttendanceBatch = useCallback((records) => {
    setData(prev => ({
      ...prev,
      attendance: [...records, ...prev.attendance]
    }));
  }, []);

  const updateAttendanceStatus = useCallback((attId, status, notes = "") => {
    setData(prev => ({
      ...prev,
      attendance: prev.attendance.map(a => a.id === attId ? { ...a, status, ...(notes ? { notes } : {}) } : a)
    }));
  }, []);

  // ---------------- MAKE-UP SLOTS & REQUESTS ---------------- //
  const addMakeupSlot = useCallback((slotData) => {
    const newSlot = {
      id: `makeup-slot-${Date.now()}`,
      teacher: "مس مارينا",
      availableSeats: parseInt(slotData.maxSeats || 4),
      maxSeats: parseInt(slotData.maxSeats || 4),
      ...slotData
    };
    setData(prev => ({
      ...prev,
      makeupSlots: [newSlot, ...prev.makeupSlots]
    }));
    return newSlot;
  }, []);

  const deleteMakeupSlot = useCallback((slotId) => {
    setData(prev => ({
      ...prev,
      makeupSlots: prev.makeupSlots.filter(s => s.id !== slotId)
    }));
  }, []);

  const createMakeupRequest = useCallback(({ studentId, missedGroupId, missedDate, reason, targetMakeupSlotId }) => {
    const student = data.users.find(u => u.id === studentId);
    const slot = data.makeupSlots.find(s => s.id === targetMakeupSlotId);
    const group = data.groups.find(g => g.id === missedGroupId);

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

    setData(prev => {
      // update attendance record if matches
      const updatedAttendance = prev.attendance.map(a => {
        if (a.studentId === studentId && (a.date === missedDate || a.status === 'upcoming')) {
          return {
            ...a,
            status: "makeup_requested",
            makeupRequested: true,
            notes: `تم طلب حصة تعويضية: ${slot.day} ${slot.time}`
          };
        }
        return a;
      });

      return {
        ...prev,
        makeupRequests: [newRequest, ...prev.makeupRequests],
        attendance: updatedAttendance
      };
    });

    return { success: true, request: newRequest };
  }, [data.users, data.makeupSlots, data.groups]);

  const updateMakeupRequestStatus = useCallback((requestId, status, note = "") => {
    setData(prev => {
      const targetReq = prev.makeupRequests.find(r => r.id === requestId);
      if (!targetReq) return prev;

      const prevStatus = targetReq.status;

      // Adjust seat counts
      const updatedSlots = prev.makeupSlots.map(s => {
        if (s.id === targetReq.targetMakeupSlotId) {
          let newSeats = s.availableSeats;
          if (status === "approved" && prevStatus !== "approved") {
            newSeats = Math.max(0, s.availableSeats - 1);
          } else if (prevStatus === "approved" && status !== "approved") {
            newSeats = Math.min(s.maxSeats, s.availableSeats + 1);
          }
          return { ...s, availableSeats: newSeats };
        }
        return s;
      });

      const updatedRequests = prev.makeupRequests.map(r => {
        if (r.id === requestId) {
          return { ...r, status, ...(note ? { coordinatorNote: note } : {}) };
        }
        return r;
      });

      const newMsg = {
        id: `msg-${Date.now()}`,
        studentId: targetReq.studentId,
        parentName: targetReq.parentName,
        sender: "coordinator",
        text: status === "approved"
          ? `تمت الموافقة على طلب الحصة التعويضية لمادة (${targetReq.subject}) يوم ${targetReq.targetTime}. في انتظار حضور البطل!`
          : `بخصوص طلب الحصة التعويضية: ${note || 'يرجى مراجعة الكوردينيتور لاختيار موعد آخر مناسب.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      return {
        ...prev,
        makeupSlots: updatedSlots,
        makeupRequests: updatedRequests,
        messages: [...prev.messages, newMsg]
      };
    });
  }, []);

  // ---------------- PAYMENTS ---------------- //
  const submitPaymentNotice = useCallback(({ studentId, month, amount, method, referenceNumber, receiptNote, receiptBase64 }) => {
    const student = data.users.find(u => u.id === studentId);
    if (!student) return { success: false, message: "الطالب غير موجود" };

    const newPayment = {
      id: `inv-${Date.now()}`,
      studentId: student.id,
      studentName: student.studentName,
      month: month || "اشتراك الشهر الحالي",
      monthEn: month || "Current Month",
      amount: parseFloat(amount) || 450,
      subjects: student.subjects.map(s => s === 'math' ? 'Math (ماث)' : 'English (إنجليزي)'),
      method: method || "vodafone_cash",
      referenceNumber: referenceNumber || "REF-" + Math.floor(100000 + Math.random() * 900000),
      receiptImage: receiptBase64 || "",
      status: "pending_review",
      paymentDate: new Date().toLocaleString("ar-EG"),
      notes: receiptNote || "تم رفع إشعار التحويل وبانتظار اعتماد الكوردينيتور"
    };

    const newMsg = {
      id: `msg-${Date.now()}`,
      studentId: student.id,
      parentName: student.name,
      sender: "parent",
      text: `تم تحويل مبلغ ${amount} ج عن طريق (${method}) لشهر ${month}. رقم المعاملة: ${referenceNumber || 'مرفق إشعار'}. برجاء التأكيد.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setData(prev => ({
      ...prev,
      payments: [newPayment, ...prev.payments],
      messages: [...prev.messages, newMsg]
    }));

    return { success: true, payment: newPayment };
  }, [data.users]);

  const confirmPayment = useCallback((paymentId, status, notes = "") => {
    setData(prev => {
      const payment = prev.payments.find(p => p.id === paymentId);
      if (!payment) return prev;

      const updatedPayments = prev.payments.map(p => {
        if (p.id === paymentId) {
          return { ...p, status, notes: notes || p.notes, reviewedAt: new Date().toLocaleString("ar-EG") };
        }
        return p;
      });

      const newMsg = {
        id: `msg-${Date.now()}`,
        studentId: payment.studentId,
        parentName: payment.studentName,
        sender: "coordinator",
        text: status === "paid"
          ? `تم تأكيد استلام اشتراك شهر ${payment.month} بمبلغ ${payment.amount} ج بنجاح. شكراً لحضرتك!`
          : `تنبيه بشأن عملية الدفع لشهر ${payment.month}: ${notes || 'يرجى مراجعة إيصال التحويل مع الكوردينيتور.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      return {
        ...prev,
        payments: updatedPayments,
        messages: [...prev.messages, newMsg]
      };
    });
  }, []);

  const updatePaymentSettings = useCallback((newSettings) => {
    setData(prev => ({
      ...prev,
      centerInfo: {
        ...prev.centerInfo,
        payments: {
          ...prev.centerInfo.payments,
          ...newSettings
        }
      }
    }));
  }, []);

  // ---------------- MESSAGING / CHAT ---------------- //
  const sendMessage = useCallback(({ studentId, sender, text }) => {
    const student = data.users.find(u => u.id === studentId);
    const newMsg = {
      id: `msg-${Date.now()}`,
      studentId,
      parentName: student ? student.name : "ولي الأمر",
      sender: sender || "coordinator",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: sender === "parent" ? false : true
    };

    setData(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));

    return newMsg;
  }, [data.users]);

  const markMessagesAsRead = useCallback((studentId) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.studentId === studentId ? { ...m, read: true } : m)
    }));
  }, []);

  // ---------------- REGISTRATIONS ---------------- //
  const updateRegistrationStatus = useCallback((regId, status, notes = "") => {
    setData(prev => ({
      ...prev,
      registrations: prev.registrations.map(r => r.id === regId ? { ...r, status, ...(notes ? { notes } : {}) } : r)
    }));
  }, []);

  return (
    <StoreContext.Provider value={{
      data,
      currentUser,
      login,
      logout,
      switchRole,
      resetToDefaults,
      registerParentStudent,
      getStudents,
      updateStudent,
      addGroup,
      updateGroup,
      deleteGroup,
      assignStudentToGroup,
      removeStudentFromGroup,
      addAttendanceBatch,
      updateAttendanceStatus,
      addMakeupSlot,
      deleteMakeupSlot,
      createMakeupRequest,
      updateMakeupRequestStatus,
      submitPaymentNotice,
      confirmPayment,
      updatePaymentSettings,
      sendMessage,
      markMessagesAsRead,
      updateRegistrationStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
