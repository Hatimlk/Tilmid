
import React from 'react';
import { Play, Target, Eye, Heart, Shield, Zap, Users, Award, CheckCircle2, Brain, Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      {/* Video Section */}
      <section className="relative z-20 -mt-16 lg:-mt-24 px-4">
        <div className="container mx-auto max-w-5xl">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-900 aspect-video group animate-fade-in-up animate-delay-300">
                {/* Placeholder Image for Video */}
                <img 
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                    alt="Tilmid Presentation" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="relative w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
                        <Play size={32} fill="currentColor" className="ml-1" />
                        {/* Pulse Rings */}
                        <span className="absolute inset-0 rounded-full border border-white/30 animate-ping"></span>
                        <span className="absolute inset-0 rounded-full border border-white/30 animate-ping animation-delay-500"></span>
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

      {/* Mission & Vision */}
      <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <div className="space-y-8">
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

                  <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary to-royal rounded-[3rem] rotate-3 opacity-10"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
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

      {/* Values Section */}
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
                      { icon: Shield, title: "المصداقية والالتزام", desc: "نلتزم بمواكبتك خطوة بخطوة حتى تحقق أهدافك المرسومة.", color: "text-green-500", bg: "bg-green-50" },
                  ].map((item, idx) => (
                      <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 text-center group">
                          <div className={`w-20 h-20 mx-auto ${item.bg} ${item.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                              <item.icon size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Founder Section - Redesigned to match Success Stories style */}
      <section className="py-20 lg:py-28 bg-blue-50/30">
          <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">مؤسس المنصة</h2>
                  <p className="text-gray-500 text-lg">تعرف على الخبير وراء نجاح تلميذ</p>
              </div>

              <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  {/* Decorative Elements matching Success Stories */}
                  <div className="absolute top-10 left-10 text-gray-100 group-hover:text-blue-50 transition-colors">
                      <Quote size={80} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                      {/* Photo */}
                      <div className="shrink-0 relative">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-br from-primary to-royal shadow-lg">
                              <img 
                                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="الأستاذ ياسين" 
                                className="w-full h-full object-cover rounded-full border-4 border-white"
                              />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-md border-4 border-white">
                              <Award size={20} />
                          </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-right">
                          <div className="mb-4">
                              <h3 className="text-2xl font-bold text-gray-900">الأستاذ ياسين</h3>
                              <span className="text-primary font-bold text-sm block mt-1">مؤسس منصة تلميذ & مستشار تربوي</span>
                          </div>

                          <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                              <p>
                                  "بعد مسيرة امتدت لأكثر من 10 سنوات في ميدان التربية والتكوين، أدركت أن الفجوة الحقيقية ليست في المناهج، بل في طريقة التعامل معها. أسست 'تلميذ' لتكون البوصلة التي توجه الطلاب نحو اكتشاف قدراتهم الكامنة."
                              </p>
                              <p className="text-sm text-gray-500">
                                  خبير معتمد في استراتيجيات التعلم السريع والتوجيه المدرسي. ساعد آلاف الطلاب على تجاوز عقبات التحصيل الدراسي وتحقيق نتائج استثنائية من خلال منهجيات علمية حديثة.
                              </p>
                          </div>

                          {/* Badges/Tags */}
                          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                                  <CheckCircle2 size={14} />
                                  <span>+10 سنوات خبرة</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                                  <CheckCircle2 size={14} />
                                  <span>مستشار معتمد</span>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-3 py-1.5 rounded-lg text-xs font-bold">
                                  <Star size={14} fill="currentColor" />
                                  <span>تقييم ممتاز</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">مستعد لبدء رحلة التغيير؟</h2>
              <Link to="/coaching-offer" className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-royal transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
                  <span>انضم إلينا الآن</span>
                  <Zap size={20} fill="currentColor" />
              </Link>
          </div>
      </section>

    </div>
  );
};
