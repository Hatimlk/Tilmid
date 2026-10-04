import React from 'react';
import { ApiError, rateLimitMinutes } from '../lib/api';
import { dataManager } from '../utils/dataManager';
import { isValidMaPhone } from '../utils/phone';
import { ContactMessage } from '../types';
import SEO from '../components/SEO';


export const Contact = () => {
  const [formState, setFormState] = React.useState({
    name: '',
    phone: '',
    type: 'توجيه مدرسي',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');
  const [errors, setErrors] = React.useState<{ name?: string; phone?: string; form?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!formState.name.trim()) next.name = 'يرجى إدخال اسمك الكامل.';
    if (!formState.phone.trim()) next.phone = 'يرجى إدخال رقم هاتفك.';
    else if (!isValidMaPhone(formState.phone)) next.phone = 'رقم الهاتف غير صحيح. مثال: 0612345678 أو +212612345678';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ignore repeated submits while a request is in flight.
    if (status === 'sending') return;
    if (!validate()) return;

    setStatus('sending');
    setErrors({});

    // Create Message Object
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      type: formState.type,
      message: formState.message,
      created_at: new Date().toISOString(),
      status: 'new'
    };

    // Save Message
    const saveMsg = async () => {
      try {
        // The database is the source of truth. Google Sheets is only a
        // secondary mirror and must never block a contact request.
        await dataManager.saveMessage(newMessage);

        const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzkBJODYcRauPWXhwYPvEYjjZrKcYWijulXpSDXtpKaxW8Xf3aky8FJ82_yK0sBFP1s/exec';

        void fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors', // Important for Google Apps Script to avoid CORS errors
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formState.name,
            phone: formState.phone,
            goal: formState.type,
            message: formState.message
          })
        }).catch((error) => console.warn('Google Sheets mirror failed:', error));

        setStatus('success');
        setFormState({ name: '', phone: '', type: 'توجيه مدرسي', message: '' });
      } catch (e) {
        console.error("Submission Error:", e);
        setStatus('idle');
        const apiErr = e as ApiError;
        setErrors({
          form: apiErr?.status === 429
            ? `محاولات كثيرة. حاول مرة أخرى بعد ${rateLimitMinutes(apiErr.retryAfterSeconds)} دقيقة.`
            : 'فشل الإرسال. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.'
        });
      }
    };
    saveMsg();
  };

  const inputClass = (invalid?: boolean) =>
    `w-full min-h-[48px] px-4 py-3 rounded-lg border ${invalid ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`;

  return (
    <div className="container mx-auto py-12 md:py-20 px-4">
      <SEO
        title="تواصل معنا - تلميذ"
        description="تواصل مع فريق تلميذ لطلب استشارة في التوجيه المدرسي والمواكبة الدراسية. أرسل طلبك وسنتصل بك في أقرب وقت لمساعدتك في اختيار مسارك."
      />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="bg-royal p-8 text-center">
          <h1 className="text-3xl font-bold text-white">احجز استشارتك الآن</h1>
          <p className="text-blue-100 mt-2">املأ الاستمارة وسنتواصل معك في أقرب وقت</p>
        </div>
        <div className="p-6 md:p-8">
          {status === 'success' ? (
            <div role="status" className="flex flex-col items-center justify-center py-10 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6" aria-hidden="true">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">تم استلام طلبك!</h2>
              <p className="text-slate-500 font-bold">سنتواصل معك في غضون 24 ساعة.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 min-h-[44px] px-4 text-primary font-bold hover:underline">إرسال طلب جديد</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {errors.form && (
                <div role="alert" className="md:col-span-2 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-bold text-sm">
                  {errors.form}
                </div>
              )}
              <div className="col-span-1">
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className={inputClass(!!errors.name)}
                  placeholder="محمد علي"
                />
                {errors.name && <p id="contact-name-error" className="mt-1.5 text-sm text-red-600 font-bold">{errors.name}</p>}
              </div>
              <div className="col-span-1">
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  id="contact-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  dir="ltr"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  value={formState.phone}
                  onChange={e => setFormState({ ...formState, phone: e.target.value })}
                  className={`${inputClass(!!errors.phone)} text-start`}
                  placeholder="0612345678"
                />
                {errors.phone && <p id="contact-phone-error" className="mt-1.5 text-sm text-red-600 font-bold">{errors.phone}</p>}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="contact-type" className="block text-sm font-medium text-gray-700 mb-2">نوع الاستشارة</label>
                <select
                  id="contact-type"
                  value={formState.type}
                  onChange={e => setFormState({ ...formState, type: e.target.value })}
                  className={`${inputClass()} bg-white`}
                >
                  <option>توجيه مدرسي</option>
                  <option>مواكبة نفسية</option>
                  <option>تنظيم الدراسة</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">رسالة إضافية (اختياري)</label>
                <textarea
                  id="contact-message"
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className={`${inputClass()} h-32 resize-none`}
                  placeholder="اكتب تفاصيل إضافية هنا..."
                ></textarea>
              </div>
              <div className="col-span-1 md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                  className={`w-full min-h-[52px] bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-all shadow-lg transform active:scale-[0.98] flex justify-center items-center gap-2 ${status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : 'إرسال الطلب'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
