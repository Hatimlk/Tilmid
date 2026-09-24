
import React from 'react';
import { Play, Target, Eye, Heart, Shield, Zap, Users, Award, CheckCircle2, Brain, Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../constants/images';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';

const ABOUT_FR = {
  seoTitle: 'À propos de nous', seoDescription: "Tilmid est une plateforme marocaine d’orientation scolaire et d’accompagnement éducatif.",
  eyebrow: 'Notre histoire et notre vision', hero1: 'Nous sommes bien plus qu’une', hero2: 'plateforme éducative',
  heroText: "Tilmid est un mouvement de transformation de l’orientation scolaire. Chaque élève possède les clés de sa réussite : notre rôle est de l’aider à les trouver.",
  mission: 'Notre mission', missionText: "Aider les élèves à surmonter leurs difficultés scolaires et personnelles grâce à un accompagnement adapté, des outils d’organisation et des méthodes d’apprentissage efficaces.",
  vision: 'Notre vision', visionText: "Devenir la référence au Maroc pour l’orientation scolaire et l’accompagnement éducatif, et contribuer à former une génération confiante, consciente de son parcours et capable de réaliser ses ambitions.",
  students: '+3500 élèves', trust: 'nous ont fait confiance et ont transformé leur parcours scolaire.',
  why: 'Pourquoi Tilmid ?', whyText: 'Nous nous appuyons sur des valeurs essentielles pour rendre votre expérience utile et enrichissante.',
  values: [
    ['Soutien personnel', "Nous considérons le bien-être comme une base de la réussite et proposons un environnement encourageant."],
    ['Méthode scientifique', "Nos programmes s’appuient sur les recherches en psychologie éducative et les techniques d’apprentissage."],
    ['Crédibilité et engagement', "Nous vous accompagnons étape par étape pour vous aider à atteindre vos objectifs."],
  ],
  founderTitle: 'Fondateur de la plateforme', founderIntro: 'Découvrez l’expert à l’origine de Tilmid', founderName: 'M. Yassine',
  founderRole: 'Fondateur de Tilmid & conseiller pédagogique', founderQuote: "Après plus de 10 ans d’expérience, j’ai compris que le véritable défi ne réside pas dans les programmes, mais dans la façon de les aborder. J’ai créé Tilmid pour servir de boussole aux élèves.",
  founderBio: "Expert en stratégies d’apprentissage et en orientation scolaire, il a aidé des milliers d’élèves à dépasser leurs difficultés et à obtenir de meilleurs résultats grâce à des méthodes modernes.",
  badges: ['+10 ans d’expérience', 'Conseiller certifié', 'Note 4,9/5'],
  cta1: 'Prêt à commencer votre parcours', cta2: 'vers la réussite ?', ctaText: "Rejoignez dès aujourd’hui notre communauté et bénéficiez d’un accompagnement adapté à vos objectifs scolaires.", cta: 'Nous rejoindre',
};

const ABOUT_AR = {
  seoTitle: 'من نحن', seoDescription: 'تلميذ هي المنصة الأولى في المغرب للتوجيه المدرسي والمواكبة التربوية.', eyebrow: 'قصتنا ورؤيتنا', hero1: 'نحن أكثر من مجرد', hero2: 'منصة تعليمية', heroText: 'تلميذ هي حركة تغيير في عالم التوجيه المدرسي. نحن نؤمن بأن كل طالب يمتلك مفاتيح النجاح، ودورنا هو مساعدته في العثور عليها.',
  mission: 'مهمتنا', missionText: 'تمكين التلاميذ من تجاوز الصعوبات الدراسية والنفسية من خلال توفير مواكبة شخصية، أدوات تنظيمية متطورة، واستراتيجيات تعلم ذكية تضمن لهم التفوق بأقل جهد.', vision: 'رؤيتنا', visionText: 'أن نكون المرجع الأول في المغرب للتوجيه المدرسي والمواكبة التربوية، ونساهم في بناء جيل واثق من قدراته، واعٍ بمساره، وقادر على تحقيق طموحاته.',
  students: '+3500 تلميذ', trust: 'وثقوا بنا وغيروا مسارهم الدراسي.', why: 'لماذا تلميذ؟', whyText: 'نرتكز على قيم أساسية تجعل تجربتك معنا فريدة ومثمرة.', values: [['الدعم النفسي', 'نعتبر الجانب النفسي أساس التفوق، لذا نوفر بيئة داعمة ومحفزة.'], ['المنهجية العلمية', 'برامجنا مبنية على أحدث أبحاث علم النفس التربوي وتقنيات التعلم.'], ['المصداقية والالتزام', 'نلتزم بمواكبتك خطوة بخطوة حتى تحقق أهدافك المرسومة.']],
  founderTitle: 'مؤسس المنصة', founderIntro: 'تعرف على الخبير وراء نجاح تلميذ', founderName: 'الأستاذ ياسين', founderRole: 'مؤسس منصة تلميذ & مستشار تربوي', founderQuote: "بعد مسيرة امتدت لأكثر من 10 سنوات، أدركت أن الفجوة الحقيقية ليست في المناهج، بل في طريقة التعامل معها. أسست 'تلميذ' لتكون البوصلة التي توجه الطلاب.", founderBio: 'خبير معتمد في استراتيجيات التعلم السريع والتوجيه المدرسي. ساعد آلاف الطلاب على تجاوز عقبات التحصيل الدراسي وتحقيق نتائج استثنائية من خلال منهجيات علمية حديثة.', badges: ['+10 سنوات خبرة', 'مستشار معتمد', 'تقييم 4.9/5'], cta1: 'مستعد لبدء رحلة', cta2: 'التغيير نحو التفوق؟', ctaText: 'انضم اليوم لمجتمع المتفوقين واستفد من مواكبة شخصية تضمن لك الوصول لأهدافك الدراسية.', cta: 'انضم إلينا الآن',
};

export const About: React.FC = () => {
  const { i18n } = useTranslation();
  const copy = i18n.language.startsWith('fr') ? ABOUT_FR : ABOUT_AR;
  return (
    <div dir={i18n.dir()} lang={i18n.language} className="min-h-screen bg-white overflow-hidden font-sans">
      <SEO
        title={copy.seoTitle}
        description={copy.seoDescription}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 bg-slate-900 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-blue-100 font-bold text-sm mb-8 animate-fade-in-up hover:bg-white/10 transition-colors">
            <Users size={16} className="text-primary" />
            <span className="tracking-wide">{copy.eyebrow}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight animate-fade-in-up animate-delay-100">
            {copy.hero1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-blue-500">{copy.hero2}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 font-medium">
            {copy.heroText}
          </p>
        </div>
      </section>

      {/* 1. Hero Video Section */}
      <section className="relative z-20 -mt-20 lg:-mt-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border-[8px] border-white/10 bg-slate-900 aspect-video group animate-fade-in-up animate-delay-300 backdrop-blur-sm">
            {/* Video Player */}
            <video
              src={IMAGES.ABOUT.VIDEO_MAIN}
              controls
              poster={IMAGES.ABOUT.VIDEO_COVER}
              className="w-full h-full object-cover"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
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
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{copy.mission}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    {copy.missionText}
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
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{copy.vision}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">
                    {copy.visionText}
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
                  <span className="font-bold text-slate-900 text-lg">{copy.students}</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">{copy.trust}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Tilmid? Grid */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">{copy.why}</h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">{copy.whyText}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: copy.values[0][0], desc: copy.values[0][1], color: "text-rose-500", bg: "bg-rose-500/10" },
              { icon: Brain, title: copy.values[1][0], desc: copy.values[1][1], color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Shield, title: copy.values[2][0], desc: copy.values[2][1], color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">{copy.founderTitle}</h2>
            <p className="text-slate-500 text-xl font-medium">{copy.founderIntro}</p>
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
                    alt={copy.founderName}
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
              <div className="flex-1 text-center md:text-start">
                <div className="mb-8">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{copy.founderName}</h3>
                  <span className="inline-block px-4 py-1.5 bg-blue-50 text-primary font-bold text-sm rounded-full">
                    {copy.founderRole}
                  </span>
                </div>

                <div className="space-y-6">
                  <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed italic">
                    “{copy.founderQuote}”
                  </p>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {copy.founderBio}
                  </p>
                </div>

                {/* Badges */}
                <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-4">
                  {[
                    { icon: CheckCircle2, text: copy.badges[0], color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: CheckCircle2, text: copy.badges[1], color: "text-emerald-600", bg: "bg-emerald-50" },
                    { icon: Star, text: copy.badges[2], color: "text-amber-500", bg: "bg-amber-50" }
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
              {copy.cta1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{copy.cta2}</span>
            </h2>

            <p className="text-blue-100 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
              {copy.ctaText}
            </p>

            <div className="pt-8">
              <Link
                to="/coaching-offer"
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl hover:bg-blue-50 transition-all shadow-xl hover:scale-105 group"
              >
                <span>{copy.cta}</span>
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
