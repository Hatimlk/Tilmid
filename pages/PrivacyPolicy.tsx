import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-primary rounded-2xl mb-4">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">سياسة الخصوصية</h1>
            <p className="text-gray-500 text-lg">نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية</p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
              
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
                <p className="text-gray-800 font-medium m-0">
                  مرحباً بكم في منصة تلميذ. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحماية معلوماتكم الشخصية عند استخدامكم لموقعنا وخدماتنا.
                </p>
              </div>

              <section>
                <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-700"><FileText size={20} /></div>
                  1. المعلومات التي نجمعها
                </h2>
                <p>
                  قد نجمع أنواعاً مختلفة من المعلومات لأغراض متنوعة لتقديم وتحسين خدماتنا لك:
                </p>
                <ul className="list-disc list-inside space-y-2 marker:text-primary mt-4">
                  <li><strong>المعلومات الشخصية:</strong> مثل الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل أو التواصل معنا.</li>
                  <li><strong>بيانات الاستخدام:</strong> معلومات حول كيفية الوصول إلى الخدمة واستخدامها (مثل عنوان IP، نوع المتصفح، وقت الزيارة).</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-700"><Eye size={20} /></div>
                  2. كيفية استخدام المعلومات
                </h2>
                <p>نستخدم البيانات التي نجمعها للأغراض التالية:</p>
                <ul className="list-disc list-inside space-y-2 marker:text-primary mt-4">
                  <li>توفير وصيانة خدماتنا التعليمية.</li>
                  <li>إعلامك بالتغييرات التي تطرأ على خدماتنا.</li>
                  <li>السماح لك بالمشاركة في الميزات التفاعلية لخدمتنا.</li>
                  <li>توفير الدعم للعملاء.</li>
                  <li>جمع التحليلات أو المعلومات القيمة حتى نتمكن من تحسين خدماتنا.</li>
                </ul>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-700"><Lock size={20} /></div>
                  3. أمن البيانات
                </h2>
                <p>
                  أمان بياناتك مهم بالنسبة لنا، ولكن تذكر أنه لا توجد وسيلة نقل عبر الإنترنت أو وسيلة تخزين إلكتروني آمنة بنسبة 100٪. بينما نسعى جاهدين لاستخدام وسائل مقبولة تجارياً لحماية بياناتك الشخصية، لا يمكننا ضمان أمانها المطلق.
                </p>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-700"><Shield size={20} /></div>
                  4. ملفات تعريف الارتباط (Cookies)
                </h2>
                <p>
                  نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على خدمتنا والاحتفاظ ببعض المعلومات. يمكنك توجيه متصفحك لرفض جميع ملفات تعريف الارتباط أو الإشارة إلى وقت إرسال ملف تعريف الارتباط.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. تغييرات على سياسة الخصوصية هذه</h2>
                <p>
                  قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنقوم بإعلامك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة.
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                آخر تحديث: {new Date().toLocaleDateString('ar-MA')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};