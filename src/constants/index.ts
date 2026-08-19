
import {
  TrendingUp,
  Target,
  MessageCircle,
  Brain
} from 'lucide-react';
import { ServiceFeature, VideoReel, ProgramData } from '../types';
import { IMAGES } from './images';

export const NAV_ITEMS = [
  { label: "nav.home", href: "/" },
  { label: "nav.tilmidTalib", href: "/tilmid-talib" },
  { label: "nav.tawjih", href: "/tawjih" },
  { label: "nav.coaching", href: "/coaching-offer" },
  { label: "nav.studentArea", href: "/student-area", isButton: true }
];

export const MAIN_SERVICES: ServiceFeature[] = [
  {
    title: "تطوير مهارة التلميذ الدراسية",
    description: "عن طريق تقنيات متقدمة ومتطورة في المراجعة من أجل الحصول على نتائج جيدة أثناء المراجعة أو الدراسة.",
    icon: TrendingUp
  },
  {
    title: "تحسين الأداء التعليمي",
    description: "مساعدة التلميذ في تطوير مهاراته من خلال تنظيم الوقت وإعداد برامج مراجعة متقدمة أساسها تقنيات تجعله يستمتع بدراسته.",
    icon: Brain
  },
  {
    title: "تحديد أهداف التلميذ",
    description: "عن طريق استشارات توجيهية مع الأستاذ والمستشار الدراسي بخبرة طويلة في الميدان ومواكبة التلاميذ.",
    icon: Target
  },
  {
    title: "تطوير مهارات الاتصال",
    description: "عن طريق تداريب وتجارب تمكن التلميذ من التفاعل بفعالية مع المحيط والتعبير عن أفكاره وتطوير شخصيته.",
    icon: MessageCircle
  }
];

export const INSTAGRAM_REELS: VideoReel[] = [
  {
    id: '1',
    reelId: 'C7J4pnzC-VR',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'جرعة أمل، و الله حتا تفرحوا براسكوم.. ماتستاسلموش ✌️❤️🫡',
    duration: '0:47',
    views: '125.5K',
    url: 'https://www.instagram.com/reel/C7J4pnzC-VR/'
  },
  {
    id: '2',
    reelId: 'C4ob4c3iLkv',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'إلى يالاه بديتي المراجعة هاد النصائح الثمينة ليك',
    duration: '0:27',
    views: '98.2K',
    url: 'https://www.instagram.com/reel/C4ob4c3iLkv/'
  },
  {
    id: '3',
    reelId: 'C6wzMqkrN_x',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'حداااااااري من وهم المراجعة',
    duration: '1:02',
    views: '150.1K',
    url: 'https://www.instagram.com/reel/C6wzMqkrN_x/'
  }
];

// --- ADMIN CREDENTIALS REMOVED FOR SECURITY ---
// Authentication should only be handled via API


// Data from PDF 1 (Tawjih)
export const TAWJIH_DATA: ProgramData = {
  id: 'tawjih',
  title: 'التوجيه المدرسي',
  subtitle: 'أهدافنا الكبرى لي غادي تعاونك كتلميذ فالمسار التوجيهي ديالك',
  features: [
    {
      title: 'ضمان اختيار التخصص المناسب للمستقبل',
      description: 'نوجه التلميذ لاختيار الشعب والمسالك اللي منسجمة مع قدراته وطموحاته، باش يضمن مسار دراسي ومهني ناجح.'
    },
    {
      title: 'تبسيط عملية التسجيل في المدارس العليا',
      description: 'نوفر خدمة شاملة كنقومو فيها بجميع إجراءات التسجيل والتتبع، وكنخففو الضغط والارتباك اللي كيعيشوه التلاميذ وعائلاتهم.'
    },
    {
      title: 'مواكبة شخصية لفتح أفضل الفرص الدراسية',
      description: 'كل تلميذ كيستافد من استشارات فردية كاتضمن ليه يختار أحسن الخيارات التعليمية اللي تفتح ليه آفاق مستقبيلة واسعة.'
    },
    {
      title: 'متابعة دقيقة للوائح الرئيسية ولوائح الانتظار',
      description: 'ما نخليوش أي فرصة تضيع، كنراقبو ونوجهو التلاميذ لحظة بلحظة حتى يضمنو مقعدهم فالمدرسة اللي يستحقوها.'
    }
  ],
  extraTopics: [
    { title: 'الفرق بين المدارس و المعاهد و الجامعات', query: 'نصائح' },
    { title: 'المدارس بعد الباك', query: 'توجيه' },
    { title: 'كيفية حساب عتبة الانتقاء', query: 'توجيه' }
  ],
  relatedBlogIds: ['9', '10', '11']
};

// Data from PDF 2 (Tilmid)
export const TILMID_DATA: ProgramData = {
  id: 'tilmid',
  title: 'برنامج تلميذ',
  subtitle: 'أهدافنا الكبرى لي غادي تعاونك كتلميذ فالمسار ديالك',
  features: [
    {
      title: 'نوصلوك لأفضل مستوى دراسي',
      description: 'نساعدك تبني مسار ناجح بخطوات واضحة ومركزة.'
    },
    {
      title: 'نعلموك كيفاش تخدم بذكاء مشي بالجهد',
      description: 'عن طريق تقنيات متطورة فالمراجعة وبخطط عملية وفعالة غادي تعطيك نتائج أسرع وأفضل.'
    },
    {
      title: 'نختاصرو عليك الطريق ونبعدوك على الأخطاء',
      description: 'نعطيك جميع الأخطاء لي خاصك تفاداهم باش تستفد وما تعاودش نفس العثرات.'
    },
    {
      title: 'نوفرو لك التوجيه والمواكبة الصحيحة',
      description: 'باش تختار الطريق الأنسب ليك وتبقى ديما واثق من اختياراتك.'
    }
  ],
  extraTopics: [
    { title: 'تقنيات المراجعة الفعالة', query: 'تقنية' },
    { title: 'تنظيم الوقت المدرسي', query: 'كانبان' },
    { title: 'الاستعداد للامتحانات', query: 'الامتحانات' }
  ],
  relatedBlogIds: ['6', '8', '1']
};

// Data from PDF 3 (Talib)
export const TALIB_DATA: ProgramData = {
  id: 'talib',
  title: 'برنامج طالب',
  subtitle: 'أهدافنا الكبرى لي غادي تعاونك كطالب فالمسار ديالك',
  features: [
    {
      title: 'تمكين الطلبة من التفوق الأكاديمي بأقل جهد ووقت',
      description: 'عبر تزويدهم بأدوات عملية وتقنيات ذكية للمراجعة والتنظيم، كيختاصروا الطريق ويحققوا نتائج قوية بلا تضييع سنوات فالمحاولات العشوائية.'
    },
    {
      title: 'بناء طالب منظم وواعي بقدراته',
      description: 'الهدف ماشي غير النجاح، ولكن تكوين شخصية مستقلة قادرة تنظم وقتها وتبني خططها الدراسية بثقة، باش يبقا النجاح أسلوب حياة ماشي مجرد محطة.'
    },
    {
      title: 'توفير مواكبة شخصية تُسرّع التقدم',
      description: 'كل طالب كيستافد من استشارات فردية مصممة على مقاسه، باش يلقى حلول سريعة لأي صعوبة، ويستافد من خبرات وتجارب سنوات فمجال التوجيه.'
    },
    {
      title: 'تحويل مسار التعليم العالي إلى تجربة ناجحة ومُلهمة',
      description: 'هدفنا الكبير أننا نحولو سنوات الدراسة من معاناة وضغط إلى تجربة إيجابية عامرة بالإنجازات، كتخلي الطالب يحس أنه غادي فالطريق الصحيح.'
    }
  ],
  extraTopics: [
    { title: 'منهجية البحث الجامعي', query: 'تفوق' },
    { title: 'الموازنة بين الدراسة والحياة الشخصية', query: 'عادات' },
    { title: 'التخطيط للمسار المهني', query: 'تطوير' }
  ],
  relatedBlogIds: ['4', '5', '7']
};

// --- SHARED KEYS ---
export const CUSTOM_POSTS_KEY = 'tilmid_posts';
export const GLOBAL_STUDENTS_KEY = 'tilmid_students';
export const GLOBAL_APPOINTMENTS_KEY = 'tilmid_appointments';



