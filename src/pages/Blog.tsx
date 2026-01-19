
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { BlogPost } from '../types';
import { IMAGES } from '../constants/images';
import { BlogCard } from '../components/BlogCard';

export const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const location = useLocation();
  const POSTS_PER_PAGE = 7; // Increased to accommodate featured layout

  useEffect(() => {
    // --- SEO CONFIGURATION ---
    const title = "المدونة التعليمية - تلميذ | نصائح، توجيه، وطرق مراجعة";
    const description = "اكتشف أحدث المقالات التعليمية، نصائح التوجيه المدرسي، تقنيات الحفظ والمراجعة، واستراتيجيات التفوق الدراسي على منصة تلميذ.";
    const image = IMAGES.BLOG.DEFAULT_SEO;
    const url = window.location.href;

    document.title = title;

    // Fetch posts
    const posts = dataManager.getPosts().filter(p => p.status === 'published');
    setAllPosts(posts);
  }, []);

  const categories = ['الكل', 'الحفظ والمراجعة', 'نصائح', 'تقنيات', 'توجيه'];

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = selectedCategory === 'الكل' || post.category.includes(selectedCategory);
    if (selectedCategory === 'نصائح') matchesCategory = ['نصائح', 'الصحة والدراسة'].some(c => post.category.includes(c));
    if (selectedCategory === 'تقنيات') matchesCategory = post.category.includes('تقنية');

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-primary/20 selection:text-primary">

      {/* 4. Hero Section Background with Texture Pattern */}
      {/* 4. Hero Section Background with Texture Pattern */}
      <section className="relative bg-gradient-to-br from-royal via-blue-900 to-slate-900 text-white pt-16 pb-32 lg:pt-24 lg:pb-48 overflow-hidden rounded-b-[3rem] lg:rounded-b-[5rem] shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/80"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-blue-100 font-bold text-sm animate-fade-in-up shadow-lg">
              <BookOpen size={18} className="text-secondary" />
              <span>بوابة المعرفة</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight animate-fade-in-up animate-delay-100 drop-shadow-md">
              استكشف عالم <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-white uppercase">التعلم الذكي</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/90 font-medium leading-relaxed max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              مكتبة شاملة من المقالات التعليمية، نصائح التوجيه، واستراتيجيات التفوق الدراسي. اكتشف الطريق المختصر نحو النجاح.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-20 lg:-mt-28">

        {/* 1. Responsive Floating Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-6 lg:p-8 mb-16 animate-fade-in-up border border-white/50">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <div className="relative group/search w-full max-w-2xl mx-auto transform transition-all hover:scale-[1.01]">
              <Search size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-primary transition-colors" />
              <input
                type="text"
                placeholder="ابحث عن مقال، تقنية، أو نصيحة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-16 pl-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/30 outline-none transition-all text-lg font-bold placeholder-slate-400 shadow-inner group-focus-within/search:shadow-lg group-focus-within/search:shadow-primary/5"
              />
            </div>

            {/* Horizontal Scroll for Categories on Mobile */}
            <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar flex justify-start md:justify-center gap-3 px-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                      px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border-2
                      ${selectedCategory === category
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                      : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-primary hover:bg-blue-50'
                    }
                    `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Pagination/Results Indicator (Pill Shape) */}
        {currentPosts.length > 0 && (
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                <Sparkles size={20} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">أحدث المقالات</h2>
            </div>
            <div className="bg-slate-100 px-5 py-2 rounded-full border border-slate-200 flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">عرض</span>
              <span className="text-sm font-black text-slate-900">{indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} من {filteredPosts.length}</span>
            </div>
          </div>
        )}

        {/* 3. Responsive Grid Layout with Featured Article Logic */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {currentPosts.map((post, idx) => {
              return (
                <BlogCard key={post.id} post={post} index={idx} />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
            <Search size={48} className="mx-auto mb-6 text-slate-200" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">لا توجد نتائج</h3>
            <p className="text-slate-400 font-bold mb-8">لم نجد أي مقالات تطابق بحثك الحالي</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('الكل'); }} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black">عرض الكل</button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-20">
            <button
              onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={28} />
            </button>

            <div className="px-6 py-3 bg-white rounded-2xl border-2 border-slate-50 font-black text-slate-900 shadow-sm">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-50 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={28} />
            </button>
          </div>
        )}

        {/* Community CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl mb-12 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -ml-32 -mb-32 group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl transform rotate-6 hover:rotate-12 transition-transform">
              <Sparkles size={40} className="text-yellow-300" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">انضم لمجتمع المتفوقين</h2>
            <p className="text-blue-100 text-lg md:text-xl font-medium mb-10 leading-relaxed">
              توصل بأحدث المقالات، ملخصات الدروس، ونصائح التوجيه مباشرة عبر الواتساب. كن جزءاً من عائلة تلميذ.
            </p>

            <button className="px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-xl hover:bg-yellow-300 hover:text-slate-900 transition-all shadow-xl hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-3 mx-auto">
              <CheckCircle2 size={24} />
              <span>انضم للمجموعة مجاناً</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
