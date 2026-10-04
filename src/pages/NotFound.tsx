
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle, Building2, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-12 bg-gray-50">
      <SEO
        title={t('notFound.title')}
        description={t('notFound.text')}
        noindex={true}
      />
      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce-slow" aria-hidden="true">
            <AlertCircle size={48} strokeWidth={2} />
          </div>

          <p className="text-6xl md:text-8xl font-black text-slate-900 mb-4 tracking-tighter" aria-hidden="true">404</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-700 mb-6">{t('notFound.heading')}</h1>
          <p className="text-slate-500 text-lg mb-10 max-w-md leading-relaxed font-bold">
            {t('notFound.text')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 w-full">
            <Link
              to="/"
              className="min-h-[52px] px-8 py-3 bg-primary text-white rounded-2xl font-black text-lg hover:bg-blue-600 shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Home size={20} aria-hidden="true" />
              <span>{t('notFound.home')}</span>
            </Link>
            <Link
              to="/higher-schools"
              className="min-h-[52px] px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Building2 size={18} aria-hidden="true" />
              <span>{t('notFound.schools')}</span>
            </Link>
            <Link
              to="/tawjih"
              className="min-h-[52px] px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Compass size={18} aria-hidden="true" />
              <span>{t('notFound.filiere')}</span>
            </Link>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-100 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
      </div>
    </div>
  );
};
