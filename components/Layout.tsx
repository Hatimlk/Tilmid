
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MessageCircle, ArrowUp, Zap, ArrowLeft } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentArea = location.pathname.startsWith('/student-area');
  const isOfferPage = location.pathname === '/coaching-offer';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAdminRoute && <Navbar />}
      
      <main className={`flex-grow ${!isAdminRoute ? 'pt-24 lg:pt-28' : ''}`}>
        {children}
      </main>
      
      {!isAdminRoute && !isStudentArea && <Footer />}
      
      {/* Mobile Sticky CTA Bar - CRO Optimization */}
      {!isAdminRoute && isOfferPage && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-blue-100 p-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-primary uppercase">عرض النجاح</span>
              <span className="text-lg font-black text-slate-900">سجل الآن 🔥</span>
           </div>
           <button 
             onClick={() => document.getElementById('registration-card')?.scrollIntoView({ behavior: 'smooth' })}
             className="bg-primary text-white px-8 py-3 rounded-full font-black flex items-center gap-2 shadow-lg shadow-blue-500/30"
           >
              <span>انضم فوراً</span>
              <ArrowLeft size={18} />
           </button>
        </div>
      )}

      {/* Floating Action Buttons Container */}
      <div className={`fixed ${isOfferPage ? 'bottom-24 md:bottom-6' : 'bottom-6'} right-6 z-40 flex flex-col gap-4 items-center transition-all`}>
        
        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className={`bg-white text-primary p-3 rounded-full shadow-lg border border-blue-100 hover:bg-blue-50 transition-all duration-300 transform ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>

        {/* WhatsApp Floating Button */}
        <a 
          href="https://wa.me/message/GN4XKUOMHNHGO1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={28} fill="white" />
        </a>
      </div>
    </div>
  );
};
