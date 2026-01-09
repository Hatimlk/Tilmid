
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
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-blue-100 font-bold text-sm mb-8 animate-fade-in-up hover:bg-white/10 transition-colors">
            <Users size={16} className="text-primary" />
            <span className="tracking-wide">قصتنا ورؤيتنا</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight animate-fade-in-up animate-delay-100">
            نحن أكثر من مجرد <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-500">منصة تعليمية</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 font-medium">
            تلميذ هي حركة تغيير في عالم التوجيه المدرسي. نحن نؤمن بأن كل طالب يمتلك مفاتيح النجاح، ودورنا هو مساعدته في العثور عليها.
          </p>
        </div>
      </section>

      {/* 1. Hero Video Section */}
      <section className="relative z-20 -mt-20 lg:-mt-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border-[8px] border-white/10 bg-slate-900 aspect-video group animate-fade-in-up animate-delay-300 backdrop-blur-sm">
            {/* Placeholder Image for Video */}
            <img
              src={IMAGES.ABOUT.VIDEO_COVER}
              alt="Tilmid Presentation"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-700 scale-100 group-hover:scale-105"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="relative w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center group/btn focus:outline-none">
                <div className="absolute inset-0 bg-primary/90 rounded-full animate-ping opacity-20 duration-1000"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/30 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-primary group-hover/btn:border-transparent"></div>
                <Play size={32} fill="currentColor" className="relative z-10 text-white ml-1 transition-transform duration-300 group-hover/btn:scale-110" />
              </button>
            </div>

            {/* Video Text */}
            <div className="absolute bottom-0 right-0 p-8 lg:p-12 text-white text-right w-full bg-gradient-to-t from-slate-900/80 to-transparent">
              <h3 className="text-2xl font-bold mb-2">قصة تلميذ</h3>
              <p className="text-slate-300 text-sm font-medium">تعرف على رؤيتنا وكيف نساعد الطلاب في دقيقتين.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-16 lg:gap-24 items-center">

            <div className="w-full lg:w-1/2 space-y-8">
              {/* Mission Card */}
              <div className="group bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-500/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                    <Target size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">مهمتنا</h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    تمكين التلاميذ من تجاوز الصعوبات الدراسية والنفسية من خلال توفير مواكبة شخصية، أدوات تنظيمية متطورة، واستراتيجيات تعلم ذكية تضمن لهم التفوق بأقل جهد.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50/80 rounded-full blur-2xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-125"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <Eye size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">رؤيتنا</h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    أن نكون المرجع الأول في المغرب للتوجيه المدرسي والمواكبة التربوية، ونساهم في بناء جيل واثق من قدراته، واعٍ بمساره، وقادر على تحقيق طموحاته.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 rounded-[3rem] rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-700"></div>
              <img
                src={IMAGES.ABOUT.TEAM}
                alt="Team Meeting"
                className="relative rounded-[3rem] shadow-2xl border-[6px] border-white w-full transform transition-transform duration-700"
              />

              {/* Floating Stat Card */}
              <div className="absolute -bottom-12 -left-8 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-50 max-w-xs hidden md:block animate-float">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex -space-x-3 space-x-reverse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 text-lg">+3500 تلميذ</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">وثقوا بنا وغيروا مسارهم الدراسي.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Tilmid? Grid */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">لماذا تلميذ؟</h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">نرتكز على قيم أساسية تجعل تجربتك معنا فريدة ومثمرة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "الدعم النفسي", desc: "نعتبر الجانب النفسي أساس التفوق، لذا نوفر بيئة داعمة ومحفزة.", color: "text-rose-500", bg: "bg-rose-500/10" },
              { icon: Brain, title: "المنهجية العلمية", desc: "برامجنا مبنية على أحدث أبحاث علم النفس التربوي وتقنيات التعلم.", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Shield, title: "المصداقية والالتزام", desc: "نلتزم بمواكبتك خطوة بخطوة حتى تحقق أهدافك المرسومة.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100/50 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 group">
                <div className={`w-20 h-20 mx-auto ${item.bg} ${item.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-center text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Founder Profile Card */}
      <section className="py-24 lg:py-32 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">مؤسس المنصة</h2>
            <p className="text-slate-500 text-xl font-medium">تعرف على الخبير وراء نجاح تلميذ</p>
          </div>

          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute top-10 left-10 text-slate-100 group-hover:text-blue-50 transition-colors duration-500">
              <Quote size={120} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
              {/* Photo Container */}
              <div className="shrink-0 relative">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-[2.5rem] p-2 bg-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out">
                  <img
                    src={IMAGES.ABOUT.FOUNDER}
                    alt="الأستاذ ياسين"
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                </div>
                <div className="absolute -bottom-6 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 animate-bounce-slow">
                  <div className="bg-yellow-50 text-yellow-500 p-3 rounded-xl">
                    <Award size={32} />
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="flex-1 text-center md:text-right">
                <div className="mb-8">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">الأستاذ ياسين</h3>
                  <span className="inline-block px-4 py-1.5 bg-blue-50 text-primary font-bold text-sm rounded-full">
                    مؤسس منصة تلميذ & مستشار تربوي
                  </span>
                </div>

                <div className="space-y-6">
                  <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed italic">
                    "بعد مسيرة امتدت لأكثر من 10 سنوات، أدركت أن الفجوة الحقيقية ليست في المناهج، بل في طريقة التعامل معها. أسست 'تلميذ' لتكون البوصلة التي توجه الطلاب."
                  </p>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    خبير معتمد في استراتيجيات التعلم السريع والتوجيه المدرسي. ساعد آلاف الطلاب على تجاوز عقبات التحصيل الدراسي وتحقيق نتائج استثنائية من خلال منهجيات علمية حديثة.
                  </p>
                </div>

                {/* Badges */}
                <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                  {[
                    { icon: CheckCircle2, text: "+10 سنوات خبرة", color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: CheckCircle2, text: "مستشار معتمد", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { icon: Star, text: "تقييم 4.9/5", color: "text-amber-500", bg: "bg-amber-50" }
                  ].map((badge, i) => (
                    <div key={i} className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold border border-transparent ${badge.bg} ${badge.color}`}>
                      <badge.icon size={18} />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 opacity-30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-white/20">
              <Zap size={48} className="text-yellow-400" fill="currentColor" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              مستعد لبدء رحلة <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">التغيير نحو التفوق؟</span>
            </h2>

            <p className="text-blue-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
              انضم اليوم لمجتمع المتفوقين واستفد من مواكبة شخصية تضمن لك الوصول لأهدافك الدراسية.
            </p>

            <div className="pt-8">
              <Link
                to="/coaching-offer"
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl hover:bg-blue-50 transition-all shadow-xl hover:scale-105 group"
              >
                <span>انضم إلينا الآن</span>
                <ArrowLeftIcon size={24} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const ArrowLeftIcon = ({ size, className }: { size: number, className?: string }) => (
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
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
