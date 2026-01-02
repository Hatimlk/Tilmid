import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Facebook, Twitter, Linkedin, ChevronLeft, List, Mail, Send, Sparkles,
  Calendar, Clock, User, Bookmark
} from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { updateMeta, updateCanonical } from '../utils/seo';

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = dataManager.getPosts().find(p => p.id === id);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  React.useEffect(() => {
    if (id) {
      const bookmarks = JSON.parse(localStorage.getItem('tilmid_bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(id));
    }
  }, [id]);

  // SEO & Metadata Logic
  React.useEffect(() => {
    if (post) {
      const currentUrl = window.location.href;
      document.title = `${post.title} - مدونة تلميذ`;
      updateCanonical(currentUrl);
      updateMeta('description', post.excerpt);
      updateMeta('keywords', `${post.category}, تعليم, دراسة, توجيه مدرسي, ${post.title.split(' ').slice(0, 3).join(', ')}`);
      updateMeta('', post.title, 'og:title');
      updateMeta('', post.excerpt, 'og:description');
      updateMeta('', post.image, 'og:image');
      updateMeta('', currentUrl, 'og:url');
      updateMeta('', 'article', 'og:type');
    }
  }, [post]);

  // Scroll Progress Logic
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="container mx-auto py-32 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-300 mb-4">المقال غير موجود</h1>
        <p className="text-gray-500">عذراً، لم نتمكن من العثور على المقال الذي تبحث عنه.</p>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `اقرأ هذا المقال المميز على منصة تلميذ: ${post.title}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`; break;
      case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`; break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-1.5 bg-gray-100 w-full z-[60]">
        <div className="h-full bg-gradient-to-r from-primary to-royal transition-all duration-100" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="bg-gray-50/50 min-h-screen pt-12 pb-20 font-sans">
        <div className="container mx-auto px-4 lg:px-8">

          {/* Breadcrumbs */}
          <div className="max-w-7xl mx-auto mb-10">
            <nav className="flex items-center gap-2 text-xs font-bold text-gray-400">
              <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ChevronLeft size={14} />
              <Link to="/blog" className="hover:text-primary transition-colors">المدونة</Link>
              <ChevronLeft size={14} />
              <span className="text-primary truncate max-w-[200px]">{post.title}</span>
            </nav>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Article Content */}
            <div className="lg:col-span-8">
              <article className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Image */}
                <div className="relative aspect-video w-full">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 right-6">
                    <span className="bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">{post.category}</span>
                  </div>
                </div>

                <div className="p-8 lg:p-12">
                  <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 mb-8 border-b border-gray-50 pb-6">
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-primary" /> {post.date}</div>
                    <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {post.readingTime || '5 min read'}</div>
                    <div className="flex items-center gap-2"><User size={16} className="text-primary" /> {post.author?.name}</div>
                  </div>

                  <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">{post.title}</h1>

                  <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-8">
                    <p className="text-xl font-medium text-slate-600 bg-slate-50 p-8 rounded-3xl border-r-8 border-primary italic">
                      "{post.excerpt}"
                    </p>

                    <div className="space-y-6">
                      <h2 id="section-1" className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full"></div> لماذا هذه الخطوة حاسمة؟
                      </h2>
                      <p>تعتبر إدارة الوقت وتحديد الأهداف حجر الزاوية في مسيرة أي تلميذ ناجح. الفارق الجوهري بين التلميذ المتفوق وغيره ليس في عدد ساعات الدراسة، بل في "جودة" و"ذكاء" هذه الساعات.</p>
                    </div>

                    <div className="space-y-6">
                      <h2 id="section-2" className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-2 h-8 bg-royal rounded-full"></div> خطوات عملية للتطبيق الفوري
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        {[
                          { t: "التخطيط المسبق", d: "ابدأ يومك بخريطة واضحة." },
                          { t: "تقسيم المهام", d: "حول المهام الكبيرة لوحدات صغيرة." },
                          { t: "المراجعة النشطة", d: "لا تكتفِ بالقراءة السلبية." },
                          { t: "فترات الراحة", d: "استخدم تقنية 50/10 للتركيز." }
                        ].map((item, i) => (
                          <li key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 m-0">
                            <span className="block font-black text-primary mb-1">{item.t}</span>
                            <span className="text-sm opacity-70">{item.d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                      <h2 id="section-3" className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <div className="w-2 h-8 bg-yellow-400 rounded-full"></div> نصائح إضافية للنجاح
                      </h2>
                      <p>تذكر دائماً أن النجاح هو رحلة تراكمية. ابدأ بخطوات بسيطة اليوم، وستجد النتائج مبهرة غداً. لا تتردد في طلب المساعدة من المختصين في "تلميذ" لتوجيهك بشكل أفضل.</p>
                    </div>
                  </div>

                  {/* Post Share & Bookmark */}
                  <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">شارك المعرفة:</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all"><Facebook size={18} /></button>
                        <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all"><Twitter size={18} /></button>
                        <button onClick={() => handleShare('linkedin')} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all"><Linkedin size={18} /></button>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
                      <Bookmark size={18} /> حفظ المقال للمراجعة
                    </button>
                  </div>
                </div>
              </article>
            </div>

            {/* SIDEBAR - Requested Feature */}
            <aside className="lg:col-span-4 space-y-8">

              {/* 1. Table of Contents Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <List size={20} className="text-primary" /> فهرس المقال
                </h3>
                <nav className="space-y-4">
                  <a href="#section-1" className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary transition-colors group">
                    <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] group-hover:bg-primary group-hover:text-white transition-all">01</span>
                    لماذا هذه الخطوة حاسمة؟
                  </a>
                  <a href="#section-2" className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary transition-colors group">
                    <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] group-hover:bg-primary group-hover:text-white transition-all">02</span>
                    خطوات عملية للتطبيق
                  </a>
                  <a href="#section-3" className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-primary transition-colors group">
                    <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] group-hover:bg-primary group-hover:text-white transition-all">03</span>
                    نصائح إضافية للنجاح
                  </a>
                </nav>

                <hr className="my-8 border-gray-50" />

                {/* 2. Newsletter Signup Card */}
                <div className="bg-gradient-to-br from-primary to-royal rounded-[1.5rem] p-6 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform"></div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                      <Sparkles size={18} className="text-yellow-300" /> لا تفوت أي نصيحة!
                    </h4>
                    <p className="text-xs text-blue-100 opacity-80 mb-6 leading-relaxed">
                      انضم لأكثر من 5000 تلميذ يحصلون على أفضل تقنيات المراجعة أسبوعياً في بريدهم.
                    </p>
                    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('تم الاشتراك بنجاح!'); }}>
                      <div className="relative">
                        <input type="email" placeholder="بريدك الإلكتروني" required className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs placeholder:text-blue-100/50 outline-none focus:bg-white focus:text-slate-900 transition-all" />
                        <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                      </div>
                      <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-xs hover:bg-yellow-400 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                        اشترك الآن <Send size={14} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* 3. Related Resource (Bonus) */}
                <Link to="/program/tilmid" className="mt-8 block bg-slate-900 rounded-[1.5rem] p-6 text-white group overflow-hidden relative">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">برامجنا الخاصة</span>
                    <h4 className="font-black text-base group-hover:text-primary transition-colors">هل تبحث عن تفوق حقيقي؟</h4>
                    <p className="text-[10px] text-gray-400 mt-2">اكتشف عرض "المواكبة الشخصية" الذي يضمن لك أفضل النتائج.</p>
                  </div>
                  <ChevronLeft size={20} className="absolute left-6 bottom-6 text-gray-600 group-hover:text-primary group-hover:-translate-x-2 transition-all" />
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
};
