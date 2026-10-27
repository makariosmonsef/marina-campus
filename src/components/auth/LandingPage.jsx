import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { 
  UserPlus, 
  LogIn, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Calculator,
  Languages,
  Brain,
  Compass,
  Clock,
  ShieldCheck,
  Crown,
  User,
  HeartHandshake,
  Check,
  Smartphone,
  Building2,
  Coins,
  MapPin,
  Phone,
  Camera,
  Upload,
  Quote,
  Sparkles
} from 'lucide-react';

export const LandingPage = ({ onOpenLogin, onOpenRegister }) => {
  const { t, isRTL } = useLanguage();
  const { login } = useStore();
  const { addToast } = useToast();

  // Instructor Photo State: default loads from /images/instructor-marina.jpg
  // The user can drop a photo directly into public/images/instructor-marina.jpg,
  // or use the instant file preview button below to test their picture live!
  const [instructorPhoto, setInstructorPhoto] = useState('/images/instructor-marina.jpg');
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setInstructorPhoto(previewUrl);
      addToast(
        isRTL 
          ? 'تم تحديث صورة المعلمة مارينا للمعاينة بنجاح!' 
          : 'Instructor Marina photo preview updated successfully!', 
        'success'
      );
    }
  };

  const handleQuickLogin = (username) => {
    const res = login(username, '123');
    if (res.success) {
      addToast(`${t('parentGreeting')} ${res.user.studentName || res.user.name}`, 'success');
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const scrollToPricing = () => {
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenRegister) {
      onOpenRegister();
    }
  };

  const scrollToInstructor = () => {
    const instructorEl = document.getElementById('instructor');
    if (instructorEl) {
      instructorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 text-forest">
      
      {/* =========================================================================
          SECTION 1: HERO
          ========================================================================= */}
      <section id="hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8F5EF] via-[#F3EDE3]/80 to-[#E8EFEA]/70 border border-surface-border p-6 sm:p-10 lg:p-14 shadow-xs">
        {/* Soft Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gold-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 space-x-reverse px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/90 text-brand-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>{t('welcomePill')}</span>
            </div>

            {/* Main Headline */}
            <div>
              {isRTL ? (
                <>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest tracking-tight leading-[1.25] mb-2 font-cairo">
                    حيث تبدأ الخطوات الصغيرة
                    <span className="block text-brand-600 mt-1">لتصبح اكتشافات كبرى</span>
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-forest-muted/80 tracking-wide font-inter">
                    Where Little Steps Become Big Discoveries
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-forest tracking-tight leading-[1.15] mb-3 font-inter">
                    Where Little Steps 
                    <span className="block text-brand-600 mt-1">Become Big Discoveries</span>
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-forest-muted/80 tracking-wide font-cairo">
                    حيث تبدأ الخطوات الصغيرة لتصبح اكتشافات كبرى
                  </p>
                </>
              )}
            </div>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-forest-muted leading-relaxed font-normal max-w-xl">
              {t('heroDescription')}
            </p>

            {/* Quick Core Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-semibold text-forest">
              <div className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{isRTL ? 'تأسيس احترافي في Math & English' : 'Specialized Math & English foundation'}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{isRTL ? 'مراحل رياض الأطفال (KG) والابتدائي' : 'Kindergarten (KG) & Primary stages'}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{isRTL ? 'نظام حصص تعويضية مرن وسهل' : 'Flexible make-up class booking'}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{isRTL ? 'دفع إلكتروني فوري ومتابعة مستمرة' : 'Instant digital tuition & reports'}</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenRegister}
                className="px-6 sm:px-7 py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center"
              >
                <UserPlus className="w-4 h-4 ml-2 mr-2" />
                <span>{t('heroRegisterBtn')}</span>
                <ArrowIcon className="w-4 h-4 mr-2 ml-2" />
              </button>

              <button
                onClick={scrollToPricing}
                className="px-5 sm:px-6 py-3.5 bg-surface hover:bg-surface-alt active:scale-98 text-forest border border-surface-border font-bold text-sm rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 ml-2 mr-2 text-brand-600" />
                <span>{isRTL ? 'عرض باقات الدفع' : 'View Pricing Plans'}</span>
              </button>

              <button
                onClick={scrollToInstructor}
                className="px-4 py-3.5 text-brand-700 hover:text-brand-800 hover:underline font-bold text-xs flex items-center justify-center transition"
              >
                <span>{isRTL ? 'عن المعلمة مارينا' : 'About Miss Marina'}</span>
              </button>
            </div>

            {/* Platform Live Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-surface-border/80">
              <div className="bg-surface/70 backdrop-blur-xs p-3 rounded-xl border border-surface-border text-center">
                <div className="text-lg font-black text-brand-700">+8</div>
                <div className="text-[11px] text-forest-muted font-medium">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
              </div>
              <div className="bg-surface/70 backdrop-blur-xs p-3 rounded-xl border border-surface-border text-center">
                <div className="text-lg font-black text-brand-700">+500</div>
                <div className="text-[11px] text-forest-muted font-medium">{isRTL ? 'طالب متميز' : 'Bright Students'}</div>
              </div>
              <div className="bg-surface/70 backdrop-blur-xs p-3 rounded-xl border border-surface-border text-center">
                <div className="text-lg font-black text-brand-700">6</div>
                <div className="text-[11px] text-forest-muted font-medium">{isRTL ? 'مسارات تعليمية' : 'Learning Tracks'}</div>
              </div>
              <div className="bg-surface/70 backdrop-blur-xs p-3 rounded-xl border border-surface-border text-center">
                <div className="text-lg font-black text-brand-700">100%</div>
                <div className="text-[11px] text-forest-muted font-medium">{isRTL ? 'متابعة دورية' : 'Parent Follow-up'}</div>
              </div>
            </div>

          </div>

          {/* Classroom Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden border border-surface-border bg-white shadow-md">
                <img 
                  src="/images/hero-classroom.jpg" 
                  alt="Miss Marina Educational Classroom"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
                  loading="eager"
                />
                
                {/* Floating Bottom Badge */}
                <div className="absolute bottom-3 inset-x-3 bg-surface/95 backdrop-blur-md border border-surface-border/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-xs font-bold text-forest">
                      {isRTL ? 'سنتر مس مارينا التعليمي' : 'Miss Marina Academy'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-gold-800 bg-gold-100 px-2.5 py-0.5 rounded-md border border-gold-200/70">
                    Math & English
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT ACADEMY & METHODOLOGY
          ========================================================================= */}
      <section id="about" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-bold tracking-wider text-brand-800 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            {isRTL ? 'عن الأكاديمية' : 'About The Academy'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
            {isRTL ? 'رؤية تربوية تركز على الفهم الحقيقي وبناء الثقة' : 'A Nurturing Approach Focused on True Comprehension'}
          </h2>
          <p className="text-xs sm:text-sm text-forest-muted leading-relaxed">
            {isRTL 
              ? 'نؤمن بأن المراحل المبكرة هي حجر الأساس لمستقبل طفلك، لذلك نبتعد عن التلقين السطحي ونعتمد أساليب تفاعلية تجعل الطفل شغوفاً بالتعلم ومتمكناً من المفاهيم الأساسية.'
              : 'Early childhood and primary stages form the foundation of your child’s academic future. We replace memorization with deep conceptual mastery and engaging exploration.'}
          </p>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs hover:shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 border border-brand-100">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-forest mb-2">
              {isRTL ? 'الفهم العميق قبل الحفظ' : 'Deep Understanding'}
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              {isRTL 
                ? 'تبسيط القواعد الرياضية واللغوية عبر تطبيقات بصرية وأنشطة عملية ترسخ المعلومة في ذهن الطفل.'
                : 'Simplifying mathematical and language rules using visual methods and hands-on activities.'}
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs hover:shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center mb-4 border border-gold-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-forest mb-2">
              {isRTL ? 'مجموعات صغيرة وتركيز كامل' : 'Small Interactive Groups'}
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              {isRTL 
                ? 'عدد محدود في كل مجموعة لضمان أن يحصل كل طالب على اهتمام المعلمة وتصحيح مباشر لأدائه.'
                : 'Limited group sizes ensuring every child receives direct attention and timely guidance.'}
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs hover:shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 border border-brand-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-forest mb-2">
              {isRTL ? 'متابعة دورية مع ولي الأمر' : 'Continuous Parent Updates'}
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              {isRTL 
                ? 'تقارير أسبوعية وشهرية توضح مستوى الحضور والواجبات ونقاط القوة التي تميز طفلك.'
                : 'Weekly and monthly progress reports detailing attendance, homework, and academic milestones.'}
            </p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs hover:shadow-xs transition-all">
            <div className="w-11 h-11 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4 border border-forest/15">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-forest mb-2">
              {isRTL ? 'مرونة الحصص والتعويض' : 'Flexible Make-up System'}
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              {isRTL 
                ? 'إذا غاب الطالب بعذر، يمكنه حجز موعد بديل بكل سهولة من بين المواعيد التعويضية الشاغرة.'
                : 'Missed a session? Easily pick a convenient replacement slot from vacant makeup schedules.'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MULTI-DISCIPLINE TRACKS & PROGRAMS
          ========================================================================= */}
      <section id="tracks" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-bold tracking-wider text-brand-800 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            {isRTL ? 'المسارات والبرامج التعليمية' : 'Tracks & Programs'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
            {isRTL ? 'تنوع شامل في المجالات يلبي احتياجات كل طالب' : 'Comprehensive Multi-Discipline Offerings'}
          </h2>
          <p className="text-xs sm:text-sm text-forest-muted leading-relaxed">
            {isRTL 
              ? 'نقدم للعملاء وأولياء الأمور منظومة متكاملة من البرامج التي تغطي التأسيس الأكاديمي، الحساب الذهني، وتنمية المهارات اللغوية والشخصية.'
              : 'Explore a rich variety of foundational courses, mental math mastery, and language development tailored for young learners.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Track 1: Math */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/80">
                  {isRTL ? 'تأسيس & مناهج' : 'Core Foundation'}
                </span>
              </div>
              <h3 className="text-base font-bold text-forest mb-2">
                {isRTL ? 'مسار الرياضيات (Math Foundation)' : 'Mathematics Foundation Track'}
              </h3>
              <p className="text-xs text-forest-muted leading-relaxed mb-4">
                {isRTL 
                  ? 'بناء فهم عميق للأرقام، والعمليات الحسابية الأساسية، والهندسة المبسطة، وتدريبات على حل المسائل المدرسية بذكاء وسرعة.'
                  : 'Mastering numerical sense, fundamental operations, introductory geometry, and word problems with confidence.'}
              </p>
            </div>
            <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-brand-700">
              <span>{isRTL ? 'المراحل: KG2 حتى 6 ابتدائي' : 'Grades: KG2 to Primary 6'}</span>
              <span className="text-forest-muted text-[11px]">{isRTL ? 'شيتات تفاعلية' : 'Worksheets Included'}</span>
            </div>
          </div>

          {/* Track 2: English & Phonics */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                  <Languages className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-gold-800 bg-gold-50 px-2.5 py-1 rounded-md border border-gold-200">
                  {isRTL ? 'صوتيات & قراءة' : 'Jolly Phonics'}
                </span>
              </div>
              <h3 className="text-base font-bold text-forest mb-2">
                {isRTL ? 'مسار الفونكس واللغة الإنجليزية' : 'English & Phonics Mastery Track'}
              </h3>
              <p className="text-xs text-forest-muted leading-relaxed mb-4">
                {isRTL 
                  ? 'تطبيق منهج Jolly Phonics المعتمد لتمكين الطفل من نطق الكلمات وتهجئتها بشكل مستقل، مع التأسيس في القواعد والمفردات.'
                  : 'Accredited Jolly Phonics program empowering children to read, blend, write, and pronounce words accurately.'}
              </p>
            </div>
            <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-gold-800">
              <span>{isRTL ? 'المراحل: KG1 حتى 6 ابتدائي' : 'Grades: KG1 to Primary 6'}</span>
              <span className="text-forest-muted text-[11px]">{isRTL ? 'قصص وقراءة' : 'Reading Stories'}</span>
            </div>
          </div>

          {/* Track 3: Early Stage & KG */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-coral-50 text-coral-700 flex items-center justify-center border border-coral-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-coral-800 bg-coral-50 px-2.5 py-1 rounded-md border border-coral-200">
                  {isRTL ? 'الطفولة المبكرة' : 'Early Years'}
                </span>
              </div>
              <h3 className="text-base font-bold text-forest mb-2">
                {isRTL ? 'مسار رياض الأطفال (KG Readiness)' : 'Kindergarten Readiness Track'}
              </h3>
              <p className="text-xs text-forest-muted leading-relaxed mb-4">
                {isRTL 
                  ? 'إعداد الطفل معرفياً ونفسياً للمدرسة عبر ألعاب تعليمية، تدريبات مسكة القلم، وتطوير المهارات الحركية والتفاعل الصفي.'
                  : 'Preparing preschoolers cognitively and socially through playful education, pencil grip, and sensory tasks.'}
              </p>
            </div>
            <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-coral-800">
              <span>{isRTL ? 'الأعمار: 4 إلى 6 سنوات' : 'Ages: 4 to 6 Years'}</span>
              <span className="text-forest-muted text-[11px]">{isRTL ? 'أنشطة باللعب' : 'Play-based'}</span>
            </div>
          </div>

          {/* Track 4: Mental Math */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/80">
                  {isRTL ? 'ذكاء وسرعة' : 'Mental Agility'}
                </span>
              </div>
              <h3 className="text-base font-bold text-forest mb-2">
                {isRTL ? 'مسار الحساب الذهني والتفكير المنطقي' : 'Mental Math & Logic Track'}
              </h3>
              <p className="text-xs text-forest-muted leading-relaxed mb-4">
                {isRTL 
                  ? 'تمارين تركيز وتطوير سرعة البديهة في إجراء العمليات الحسابية دون الاعتماد على الآلة الحاسبة، لتعزيز الثقة الرياضية.'
                  : 'Speed arithmetic techniques and memory enhancement drills building unmatched computational intuition.'}
              </p>
            </div>
            <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-brand-700">
              <span>{isRTL ? 'لجميع طلاب الابتدائي' : 'Primary Students'}</span>
              <span className="text-forest-muted text-[11px]">{isRTL ? 'تحديات أسبوعية' : 'Weekly Drills'}</span>
            </div>
          </div>

          {/* Track 5: Spoken English */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center border border-gold-200">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-gold-800 bg-gold-50 px-2.5 py-1 rounded-md border border-gold-200">
                  {isRTL ? 'محادثة وطلاقة' : 'Speaking Skills'}
                </span>
              </div>
              <h3 className="text-base font-bold text-forest mb-2">
                {isRTL ? 'مسار المحادثة والتعبير اللغوي' : 'Spoken English & Communication Track'}
              </h3>
              <p className="text-xs text-forest-muted leading-relaxed mb-4">
                {isRTL 
                  ? 'كسر حاجز الخوف من الحديث باللغة الإنجليزية، تدريب على النطق السليم، والحوار والمحادثات الصفية الشيقة.'
                  : 'Overcoming shyness, practicing conversational dialogues, and nurturing fearless self-expression in English.'}
              </p>
            </div>
            <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-gold-800">
              <span>{isRTL ? 'تطوير النطق والحوار' : 'Pronunciation & Dialogues'}</span>
              <span className="text-forest-muted text-[11px]">{isRTL ? 'تطبيق عملي' : 'Interactive'}</span>
            </div>
          </div>

          {/* Track 6: Remedial & Catch-up */}
          <div className="bg-surface p-6 rounded-2xl border border-surface-border hover:border-brand-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center border border-forest/15">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-forest bg-surface-alt px-2.5 py-1 rounded-md border border-surface-border">
                  {isRTL ? 'مراجعات ومتابعة' : 'Support & Prep'}
                </span>
              </div>
              <h3 className="text-base font-bold text-forest mb-2">
                {isRTL ? 'مسار المتابعة الفردية والتقوية' : 'Individual Remedial & Exam Prep Track'}
              </h3>
              <p className="text-xs text-forest-muted leading-relaxed mb-4">
                {isRTL 
                  ? 'مراجعات مخصصة وشرح مكثف للنقاط الصعبة قبل الامتحانات الشهرية لمدارس اللغات والمدارس التجريبية والخاصة.'
                  : 'Targeted reviews, personalized reinforcement of challenging concepts, and comprehensive mock exams.'}
              </p>
            </div>
            <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-forest">
              <span>{isRTL ? 'شرح مكثف قبل الامتحانات' : 'Exam Preparation'}</span>
              <span className="text-forest-muted text-[11px]">{isRTL ? 'متابعة مستمرة' : 'Custom Pace'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: DEDICATED INSTRUCTOR SECTION (MISS MARINA)
          ========================================================================= */}
      <section id="instructor" className="scroll-mt-24">
        <div className="bg-gradient-to-br from-[#FAF7F2] via-surface to-[#F3EDE4] rounded-3xl border border-surface-border p-6 sm:p-10 lg:p-12 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Instructor Photo Spot & Customization */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              <div className="relative w-full max-w-sm">
                
                {/* Photo Frame Container */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-surface-border bg-white shadow-md">
                  <img 
                    src={instructorPhoto} 
                    alt="Miss Marina - Lead Educator"
                    className="w-full h-80 sm:h-96 object-cover object-top"
                  />
                  
                  {/* Floating Verified Badge */}
                  <div className="absolute top-3 right-3 bg-surface/95 backdrop-blur-md border border-surface-border px-3 py-1.5 rounded-xl shadow-xs flex items-center space-x-1.5 space-x-reverse">
                    <Award className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-bold text-forest">
                      {isRTL ? 'معلمة معتمدة' : 'Certified Educator'}
                    </span>
                  </div>

                  {/* Photo Replacement Quick Helper (Hidden input + Trigger button) */}
                  <div className="absolute bottom-3 inset-x-3 bg-surface/95 backdrop-blur-md border border-surface-border p-2.5 rounded-xl flex items-center justify-between shadow-xs">
                    <div>
                      <div className="text-xs font-bold text-forest">
                        {isRTL ? 'مس مارينا (Miss Marina)' : 'Miss Marina'}
                      </div>
                      <div className="text-[10px] text-forest-muted">
                        Math & English Lead Specialist
                      </div>
                    </div>
                    
                    {/* Live Preview Button so User Can Test Photo on the fly */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title={isRTL ? 'اختر صورة من جهازك للمعاينة الفورية' : 'Select a photo from device to test preview'}
                      className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 space-x-reverse"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'تغيير الصورة' : 'Change Photo'}</span>
                    </button>
                    
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </div>
                </div>

                {/* Helpful Note for Permanent Photo Replacement */}
                <p className="text-[11px] text-center text-forest-muted/80 mt-2.5">
                  {isRTL 
                    ? 'يمكنك وضع صورتك الدائمة في المسار: public/images/instructor-marina.jpg' 
                    : 'Permanent photo can be saved at: public/images/instructor-marina.jpg'}
                </p>

              </div>

            </div>

            {/* Instructor Bio, Credentials, and Quote */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-bold tracking-wider text-brand-800 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
                  {isRTL ? 'المعلمة والمشرفة الأكاديمية' : 'Academic Director & Teacher'}
                </span>
                
                <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
                  {isRTL ? 'مس مارينا — شغف حقيقي بالتعليم وخبرة تصنع الفارق' : 'Miss Marina — Passion for Teaching That Inspires'}
                </h2>
                
                <p className="text-xs sm:text-sm text-forest-muted leading-relaxed font-normal">
                  {isRTL 
                    ? 'مؤسسة الأكاديمية، متخصصة في تدريس وتأسيس مناهج الماث واللغة الإنجليزية للأطفال ومراحل الابتدائي للمدارس الرسمية واللغات والخاصة.'
                    : 'Founder and Lead Instructor, specializing in Math and English foundational curricula for Kindergarten and Primary stages.'}
                </p>
              </div>

              {/* Qualifications Checklist */}
              <div className="space-y-3 bg-surface p-4 sm:p-5 rounded-2xl border border-surface-border">
                <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
                  {isRTL ? 'المؤهلات والخبرات الأكاديمية' : 'Qualifications & Background'}
                </h3>
                
                <div className="space-y-2 text-xs text-forest">
                  <div className="flex items-start space-x-2.5 space-x-reverse">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      {isRTL 
                        ? 'خبرة تدريسية تتجاوز 8 سنوات في تأسيس مناهج اللغات والرياضيات للمدارس التجريبية واللغات والخاصة.' 
                        : 'Over 8 years of specialized teaching experience for language and experimental school curricula.'}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5 space-x-reverse">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      {isRTL 
                        ? 'شهادات معتمدة في تدريس الصوتيات الحديثة (Jolly Phonics) وتطوير مهارات القراءة والكتابة.' 
                        : 'Accredited training in Jolly Phonics methodology for early reading fluency and writing.'}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5 space-x-reverse">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      {isRTL 
                        ? 'أسلوب تربوي هادئ يراعي الفروق الفردية ويزيل حاجز الخوف من الرياضيات واللغات لدى الطفل.' 
                        : 'A calm, encouraging pedagogical style that respects individual learning paces.'}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5 space-x-reverse">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      {isRTL 
                        ? 'مئات من الطلاب المتفوقين دراسياً مع تقييمات استثنائية ورضا مستمر من أولياء الأمور.' 
                        : 'Hundreds of accomplished young learners with outstanding academic track records.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote from Miss Marina */}
              <div className="relative p-5 rounded-2xl bg-brand-50/70 border border-brand-200/80">
                <Quote className="w-6 h-6 text-brand-400 absolute top-4 left-4 sm:left-auto sm:right-4 opacity-40" />
                <p className="text-xs sm:text-sm text-brand-900 font-medium leading-relaxed italic relative z-10">
                  {isRTL 
                    ? '«هدفنا ليس مجرد درجات دراسية مرتفعة، بل غرس حب المعرفة وبناء ثقة الطالب بقدراته ليتفوق دراسياً وشخصياً ويكون فخوراً بكل خطوة يخطوها.»'
                    : '“Our mission extends beyond test scores; it is about inspiring a genuine curiosity for learning and empowering each child with lifelong confidence.”'}
                </p>
                <div className="mt-2 text-[11px] font-bold text-brand-700">
                  — مس مارينا (Miss Marina)
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={scrollToPricing}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-sm transition flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 ml-2 mr-2" />
                  <span>{isRTL ? 'احجز مكان طفلك مع مس مارينا' : 'Enroll with Miss Marina'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PRICING & SUBSCRIPTION PACKAGES
          ========================================================================= */}
      <section id="pricing" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-bold tracking-wider text-brand-800 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
            {isRTL ? 'باقات الاشتراك والدفع' : 'Tuition & Packages'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
            {isRTL ? 'خيارات اشتراك واضحة ومناسبة لاحتياجات طفلك' : 'Transparent Tuition Plans Designed for Every Student'}
          </h2>
          <p className="text-xs sm:text-sm text-forest-muted leading-relaxed">
            {isRTL 
              ? 'اختر الباقة المناسبة لطفلك وابدأ رحلة التأسيس والتفوق، مع مرونة تامة في الدفع وتوفير حصص تعويضية عند الحاجة.'
              : 'Choose the most suitable monthly package with complete clarity and flexible online payment options.'}
          </p>
        </div>

        {/* 3 Pricing Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Package 1: Single Track */}
          <div className="bg-surface rounded-3xl border border-surface-border p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-forest-muted bg-surface-alt px-2.5 py-1 rounded-md border border-surface-border">
                  {isRTL ? 'باقة مادة واحدة' : 'Single Subject'}
                </span>
                <h3 className="text-lg font-black text-forest mt-2">
                  {isRTL ? 'الباقة الأساسية' : 'Foundation Plan'}
                </h3>
                <p className="text-xs text-forest-muted mt-1">
                  {isRTL ? 'Math أو English' : 'Math OR English'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-1 space-x-reverse pt-2 pb-3 border-b border-surface-border">
                <span className="text-3xl font-black text-forest">450</span>
                <span className="text-xs font-bold text-forest-muted">{t('currency')} / {isRTL ? 'شهرياً' : 'month'}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-forest">
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? '4 حصص شهرياً (حصة أسبوعياً)' : '4 monthly sessions (1/week)'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'مذكرات وأوراق عمل تفاعلية' : 'Interactive worksheets included'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'تقرير شهري لمستوى الطالب' : 'Monthly progress report'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'إمكانية حجز حصة تعويضية شهرياً' : '1 makeup session per month'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-6 w-full py-3 bg-surface hover:bg-surface-alt text-forest border border-surface-border rounded-xl font-bold text-xs transition shadow-2xs hover:shadow-xs"
            >
              {isRTL ? 'اختيار الباقة والتسجيل' : 'Select Plan & Enroll'}
            </button>
          </div>

          {/* Package 2: Dual Track (Recommended) */}
          <div className="bg-surface rounded-3xl border-2 border-brand-500 p-6 flex flex-col justify-between shadow-md relative bg-gradient-to-b from-brand-50/30 to-surface">
            {/* Recommended Tag */}
            <div className="absolute -top-3 inset-x-0 flex justify-center">
              <span className="bg-brand-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
                {isRTL ? 'الباقة الأكثر طلباً • وفر 100 ج.م' : 'Most Popular • Save 100 EGP'}
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <span className="text-[11px] font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                  {isRTL ? 'المادتين معاً' : 'Dual Subject'}
                </span>
                <h3 className="text-lg font-black text-forest mt-2">
                  {isRTL ? 'باقة التميز المتكاملة' : 'Integrated Excellence Plan'}
                </h3>
                <p className="text-xs text-brand-700 font-medium mt-1">
                  Math + English
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-1 space-x-reverse pt-2 pb-3 border-b border-surface-border">
                <span className="text-3xl font-black text-brand-700">800</span>
                <span className="text-xs font-bold text-forest-muted">{t('currency')} / {isRTL ? 'شهرياً' : 'month'}</span>
                <span className="text-[11px] text-forest-muted line-through mr-2 ml-2">900 {t('currency')}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-forest">
                <li className="flex items-center space-x-2 space-x-reverse font-semibold text-brand-800">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? '8 حصص شهرياً (حصتين أسبوعياً)' : '8 monthly sessions (2/week)'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'حقيبة الملازم والشيتات المطبوعة' : 'Complete printed booklet set'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'متابعة أسبوعية مباشرة مع ولي الأمر' : 'Weekly direct parent updates'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'أولوية في مواعيد الحصص التعويضية' : 'Priority make-up session booking'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'تواصل مباشر مع كوردينيتور السنتر' : 'Direct center coordinator access'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-6 w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs transition shadow-sm hover:shadow-md"
            >
              {isRTL ? 'اختيار باقة التميز والتسجيل' : 'Select Excellence Plan'}
            </button>
          </div>

          {/* Package 3: Intensive */}
          <div className="bg-surface rounded-3xl border border-surface-border p-6 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-gold-800 bg-gold-50 px-2.5 py-1 rounded-md border border-gold-200">
                  {isRTL ? 'مكثف وتفوق' : 'Intensive'}
                </span>
                <h3 className="text-lg font-black text-forest mt-2">
                  {isRTL ? 'باقة التفوق والمتابعة الخاصة' : 'Intensive Mastery Plan'}
                </h3>
                <p className="text-xs text-forest-muted mt-1">
                  Math + English + {isRTL ? 'مراجعات فردية' : 'Personal Reviews'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-1 space-x-reverse pt-2 pb-3 border-b border-surface-border">
                <span className="text-3xl font-black text-forest">1,150</span>
                <span className="text-xs font-bold text-forest-muted">{t('currency')} / {isRTL ? 'شهرياً' : 'month'}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-forest">
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? '12 حصة شهرياً شاملة مراجعات مكثفة' : '12 sessions including intensive review'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'جلسة تقييم فردية شهرية مع مس مارينا' : 'Monthly 1-on-1 review with Miss Marina'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'حصص تعويضية مجانية غير محدودة بعذر' : 'Unlimited excused make-up classes'}</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{isRTL ? 'بنك أسئلة واختبارات قياس مستوى' : 'Question bank & mock testing'}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-6 w-full py-3 bg-surface hover:bg-surface-alt text-forest border border-surface-border rounded-xl font-bold text-xs transition shadow-2xs hover:shadow-xs"
            >
              {isRTL ? 'اختيار الباقة والتسجيل' : 'Select Plan & Enroll'}
            </button>
          </div>

        </div>

        {/* Accepted Payment Methods Banner */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-surface-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start space-y-1">
              <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
                {isRTL ? 'طرق دفع مريحة وسريعة' : 'Accepted Payment Methods'}
              </h4>
              <p className="text-[11px] text-forest-muted">
                {isRTL 
                  ? 'يمكنك سداد المصروفات بسهولة عبر المحافظ الإلكترونية، إنستاباي، أو التحويل البنكي مع اعتماد فوري.' 
                  : 'Pay tuition conveniently via Mobile Wallets, InstaPay, Bank Transfer, or Cash at the center.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-forest">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-alt border border-surface-border">
                <Smartphone className="w-3.5 h-3.5 text-brand-600 ml-1.5 mr-1.5" />
                <span>Vodafone Cash</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-alt border border-surface-border">
                <CreditCard className="w-3.5 h-3.5 text-gold-700 ml-1.5 mr-1.5" />
                <span>InstaPay</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-alt border border-surface-border">
                <Building2 className="w-3.5 h-3.5 text-forest ml-1.5 mr-1.5" />
                <span>{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-alt border border-surface-border">
                <Coins className="w-3.5 h-3.5 text-brand-700 ml-1.5 mr-1.5" />
                <span>{isRTL ? 'دفع بالسنتر' : 'Cash at Center'}</span>
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 6: QUICK DEMO SWITCHER STRIP (FOR TESTING ALL PORTALS)
          ========================================================================= */}
      <section id="demo" className="bg-surface-alt/70 rounded-2xl border border-surface-border p-5 text-center space-y-3">
        <div className="text-xs font-bold text-forest">
          {t('demoTryQuick')}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => handleQuickLogin('marina')}
            className="px-3.5 py-2 bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-200 rounded-xl font-bold text-xs transition flex items-center shadow-2xs"
          >
            <Crown className="w-3.5 h-3.5 ml-1.5 mr-1.5 text-gold-600" />
            <span>{t('superadminRole')}</span>
          </button>

          <button
            onClick={() => handleQuickLogin('coordinator')}
            className="px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-xl font-bold text-xs transition flex items-center shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 ml-1.5 mr-1.5 text-brand-600" />
            <span>{t('adminRole')}</span>
          </button>

          <button
            onClick={() => handleQuickLogin('youssef')}
            className="px-3.5 py-2 bg-surface hover:bg-surface-alt text-forest border border-surface-border rounded-xl font-bold text-xs transition flex items-center shadow-2xs"
          >
            <User className="w-3.5 h-3.5 ml-1.5 mr-1.5 text-forest-muted" />
            <span>{isRTL ? 'ولي أمر (يوسف أحمد - Primary 3)' : 'Parent (Youssef - Primary 3)'}</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CONTACT & FOOTER INFO
          ========================================================================= */}
      <footer id="contact" className="pt-8 border-t border-surface-border text-xs text-forest-muted space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 space-x-reverse font-black text-forest text-sm">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              <span>{t('brandName')}</span>
            </div>
            <p className="text-xs leading-relaxed text-forest-muted">
              {t('centerTagline')}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-forest text-xs">{isRTL ? 'مقر السنتر والمواعيد' : 'Center Location & Hours'}</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 space-x-reverse">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isRTL ? 'سنتر مس مارينا التعليمي — مدينة نصر / مصر الجديدة' : 'Miss Marina Center, Cairo'}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isRTL ? 'السبت إلى الخميس: 2:00 ظهراً - 8:30 مساءً' : 'Saturday - Thursday: 2:00 PM - 8:30 PM'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-forest text-xs">{isRTL ? 'التواصل المباشر' : 'Direct Inquiries'}</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <span dir="ltr">+20 10 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <MessageCircle className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{isRTL ? 'واتساب متاح طوال اليوم للرد على الاستفسارات' : 'WhatsApp available for inquiries'}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-surface-border/70 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <span>
            © {new Date().getFullYear()} {t('brandName')}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </span>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-forest transition">
              {isRTL ? 'العودة للأعلى' : 'Back to top'} ↑
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
