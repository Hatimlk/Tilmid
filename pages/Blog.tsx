
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, ChevronLeft, ChevronRight, User, Sparkles, BookOpen, ArrowUpRight, Clock, CheckCircle2, Hash } from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { BlogPost } from '../types';

export const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const location = useLocation();
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    // --- SEO CONFIGURATION ---
    const title = "المدونة التعليمية - تلميذ | نصائح، توجيه، وطرق مراجعة";
    const description = "اكتشف أحدث المقالات التعليمية، نصائح التوجيه المدرسي، تقنيات الحفظ والمراجعة، واستراتيجيات التفوق الدراسي على منصة تلميذ.";
    const image = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"; // Generic Education Image
    const url = window.location.href;

    document.title = title;

    // Meta Tag Helper
    const updateMeta = (name: string, content: string, property?: string) => {
      let element;
      if (property) {
         element = document.querySelector(`meta[property="${property}"]`);
      } else {
         element = document.querySelector(`meta[name="${name}"]`);
      }
    
      if (!element) {
        element = document.createElement('meta');
        if(property) element.setAttribute('property', property);
        else element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    updateMeta('description', description);
    updateMeta('keywords', 'تعليم, مدونة, توجيه مدرسي, باكالوريا, نصائح دراسية, تقنيات الحفظ, المغرب, تلميذ');

    // Open Graph / Facebook
    updateMeta('', title, 'og:title');
    updateMeta('', description, 'og:description');
    updateMeta('', image, 'og:image');
    updateMeta('', url, 'og:url');
    updateMeta('', 'website', 'og:type');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Schema.org JSON-LD
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": title,
      "description": description,
      "url": url,
      "publisher": {
        "@type": "Organization",
        "name": "Tilmid",
        "logo": { "@type": "ImageObject", "url": "https://tilmide.ma/logo.png" }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };

    let script = document.querySelector('#blog-schema');
    if (!script) {
        script = document.createElement('script');
        script.id = 'blog-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);
    
    // Fetch all posts including custom ones from dataManager
    const posts = dataManager.getPosts().filter(p => p.status === 'published');
    setAllPosts(posts);
  }, []);

  // Handle URL Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');

    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  const categories = ['الكل', 'الحفظ والمراجعة', 'نصائح', 'تقنيات', 'توجيه'];

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = false;

    if (selectedCategory === 'الكل') {
      matchesCategory = true;
    } else if (selectedCategory === 'تقنيات') {
      matchesCategory = post.category.includes('تقنية') || post.category === 'طرق التعلم';
    } else if (selectedCategory === 'نصائح') {
      matchesCategory = ['الصحة والدراسة', 'التركيز', 'نصائح'].includes(post.category);
    } else if (selectedCategory === 'الحفظ والمراجعة') {
      matchesCategory = ['الحفظ والمراجعة'].includes(post.category);
    } else if (selectedCategory === 'توجيه') {
      matchesCategory = post.category === 'توجيه';
    } else {
      matchesCategory = post.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans selection:bg-primary/20 selection:text-primary">
      {/* Hero Section - Refined */}
      <section className="relative bg-slate-900 text-white pt-32 pb-48 lg:pt-48 lg:pb-72 overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-2xl">
        {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
           <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
           <div className="absolute top-[30%] right-[20%] w-40 h-40 bg-yellow-400/10 rounded-full blur-[60px] animate-pulse"></div>
           {/* Grid Pattern */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-blue-100 font-bold text-sm animate-fade-in-up hover:bg-white/20 transition-colors cursor-default">
               <BookOpen size={18} className="text-yellow-400" />
               <span>بوابة المعرفة</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-up animate-delay-100">
              استكشف عالم <br className="md:hidden"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">التعلم الذكي</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300/90 font-medium leading-relaxed max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              مكتبة شاملة من المقالات التعليمية، نصائح التوجيه، واستراتيجيات التفوق الدراسي. اكتشف الطريق المختصر نحو النجاح.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-24 lg:-mt-32">
        
        {/* Search & Filters Card - Refined */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 lg:p-8 mb-16 animate-fade-in-up animate-delay-300 border border-white/60 relative overflow-hidden group hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all duration-500">
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            {/* Search Input */}
            <div className="relative group/search w-full max-w-3xl mx-auto">
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within/search:text-primary transition-colors">
                <Search size={24} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="ابحث عن مقال، تقنية، أو نصيحة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-14 pl-6 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-bold placeholder-gray-400 shadow-inner"
              />
            </div>

            {/* Filter Chips - Horizontal Scroll on Mobile */}
            <div className="w-full overflow-x-auto pb-4 pt-1 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 flex justify-start lg:justify-center">
               <div className="flex gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap border
                      ${selectedCategory === category
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:bg-blue-50/50'
                      }
                    `}
                  >
                    {selectedCategory === category ? <CheckCircle2 size={16} /> : <Hash size={16} className="opacity-50" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        {currentPosts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 animate-fade-in-up px-2">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                 <Sparkles size={20} fill="currentColor" />
               </div>
               <h2 className="text-2xl font-extrabold text-gray-900">أحدث المقالات</h2>
             </div>
             <div className="text-gray-500 text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                عرض <span className="text-primary">{indexOfFirstPost + 1}</span> - <span className="text-primary">{Math.min(indexOfLastPost, filteredPosts.length)}</span> من <span className="text-primary">{filteredPosts.length}</span>
             </div>
          </div>
        )}

        {/* Content Area */}
        {currentPosts.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {currentPosts.map((post, idx) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 flex flex-col h-full group opacity-0 animate-fade-in-up hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Floating Category Badge */}
                    <div className="absolute top-4 right-4 z-20">
                       <span className="bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-slate-800 border border-white/20 flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                         {post.category}
                       </span>
                    </div>

                    {/* Quick Read Time Overlay on Hover */}
                    <div className="absolute bottom-4 left-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <Clock size={12} /> 5 د قراءة
                        </span>
                    </div>
                  </div>
                  
                  {/* Body */}
                  <div className="p-8 flex-grow flex flex-col relative">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
                      <Calendar size={14} className="text-primary" />
                      {post.date}
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-extrabold text-xl lg:text-2xl mb-3 text-gray-900 group-hover:text-primary transition-colors leading-snug">
                      <Link to={`/blog/${post.id}`} className="block focus:outline-none">
                          <span className="absolute inset-0 z-0"></span>
                          {post.title}
                      </Link>
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-medium">
                      {post.excerpt}
                    </p>
                    
                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto relative z-10">
                      <div className="flex items-center gap-3">
                         {post.author?.avatar ? (
                             <img src={post.author.avatar} alt={post.author.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-primary/20 transition-all" />
                           ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={16} />
                              </div>
                           )}
                         <div>
                           <p className="text-xs font-bold text-gray-900">{post.author?.name || 'فريق تلميذ'}</p>
                           <p className="text-[10px] text-gray-400 font-bold">كاتب محتوى</p>
                         </div>
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-md group-hover:scale-110">
                        <ArrowUpRight size={20} className="transform group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination - Refined */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-20 animate-fade-in-up">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary hover:shadow-lg disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={24} />
                </button>
                
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">صفحة</span>
                  <span className="text-xl font-black text-primary">{currentPage}</span>
                  <span className="w-px h-6 bg-gray-200"></span>
                  <span className="text-lg font-bold text-gray-600">{totalPages}</span>
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary hover:shadow-lg disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State - Refined */
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-gray-200 max-w-2xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6 text-gray-400 shadow-sm">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">لم يتم العثور على نتائج</h3>
            <p className="text-gray-500 mb-8 text-base max-w-sm mx-auto leading-relaxed">
              لم نتمكن من العثور على مقالات تطابق "{searchTerm}" في قسم "{selectedCategory}". حاول البحث بكلمات مختلفة.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('الكل'); }}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
            >
              مسح الفلتر والبحث
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
