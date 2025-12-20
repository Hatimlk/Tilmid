import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MessageCircle, ArrowUp, Zap, ArrowLeft, List, X, BookOpen, Star, UserCheck } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentArea = location.pathname.startsWith('/student-area');
  const isOfferPage = location.pathname === '/coaching-offer';
  const isProgramPage = location.pathname.startsWith('/program/');

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll top button
      setShowScrollTop(window.scrollY > 400);

      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsTOCOpen(false);
    }
  };

  // Fix for line 139: Define scrollToTop function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TOCLinks = [
    { id: 'features', label: 'مميزات البرنامج', icon: Zap },
    { id: 'extra-topics', label: 'المحاور الدراسية', icon: BookOpen },
    { id: 'registration-card', label: 'سجل الآن', icon: UserCheck },
    { id: 'testimonials', label: 'قصص النجاح', icon: Star }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {!isAdminRoute && <Navbar />}
      
      {/* Scroll Progress Bar (Top Sticky) */}
      {!isAdminRoute && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
          <div 
            className="h-full bg-gradient-to-r from-primary to-royal transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      )}

      <main className={`flex-grow ${!isAdminRoute ? 'pt-24 lg:pt-28' : ''}`}>
        {children}
      </main>
      
      {!isAdminRoute && !isStudentArea && <Footer />}
      
      {/* Mobile Table of Contents (TOC) Toggle */}
      {(isProgramPage || isOfferPage) && !isAdminRoute && (
        <div className="md:hidden fixed bottom-24 right-6 z-40 animate-in fade-in slide-in-from-right duration-500">
           <button 
             onClick={() => setIsTOCOpen(true)}
             className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-white/20"
             aria-label="Toggle Navigation"
           >
              <List size={28} />
           </button>
        </div>
      )}

      {/* Mobile TOC Drawer Overlay */}
      {isTOCOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTOCOpen(false)}></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-900">انتقال سريع</h3>
                    <button onClick={() => setIsTOCOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={24} /></button>
                </div>
                <nav className="grid grid-cols-1 gap-4">
                    {TOCLinks.map((link) => (
                        <button 
                            key={link.id} 
                            onClick={() => scrollToSection(link.id)}
                            className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                <link.icon size={20} />
                            </div>
                            <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{link.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
      )}
      
      {/* Mobile Sticky CTA Bar */}
      {!isAdminRoute && (isOfferPage || isProgramPage) && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-blue-50 p-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,149,255,0.15)] animate-in slide-in-from-bottom duration-500">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">فرصة النجاح</span>
              <span className="text-lg font-black text-slate-900">سجل مكانك الآن 🔥</span>
           </div>
           <button 
             onClick={() => {
                const target = document.getElementById('registration-card') || document.getElementById('features');
                target?.scrollIntoView({ behavior: 'smooth' });
             }}
             className="bg-primary text-white px-8 py-3.5 rounded-full font-black flex items-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
           >
              <span>انضمام</span>
              <ArrowLeft size={18} />
           </button>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className={`fixed ${isOfferPage || isProgramPage ? 'bottom-24 md:bottom-10' : 'bottom-10'} right-6 z-40 flex flex-col gap-5 items-center transition-all`}>
        
        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className={`bg-white text-primary p-3 rounded-full shadow-xl border border-blue-50 hover:bg-blue-50 transition-all duration-500 transform ${
            showScrollTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>

        {/* WhatsApp Floating Button with Refined Ripple */}
        <div className="relative group">
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ripple pointer-events-none"></span>
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ripple animation-delay-1000 pointer-events-none"></span>
          <a 
            href="https://wa.me/message/GN4XKUOMHNHGO1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative block bg-[#25D366] text-white p-4 lg:p-5 rounded-full shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:-translate-y-2 active:scale-90 transition-all z-10"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={32} fill="white" className="drop-shadow-sm" />
          </a>
          
          {/* Tooltip for Desktop */}
          <div className="hidden lg:block absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
             تحدث مع المستشار الآن 👋
          </div>
        </div>
      </div>
    </div>
  );
};