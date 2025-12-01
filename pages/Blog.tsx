
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, ChevronLeft, ChevronRight, User, Sparkles, Filter, BookOpen, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Modern Hero Section */}
      <div className="relative bg-slate-900 text-white pt-32 pb-40 lg:pt-48 lg:pb-64 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-blob"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
           <div className="absolute top-[20%] right-[20%] w-32 h-32 bg-yellow-400/10 rounded-full blur-[50px] animate-pulse"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-blue-100 font-bold text-sm mb-8 animate-fade-in-up">
               <BookOpen size={18} className="text-yellow-400" />
               <span>بوابة المعرفة</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight animate-fade-in-up animate-delay-100">
              المدونة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">التعليمية</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
              اكتشف أحدث التقنيات الدراسية، نصائح التوجيه، واستراتيجيات التفوق التي يشاركها خبراؤنا معك لتختصر طريق النجاح.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-32 lg:-mt-48">
        
        {/* Search & Filters Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 lg:p-10 mb-16 animate-fade-in-up animate-delay-300 border border-white/50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-shimmer"></div>
          
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Search Input */}
            <div className="relative group/search">
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-gray-400 group-focus-within/search:text-primary transition-colors">
                <Search size={28} />
              </div>
              <input
                type="text"
                placeholder="ابحث عن مقال، تقنية، أو نصيحة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-16 pl-6 py-5 lg:py-6 rounded-2xl border-2 border-gray-100 bg-white focus:border-primary focus:ring-4 focus:ring-blue-50 outline-none transition-all text-lg font-bold placeholder-gray-400 shadow-sm"
              />
            </div>

            {/* Filter Chips */}
            <div>
               <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary hover:bg-blue-50 hover:-translate-y-0.5'
                    }`}
                  >
                    {selectedCategory === category && <CheckCircle2 size={16} className="animate-in zoom-in" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {currentPosts.length > 0 ? (
          <>
             {/* Results Count */}
             <div className="flex items-center justify-between mb-8 px-4 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                   <Sparkles className="text-yellow-500" size={24} />
                   <span>أحدث المقالات</span>
                </h2>
                <span className="text-gray-500 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                   عرض {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} من أصل {filteredPosts.length}
                </span>
             </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {currentPosts.map((post, idx) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100 flex flex-col h-full group opacity-0 animate-fade-in-up hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-5 right-5 z-20 flex gap-2">
                       <span className="bg-white/90 backdrop-blur-md text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm text-slate-900">
                         {post.category}
                       </span>
                    </div>
                  </div>
                  
                  {/* Body */}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-primary">
                         <Calendar size={14} /> {post.date}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1.5">
                         <Clock size={14} /> 5 د قراءة
                      </span>
                    </div>
                    
                    <h3 className="font-extrabold text-xl lg:text-2xl mb-4 text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link to={`/blog/${post.id}`}>
                          {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow font-medium">
                      {post.excerpt}
                    </p>
                    
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                         {post.author?.avatar ? (
                             <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md bg-gray-100" />
                           ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 ring-2 ring-white shadow-md">
                                <User size={18} />
                              </div>
                           )}
                         <div>
                           <p className="text-xs font-bold text-gray-900">{post.author?.name || 'فريق تلميذ'}</p>
                           <p className="text-[10px] text-gray-400 font-bold">كاتب محتوى</p>
                         </div>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-primary hover:text-white transition-all shadow-sm group/btn"
                        aria-label="Read more"
                      >
                        <ArrowUpRight size={20} className="group-hover/btn:rotate-45 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-20 animate-fade-in-up">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:shadow-lg disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={28} />
                </button>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <span className="font-bold text-gray-400 text-sm">صفحة</span>
                  <span className="text-xl font-black text-primary">{currentPage}</span>
                  <span className="font-bold text-gray-300 text-sm">من</span>
                  <span className="text-xl font-bold text-gray-900">{totalPages}</span>
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-14 h-14 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:shadow-lg disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-xl max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-8 text-primary shadow-inner">
              <Search size={40} />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">لم يتم العثور على نتائج</h3>
            <p className="text-gray-500 mb-10 text-lg max-w-md mx-auto leading-relaxed font-medium">
              عذراً، لم نتمكن من العثور على مقالات تطابق بحثك "{searchTerm}" في تصنيف "{selectedCategory}".
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('الكل'); }}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
            >
              عرض جميع المقالات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
