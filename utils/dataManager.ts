
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
    {
      id: '5',
      title: "طريقة كورنيل: كيف تكتب ملخصات لا تنسى؟",
      category: "تقنيات",
      date: "10 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "تعلم طريقة كورنيل لتدوين الملاحظات، الطريقة الأكثر فعالية لتلخيص الدروس ومراجعتها.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>يعاني الكثير من الطلاب من فوضى الملاحظات. تكتب الدرس في القسم، وعند المراجعة تجد نفسك أمام "طلاسم" غير مفهومة. الحل؟ <strong>طريقة كورنيل (Cornell Method)</strong>.</p>
            
            <h3 class="text-2xl font-bold text-gray-900 mt-6">كيف تقسم ورقتك؟</h3>
            <p>خذ ورقة عادية وقسمها إلى 3 أقسام رئيسية:</p>
            <ul class="list-disc list-inside space-y-3">
                <li><strong>العمود الأيمن (عمود المراجعة):</strong> مساحة صغيرة (حوالي 5 سم) لكتابة الكلمات المفتاحية والأسئلة الرئيسية.</li>
                <li><strong>العمود الأيسر (عمود الملاحظات):</strong> المساحة الأكبر، تكتب فيها شرح الدرس، الأفكار، والرسوم البيانية أثناء الحصة.</li>
                <li><strong>الخلاصة (في الأسفل):</strong> مستطيل في أسفل الورقة لكتابة ملخص مكثف للدرس في جملتين أو ثلاث.</li>
            </ul>

            <div class="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl mt-6">
                <h4 class="font-bold text-yellow-800 mb-2">سر الفعالية: The 5 R's</h4>
                <ol class="list-decimal list-inside text-sm text-yellow-900 font-medium space-y-1">
                    <li><strong>Record:</strong> سجل الملاحظات في العمود الكبير.</li>
                    <li><strong>Reduce:</strong> لخص الأفكار في العمود الصغير بعد الحصة.</li>
                    <li><strong>Recite:</strong> غط العمود الكبير وحاول استرجاع المعلومات باستخدام الكلمات المفتاحية فقط.</li>
                    <li><strong>Reflect:</strong> فكر في المعلومات واربطها بمعارفك السابقة.</li>
                    <li><strong>Review:</strong> راجع مذكراتك أسبوعياً لمدة 10 دقائق.</li>
                </ol>
            </div>
        </div>
      `,
      author: { name: "سارة العلمي", avatar: IMAGES.AVATARS.SARA },
      status: 'published',
      views: 1100
    },
    {
      id: '6',
      title: "النوم والذاكرة: لماذا السهر هو عدوك الأول؟",
      category: "الصحة والدراسة",
      date: "12 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1541781777621-af1187546367?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "اكتشف العلاقة العلمية بين النوم وترسيخ المعلومات في الذاكرة، وكيف تنظم نومك.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>"سأسهر الليلة لأراجع كل شيء!"... هذه الجملة هي بداية الكارثة لأي طالب. الاعتقاد بأن تقليص ساعات النوم يوفر وقتاً للمراجعة هو خطأ علمي فادح.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">ماذا يحدث لعقلك وأنت نائم؟</h3>
            <p>أثناء النوم، وبالتحديد في مرحلة REM (حركة العين السريعة)، يقوم الدماغ بعملية "Hconsolidation" أو ترسيخ الذاكرة. إنه ينقل المعلومات من الذاكرة قصيرة المدى (التي تختفي بسرعة) إلى الذاكرة طويلة المدى.</p>

            <div class="grid md:grid-cols-2 gap-4 mt-6">
               <div class="bg-red-50 p-4 rounded-xl border border-red-100">
                   <h4 class="font-bold text-red-700 mb-2">قلة النوم تسبب:</h4>
                   <ul class="list-disc list-inside text-sm text-red-600">
                       <li>ضعف التركيز وتشتت الانتباه.</li>
                       <li>صعوبة استرجاع المعلومات.</li>
                       <li>زيادة التوتر والقلق.</li>
                   </ul>
               </div>
               <div class="bg-green-50 p-4 rounded-xl border border-green-100">
                   <h4 class="font-bold text-green-700 mb-2">النوم الكافي يمنحك:</h4>
                   <ul class="list-disc list-inside text-sm text-green-600">
                       <li>سرعة بديهة وحل المشكلات.</li>
                       <li>ذاكرة حديدية.</li>
                       <li>استقرار عاطفي ونفسي.</li>
                   </ul>
               </div>
            </div>

            <p class="font-bold mt-4 text-center text-primary">نصيحة: احرص على النوم لمدة 7-8 ساعات، خاصة ليلة الامتحان.</p>
        </div>
      `,
      author: { name: "د. كريم", avatar: IMAGES.AVATARS.KARIM },
      status: 'published',
      views: 1450
    },
    {
      id: '7',
      title: "كيف تختار تخصصك الجامعي دون ندم؟",
      category: "توجيه",
      date: "15 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "خطوات عملية لاكتشاف شغفك واختيار المسار الدراسي الذي يناسب سوق الشغل وقدراتك.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>اختيار التخصص الجامعي هو واحد من أهم القرارات في حياتك. الكثير من الطلاب يختارون بناءً على "المعدل" فقط أو "رغبة الوالدين"، وينتهي بهم الأمر بدراسة مجال لا يحبونه.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">معادلة "إيكيجاي" للاختيار الصحيح:</h3>
            <p>للاختيار الصحيح، حاول أن تجد التقاطع بين 4 دوائر:</p>
            <ol class="list-decimal list-inside space-y-2 font-medium">
                <li><strong>ما تحبه:</strong> (الشغف) ما هي المواد التي تستمتع بها؟</li>
                <li><strong>ما تجيده:</strong> (الموهبة) ما هي المهارات التي تتقنها بسهولة؟</li>
                <li><strong>ما يحتاجه العالم:</strong> (الفرص) هل هناك طلب في سوق الشغل؟</li>
                <li><strong>ما يُدفع لك لأجله:</strong> (المهنة) هل يمكنك كسب عيش كريم منه؟</li>
            </ol>

            <div class="bg-gray-100 p-6 rounded-2xl mt-6">
                <h4 class="font-bold text-gray-800 mb-2">خطوات عملية:</h4>
                <ul class="space-y-2 text-sm">
                    <li>✅ قم باختبارات تحليل الشخصية والميول المهنية.</li>
                    <li>✅ تحدث مع طلاب يدرسون التخصصات التي تفكر فيها.</li>
                    <li>✅ ابحث في مواقع التوظيف عن المهن المطلوبة مستقبلاً.</li>
                </ul>
            </div>
        </div>
      `,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 2100
    },
    {
      id: '8',
      title: "عقدة الرياضيات: كيف تتصالح مع الأرقام؟",
      category: "نصائح",
      date: "18 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "نصائح للتغلب على الخوف من الرياضيات وفهمها بشكل مبسط ومنطقي.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>"أنا أدبي، لا أفهم الرياضيات!"... هذا معتقد خاطئ يبرمج عقلك على الفشل قبل المحاولة. الرياضيات ليست وحشاً، بل هي لغة منطقية تحتاج فقط إلى طريقة صحيحة لفك شفرتها.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">كيف تتغلب على "فوبيا الرياضيات"؟</h3>
            
            <ul class="space-y-4">
                <li class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <strong class="text-primary block mb-1">1. ابدأ من الأساسيات:</strong>
                    الرياضيات بناء تراكمي. لا يمكنك فهم الدوال دون فهم المعادلات من الدرجة الأولى. لا تخجل من العودة لدروس السنوات الماضية لسد الثغرات.
                </li>
                <li class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <strong class="text-primary block mb-1">2. الممارسة ثم الممارسة:</strong>
                    لا يمكن تعلم الرياضيات بـ "المشاهدة" فقط. يجب أن تمسك القلم وتحل التمارين بيدك وتخطئ وتصحح.
                </li>
                <li class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <strong class="text-primary block mb-1">3. افهم "لماذا":</strong>
                    لا تحفظ القواعد، بل حاول فهم المنطق وراءها. عندما تفهم "لماذا" تعمل القاعدة، لن تنساها أبداً.
                </li>
            </ul>

            <p class="mt-6">تذكر: كل مسألة رياضية هي لغز ممتع ينتظر الحل، وليست عقاباً!</p>
        </div>
      `,
      author: { name: "محمد التازي", avatar: IMAGES.AVATARS.MOHAMED },
      status: 'published',
      views: 950
    },
    {
      id: '9',
      title: "الجامعة أم المدارس العليا؟ دليلك الشامل للاختيار",
      category: "توجيه",
      date: "20 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "مقارنة مفصلة بين نظام الدراسة في الجامعات (Facultés) والمدارس العليا (Grandes Écoles) لمساعدتك في اتخاذ القرار.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>بعد البكالوريا، يجد الطالب نفسه أمام مفترق طرق كبير: هل أختار الجامعة (الاستقطاب المفتوح) أم أقاتل من أجل المدارس العليا (الاستقطاب المحدود)؟</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">1. المدارس العليا والمعاهد (Grandes Écoles):</h3>
            <ul class="list-disc list-inside space-y-2 mb-4">
                <li><strong>الولوج:</strong> يتطلب انتقاء أولياً (Seuil) ثم مباراة كتابية وشفوية أحياناً.</li>
                <li><strong>نظام الدراسة:</strong> حضور إلزامي، عدد طلبة محدود في القسم، تأطير قريب من الأساتذة.</li>
                <li><strong>الآفاق:</strong> دبلومات مطلوبة بكثرة في سوق الشغل، تكوين مهني وعملي أكثر.</li>
            </ul>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">2. الجامعة (Faculté):</h3>
            <ul class="list-disc list-inside space-y-2 mb-4">
                <li><strong>الولوج:</strong> مفتوح لجميع الحاصلين على البكالوريا (حسب التوزيع الجغرافي).</li>
                <li><strong>نظام الدراسة:</strong> حرية أكبر، مدرجات مكتظة، يتطلب انضباطاً ذاتياً كبيراً (Auto-discipline).</li>
                <li><strong>الآفاق:</strong> تفتح آفاقاً في البحث العلمي، التعليم، ويمكن الولوج منها للمدارس العليا عبر "الجسور" (Passerelles).</li>
            </ul>

            <div class="bg-blue-50 p-6 rounded-2xl mt-6 border border-blue-100">
                <h4 class="font-bold text-primary mb-2">الخلاصة:</h4>
                <p>إذا كنت طالباً يحتاج إلى التأطير والمتابعة، فالمدارس العليا أفضل. أما إذا كنت مستقلاً وقادراً على البحث الذاتي، فالجامعة قد تكون مكاناً للإبداع والتميز.</p>
            </div>
        </div>
      `,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 1850
    },
    {
      id: '10',
      title: "كيف يتم حساب عتبة الانتقاء (Seuil) في المدارس العليا؟",
      category: "توجيه",
      date: "22 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "شرح مبسط لطريقة حساب المعدل الانتقائي للمدارس العليا مثل ENCG, ENSA, FMP.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>كثيراً ما يسمع التلاميذ كلمة "Seuil" أو عتبة الانتقاء، لكن القليل منهم يفهم كيف يتم حسابها بالضبط. هذا الفهم ضروري لتعرف حظوظك في القبول.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">القاعدة العامة (75% - 25%):</h3>
            <p>أغلب المدارس العليا في المغرب تعتمد المعادلة التالية لحساب معدل الانتقاء الأولي:</p>
            <div class="bg-gray-100 p-4 rounded-xl text-center font-bold text-lg my-4 font-mono dir-ltr">
                (Note National × 0.75) + (Note Régional × 0.25)
            </div>
            <p>هذا يعني أن نقطة الامتحان الوطني تشكل 75% من معدل الانتقاء، بينما الجهوي يشكل 25%. المراقبة المستمرة غالباً لا تحتسب في الانتقاء الأولي لهذه المدارس.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">استثناءات هامة:</h3>
            <ul class="list-disc list-inside space-y-2">
                <li><strong>FMP (كليات الطب):</strong> تعتمد نفس الصيغة (75% وطني + 25% جهوي).</li>
                <li><strong>CPGE (الأقسام التحضيرية):</strong> لها معادلة معقدة خاصة تعتمد على مواد التخصص ومعاملات الترجيح.</li>
                <li><strong>EST / FST:</strong> تعتمد أيضاً بشكل كبير على المعادلة أعلاه مع بعض الاختلافات الطفيفة حسب المسلك.</li>
            </ul>

            <div class="bg-yellow-50 p-6 rounded-2xl mt-6 border border-yellow-200">
                <h4 class="font-bold text-yellow-800 mb-2">نصيحة:</h4>
                <p>لا تعتمد على "Seuil" السنوات الماضية كمعيار ثابت، فهو يتغير كل سنة حسب صعوبة الامتحانات ومعدلات التلاميذ.</p>
            </div>
        </div>
      `,
      author: { name: "سارة العلمي", avatar: IMAGES.AVATARS.SARA },
      status: 'published',
      views: 2300
    },
    {
      id: '11',
      title: "آفاق التكوين المهني (OFPPT): هل هو خيار جيد؟",
      category: "توجيه",
      date: "25 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "تصحيح المفاهيم الخاطئة حول التكوين المهني والفرص الحقيقية التي يقدمها في سوق الشغل.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>للأسف، لا يزال البعض ينظر للتكوين المهني (OFPPT) نظرة دونية، ويعتبره ملاذاً "للفاشلين". هذه نظرة قديمة وخاطئة تماماً في عصرنا الحالي.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">لماذا تختار التكوين المهني؟</h3>
            <ul class="list-disc list-inside space-y-3">
                <li><strong>مدة تكوين قصيرة:</strong> سنتان فقط (Technicien Spécialisé) وتكون جاهزاً لسوق الشغل.</li>
                <li><strong>تكوين تطبيقي 100%:</strong> تتعلم "الصنعة" والمهارات اليدوية والتقنية المطلوبة مباشرة في الشركات.</li>
                <li><strong>طلب مرتفع:</strong> الشركات اليوم تبحث عن "تقنيين" أكفاء أكثر من بحثها عن حاملي الإجازات النظرية.</li>
                <li><strong>آفاق المتابعة:</strong> يمكنك بعد الحصول على الدبلوم إكمال دراستك في الإجازة المهنية (Licence Pro) ومدارس المهندسين.</li>
            </ul>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">تخصصات واعدة:</h3>
            <p>هناك تخصصات مطلوبة جداً مثل: تطوير البرمجيات (Dev Digital)، التشخيص الإلكتروني للسيارات، اللوجستيك، والذكاء الاصطناعي.</p>

            <div class="bg-green-50 p-6 rounded-2xl mt-6 border border-green-200">
                <h4 class="font-bold text-green-800 mb-2">خلاصة القول:</h4>
                <p>الدبلوم هو "مفتاح"، لكن كفاءتك هي التي تفتح الباب. خريج تكوين مهني متميز أفضل بألف مرة من خريج جامعة "شبح".</p>
            </div>
        </div>
      `,
      author: { name: "محمد التازي", avatar: IMAGES.AVATARS.MOHAMED },
      status: 'published',
      views: 1600
    },
    {
      id: '12',
      title: "الدراسة في الخارج: من أين تبدأ؟",
      category: "توجيه",
      date: "28 شتنبر 2023",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      excerpt: "خطوات التخطيط للدراسة بالخارج، الوثائق المطلوبة، وكيفية التحضير اللغوي والمادي.",
      content: `
        <div class="space-y-6 text-gray-700 leading-relaxed">
            <p>الدراسة في الخارج حلم يراود الكثيرين، لكنه يتطلب تخطيطاً مبكراً وجدية. "بغيت نمشي لبرا" ليست خطة، بل أمنية تحتاج لخطوات عملية.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">الخطوة الأولى: اللغة (TCF/IELTS)</h3>
            <p>قبل أي شيء، يجب أن تثبت إتقانك للغة البلد المضيف. بالنسبة لفرنسا، يجب اجتياز TCF والحصول على مستوى B2 على الأقل لضمان حظوظ جيدة. ابدأ التحضير في الصيف!</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">الخطوة الثانية: المشروع الدراسي</h3>
            <p>يجب أن تقنع القنصلية والجامعة بأن لديك هدفاً واضحاً. لماذا هذا التخصص؟ ولماذا في هذا البلد؟ وماذا ستفعل بعد التخرج؟ رسالة التحفيز (Lettre de motivation) حاسمة هنا.</p>

            <h3 class="text-2xl font-bold text-gray-900 mt-6">الجانب المادي (الضمانة):</h3>
            <p>الدراسة في الخارج مكلفة. يجب أن تثبت قدرتك المالية (Blochage) لتغطية مصاريف العيش. هناك منح دراسية لكن المنافسة عليها شديدة.</p>

            <div class="bg-indigo-50 p-6 rounded-2xl mt-6 border border-indigo-100">
                <h4 class="font-bold text-indigo-800 mb-2">تنبيه هام:</h4>
                <p>الإجراءات (Campus France مثلاً) تبدأ مبكراً جداً (من شهر نونبر/دجنبر). لا تنتظر حتى نهاية السنة الدراسية!</p>
            </div>
        </div>
      `,
      author: { name: "الأستاذ ياسين", avatar: IMAGES.AVATARS.YASSINE },
      status: 'published',
      views: 2500
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
