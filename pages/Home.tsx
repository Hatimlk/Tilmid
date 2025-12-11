
import React, { useState, useEffect } from 'react';
import { MAIN_SERVICES, INSTAGRAM_REELS } from '../constants';
import { IMAGES } from '../constants/images';
import { dataManager } from '../utils/dataManager';
import { BlogPost, SuccessStory } from '../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, PlayCircle, Sparkles, Star, Instagram, Quote, ArrowLeftIcon, Timer } from 'lucide-react';

const DaysCountdown: React.FC<{ date: Date; label: string }> = ({ date, label }) => {
    const [days, setDays] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const diff = date.getTime() - Date.now();
            setDays(Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0));
        };
        calculate();
        const timer = setInterval(calculate, 3600000); // تحديث كل ساعة
        return () => clearInterval(timer);
    }, [date]);

    return (
        <div className="flex items-center gap-5 bg-[#1e293b]/40 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/5 flex-1 min-w-[220px] group hover:border-primary/30 hover:bg-[#1e293b]/60 transition-all">
            <div className="w-16 h-16 bg-[#1a2333] rounded-2xl flex items-center justify-center font-black text-4xl text-white shadow-inner border border-white/10 group-hover:scale-110 transition-transform tabular-nums">
                {days}
            </div>
            <div className="text-right">
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-400">يوم متبقي</p>
            </div>
        </div>
    );
};

export const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    const publishedPosts = dataManager.getPosts().filter(p => p.status === 'published');
    setBlogPosts(publishedPosts);
    setSuccessStories(dataManager.getStories());
  }, []);

  // تواريخ امتحانات 2025 الرسمية التقريبية
  const nationalDate = new Date('2025-06-10T08:00:00');
  const regionalDate = new Date('2025-06-02T08:00:00');

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-primary/5 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-royal/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            <div className="flex-1 text-center lg:text-right space-y-6 lg:space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-primary font-bold text-xs lg:text-sm shadow-sm border border-blue-100 animate-fade-in-up animate-delay-100 mx-auto lg:mx-0">
                <Sparkles size={16} />
                <span>منصة المواكبة والتميز الدراسي</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.2] lg:leading-[1.1] text-gray-900 tracking-tight">
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
            </div>

            <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none mx-auto animate-fade-in-up animate-delay-200 mt-8 lg:mt-0 px-4 lg:px-0">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-royal rounded-[2rem] lg:rounded-[3rem] rotate-6 opacity-20 transform scale-105"></div>
                <img src={IMAGES.HERO.HOME_MAIN} alt="Students Learning" className="relative rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full object-cover h-[300px] sm:h-[450px] lg:h-[600px] border-4 border-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Banner - Simplified to Days Only */}
      <section className="relative z-30 -mt-12 lg:-mt-16 px-4">
          <div className="container mx-auto max-w-6xl">
              <div className="bg-[#0f172a] rounded-[3rem] p-6 lg:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col xl:flex-row items-center gap-8 relative overflow-hidden group">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
                
                <div className="text-right flex-shrink-0 lg:max-w-[240px]">
                    <div className="flex items-center gap-2 text-[#0ea5e9] font-black text-[11px] uppercase tracking-widest mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9] animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.6)]"></span>
                        مباشر: عداد الامتحان
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">يوم الحسم يقترب!</h2>
                    <p className="text-gray-500 text-xs mt-1 font-bold italic">استعد جيداً، لم يتبق الكثير</p>
                </div>

                <div className="flex flex-col md:flex-row gap-5 flex-grow w-full">
                    <DaysCountdown date={nationalDate} label="الوطني (2 باك)" />
                    <DaysCountdown date={regionalDate} label="الجهوي (1 باك)" />
                </div>

                <Link to="/bac-simulator" className="bg-white text-[#0f172a] px-8 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl hover:shadow-primary/30 shrink-0 group/btn transform active:scale-95 w-full xl:w-auto justify-center">
                    <span>احسب معدلك</span>
                    <ArrowLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
          </div>
      </section>

      {/* Main Services Grid */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-3 block">نعمـل على</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">تلميذ يساعد الطلبة على تحقيق أهدافهم</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {MAIN_SERVICES.map((service, idx) => (
              <div key={idx} className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row items-start gap-6 group hover:-translate-y-1">
                <div className="p-4 rounded-2xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <service.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 lg:py-24 overflow-hidden bg-slate-50 relative">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
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
                        <Timer size={22} />
                    </div>
                     <div>
                        <span className="block font-bold text-gray-900 text-xl">+10 سنوات</span>
                        <span className="text-sm text-gray-500 font-medium">خبرة في الميدان</span>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                 <Link to="/about" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 group">
                    <span>اقرأ قصتنا</span>
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                 </Link>
               </div>
            </div>

            <div className="flex-1 order-1 lg:order-2 relative animate-fade-in-up animate-delay-200 w-full max-w-[600px] mx-auto px-4 lg:px-0">
               <div className="relative z-10">
                 <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white">
                     <img src={IMAGES.ABOUT.FOUNDER} alt="الأستاذ ياسين" className="w-full h-auto object-cover" />
                 </div>
                 <div className="absolute bottom-6 lg:bottom-8 -right-2 lg:-right-10 bg-white p-4 lg:p-5 rounded-2xl shadow-xl flex items-center gap-3 lg:gap-4 animate-float z-20 border border-gray-50 max-w-[200px]">
                    <div className="bg-blue-50 text-primary p-2 lg:p-3.5 rounded-xl shrink-0">
                       <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                       <span className="block text-2xl lg:text-3xl font-extrabold text-gray-900 leading-none mb-1" dir="ltr">+90 K</span>
                       <span className="text-[10px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider">متابع</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media & Reels Section */}
      <section id="media" className="py-20 lg:py-28 bg-[#FDFBF7] relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-6 shadow-lg shadow-purple-200 animate-fade-in-up">
                  <Instagram size={18} />
                  <span>تابعنا على انستغرام</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  الأكثر مشاهدة على <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">تلميذ</span> 🔥
              </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {INSTAGRAM_REELS.map((reel, idx) => (
              <div key={reel.id} className="group relative flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                 <div className="relative w-full max-w-[320px] bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-900 ring-1 ring-gray-800/50 transform transition-transform duration-500 hover:-translate-y-2">
                     <div className="relative overflow-hidden rounded-[2rem] bg-black aspect-[9/16] w-full">
                        <iframe src={`https://www.instagram.com/reel/${reel.reelId}/embed/`} className="w-full h-full border-0" allowFullScreen title={reel.title} scrolling="no"></iframe>
                     </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-yellow-600 font-bold text-sm mb-4 border border-yellow-100 shadow-sm">
              <Star size={16} className="fill-yellow-500 text-yellow-500" />
              <span>قصص نجاح</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">تلاميذنا هم فخرنا</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group relative">
                 <div className="absolute top-8 left-8 text-gray-100 group-hover:text-blue-50 transition-colors"><Quote size={48} /></div>
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
                   <p className="text-gray-600 leading-relaxed font-medium">"{story.content}"</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
