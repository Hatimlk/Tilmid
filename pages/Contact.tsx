import React from 'react';

export const Contact = () => (
  <div className="container mx-auto py-20 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-royal p-8 text-center">
        <h1 className="text-3xl font-bold text-white">احجز استشارتك الآن</h1>
        <p className="text-blue-100 mt-2">املأ الاستمارة وسنتواصل معك في أقرب وقت</p>
      </div>
      <div className="p-8">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="محمد علي" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0600000000" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الاستشارة</label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white">
              <option>توجيه مدرسي</option>
              <option>مواكبة نفسية</option>
              <option>تنظيم الدراسة</option>
            </select>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">رسالة إضافية (اختياري)</label>
            <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none" placeholder="اكتب تفاصيل إضافية هنا..."></textarea>
          </div>
          <div className="col-span-1 md:col-span-2 mt-2">
            <button className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg transform active:scale-[0.98]">
              إرسال الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
