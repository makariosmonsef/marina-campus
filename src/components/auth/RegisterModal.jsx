import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';

export const RegisterModal = ({ isOpen, onClose, onOpenLogin }) => {
  const { t } = useLanguage();
  const { registerParentStudent } = useStore();
  const { addToast } = useToast();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('Primary 3 (الصف الثالث)');
  const [hasMath, setHasMath] = useState(true);
  const [hasEng, setHasEng] = useState(true);
  const [preferredDay, setPreferredDay] = useState('السبت');
  const [password, setPassword] = useState('123');

  const handleSubmit = (e) => {
    e.preventDefault();

    const subjects = [];
    if (hasMath) subjects.push('math');
    if (hasEng) subjects.push('english');

    if (subjects.length === 0) {
      addToast('يرجى اختيار مادة واحدة على الأقل (ماث أو إنجليزي)', 'warning');
      return;
    }

    const res = registerParentStudent({
      studentName,
      parentName,
      phone,
      grade,
      subjects,
      preferredDay,
      password
    });

    if (res.success) {
      addToast(`تم إنشاء الحساب بنجاح! كود الطالب: ${res.credentials.username}`, 'success');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('register')}>
      <form onSubmit={handleSubmit} className="space-y-4 text-start">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            اسم الطالب أو الطفل بالكامل:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="مثال: يوسف أحمد إبراهيم"
            required
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            اسم ولي الأمر:
          </label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            placeholder="مثال: أحمد إبراهيم"
            required
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('phone')}:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010xxxxxxxx"
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('grade')}:
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
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
          <label className="block text-xs font-bold text-slate-700 mb-1">
            المواد المراد التسجيل بها مع مس مارينا:
          </label>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className={`p-3 rounded-xl border flex items-center cursor-pointer transition ${hasMath ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <input
                type="checkbox"
                checked={hasMath}
                onChange={(e) => setHasMath(e.target.checked)}
                className="ml-2 mr-2 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-bold block">{t('math')}</span>
                <span className="text-[10px] text-slate-500">تأسيس وحساب ذهني ومنهج</span>
              </div>
            </label>
            <label className={`p-3 rounded-xl border flex items-center cursor-pointer transition ${hasEng ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <input
                type="checkbox"
                checked={hasEng}
                onChange={(e) => setHasEng(e.target.checked)}
                className="ml-2 mr-2 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-bold block">{t('english')}</span>
                <span className="text-[10px] text-slate-500">Phonics، محادثة ومنهج</span>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اليوم المفضل للحصة (إن وجد):
            </label>
            <select
              value={preferredDay}
              onChange={(e) => setPreferredDay(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="السبت">السبت (Saturday)</option>
              <option value="الأحد">الأحد (Sunday)</option>
              <option value="الاثنين">الاثنين (Monday)</option>
              <option value="الثلاثاء">الثلاثاء (Tuesday)</option>
              <option value="الأربعاء">الأربعاء (Wednesday)</option>
              <option value="الخميس">الخميس (Thursday)</option>
              <option value="حسب المتاح">حسب المتاح مع مس مارينا</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('password')}:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {t('login')}
          </button>
          <div className="flex space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              {t('register')}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
