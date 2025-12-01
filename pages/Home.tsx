
import React, { useState, useEffect } from 'react';
import { MAIN_SERVICES, INSTAGRAM_REELS } from '../constants';
import { dataManager } from '../utils/dataManager';
import { BlogPost, SuccessStory } from '../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, CheckCircle2, Users, Lightbulb, Clock, BarChart3, UserPlus, PlayCircle, Target, Sparkles, GraduationCap, Star, Instagram, Play, Volume2, Maximize2, X, Heart, Quote } from 'lucide-react';

export const Home: React.FC = () => {
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    // Fetch dynamic content from dataManager
    const publishedPosts = dataManager.getPosts().filter(p => p.status === 'published');
    setBlogPosts(publishedPosts);
    setSuccessStories(dataManager.getStories());
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-primary/5 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-royal/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] right-[10%] w-16 lg:w-20 h-16 lg:h-20 bg-yellow-400/10 rounded-full blur-xl animate-float"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-right space-y-6 lg:space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-primary font-bold text-xs lg:text-sm shadow-sm border border-blue-100 animate-fade-in-up animate-delay-100 mx-auto lg:mx-0">
                <Sparkles size={16} />
                <span>منصة المواكبة والتميز الدراسي</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.3] lg:leading-[1.1] text-gray-900 tracking-tight">
                تلميـذ مستشارك <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-royal">
                  نحو التفوق والتغييـر
                </span>
              </h1>
              
              <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed animate-fade-in-up animate-delay-200 px-2 lg:px-0">
                منصة متكاملة للتوجيه المدرسي والمواكبة النفسية والتربوية. نساعدك في اكتشاف قدراتك، تنظيم وقتك، وبناء مسارك الدراسي والمهني بثقة.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up animate-delay-300 w-full sm:w-auto px-4 lg:px-0">
                <Link to="/coaching-offer" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-royal transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transform hover:-translate-y-1">
                  ابدأ رحلتك الآن
                  <ArrowLeft size={20} />
                </Link>
                <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  <PlayCircle size={20} />
                  اكتشف تلميذ
                </Link>
              </div>

              <div className="pt-4 lg:pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-8 text-gray-500 text-xs lg:text-sm font-semibold animate-fade-in-up animate-delay-400">
                 <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="text-green-500" size={16} />
                    <span>مواكبة شخصية</span>
                 </div>
                 <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="text-green-500" size={16} />
                    <span>توجيه مدرسي</span>
                 </div>
                 <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-lg">
                    <CheckCircle2 className="text-green-500" size={16} />
                    <span>دعم نفسي</span>
                 </div>
              </div>
            </div>

            {/* Image/Visual Content */}
            <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none mx-auto animate-fade-in-up animate-delay-200 mt-8 lg:mt-0 px-4 lg:px-0">
              <div className="relative z-10">
                {/* Back decorative layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-royal rounded-[2rem] lg:rounded-[3rem] rotate-6 opacity-20 transform scale-105"></div>
                
                {/* Main Image */}
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Students Learning" 
                  className="relative rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full object-cover h-[300px] sm:h-[450px] lg:h-[600px] border-4 border-white"
                />
                
                {/* Floating Elements - Hidden on very small screens to prevent clutter */}
                <div className="hidden sm:flex absolute -left-2 lg:-left-8 top-1/4 p-3 lg:p-4 bg-white rounded-2xl shadow-xl animate-float items-center gap-3 border border-gray-100 z-20 max-w-[160px] lg:max-w-[200px]">
                   <div className="bg-green-100 p-2 lg:p-3 rounded-full text-green-600">
                      <Target size={20} className="lg:w-6 lg:h-6" />
                   </div>
                   <div>
                      <span className="block font-bold text-gray-900 text-sm lg:text-base">حدد هدفك</span>
                      <span className="text-[10px] lg:text-xs text-gray-500">خطط لمستقبلك</span>
                   </div>
                </div>

                <div className="hidden sm:flex absolute -right-2 lg:-right-8 bottom-1/3 p-3 lg:p-4 bg-white rounded-2xl shadow-xl animate-float animation-delay-2000 items-center gap-3 border border-gray-100 z-20">
                   <div className="bg-orange-100 p-2 lg:p-3 rounded-full text-orange-600">
                      <GraduationCap size={20} className="lg:w-6 lg:h-6" />
                   </div>
                   <div>
                      <span className="block font-bold text-gray-900 text-sm lg:text-base">نجاح مضمون</span>
                      <span className="text-[10px] lg:text-xs text-gray-500">بإذن الله</span>
                   </div>
                </div>

                {/* Student Count Badge */}
                 <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md p-3 lg:p-4 pr-6 lg:pr-8 rounded-full shadow-xl border border-white/50 flex items-center gap-3 lg:gap-4 w-[90%] max-w-sm z-20">
                    <div className="flex -space-x-3 space-x-reverse">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+5}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <div>
                        <span className="block font-bold text-gray-900 text-xs lg:text-sm">انضم إلى +3500 تلميذ</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-yellow-500 lg:w-3 lg:h-3" />)}
                        </div>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="py-8 lg:py-12 relative z-20 -mt-6 lg:-mt-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-royal rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="z-10 text-center md:text-right">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">للتسجيل بعرض المواكبة</h2>
              <p className="text-gray-300 text-base lg:text-lg">انضم إلى مئات الطلاب الذين غيروا مسارهم الدراسي</p>
            </div>
            <Link to="/coaching-offer" className="z-10 w-full md:w-auto text-center px-10 py-4 bg-white text-royal rounded-full font-bold hover:bg-gray-50 transition-all shadow-lg transform hover:-translate-y-1">
              سجل الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 lg:py-24 overflow-hidden bg-white relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[-10%] w-[20rem] lg:w-[40rem] h-[20rem] lg:h-[40rem] bg-pink-50/50 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[20rem] lg:w-[40rem] h-[20rem] lg:h-[40rem] bg-blue-50/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* Text Content */}
            <div className="flex-1 order-2 lg:order-1 animate-fade-in-up w-full">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-600 font-bold text-sm mb-6 border border-pink-100 shadow-sm">
                  <Users size={16} />
                  <span className="tracking-wide">من نحن</span>
               </div>
               
               <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.2]">
                 شريكك الموثوق في <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-royal">رحلة التميز الدراسي</span>
               </h2>
               
               <p className="text-gray-600 text-base lg:text-xl leading-relaxed mb-10 font-medium">
                 مع "تلميذ"، نحن لا نقدم دروساً فقط، بل نبني مستقبلاً. بقيادة <span className="text-gray-900 font-bold">الأستاذ ياسين</span>، نقدم تجربة توجيهية فريدة تدمج بين الدعم النفسي، التفوق الأكاديمي، والتخطيط الاستراتيجي لمستقبلك.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 mb-10">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <Users size={22} />
                    </div>
                    <div>
                        <span className="block font-bold text-gray-900 text-xl">+3500</span>
                        <span className="text-sm text-gray-500 font-medium">تلميذ تم توجيهه</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Clock size={22} />
                    </div>
                     <div>
                        <span className="block font-bold text-gray-900 text-xl">+10 سنوات</span>
                        <span className="text-sm text-gray-500 font-medium">خبرة في الميدان</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Lightbulb size={22} />
                    </div>
                     <div>
                        <span className="block font-bold text-gray-900 text-xl">تقنيات حصرية</span>
                        <span className="text-sm text-gray-500 font-medium">للتعلم السريع</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <BarChart3 size={22} />
                    </div>
                     <div>
                        <span className="block font-bold text-gray-900 text-xl">نتائج ملموسة</span>
                        <span className="text-sm text-gray-500 font-medium">تحسن ملحوظ</span>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                 <Link 
                   to="/about" 
                   className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 group"
                 >
                    <span>اقرأ قصتنا</span>
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                 </Link>
                 
                 <Link 
                   to="/contact" 
                   className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold hover:border-primary hover:text-primary transition-all group"
                 >
                    <span>تواصل معنا</span>
                 </Link>
               </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 order-1 lg:order-2 relative animate-fade-in-up animate-delay-200 w-full max-w-[600px] mx-auto px-4 lg:px-0">
               <div className="relative z-10">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary to-royal rounded-[2.5rem] rotate-3 transform scale-[1.02] opacity-10"></div>
                 
                 {/* Main Image Container */}
                 <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white">
                     <img 
                       src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                       alt="الأستاذ ياسين" 
                       className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                 </div>
                 
                 {/* Floating Badge */}
                 <div className="absolute bottom-6 lg:bottom-8 -right-2 lg:-right-10 bg-white p-4 lg:p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-3 lg:gap-4 animate-float z-20 border border-gray-50 max-w-[200px] lg:max-w-[240px]">
                    <div className="bg-blue-50 text-primary p-2 lg:p-3.5 rounded-xl shrink-0">
                       <UserPlus size={24} className="lg:w-7 lg:h-7" />
                    </div>
                    <div>
                       <span className="block text-2xl lg:text-3xl font-extrabold text-gray-900 leading-none mb-1" dir="ltr">+90 K</span>
                       <span className="text-[10px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider">متابع على المنصات</span>
                    </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-primary font-bold tracking-wider text-sm uppercase">نعمـل على</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">تلميذ يساعد الطلبة على تحقيق أهدافهم</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {MAIN_SERVICES.map((service, idx) => (
              <div key={idx} className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col md:flex-row items-start gap-6 group">
                <div className="p-4 rounded-2xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <service.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section id="media" className="py-16 lg:py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="mb-12">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-purple-600 font-bold text-lg tracking-wide mb-2 block">
                الترند في انستغرام
             </span>
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">الأكثر مشاهدة على صفحة تلميذ 🔥</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {INSTAGRAM_REELS.map((reel) => (
              <div key={reel.id} className="group relative max-w-sm mx-auto w-full">
                 {/* Colorful Border Gradient */}
                 <div className="absolute -inset-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                 
                 {/* Phone Frame Card */}
                 <div className="relative bg-white p-2 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full">
                     <div className="relative overflow-hidden rounded-[1.6rem] aspect-[9/16] bg-black w-full">
                        {activeReel === reel.id ? (
                          <div className="w-full h-full bg-black animate-in fade-in duration-500 relative flex items-center justify-center">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveReel(null); }}
                              className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-colors"
                              title="إغلاق الفيديو"
                            >
                              <X size={20} />
                            </button>
                            <iframe 
                              src={`https://www.instagram.com/reel/${reel.reelId}/embed/`} 
                              className="w-full h-full border-0" 
                              allowFullScreen
                              title={reel.title}
                              scrolling="no"
                            ></iframe>
                          </div>
                        ) : (
                          <div className="w-full h-full relative cursor-pointer group/cover" onClick={() => setActiveReel(reel.id)}>
                            <img 
                              src={reel.thumbnail} 
                              alt={reel.title} 
                              className="w-full h-full object-cover opacity-90 group-hover/cover:opacity-100 group-hover/cover:scale-105 transition-all duration-700" 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10 flex flex-col justify-end p-6 text-white text-right">
                               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white hover:bg-white hover:text-primary transition-all shadow-xl transform group-hover/cover:scale-110 animate-pulse">
                                     <Play size={32} fill="currentColor" className="ml-1" />
                                  </div>
                               </div>
                               <div className="transform translate-y-2 group-hover/cover:translate-y-0 transition-transform duration-300">
                                  <h3 className="font-bold text-base leading-snug mb-3 drop-shadow-md line-clamp-2" dir="rtl">{reel.title}</h3>
                                  <div className="flex items-center justify-between text-xs font-medium text-gray-300 border-t border-white/20 pt-3">
                                     <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1 text-white"><Heart size={14} /> {reel.views}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {reel.duration}</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                     </div>
                     <div className="pt-3 px-1 pb-1">
                        <a 
                          href={reel.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block w-full py-3 bg-gray-50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:text-pink-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 group/btn"
                        >
                          <Instagram size={18} className="group-hover/btn:text-pink-600" /> 
                          <span>مشاهدة في التطبيق</span>
                        </a>
                     </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-primary font-bold tracking-wider text-sm uppercase">تقنيــات</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 max-w-2xl">
                ستجد هنا جميع المصادر والمعلومات التي تحتاجها لبدء رحلتك
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group flex flex-col h-full border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    تلميذ
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <span className="text-primary font-semibold bg-blue-50 px-2 py-1 rounded-md">{post.category}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{post.excerpt}</p>
                  
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all mt-auto">
                    اقرأ المزيد <ChevronLeft size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 lg:py-20 bg-blue-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-yellow-600 font-bold text-sm mb-4 border border-yellow-100 shadow-sm">
              <Star size={16} className="fill-yellow-500 text-yellow-500" />
              <span>قصص نجاح</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">تلاميذنا هم فخرنا</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              اكتشف كيف ساهمت برامجنا في تغيير مسار هؤلاء الطلاب نحو التميز.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group relative">
                 <div className="absolute top-8 left-8 text-gray-100 group-hover:text-blue-50 transition-colors">
                    <Quote size={48} />
                 </div>
                 
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-primary to-royal">
                         <img src={story.image} alt={story.name} className="w-full h-full object-cover rounded-full border-2 border-white" />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg text-gray-900">{story.name}</h3>
                         <span className="text-sm text-primary font-medium">{story.role}</span>
                      </div>
                   </div>
                   
                   <p className="text-gray-600 leading-relaxed relative">
                     "{story.content}"
                   </p>
                   
                   <div className="mt-6 flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">احجز جلسة استشارية اليوم!</h2>
          <div className="inline-block p-1 rounded-full bg-gray-100">
             <Link to="/contact" className="inline-block w-full sm:w-auto px-12 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/40">
              احصل على جلسة استشارية الان
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="text-green-500" />
              <span>استشارة شخصية</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="text-green-500" />
              <span>خبرة 10 سنوات</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="text-green-500" />
              <span>مواكبة مستمرة</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
