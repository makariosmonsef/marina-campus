/**
 * Default Initial Data for Miss Marina Academy Platform
 */
const INITIAL_DATA = {
    centerInfo: {
        name: "أكاديمية وسنتر مس مارينا التعليمي",
        subTitle: "تأسيس وتفوق في مادتي الماث (Math) واللغة الإنجليزية (English) لمراحل KG والابتدائي",
        owner: "مس مارينا (Miss Marina)",
        coordinator: "منسق السنتر (Coordinator)",
        phone: "01012345678",
        whatsapp: "01012345678",
        address: "القاهرة - فرع السنتر الرئيسي (متاح أونلاين وحضوري)",
        payments: {
            vodafoneCash: {
                number: "01012345678",
                ownerName: "مارينا أشرف (مس مارينا)",
                instructions: "يرجى التحويل على رقم فودافون كاش ثم رفع صورة الإيصال أو إرسال رقم العملية لتأكيد الدفع."
            },
            instapay: {
                ipa: "marina.academy@instapay",
                phone: "01012345678",
                ownerName: "Marina Ashraf",
                instructions: "يمكنك التحويل الفوري عبر تطبيق إنستاباي باستخدام عنوان الدفع اللحظي أو رقم الهاتف."
            },
            bankTransfer: {
                bankName: "البنك الأهلي المصري (NBE)",
                accountNumber: "123456789012345",
                iban: "EG380003000001234567890123456",
                accountHolder: "مارينا أشرف بطرس",
                instructions: "يرجى كتابة اسم الطالب في خانة الملاحظات أثناء التحويل البنكي."
            }
        }
    },
    users: [
        {
            id: "user-superadmin",
            username: "marina",
            password: "123",
            name: "مس مارينا (Miss Marina)",
            role: "superadmin",
            email: "marina@academy.com",
            phone: "01012345678",
            avatar: "👩‍🏫",
            title: "المعلمة وصاحبة السنتر"
        },
        {
            id: "user-admin",
            username: "coordinator",
            password: "123",
            name: "كوردينيتور السنتر (أحمد المنسق)",
            role: "admin",
            email: "coordinator@academy.com",
            phone: "01234567890",
            avatar: "👨‍💼",
            title: "منسق المواعيد والأنشطة والرد على الاستفسارات"
        },
        {
            id: "user-p1",
            username: "youssef",
            password: "123",
            name: "أحمد إبراهيم (ولي أمر يوسف)",
            studentName: "يوسف أحمد إبراهيم",
            role: "parent",
            phone: "01155554433",
            grade: "Primary 3 (الصف الثالث)",
            stage: "primary",
            subjects: ["math", "english"],
            avatar: "👦",
            groupIds: ["grp-p3-math-sat", "grp-p3-eng-sat"],
            joinedDate: "2026-09-01"
        },
        {
            id: "user-p2",
            username: "layla",
            password: "123",
            name: "سارة محمود (ولي أمر ليلى)",
            studentName: "ليلى كريم أحمد",
            role: "parent",
            phone: "01088889922",
            grade: "KG 2",
            stage: "kg",
            subjects: ["english"],
            avatar: "👧",
            groupIds: ["grp-kg2-eng-sun"],
            joinedDate: "2026-09-10"
        },
        {
            id: "user-p3",
            username: "kevin",
            password: "123",
            name: "مينا سامح (ولي أمر كيفين)",
            studentName: "كيفين مينا سامح",
            role: "parent",
            phone: "01277771144",
            grade: "Primary 1 (الصف الأول)",
            stage: "primary",
            subjects: ["math"],
            avatar: "👦",
            groupIds: ["grp-p1-math-mon"],
            joinedDate: "2026-09-15"
        }
    ],
    groups: [
        {
            id: "grp-p3-math-sat",
            name: "ماث - الصف الثالث (مجموعة السبت)",
            subject: "math",
            subjectName: "Math (ماث)",
            grade: "Primary 3 (الصف الثالث)",
            stage: "primary",
            day: "السبت",
            time: "04:00 م - 05:30 م",
            teacher: "مس مارينا",
            maxCapacity: 12,
            studentIds: ["user-p1"],
            monthlyFee: 450,
            location: "قاعة 1 (السنتر الرئيسي)"
        },
        {
            id: "grp-p3-eng-sat",
            name: "إنجليزي - الصف الثالث (مجموعة السبت)",
            subject: "english",
            subjectName: "English (لغة إنجليزية)",
            grade: "Primary 3 (الصف الثالث)",
            stage: "primary",
            day: "السبت",
            time: "05:30 م - 07:00 م",
            teacher: "مس مارينا",
            maxCapacity: 12,
            studentIds: ["user-p1"],
            monthlyFee: 450,
            location: "قاعة 1 (السنتر الرئيسي)"
        },
        {
            id: "grp-kg2-eng-sun",
            name: "إنجليزي - مرحلة KG2 (مجموعة الأحد)",
            subject: "english",
            subjectName: "English Phonics & Fun (إنجليزي وتأسيس)",
            grade: "KG 2",
            stage: "kg",
            day: "الأحد",
            time: "03:30 م - 04:45 م",
            teacher: "مس مارينا",
            maxCapacity: 10,
            studentIds: ["user-p2"],
            monthlyFee: 400,
            location: "قاعة الأطفال (السنتر)"
        },
        {
            id: "grp-p1-math-mon",
            name: "ماث - الصف الأول (مجموعة الاثنين)",
            subject: "math",
            subjectName: "Math (ماث تأسيس وحساب ذهني)",
            grade: "Primary 1 (الصف الأول)",
            stage: "primary",
            day: "الاثنين",
            time: "04:00 م - 05:15 م",
            teacher: "مس مارينا",
            maxCapacity: 10,
            studentIds: ["user-p3"],
            monthlyFee: 400,
            location: "قاعة 2 (السنتر الرئيسي)"
        },
        {
            id: "grp-p4-math-tue",
            name: "ماث - الصف الرابع (مجموعة الثلاثاء)",
            subject: "math",
            subjectName: "Math (منهج رابعة ابتدائي الجديد)",
            grade: "Primary 4 (الصف الرابع)",
            stage: "primary",
            day: "الثلاثاء",
            time: "05:00 م - 06:30 م",
            teacher: "مس مارينا",
            maxCapacity: 12,
            studentIds: [],
            monthlyFee: 500,
            location: "قاعة 1"
        },
        {
            id: "grp-p5-eng-wed",
            name: "إنجليزي - الصف الخامس (مجموعة الأربعاء)",
            subject: "english",
            subjectName: "English Connect Plus & Grammar",
            grade: "Primary 5 (الصف الخامس)",
            stage: "primary",
            day: "الأربعاء",
            time: "05:00 م - 06:30 م",
            teacher: "مس مارينا",
            maxCapacity: 12,
            studentIds: [],
            monthlyFee: 500,
            location: "قاعة 1"
        }
    ],
    // الحصص التعويضية المتاحة (Available Make-up Sessions)
    makeupSlots: [
        {
            id: "makeup-slot-1",
            subject: "math",
            grade: "Primary 3 (الصف الثالث)",
            day: "الثلاثاء",
            date: "2026-10-20",
            time: "06:30 م - 08:00 م",
            teacher: "مس مارينا",
            availableSeats: 3,
            maxSeats: 4,
            note: "حصة تعويضية لمراجعة الوحدة الثانية وحل التمارين"
        },
        {
            id: "makeup-slot-2",
            subject: "english",
            grade: "Primary 3 (الصف الثالث)",
            day: "الخميس",
            date: "2026-10-22",
            time: "04:00 م - 05:30 م",
            teacher: "مس مارينا",
            availableSeats: 2,
            maxSeats: 4,
            note: "حصة تعويضية للجرامر والكلمات"
        },
        {
            id: "makeup-slot-3",
            subject: "english",
            grade: "KG 2",
            day: "الأربعاء",
            date: "2026-10-21",
            time: "03:30 م - 04:30 م",
            teacher: "مس مارينا",
            availableSeats: 4,
            maxSeats: 5,
            note: "حصة تعويضية صوتيات وألعاب تعليمية"
        },
        {
            id: "makeup-slot-4",
            subject: "math",
            grade: "Primary 1 (الصف الأول)",
            day: "الخميس",
            date: "2026-10-22",
            time: "05:30 م - 06:45 م",
            teacher: "مس مارينا",
            availableSeats: 3,
            maxSeats: 4,
            note: "حصة تعويضية للأرقام ومفاهيم الجمع"
        }
    ],
    // سجل الحصص والحضور والغياب (Sessions & Attendance)
    attendance: [
        {
            id: "att-1",
            studentId: "user-p1",
            groupId: "grp-p3-math-sat",
            date: "2026-10-03",
            dayName: "السبت",
            sessionTitle: "Math - Place Value & Addition",
            status: "attended", // attended, absent, makeup_requested, makeup_attended
            notes: "حضر وتفاعل بشكل ممتاز وحل الواجب كاملاً",
            homeworkDone: true
        },
        {
            id: "att-2",
            studentId: "user-p1",
            groupId: "grp-p3-eng-sat",
            date: "2026-10-03",
            dayName: "السبت",
            sessionTitle: "English - Unit 1 Phonics & Reading",
            status: "attended",
            notes: "أتقن القراءة وكان متميزاً",
            homeworkDone: true
        },
        {
            id: "att-3",
            studentId: "user-p1",
            groupId: "grp-p3-math-sat",
            date: "2026-10-10",
            dayName: "السبت",
            sessionTitle: "Math - Subtraction Strategies",
            status: "attended",
            notes: "حضر واختبار قصير 10/10",
            homeworkDone: true
        },
        {
            id: "att-4",
            studentId: "user-p1",
            groupId: "grp-p3-eng-sat",
            date: "2026-10-10",
            dayName: "السبت",
            sessionTitle: "English - Grammar Present Simple",
            status: "absent",
            notes: "اعتذر ولي الأمر لظرف طارئ وطلب حصة تعويضية",
            homeworkDone: false,
            makeupRequested: true,
            makeupSessionId: "makeup-slot-2"
        },
        {
            id: "att-5",
            studentId: "user-p1",
            groupId: "grp-p3-math-sat",
            date: "2026-10-17",
            dayName: "السبت",
            sessionTitle: "Math - Multiplication Intro",
            status: "attended",
            notes: "حضر الحصة وتم تسليم شيت التدريبات",
            homeworkDone: true
        },
        {
            id: "att-6",
            studentId: "user-p1",
            groupId: "grp-p3-eng-sat",
            date: "2026-10-17",
            dayName: "السبت",
            sessionTitle: "English - Unit 2 Vocabulary",
            status: "upcoming",
            notes: "الحصة القادمة - السبت القادم",
            homeworkDone: null
        },
        {
            id: "att-7",
            studentId: "user-p2",
            groupId: "grp-kg2-eng-sun",
            date: "2026-10-11",
            dayName: "الأحد",
            sessionTitle: "KG2 English - Letter Sounds (S, A, T, P)",
            status: "attended",
            notes: "تلوين ونطق الحروف شاطرة جداً",
            homeworkDone: true
        },
        {
            id: "att-8",
            studentId: "user-p3",
            groupId: "grp-p1-math-mon",
            date: "2026-10-12",
            dayName: "الاثنين",
            sessionTitle: "Math - Number Bonds up to 10",
            status: "attended",
            notes: "فهم الدرس بسرعة ممتازة",
            homeworkDone: true
        }
    ],
    // سجل طلبات الحصص التعويضية (Make-up Requests)
    makeupRequests: [
        {
            id: "mkr-101",
            studentId: "user-p1",
            studentName: "يوسف أحمد إبراهيم",
            parentName: "أحمد إبراهيم",
            phone: "01155554433",
            missedGroupId: "grp-p3-eng-sat",
            missedDate: "2026-10-10",
            subject: "English (إنجليزي)",
            grade: "Primary 3 (الصف الثالث)",
            reason: "ظرف سفر عائلي مفاجئ ولم نتمكن من حضور الحصة الأساسية",
            targetMakeupSlotId: "makeup-slot-2",
            targetDate: "2026-10-22",
            targetTime: "04:00 م - 05:30 م (الخميس)",
            status: "approved", // pending, approved, rejected, completed
            coordinatorNote: "تم تأكيد الحجز وحجز مقعد ليوسف في موعد الخميس مع مس مارينا",
            requestedAt: "2026-10-09 18:20"
        }
    ],
    // سجل المدفوعات والاشتراكات (Payments & Invoices)
    payments: [
        {
            id: "inv-2026-10-01",
            studentId: "user-p1",
            studentName: "يوسف أحمد إبراهيم",
            month: "أكتوبر 2026",
            amount: 900,
            subjects: ["ماث (450 ج)", "إنجليزي (450 ج)"],
            method: "instapay", // instapay, vodafone_cash, bank, cash
            referenceNumber: "IPN-98421034",
            receiptImage: "assets/images/receipt-demo.png",
            status: "paid", // paid, pending_review, unpaid, overdue
            paymentDate: "2026-10-02 14:15",
            notes: "تم التأكيد والاستلام عبر حساب إنستاباي السنتر"
        },
        {
            id: "inv-2026-11-01",
            studentId: "user-p1",
            studentName: "يوسف أحمد إبراهيم",
            month: "نوفمبر 2026",
            amount: 900,
            subjects: ["ماث (450 ج)", "إنجليزي (450 ج)"],
            method: "vodafone_cash",
            referenceNumber: "VF-202611-PEND",
            receiptImage: "",
            status: "unpaid",
            paymentDate: "",
            notes: "ميعاد السداد بداية الشهر القادم"
        },
        {
            id: "inv-2026-10-02",
            studentId: "user-p2",
            studentName: "ليلى كريم أحمد",
            month: "أكتوبر 2026",
            amount: 400,
            subjects: ["إنجليزي KG2 (400 ج)"],
            method: "vodafone_cash",
            referenceNumber: "VF-4581299",
            receiptImage: "",
            status: "paid",
            paymentDate: "2026-10-05 11:30",
            notes: "تم التحويل على فودافون كاش وتم التأكيد"
        },
        {
            id: "inv-2026-10-03",
            studentId: "user-p3",
            studentName: "كيفين مينا سامح",
            month: "أكتوبر 2026",
            amount: 400,
            subjects: ["ماث الصف الأول (400 ج)"],
            method: "instapay",
            referenceNumber: "IPN-7734120",
            receiptImage: "",
            status: "pending_review",
            paymentDate: "2026-10-18 20:00",
            notes: "قام ولي الأمر برفع إشعار التحويل وجاري المراجعة بواسطة الكوردينيتور"
        }
    ],
    // المحادثات والاستفسارات المتبادلة بين الكوردينيتور وأولياء الأمور
    messages: [
        {
            id: "msg-1",
            studentId: "user-p1",
            parentName: "أحمد إبراهيم",
            sender: "parent", // parent, coordinator, superadmin
            text: "مساء الخير يا فندم، هل ممكن أأكد ميعاد الحصة التعويضية لإنجليزي يوسف الأسبوع ده؟",
            timestamp: "2026-10-18 16:30",
            read: true
        },
        {
            id: "msg-2",
            studentId: "user-p1",
            parentName: "أحمد إبراهيم",
            sender: "coordinator",
            text: "أهلاً بحضرتك يا أستاذ أحمد، تمام مس مارينا وافقت على الميعاد والطلب معتمد يوم الخميس الساعة 4 عصراً إن شاء الله.",
            timestamp: "2026-10-18 16:45",
            read: true
        },
        {
            id: "msg-3",
            studentId: "user-p3",
            parentName: "مينا سامح",
            sender: "parent",
            text: "سلام عليكم، أنا حولت المصاريف عن طريق إنستاباي ورفعت رقم المعاملة، برجاء التأكيد.",
            timestamp: "2026-10-18 20:05",
            read: false
        }
    ],
    // طلبات التسجيل الجديدة من الموقع (New Registrations)
    registrations: [
        {
            id: "reg-1",
            parentName: "مريم جرجس",
            studentName: "ديفيد رامي",
            phone: "01099887766",
            stage: "kg",
            grade: "KG 1",
            subjects: ["english", "math"],
            preferredDays: ["الأحد", "الأربعاء"],
            status: "pending", // pending, accepted, contacted
            createdAt: "2026-10-18 19:10",
            notes: "يرغب في حجز ميعاد مسائي ويسأل عن طريقة الدفع"
        }
    ]
};
