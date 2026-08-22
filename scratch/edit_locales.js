const fs = require('fs');

const arPath = 'c:/Users/Hatim/Desktop/Projects/Tilmid/src/locales/ar.json';
const frPath = 'c:/Users/Hatim/Desktop/Projects/Tilmid/src/locales/fr.json';

let ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
let fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

const aboutAr = {
  seoTitle: "من نحن",
  seoDesc: "تلميذ هي المنصة الأولى في المغرب للتوجيه المدرسي والمواكبة التربوية. اكتشف رؤيتنا لمساعدة التلاميذ على التفوق الدراسي وبناء مستقبل واعد.",
  badge: "قصتنا ورؤيتنا",
  heroTitle1: "نحن أكثر من مجرد",
  heroTitle2: "منصة تعليمية",
  heroDesc: "تلميذ هي حركة تغيير في عالم التوجيه المدرسي. نحن نؤمن بأن كل طالب يمتلك مفاتيح النجاح، ودورنا هو مساعدته في العثور عليها.",
  mission: "مهمتنا",
  missionDesc: "تمكين التلاميذ من تجاوز الصعوبات الدراسية والنفسية من خلال توفير مواكبة شخصية، أدوات تنظيمية متطورة، واستراتيجيات تعلم ذكية تضمن لهم التفوق بأقل جهد.",
  vision: "رؤيتنا",
  visionDesc: "أن نكون المرجع الأول في المغرب للتوجيه المدرسي والمواكبة التربوية، ونساهم في بناء جيل واثق من قدراته، واعٍ بمساره، وقادر على تحقيق طموحاته.",
  statValue: "+3500 تلميذ",
  statDesc: "وثقوا بنا وغيروا مسارهم الدراسي.",
  whyTitle: "لماذا تلميذ؟",
  whyDesc: "نرتكز على قيم أساسية تجعل تجربتك معنا فريدة ومثمرة.",
  why1Title: "الدعم النفسي",
  why1Desc: "نعتبر الجانب النفسي أساس التفوق، لذا نوفر بيئة داعمة ومحفزة.",
  why2Title: "المنهجية العلمية",
  why2Desc: "برامجنا مبنية على أحدث أبحاث علم النفس التربوي وتقنيات التعلم.",
  why3Title: "المصداقية والالتزام",
  why3Desc: "نلتزم بمواكبتك خطوة بخطوة حتى تحقق أهدافك المرسومة.",
  founderTitle: "مؤسس المنصة",
  founderDesc: "تعرف على الخبير وراء نجاح تلميذ",
  founderName: "الأستاذ ياسين",
  founderRole: "مؤسس منصة تلميذ & مستشار تربوي",
  founderQuote: "\"بعد مسيرة امتدت لأكثر من 10 سنوات، أدركت أن الفجوة الحقيقية ليست في المناهج، بل في طريقة التعامل معها. أسست 'تلميذ' لتكون البوصلة التي توجه الطلاب.\"",
  founderBio: "خبير معتمد في استراتيجيات التعلم السريع والتوجيه المدرسي. ساعد آلاف الطلاب على تجاوز عقبات التحصيل الدراسي وتحقيق نتائج استثنائية من خلال منهجيات علمية حديثة.",
  badge1: "+10 سنوات خبرة",
  badge2: "مستشار معتمد",
  badge3: "تقييم 4.9/5",
  ctaTitle1: "مستعد لبدء رحلة",
  ctaTitle2: "التغيير نحو التفوق؟",
  ctaDesc: "انضم اليوم لمجتمع المتفوقين واستفد من مواكبة شخصية تضمن لك الوصول لأهدافك الدراسية.",
  ctaBtn: "انضم إلينا الآن"
};

const aboutFr = {
  seoTitle: "À Propos",
  seoDesc: "Tilmid est la première plateforme au Maroc d'orientation et d'accompagnement. Découvrez notre vision pour aider les élèves à exceller.",
  badge: "Notre Histoire et Vision",
  heroTitle1: "Nous sommes plus qu'une",
  heroTitle2: "plateforme éducative",
  heroDesc: "Tilmid est un mouvement de changement dans le monde de l'orientation scolaire. Nous croyons que chaque élève détient les clés du succès.",
  mission: "Notre Mission",
  missionDesc: "Donner aux étudiants les moyens de surmonter les difficultés grâce à un accompagnement personnalisé, des outils d'organisation avancés et des stratégies intelligentes.",
  vision: "Notre Vision",
  visionDesc: "Devenir la référence numéro un au Maroc en matière d'orientation scolaire et contribuer à bâtir une génération confiante en ses capacités.",
  statValue: "+3500 Élèves",
  statDesc: "Nous ont fait confiance.",
  whyTitle: "Pourquoi Tilmid?",
  whyDesc: "Nous nous appuyons sur des valeurs fondamentales pour une expérience unique.",
  why1Title: "Soutien Psychologique",
  why1Desc: "Nous considérons le côté psychologique comme la base de l'excellence.",
  why2Title: "Méthodologie Scientifique",
  why2Desc: "Nos programmes sont basés sur les dernières recherches en psychologie de l'éducation.",
  why3Title: "Crédibilité et Engagement",
  why3Desc: "Nous nous engageons à vous accompagner pas à pas vers vos objectifs.",
  founderTitle: "Le Fondateur",
  founderDesc: "Découvrez l'expert derrière le succès de Tilmid",
  founderName: "Professeur Yassine",
  founderRole: "Fondateur de Tilmid & Conseiller Pédagogique",
  founderQuote: "\"Après plus de 10 ans de carrière, j'ai réalisé que le vrai fossé n'est pas dans le programme, mais dans l'approche.\"",
  founderBio: "Expert certifié en stratégies d'apprentissage rapide. A aidé des milliers d'étudiants à surmonter les obstacles académiques.",
  badge1: "+10 ans d'expérience",
  badge2: "Conseiller Certifié",
  badge3: "Note de 4.9/5",
  ctaTitle1: "Prêt à commencer le voyage",
  ctaTitle2: "vers l'excellence?",
  ctaDesc: "Rejoignez la communauté aujourd'hui et bénéficiez d'un accompagnement personnalisé.",
  ctaBtn: "Rejoignez-nous maintenant"
};

ar.about = aboutAr;
fr.about = aboutFr;

fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');
console.log('done');
