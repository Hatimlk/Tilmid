
import { BlogPost, Student, Appointment, SuccessStory, VideoReel } from '../types';
import { IMAGES } from '../constants/images';

// Keys
const KEYS = {
  POSTS: 'tilmid_posts',
  STUDENTS: 'tilmid_students',
  APPOINTMENTS: 'tilmid_appointments',
  STORIES: 'tilmid_stories',
  REELS: 'tilmid_reels'
};

// Initial Seed Data (Moved from constants.ts)
const SEED_DATA = {
  POSTS: [
    {
      id: '1',
      title: "هاد التقنية غادي تنفعك إلى كنتي كاتعاني من التسويف",
      category: "تقنية POMODORO",
      date: "1 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "تعرف على كيفية استخدام تقنية بومودورو لزيادة الإنتاجية والتغلب على الملل أثناء المراجعة.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p class="text-lg font-medium">هل تجد صعوبة في البدء بالمذاكرة؟ هل تشعر بالملل بعد 10 دقائق فقط؟ تقنية <strong>بومودورو (Pomodoro)</strong> هي الحل السحري الذي يستخدمه ملايين الطلاب حول العالم.</p>
            
            <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-6">
                <h3 class="text-xl font-bold text-primary mb-3">🍅 ما هي هذه التقنية؟</h3>
                <p>هي طريقة لإدارة الوقت طورها الإيطالي "فرانسيسكو سيريلو" في أواخر الثمانينيات. الفكرة بسيطة: تقسيم وقت العمل إلى فترات زمنية قصيرة (25 دقيقة) مفصولة باستراحات قصيرة.</p>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">خطوات التطبيق العملية:</h3>
            <ul class="space-y-4">
                <li class="flex items-start gap-3">
                    <span class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                    <div>
                        <strong>اختر المهمة:</strong> حدد درساً واحداً أو تمريناً تريد إنجازه.
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <span class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                    <div>
                        <strong>اضبط المؤقت:</strong> عير المنبه على 25 دقيقة (تسمى هذه الفترة "بومودورو").
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <span class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                    <div>
                        <strong>اعمل بتركيز تام:</strong> ركز فقط على المهمة حتى يرن المنبه. لا هاتف، لا فيسبوك!
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <span class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">4</span>
                    <div>
                        <strong>خذ استراحة قصيرة:</strong> خذ استراحة لمدة 5 دقائق (تمدد، اشرب ماء، تنفس).
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <span class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold">5</span>
                    <div>
                        <strong>كرر العملية:</strong> بعد كل 4 دورات "بومودورو"، خذ استراحة طويلة (15-30 دقيقة).
                    </div>
                </li>
            </ul>

            <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">لماذا تنجح هذه الطريقة؟</h3>
            <p>لأنها تحول المهمة الكبيرة "المخيفة" إلى خطوات صغيرة يمكن إدارتها. كما أن فكرة "الاستراحة القادمة" تحفز الدماغ على الاستمرار في التركيز.</p>
        </div>
      `,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 1205
    },
    {
      id: '2',
      title: "هاد التقنية كاتقوليك إلى بغيتي تكون سبع مرحبا بيك",
      category: "تقنية MURDER",
      date: "3 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "استراتيجية MURDER الشاملة للمذاكرة الفعالة والحفظ السريع للمعلومات المعقدة.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p class="text-lg">هل تعاني من نسيان المعلومات بمجرد الانتهاء من المراجعة؟ نظام <strong>MURDER</strong> هو نظام دراسي متكامل صممه علماء النفس للمساعدة في تخزين المعلومات في الذاكرة طويلة المدى.</p>
            
            <h3 class="text-2xl font-bold text-gray-900 mt-6 mb-4">تفكيك نظام M.U.R.D.E.R:</h3>
            
            <div class="grid gap-4 md:grid-cols-2">
                <div class="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h4 class="font-bold text-purple-600 text-lg mb-2">Mood (المزاج)</h4>
                    <p class="text-sm">هيئ عقلك ونفسيتك للدراسة. اختر مكاناً هادئاً وتخلص من الأفكار السلبية.</p>
                </div>
                <div class="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h4 class="font-bold text-purple-600 text-lg mb-2">Understand (الفهم)</h4>
                    <p class="text-sm">لا تحفظ دون فهم! حدد النقاط الغامضة في الدرس وابحث عن شرح لها أولاً.</p>
                </div>
                <div class="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h4 class="font-bold text-purple-600 text-lg mb-2">Recall (الاسترجاع)</h4>
                    <p class="text-sm">أغلق الكتاب وحاول تذكر ما قرأته، صغ المعلومات بأسلوبك الخاص.</p>
                </div>
                <div class="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h4 class="font-bold text-purple-600 text-lg mb-2">Digest (الهضم)</h4>
                    <p class="text-sm">عد إلى الأجزاء التي لم تستطع تذكرها، بسطها ولخصها مرة أخرى.</p>
                </div>
                <div class="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h4 class="font-bold text-purple-600 text-lg mb-2">Expand (التوسع)</h4>
                    <p class="text-sm">اربط المعلومات الجديدة بمعلومات سابقة لديك. اسأل نفسك: كيف يمكن تطبيق هذا؟</p>
                </div>
                <div class="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h4 class="font-bold text-purple-600 text-lg mb-2">Review (المراجعة)</h4>
                    <p class="text-sm">راجع بانتظام لضمان بقاء المعلومة راسخة.</p>
                </div>
            </div>

            <p class="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <strong>نصيحة ذهبية:</strong> تطبيق هذه الخطوات بالترتيب يضمن لك فهم الدرس بنسبة تصل إلى 90% مقارنة بالقراءة العادية.
            </p>
        </div>
      `,
      author: { name: "سارة العلمي", avatar: IMAGES.AVATARS.SARA },
      status: 'published',
      views: 980
    },
    {
      id: '3',
      title: "تخيل فرضو عليك تاكل ضفدع أو يتم قتلك",
      category: "تقنية أكل الضفدع",
      date: "4 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "كيف تبدأ بأصعب المهام في يومك لتضمن النجاح وتتخلص من ضغط المماطلة.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <div class="border-r-4 border-green-500 pr-4 bg-gray-50 p-4 rounded-r-xl">
                <p class="italic text-gray-600">"إذا كان عملك هو أكل ضفدع، فمن الأفضل أن تفعله أول شيء في الصباح. وإذا كان عملك هو أكل ضفدعين، فمن الأفضل أن تأكل الأكبر أولاً."</p>
                <p class="text-sm font-bold mt-2 text-gray-800">- مارك توين</p>
            </div>

            <p>لا تقلق، لن تأكل ضفادع حقيقية! 🐸 المقصود بـ <strong>"الضفدع"</strong> هنا هو المهمة الأصعب، الأثقل، والأكثر أهمية في يومك، تلك المهمة التي تميل لتأجيلها باستمرار.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">كيف تطبق هذه التقنية في دراستك؟</h3>
            <ol class="list-decimal list-inside space-y-4 marker:font-bold marker:text-green-600">
                <li><strong>حدد ضفدعك:</strong> في الليلة السابقة، حدد أصعب مادة أو تمرين عليك القيام به غداً (مثلاً: حل مسألة الرياضيات المعقدة).</li>
                <li><strong>كله أولاً:</strong> ابدأ يومك الدراسي بإنجاز هذه المهمة مباشرة. لا تفتح الهاتف، لا تراجع مواد سهلة، ابدأ بالصعب.</li>
                <li><strong>استمتع بالإنجاز:</strong> بمجرد الانتهاء من أصعب مهمة في الصباح الباكر، ستشعر بدفعة هائلة من الدوبامين (هرمون السعادة) والثقة بالنفس.</li>
            </ol>

            <div class="bg-green-50 p-6 rounded-2xl mt-6">
                <h4 class="font-bold text-green-800 mb-2">لماذا تنجح؟</h4>
                <p class="text-green-700 text-sm">لأن إرادتنا وطاقتنا الذهنية تكون في ذروتها صباحاً. إذا تركت المهام الصعبة للمساء، غالباً لن تنجزها بسبب التعب.</p>
            </div>
        </div>
      `,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 1500
    },
    {
        id: '4',
        title: "من أكثر التقنيات الرائعة ولي غادي تخليك منظم",
        category: "تقنية كانبان",
        date: "5 شتنبر 2023",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        excerpt: "نظام كانبان الياباني لتنظيم المهام الدراسية وتتبع تقدمك بشكل بصري ممتع.",
        content: `
          <div class="space-y-6 text-gray-700 leading-relaxed">
              <p>كلمة <strong>"كانبان" (Kanban)</strong> هي كلمة يابانية تعني "بطاقة مرئية". هي طريقة رائعة لتصور مهامك الدراسية ومعرفة أين وصلت بالضبط، مما يقلل من التوتر والقلق.</p>
              
              <h3 class="text-2xl font-bold text-gray-900 mt-6 mb-4">كيف تصنع لوحة كانبان للدراسة؟</h3>
              <p>تحتاج فقط لسبورة (أو ورقة كبيرة) وأوراق ملاحظات لاصقة (Stickynotes). قسم اللوحة إلى 3 أعمدة:</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div class="bg-gray-100 p-4 rounded-xl border-t-4 border-red-400">
                      <h4 class="font-bold text-center mb-2">1. المهام (To Do)</h4>
                      <p class="text-xs text-gray-500 text-center">ضع هنا كل الدروس والتمارين التي "يجب" عليك فعلها.</p>
                  </div>
                  <div class="bg-blue-50 p-4 rounded-xl border-t-4 border-blue-400">
                      <h4 class="font-bold text-center mb-2">2. جاري العمل (Doing)</h4>
                      <p class="text-xs text-gray-500 text-center">انقل هنا فقط المهمة التي تدرسها "الآن". (مهمة واحدة أو اثنتين كحد أقصى).</p>
                  </div>
                  <div class="bg-green-50 p-4 rounded-xl border-t-4 border-green-400">
                      <h4 class="font-bold text-center mb-2">3. تم الإنجاز (Done)</h4>
                      <p class="text-xs text-gray-500 text-center">الشعور الأجمل! انقل البطاقة هنا بعد الانتهاء.</p>
                  </div>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mt-8">الفائدة النفسية:</h3>
              <ul class="list-disc list-inside space-y-2">
                  <li>تمنعك من الشعور بالضياع وسط كثرة الدروس.</li>
                  <li>رؤية عمود "تم الإنجاز" يمتلئ يعطيك حافزاً قوياً للاستمرار.</li>
                  <li>تساعدك على التركيز على مهمة واحدة في كل مرة (عمود "جاري العمل").</li>
              </ul>
          </div>
        `,
        author: { name: "محمد التازي", avatar: IMAGES.AVATARS.MOHAMED },
        status: 'published',
        views: 850
    },
    // Other posts...
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
    },
    // ...
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
  // Initialize Data if empty
  init: () => {
    // Posts Initialization & Merge Logic
    const storedPosts = localStorage.getItem(KEYS.POSTS);
    let currentPosts: BlogPost[] = storedPosts ? JSON.parse(storedPosts) : [];
    let hasChanges = false;

    // Check seed items. If they exist in currentPosts, UPDATE them with new seed content (for rich text updates).
    // If they don't exist, ADD them.
    SEED_DATA.POSTS.forEach(seedPost => {
        const existingIndex = currentPosts.findIndex(p => p.id === seedPost.id);
        if (existingIndex >= 0) {
            // Update existing post if it matches a seed ID
            const existingPost = currentPosts[existingIndex];
            currentPosts[existingIndex] = {
                ...seedPost,
                views: existingPost.views || seedPost.views // Keep existing view count
            };
            hasChanges = true;
        } else {
            // Add new seed post
            currentPosts.push(seedPost);
            hasChanges = true;
        }
    });

    if (hasChanges || !storedPosts) {
        localStorage.setItem(KEYS.POSTS, JSON.stringify(currentPosts));
    }

    // Other Data Types (Standard Init)
    if (!localStorage.getItem(KEYS.STUDENTS)) localStorage.setItem(KEYS.STUDENTS, JSON.stringify(SEED_DATA.STUDENTS));
    if (!localStorage.getItem(KEYS.STORIES)) localStorage.setItem(KEYS.STORIES, JSON.stringify(SEED_DATA.STORIES));
    if (!localStorage.getItem(KEYS.APPOINTMENTS)) localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify([]));
  },

  // --- POSTS ---
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

  // --- STUDENTS ---
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

  // --- APPOINTMENTS ---
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

  // --- SUCCESS STORIES ---
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

// Initialize immediately
dataManager.init();
