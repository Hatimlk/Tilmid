import React from 'react';

export const Contact = () => {
  const [formState, setFormState] = React.useState({
    name: '',
    phone: '',
    type: 'توجيه مدرسي',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) return;

    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormState({ name: '', phone: '', type: 'توجيه مدرسي', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="bg-royal p-8 text-center">
          <h1 className="text-3xl font-bold text-white">احجز استشارتك الآن</h1>
          <p className="text-blue-100 mt-2">املأ الاستمارة وسنتواصل معك في أقرب وقت</p>
        </div>
        <div className="p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-10 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">تم استلام طلبك!</h3>
              <p className="text-slate-500 font-bold">سنتواصل معك في غضون 24 ساعة.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-primary font-bold hover:underline">إرسال طلب جديد</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="محمد علي"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={formState.phone}
                  onChange={e => setFormState({ ...formState, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="0600000000"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الاستشارة</label>
                <select
                  value={formState.type}
                  onChange={e => setFormState({ ...formState, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                >
                  <option>توجيه مدرسي</option>
                  <option>مواكبة نفسية</option>
                  <option>تنظيم الدراسة</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">رسالة إضافية (اختياري)</label>
                <textarea
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none"
                  placeholder="اكتب تفاصيل إضافية هنا..."
                ></textarea>
              </div>
              <div className="col-span-1 md:col-span-2 mt-2">
                <button
                  disabled={status === 'sending'}
                  className={`w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-all shadow-lg transform active:scale-[0.98] flex justify-center items-center gap-2 ${status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
