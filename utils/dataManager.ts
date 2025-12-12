
import { BlogPost, Student, Appointment, SuccessStory } from '../types';
import { IMAGES } from '../constants/images';

const KEYS = {
  POSTS: 'tilmid_posts',
  STUDENTS: 'tilmid_students',
  APPOINTMENTS: 'tilmid_appointments',
  STORIES: 'tilmid_stories',
  REELS: 'tilmid_reels'
};

const SEED_DATA = {
  POSTS: [
    {
      id: 'conf-1',
      title: "الثقة في النفس: كيف تبني 'عقلية الوحش' قبل الامتحانات؟",
      category: "تطوير الذات",
      date: "20 فبراير 2024",
      image: "https://images.unsplash.com/photo-1499209974431-9eaa37a11927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "الثقة ليست موهبة، بل هي نتيجة لدورة فعل مستمرة. تعلم كيف تكسر حاجز الخوف وتؤمن بقدراتك.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p class="text-lg">بزاف ديال التلاميذ كيسحاب ليهم أن الثقة كتجي قبل الفعل، ولكن العكس هو اللي صحيح. الثقة هي نتيجة لواحد الدورة سميتها <b>دورة الكفاءة</b>:</p>
        
        <!-- Diagram: Confidence Loop -->
        <div class="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 my-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
             <div class="bg-white p-4 rounded-2xl shadow-sm text-center border-b-4 border-blue-500">
                <span class="block font-black text-blue-600">1. فعل صغير</span>
                <span class="text-[10px] text-gray-400">مراجعة فقرة واحدة</span>
             </div>
             <div class="hidden md:block text-center text-blue-300">←</div>
             <div class="bg-white p-4 rounded-2xl shadow-sm text-center border-b-4 border-purple-500">
                <span class="block font-black text-purple-600">2. إنجاز</span>
                <span class="text-[10px] text-gray-400">إتمام المهمة</span>
             </div>
             <div class="hidden md:block text-center text-purple-300">←</div>
             <div class="bg-white p-4 rounded-2xl shadow-sm text-center border-b-4 border-emerald-500">
                <span class="block font-black text-emerald-600">3. ثقة</span>
                <span class="text-[10px] text-gray-400">شعور بالقدرة</span>
             </div>
             <div class="hidden md:block text-center text-emerald-300">←</div>
             <div class="bg-white p-4 rounded-2xl shadow-sm text-center border-b-4 border-orange-500">
                <span class="block font-black text-orange-600">4. استمرار</span>
                <span class="text-[10px] text-gray-400">فعل أكبر</span>
             </div>
          </div>
        </div>

        <h3 class="text-xl font-bold text-slate-900">كيفاش تطبق هادشي؟</h3>
        <ul class="list-disc pr-6 space-y-3">
          <li><b>حبس المقارنة:</b> قارن راسك مع النسخة ديال البارح، مشي مع صاحبك اللي طار فالمقرر.</li>
          <li><b>تقبل الخطأ:</b> الفشل فـتمرين هو معلومة جديدة، مشي نهاية العالم.</li>
          <li><b>الاستعداد القبلي:</b> أحسن مصل للثقة هو الخدمة والتمارين المكثفة.</li>
        </ul>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 2450
    },
    {
      id: 'focus-1',
      title: "قلة التركيز: 5 لصوص يسرقون وقتك الدراسي وكيف تطردهم؟",
      category: "الإنتاجية",
      date: "22 فبراير 2024",
      image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "الهاتف، الضجيج، وتشتت الأفكار.. اكتشف مخطط 'التركيز العميق' لاستعادة سيطرتك على عقلك.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <h3 class="text-xl font-bold text-slate-900">مخطط طبقات التشتت</h3>
        <p>التركيز هو القدرة على عزل عقلك وسط 'بحر' من المشتتات:</p>

        <!-- Diagram: Focus Zones -->
        <div class="flex justify-center my-10">
           <div class="relative w-64 h-64 flex items-center justify-center">
              <div class="absolute inset-0 border-4 border-red-100 rounded-full animate-pulse"></div>
              <div class="absolute inset-8 border-4 border-orange-100 rounded-full"></div>
              <div class="absolute inset-16 border-4 border-emerald-500 rounded-full bg-emerald-50 shadow-inner flex flex-col items-center justify-center text-center p-4">
                 <span class="text-xs font-black text-emerald-700">منطقة التركيز العميق</span>
                 <span class="text-[8px] text-emerald-500">(هنا كتحفظ بجد)</span>
              </div>
              <div class="absolute -top-6 bg-white px-3 py-1 rounded-full border text-[10px] font-bold text-red-500 shadow-sm">اللص 1: إشعارات الهاتف 📱</div>
              <div class="absolute -bottom-6 bg-white px-3 py-1 rounded-full border text-[10px] font-bold text-orange-500 shadow-sm">اللص 2: المقاطعات العائلية 🗣️</div>
           </div>
        </div>

        <h3 class="text-xl font-bold">الحل العملي: نظام الـ Airplane Mode</h3>
        <p>باش تدخل للمنطقة الخضراء (التركيز العميق)، خاصك تقطع الخيوط مع العالم الخارجي لمدة 50 دقيقة على الأقل. الدماغ كيحتاج 20 دقيقة باش يوصل لأقصى قدرة استيعابية، وأي 'شوفة' فالتليفون كترجعك للصفر.</p>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 3100
    },
    {
      id: 'start-1',
      title: "صعوبة البداية: كيف تخدع عقلك لتبدأ المراجعة في 5 ثواني؟",
      category: "تقنيات",
      date: "25 فبراير 2024",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "البداية هي أصعب جزء في أي مهمة. تعلم قاعدة الـ 5 ثواني لكسر حاجز العجز والتسويف.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>فاش كتقول 'خاصني نوض نحفظ'، عقلك كيبدا يحلل الصعوبات باش يخليك مرتاح. هنا كتحتاج <b>قنطرة الـ 5 ثواني</b>:</p>

        <!-- Diagram: 5 Sec Timeline -->
        <div class="bg-slate-900 p-8 rounded-[2.5rem] text-white my-10 relative overflow-hidden">
           <div class="flex items-center justify-between font-black text-4xl mb-6 px-4">
              <span class="text-red-500">5</span>
              <span class="text-orange-500">4</span>
              <span class="text-yellow-500">3</span>
              <span class="text-blue-500">2</span>
              <span class="text-emerald-500">1</span>
           </div>
           <div class="h-2 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-l from-emerald-500 via-blue-500 to-red-500 w-full"></div>
           </div>
           <p class="text-center mt-6 text-emerald-400 font-bold">في الثانية 1.. قف وتحرك فوراً!</p>
        </div>

        <h3 class="text-xl font-bold">لماذا تنجح هذه القاعدة؟</h3>
        <p>لأنك كتقطع الطريق على 'الأفكار التخريبية'. بمجرد ما كتحرك جسدك، كيتغير المود ديالك. جربها غدا مع الفياق بكري وغادي تشوف الفرق.</p>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 1890
    },
    {
      id: 'tawjih-1',
      title: "مشكل التوجيه: ميزان 'الحلم' و 'السوق' لاختيار شعبتك",
      category: "توجيه",
      date: "1 مارس 2024",
      image: "https://images.unsplash.com/photo-1513258496099-48168024adb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "لا تتبع القطيع! تعلم كيف تختار مسارك الدراسي بناءً على معادلة الإيكيغاي المبسطة.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>اختيار الشعبة هو أهم قرار غاتاخدو هاد العام. التوجيه الصحيح كيعتمد على 3 دوائر:</p>

        <!-- Diagram: Simplified Ikigai -->
        <div class="relative h-64 flex items-center justify-center my-10">
           <div class="absolute w-40 h-40 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center -translate-x-12 -translate-y-8">
              <span class="text-xs font-bold text-blue-700">شنو كنبغي؟ (الميول)</span>
           </div>
           <div class="absolute w-40 h-40 bg-purple-500/20 rounded-full border-2 border-purple-500 flex items-center justify-center translate-x-12 -translate-y-8">
              <span class="text-xs font-bold text-purple-700">فاش أنا واعر؟ (المهارة)</span>
           </div>
           <div class="absolute w-40 h-40 bg-emerald-500/20 rounded-full border-2 border-emerald-500 flex items-center justify-center translate-y-12">
              <span class="text-xs font-bold text-emerald-700">شنو كيبغي السوق؟</span>
           </div>
           <div class="absolute w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center z-10 border-4 border-yellow-400 animate-bounce">
              <span class="text-[10px] font-black">هدف!</span>
           </div>
        </div>

        <p class="bg-yellow-50 p-6 rounded-2xl border-r-4 border-yellow-400">إلى اختاريتي شي حاجة كاع ما كتحملها غير حيت فيها الفلوس، غادي تعيا. وإلى اختاريتي حلمك ولكن السوق ما محتاجوش، غادي توحل. السر هو **نقطة المنتصف**.</p>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 4200
    },
    {
      id: 'libre-1',
      title: "باك ليبر: خريطة الطريق للنجاح بميزة حسن جداً",
      category: "باك ليبر",
      date: "5 مارس 2024",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "الدليل الشامل للمترشحين الأحرار: من التسجيل الإداري حتى ليلة الامتحان الوطني.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>باك ليبر فرصة ذهبية باش تبدل مسارك. التحدي الكبير هو **الاستقلالية**. خاصك تكون أستاذ ديال راسك:</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <h4 class="font-bold text-primary mb-2">1. الإطار المرجعي</h4>
              <p class="text-sm">هو 'الكتاب المقدس' ديالك. كيعطيك شنو اللي غايتحط بالضبط، ما تضيعش وقتك خارج هاد الإطار.</p>
           </div>
           <div class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <h4 class="font-bold text-purple-600">2. قانون 80/20</h4>
              <p class="text-sm">ركز على 20% من الدروس اللي كتعطي 80% من النقط في الامتحانات السابقة.</p>
           </div>
        </div>

        <h3 class="text-xl font-bold">برنامج العمل المقترح:</h3>
        <ul class="space-y-3">
          <li class="flex gap-3"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span> <b>شتنبر - نونبر:</b> فهم الدروس وتلخيصها.</li>
          <li class="flex gap-3"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span> <b>دجنبر - مارس:</b> حل سلاسل التمارين المكثفة.</li>
          <li class="flex gap-3"><span class="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span> <b>أبريل - ماي:</b> امتحانات وطنية سابقة (Marathon).</li>
        </ul>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 5600
    },
    {
      id: 'uni-1',
      title: "الاستعداد للجامعة: كيف تنجو من 'صدمة' السنة الأولى؟",
      category: "جامعي",
      date: "10 مارس 2024",
      image: "https://images.unsplash.com/photo-1541339907198-e08756defe73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "الانتقال من الثانوي للجامعي هو انتقال من الحفظ للفهم ومن الضبط للحرية. تعلم كيف تتأقلم.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>في الجامعة، مكاينش اللي غا يقوليك 'نوض تقرا'. الحرية هي الفخ الأكبر. إليك <b>هرم النجاح الجامعي</b>:</p>

        <!-- Diagram: Uni Pyramid -->
        <div class="flex flex-col items-center gap-1 my-10">
           <div class="w-24 h-10 bg-primary rounded-t-lg flex items-center justify-center text-white font-black text-xs">التخصص</div>
           <div class="w-48 h-10 bg-blue-400 flex items-center justify-center text-white font-black text-xs">المهارات الناعمة (Soft Skills)</div>
           <div class="w-72 h-10 bg-blue-300 flex items-center justify-center text-white font-black text-xs">اللغات (الفرنسية/الإنجليزية)</div>
           <div class="w-full h-12 bg-slate-100 border-2 border-dashed border-slate-300 rounded-b-lg flex items-center justify-center text-slate-400 font-bold text-sm">القاعدة: الانضباط الذاتي</div>
        </div>

        <h3 class="text-xl font-bold">نصائح ذهبية للطلبة الجدد:</h3>
        <ul class="list-disc pr-6 space-y-2">
          <li><b>حضر المحاضرات:</b> ولو يكون 'بولي' موجود، هضرة البروف فيها 50% من الامتحان.</li>
          <li><b>خدم بـ Archives:</b> الامتحانات السابقة في الجامعة هي خريطة الكنز.</li>
          <li><b>صاوب ريزو:</b> صحابك فلافاك هوما اللي غايعاونوك فـ 'لي كور' و 'لي طي بي'.</li>
        </ul>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 3400
    },
    {
      id: 'method-1',
      title: "طريقة المراجعة النشطة: وداعاً للحفظ الببغائي الممل",
      category: "تقنيات",
      date: "12 مارس 2024",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "تعلم تقنية Active Recall و Spaced Repetition التي يستخدمها عباقرة العالم لتثبيت المعلومة للأبد.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <h3 class="text-xl font-bold text-slate-900">مقارنة بين المراجعة السلبية والنشطة</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
           <div class="bg-red-50 p-6 rounded-3xl border border-red-100">
              <span className="text-red-600 font-black block mb-4">❌ مراجعة سلبية</span>
              <ul className="text-sm space-y-2 text-red-800">
                 <li>• إعادة قراءة الدرس 5 مرات.</li>
                 <li>• تسطير الجمل بـ Highlighter.</li>
                 <li>• الحفظ بدون فهم السياق.</li>
              </ul>
           </div>
           <div class="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <span className="text-emerald-600 font-black block mb-4">✅ مراجعة نشطة</span>
              <ul className="text-sm space-y-2 text-emerald-800">
                 <li>• سد الكتاب وشرح الدرس لراسك.</li>
                 <li>• صياغة أسئلة والإجابة عليها.</li>
                 <li>• استخدام الخرائط الذهنية.</li>
              </ul>
           </div>
        </div>

        <h3 class="text-xl font-bold">نظام 'التكرار المتباعد':</h3>
        <p>بدل ما تراجع الدرس اليوم 5 سوايع وتنساه، راجعو اليوم 15 دقيقة، غدا 5 دقايق، مورا سيمانة 5 دقايق. المعلومة غاتلصق فـ الذاكرة طويلة المدى.</p>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 2200
    },
    {
      id: 'time-1',
      title: "تنظيم الوقت: مصفوفة أيزنهاور للتلميذ الذكي",
      category: "تطوير الذات",
      date: "15 مارس 2024",
      image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "الكل يملك 24 ساعة، لكن الناجحين يعرفون كيف يوزعونها. تعلم فن ترتيب الأولويات.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>تنظيم الوقت مشي هو تعمر نهارك كامل قراية، بل هو تعرف 'شنو دير دابا'. طبق هاد المصفوفة:</p>

        <!-- Diagram: Eisenhower Matrix -->
        <div class="grid grid-cols-2 gap-2 my-10 aspect-square max-w-sm mx-auto font-bold text-[10px] sm:text-xs">
           <div class="bg-red-100 border-2 border-red-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-red-700">
              <span class="block mb-1 font-black">1. مستعجل ومهم</span>
              <span>(فروض غدا)</span>
           </div>
           <div class="bg-blue-100 border-2 border-blue-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-blue-700">
              <span class="block mb-1 font-black">2. مهم غير مستعجل</span>
              <span>(المراجعة للوطني)</span>
           </div>
           <div class="bg-orange-100 border-2 border-orange-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-orange-700">
              <span class="block mb-1 font-black">3. مستعجل غير مهم</span>
              <span>(إشعارات واتساب)</span>
           </div>
           <div class="bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-gray-400">
              <span class="block mb-1 font-black">4. غير مهم وغير مستعجل</span>
              <span>(التصفح اللانهائي)</span>
           </div>
        </div>

        <p class="font-bold text-primary italic">"التلاميذ المتفوقين كيقضيو 70% من وقتهم في المربع رقم 2 (التخطيط المسبق)."</p>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 4800
    },
    {
      id: 'neg-1',
      title: "المقارنة السلبية: لماذا يدمرك النظر لنتائج الآخرين؟",
      category: "نفسي",
      date: "18 مارس 2024",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "المقارنة هي سارق السعادة. تعلم كيف تركز على مسارك الخاص وتفتخر بتقدمك الشخصي.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>فاش كتشوف صاحبك 'طير' المقرّر وأنت باقي فالبداية، كتحس بالإحباط. هاد المقارنة ظالمة حيت:</p>
        
        <!-- Diagram: Growth Graph -->
        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 my-10 relative">
           <div class="h-40 flex items-end gap-8 px-4 border-b-2 border-slate-200">
              <div class="flex-1 bg-slate-200 h-10 rounded-t-xl relative group">
                 <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">أنا البارحة</div>
              </div>
              <div class="flex-1 bg-primary h-32 rounded-t-xl relative group animate-bounce-slow">
                 <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-primary">أنا اليوم</div>
              </div>
              <div class="flex-1 bg-slate-100 h-40 rounded-t-xl opacity-20 border-2 border-dashed border-slate-300">
                 <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 rotate-45">الآخرون</div>
              </div>
           </div>
           <p class="text-center text-[10px] mt-4 font-bold text-slate-400">النمو الحقيقي هو أن تتفوق على نفسك السابقة.</p>
        </div>

        <h3 class="text-xl font-bold">قاعدة الـ 1%:</h3>
        <p>إلى كنتي كتطور غير بـ 1% كل نهار، مورا عام غادي تكون حسن بـ 37 مرة. ركز على خطواتك، الطريق طويل وكل واحد عندو الوتيرة ديالو.</p>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 1550
    },
    {
      id: 'early-1',
      title: "الفياق بكري: كيف تستغل 'ساعات البركة' لتسبق الجميع؟",
      category: "عادات",
      date: "20 مارس 2024",
      image: "https://images.unsplash.com/photo-1495480137269-ff29bd0a695c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "ساعة واحدة في الفجر تعادل 3 ساعات في الليل. اكتشف الكيمياء الذهنية للصباح الباكر.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>الدماغ فالفجر كيكون فـأقصى مستويات 'الصفاء الذهني'. إليك **منحنى الطاقة اليومي**:</p>

        <!-- Diagram: Energy Wave -->
        <div class="my-10 p-6 bg-slate-50 rounded-3xl border border-slate-200">
           <svg viewBox="0 0 400 100" class="w-full">
              <path d="M0,80 Q50,0 100,20 T200,80 T300,20 T400,80" fill="none" stroke="#0095ff" stroke-width="4" />
              <circle cx="60" cy="15" r="6" fill="#0095ff" class="animate-pulse" />
              <text x="50" y="40" font-size="10" font-weight="bold" fill="#0095ff">قمة التركيز (04:00 AM)</text>
              <text x="320" y="60" font-size="10" font-weight="bold" fill="#94a3b8">خمول (10:00 PM)</text>
           </svg>
        </div>

        <h3 class="text-xl font-bold">خطة 'نادي الفجر':</h3>
        <ol class="list-decimal pr-6 space-y-3">
          <li><b>نعس بكري:</b> مستحيل تفيق بـ 4:30 وأنت ناعس بـ 01:00.</li>
          <li><b>الماء فوراً:</b> بمجرد ما تفيق، شرب كاس ديال الماء باش تنشط الدورة الدموية.</li>
          <li><b>بدا بالمواد الصعبة:</b> استغل ذهنك الصافي فـ الرياضيات أو الفيزياء.</li>
        </ol>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 3900
    },
    {
      id: 'fr-1',
      title: "مشكل اللغة الفرنسية: لا تدع 'اللغة' تمنعك من فهم 'العلم'",
      category: "مهارات",
      date: "22 مارس 2024",
      image: "https://images.unsplash.com/photo-1543167664-40d69aa439da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "عقدة المواد العلمية بالفرنسية؟ تعلم كيف تفك شفرات التمارين دون أن تكون نابغة في اللغة.",
      content: `<div class="space-y-8 text-gray-700 leading-relaxed">
        <p>بزاف ديال التلاميذ كيعرفو يخرجو التمرين ولكن مكيفهموش 'شنو مطلوب'. الحل هو **خريطة الأفعال الإجرائية**:</p>

        <!-- Diagram: Action Verbs Map -->
        <div class="space-y-3 my-10">
           <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-blue-50 shadow-sm">
              <div className="w-24 font-black text-blue-600">Déduire</div>
              <div className="flex-grow text-sm font-bold">استنتج (خدم بنتيجة السؤال اللي قبل)</div>
           </div>
           <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-purple-50 shadow-sm">
              <div className="w-24 font-black text-purple-600">Justifier</div>
              <div className="flex-grow text-sm font-bold">علل جوابك (اعطِ القاعدة)</div>
           </div>
           <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-emerald-50 shadow-sm">
              <div className="w-24 font-black text-emerald-600">Calculer</div>
              <div className="flex-grow text-sm font-bold">احسب (تطبيق عددي مباشر)</div>
           </div>
        </div>

        <div class="bg-blue-50 p-6 rounded-2xl">
           <p class="font-bold text-primary mb-2">نصيحة الفريق:</p>
           <p class="text-sm">ما تترجمش الجملة كاملة، ترجم غير 'الكلمات المفتاحية'. دير مذكرة صغيرة لكل مادة فيها هاد المصطلحات وغادي تحس بالفرق فـ أقل من أسبوع.</p>
        </div>
      </div>`,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 2800
    }
  ] as BlogPost[],
  STUDENTS: [
    { 
      id: 'std-1', 
      username: 'amin', 
      password: '123', 
      name: 'أمين التلميذ', 
      grade: 'الثانية باكالوريا', 
      status: 'active', 
      joinDate: '2023-09-01',
      avatar: IMAGES.AVATARS.DEFAULT_USER,
      stats: {
        studyHours: 12,
        commitmentRate: 85,
        weeklyProgress: [40, 60, 55, 80, 70, 85, 50]
      }
    }
  ] as Student[],
  STORIES: [
    {
      id: 1,
      name: "سلمى بناني",
      role: "طالبة طب - سنة أولى",
      content: "بفضل توجيهات تلميذ، تمكنت من تنظيم وقتي واجتياز مباراة الطب بنجاح. التقنيات التي تعلمتها كانت فارقة في مساري.",
      image: IMAGES.AVATARS.SARA
    },
    {
      id: 2,
      name: "كريم العلمي",
      role: "مدرسة المهندسين",
      content: "كنت أعاني من التشتت، لكن برنامج المواكبة ساعدني على التركيز وتحديد أولوياتي. الحمد لله حصلت على ميزة حسن جداً.",
      image: IMAGES.AVATARS.KARIM
    },
    {
      id: 3,
      name: "هدى التازي",
      role: "علوم رياضية",
      content: "الاستشارات النفسية ساعدتني كثيراً في التغلب على توتر الامتحانات. شكراً لفريق تلميذ على الدعم المستمر.",
      image: IMAGES.AVATARS.HUDA
    }
  ] as SuccessStory[]
};

export const dataManager = {
  init: () => {
    const storedPosts = localStorage.getItem(KEYS.POSTS);
    let currentPosts: BlogPost[] = storedPosts ? JSON.parse(storedPosts) : [];
    let hasChanges = false;

    SEED_DATA.POSTS.forEach(seedPost => {
        const existingIndex = currentPosts.findIndex(p => p.id === seedPost.id);
        if (existingIndex >= 0) {
            const existingPost = currentPosts[existingIndex];
            currentPosts[existingIndex] = {
                ...seedPost,
                views: existingPost.views || seedPost.views
            };
            hasChanges = true;
        } else {
            currentPosts.push(seedPost);
            hasChanges = true;
        }
    });

    if (hasChanges || !storedPosts) {
        localStorage.setItem(KEYS.POSTS, JSON.stringify(currentPosts));
    }

    if (!localStorage.getItem(KEYS.STUDENTS)) localStorage.setItem(KEYS.STUDENTS, JSON.stringify(SEED_DATA.STUDENTS));
    if (!localStorage.getItem(KEYS.STORIES)) localStorage.setItem(KEYS.STORIES, JSON.stringify(SEED_DATA.STORIES));
    if (!localStorage.getItem(KEYS.APPOINTMENTS)) localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify([]));
  },

  getPosts: (): BlogPost[] => JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]'),
  savePost: (post: BlogPost) => {
    const posts = dataManager.getPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    let newPosts;
    if (existingIndex >= 0) {
      newPosts = [...posts];
      newPosts[existingIndex] = post;
    } else {
      newPosts = [post, ...posts];
    }
    localStorage.setItem(KEYS.POSTS, JSON.stringify(newPosts));
    return newPosts;
  },
  deletePost: (id: string) => {
    const posts = dataManager.getPosts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
    return posts;
  },

  getStudents: (): Student[] => JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]'),
  saveStudent: (student: Student) => {
    const students = dataManager.getStudents();
    const existingIndex = students.findIndex(s => s.id === student.id);
    let newStudents;
    if (existingIndex >= 0) {
        newStudents = [...students];
        newStudents[existingIndex] = student;
    } else {
        newStudents = [...students, student];
    }
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(newStudents));
    return newStudents;
  },
  deleteStudent: (id: string) => {
    const students = dataManager.getStudents().filter(s => s.id !== id);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    return students;
  },

  getAppointments: (): Appointment[] => JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]'),
  saveAppointment: (app: Appointment) => {
    const apps = dataManager.getAppointments();
    const existingIndex = apps.findIndex(a => a.id === app.id);
    let newApps;
    if (existingIndex >= 0) {
        newApps = [...apps];
        newApps[existingIndex] = app;
    } else {
        newApps = [...apps, app];
    }
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(newApps));
    return newApps;
  },
  deleteAppointment: (id: number) => {
    const apps = dataManager.getAppointments().filter(a => a.id !== id);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(apps));
    return apps;
  },

  getStories: (): SuccessStory[] => JSON.parse(localStorage.getItem(KEYS.STORIES) || '[]'),
  saveStory: (story: SuccessStory) => {
      const stories = dataManager.getStories();
      const existingIndex = stories.findIndex(s => s.id === story.id);
      let newStories;
      if (existingIndex >= 0) {
          newStories = [...stories];
          newStories[existingIndex] = story;
      } else {
          newStories = [...stories, story];
      }
      localStorage.setItem(KEYS.STORIES, JSON.stringify(newStories));
      return newStories;
  },
  deleteStory: (id: number) => {
      const stories = dataManager.getStories().filter(s => s.id !== id);
      localStorage.setItem(KEYS.STORIES, JSON.stringify(stories));
      return stories;
  }
};

dataManager.init();
