
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce-slow">
            <AlertCircle size={48} strokeWidth={2} />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-6">الصفحة غير موجودة</h2>
          <p className="text-slate-500 text-lg mb-10 max-w-md leading-relaxed font-bold">
            الرابط الذي تحاول الوصول إليه غير صحيح أو تم حذفه. تأكد من العنوان أو عد للصفحة الرئيسية.
          </p>

          <Link
            to="/"
            className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-blue-600 shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <Home size={20} />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-100 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
      </div>
    </div>
  );
};
