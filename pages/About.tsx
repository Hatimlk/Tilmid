
import React from 'react';
import { Play, Target, Eye, Heart, Shield, Zap, Users, Award, CheckCircle2, Brain, Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-900 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-blue-100 font-bold text-sm mb-8 animate-fade-in-up">
               <Users size={18} />
               <span>قصتنا ورؤيتنا</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight animate-fade-in-up animate-delay-100">
              نحن أكثر من مجرد <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">منصة تعليمية</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              تلميذ هي حركة تغيير في عالم التوجيه المدرسي. نحن نؤمن بأن كل طالب يمتلك مفاتيح النجاح، ودورنا هو مساعدته في العثور عليها.
            </p>
        </div>
      </section>

      {/* 1. Hero Video Section - Improved with Aspect Ratio & Pulse Animation */}
      <section className="relative z-20 -mt-16 lg:-mt-24 px-4">
        <div className="container mx-auto max-w-5xl">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-900 aspect-video group animate-fade-in-up animate-delay-300">
                {/* Placeholder Image for Video */}
                <img 
                    src={IMAGES.ABOUT.VIDEO_COVER} 
                    alt="Tilmid Presentation" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Play Button - Enhanced with Pulse/Ping Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="relative w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
                        <Play size={32} fill="currentColor" className="ml-1 z-10" />
                        
                        {/* Interactive Pulse Rings */}
                        <span className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-75"></span>
                        <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-50 scale-125"></span>
                    </button>
                </div>

                {/* Video Text */}
                <div className="absolute bottom-0 right-0 p-8 lg:p-12 text-white text-right">
                    <h3 className="text-2xl font-bold mb-2">قصة تلميذ</h3>
                    <p className="text-gray-300 text-sm">تعرف على رؤيتنا وكيف نساعد الطلاب في دقيقتين.</p>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Mission & Vision - Improved with Mobile Stacking Order */}
      <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
              {/* Added flex-col-reverse for Mobile Stacking Hierarchy */}
              <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center">
                  <div className="w-full lg:w-1/2 space-y-8">
                      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 relative overflow-hidden group hover:shadow-lg transition-all">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-125"></div>
                          <div className="relative z-10">
                              <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                  <Target size={28} />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-4">مهمتنا</h3>
                              <p className="text-gray-600 leading-relaxed">
                                  تمكين التلاميذ من تجاوز الصعوبات الدراسية والنفسية من خلال توفير مواكبة شخصية، أدوات تنظيمية متطورة، واستراتيجيات تعلم ذكية تضمن لهم التفوق بأقل جهد وأعلى كفاءة.
                              </p>
                          </div>
                      </div>

                      <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 relative overflow-hidden group hover:shadow-lg transition-all">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-50 transition-transform group-hover:scale-125"></div>
                          <div className="relative z-10">
                              <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                                  <Eye size={28} />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h3>
                              <p className="text-gray-600 leading-relaxed">
                                  أن نكون المرجع الأول في المغرب للتوجيه المدرسي والمواكبة التربوية، ونساهم في بناء جيل واثق من قدراته، واعٍ بمساره، وقادر على تحقيق طموحاته المهنية والشخصية.
                              </p>
                          </div>
                      </div>
                  </div>

                  <div className="w-full lg:w-1/2 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary to-royal rounded-[3rem] rotate-3 opacity-10"></div>
                      <img 
                        src={IMAGES.ABOUT.TEAM} 
                        alt="Team Meeting" 
                        className="relative rounded-[3rem] shadow-2xl border-4 border-white w-full transform hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-xs hidden md:block animate-float">
                          <div className="flex items-center gap-4 mb-3">
                              <div className="flex -space-x-3 space-x-reverse">
                                  {[1,2,3].map(i => (
                                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                                      </div>
                                  ))}
                              </div>
                              <span className="font-bold text-gray-900">+3500 تلميذ</span>
                          </div>
                          <p className="text-gray-500 text-sm">وثقوا بنا وغيروا مسارهم الدراسي.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. Why Tilmid? Grid - Reusable Feature Cards with Hover Effects & Pastel Backgrounds */}
      <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">لماذا تلميذ؟</h2>
                  <p className="text-gray-500 text-lg max-w-2xl mx-auto">نرتكز على قيم أساسية تجعل تجربتك معنا فريدة ومثمرة.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { icon: Heart, title: "الدعم النفسي", desc: "نعتبر الجانب النفسي أساس التفوق، لذا نوفر بيئة داعمة ومحفزة.", color: "text-red-500", bg: "bg-red-50" },
                      { icon: Brain, title: "المنهجية العلمية", desc: "برامجنا مبنية على أحدث أبحاث علم النفس التربوي وتقنيات التعلم.", color: "text-blue-500", bg: "bg-blue-50" },
                      { icon: Shield, title: "المصداقية والالتزام", desc: "نلتزم بمواكبتك خطوة بخطوة حتى تحقق أهدافك المرسومة.", color: "text-emerald-500", bg: "bg-emerald-50" },
                  ].map((item, idx) => (
                      <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 text-center group">
                          <div className={`w-20 h-20 mx-auto ${item.bg} ${item.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                              <item.icon size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. Founder Profile Card - Responsive Profile Card with Photo Stacking */}
      <section className="py-20 lg:py-28 bg-blue-50/30">
          <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">مؤسس المنصة</h2>
                  <p className="text-gray-500 text-lg">تعرف على الخبير وراء نجاح تلميذ</p>
              </div>

              <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  {/* Decorative Elements */}
                  <div className="absolute top-10 left-10 text-gray-100 group-hover:text-blue-50 transition-colors">
                      <Quote size={80} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-right">
                      {/* Photo Container - Responsive Stacking */}
                      <div className="shrink-0 relative">
                          <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] p-1.5 bg-gradient-to-br from-primary to-royal shadow-lg transform group-hover:rotate-3 transition-transform">
                              <img 
                                src={IMAGES.ABOUT.FOUNDER} 
                                alt="الأستاذ ياسين" 
                                className="w-full h-full object-cover rounded-[2.5rem] border-4 border-white"
                              />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-3 rounded-2xl shadow-md border-4 border-white">
                              <Award size={24} />
                          </div>
                      </div>

                      {/* Content Container */}
                      <div className="flex-1">
                          <div className="mb-6">
                              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">الأستاذ ياسين</h3>
                              <span className="text-primary font-black text-sm uppercase tracking-widest block">مؤسس منصة تلميذ & مستشار تربوي</span>
                          </div>

                          <div className="space-y-4 text-gray-600 leading-relaxed font-bold">
                              <p className="text-lg italic text-slate-700">
                                  "بعد مسيرة امتدت لأكثر من 10 سنوات في ميدان التربية والتكوين، أدركت أن الفجوة الحقيقية ليست في المناهج، بل في طريقة التعامل معها. أسست 'تلميذ' لتكون البوصلة التي توجه الطلاب نحو اكتشاف قدراتهم الكامنة."
                              </p>
                              <p className="text-sm text-gray-500 opacity-80 leading-relaxed">
                                  خبير معتمد في استراتيجيات التعلم السريع والتوجيه المدرسي. ساعد آلاف الطلاب على تجاوز عقبات التحصيل الدراسي وتحقيق نتائج استثنائية من خلال منهجيات علمية حديثة تعتمد على الفهم العميق والذكاء العاطفي.
                              </p>
                          </div>

                          {/* Badges - Responsive Wrap */}
                          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black border border-blue-100">
                                  <CheckCircle2 size={16} />
                                  <span>+10 سنوات خبرة</span>
                              </div>
                              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black border border-emerald-100">
                                  <CheckCircle2 size={16} />
                                  <span>مستشار معتمد</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-50 px-4 py-2 rounded-xl text-xs font-black border border-yellow-100">
                                  <Star size={16} fill="currentColor" />
                                  <span>تقييم 4.9/5</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. Bottom CTA - Improved with Gradient Background & Glow Effect Button */}
      <section className="py-24 text-center bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-primary/20">
                      <Zap size={36} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">مستعد لبدء رحلة التغيير نحو التفوق؟</h2>
                  <p className="text-slate-500 text-xl font-bold max-w-xl mx-auto leading-relaxed">
                      انضم اليوم لمجتمع المتفوقين واستفد من مواكبة شخصية تضمن لك الوصول لأهدافك الدراسية بأسرع طريق ممكن.
                  </p>
                  <div className="pt-6">
                      <Link 
                        to="/coaching-offer" 
                        className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white rounded-full font-black text-xl hover:bg-royal transition-all shadow-xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:-translate-y-1 active:scale-95"
                      >
                          <span>انضم إلينا الآن</span>
                          <ArrowLeftIcon size={24} />
                      </Link>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

const ArrowLeftIcon = ({ size }: { size: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="m15 18-6-6 6-6"/>
    </svg>
);
