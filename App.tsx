
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProgramDetails } from './pages/ProgramDetails';
import { Blog } from './pages/Blog';
import { StudentArea } from './pages/StudentArea';
import { CoachingOffer } from './pages/CoachingOffer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AdminDashboard } from './pages/AdminDashboard';
import { About } from './pages/About';
import { dataManager } from './utils/dataManager';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Share2, CheckCircle2, Bookmark } from 'lucide-react';

// Placeholder for Contact/Booking page
const Contact = () => (
  <div className="container mx-auto py-20 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-royal p-8 text-center">
        <h1 className="text-3xl font-bold text-white">احجز استشارتك الآن</h1>
        <p className="text-blue-100 mt-2">املأ الاستمارة وسنتواصل معك في أقرب وقت</p>
      </div>
      <div className="p-8">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="محمد علي" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0600000000" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الاستشارة</label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white">
              <option>توجيه مدرسي</option>
              <option>مواكبة نفسية</option>
              <option>تنظيم الدراسة</option>
            </select>
          </div>
           <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">رسالة إضافية (اختياري)</label>
            <textarea className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32 resize-none" placeholder="اكتب تفاصيل إضافية هنا..."></textarea>
          </div>
          <div className="col-span-1 md:col-span-2 mt-2">
            <button className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg transform active:scale-[0.98]">
              إرسال الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Helper function to update/create meta tags
const updateMeta = (name: string, content: string, property?: string) => {
  let element;
  if (property) {
     element = document.querySelector(`meta[property="${property}"]`);
  } else {
     element = document.querySelector(`meta[name="${name}"]`);
  }

  if (!element) {
    element = document.createElement('meta');
    if(property) element.setAttribute('property', property);
    else element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

// BlogPost Placeholder
const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  
  const post = dataManager.getPosts().find(p => p.id === id);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  React.useEffect(() => {
    if (id) {
      const bookmarks = JSON.parse(localStorage.getItem('tilmid_bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(id));
    }
  }, [id]);

  // SEO & Metadata Logic
  React.useEffect(() => {
    if (post) {
      // 1. Title
      document.title = `${post.title} - مدونة تلميذ`;

      // 2. Meta Description
      updateMeta('description', post.excerpt);
      updateMeta('keywords', `${post.category}, تعليم, دراسة, ${post.title.split(' ').slice(0,3).join(', ')}`);

      // 3. Open Graph (Social Media)
      updateMeta('', post.title, 'og:title');
      updateMeta('', post.excerpt, 'og:description');
      updateMeta('', post.image, 'og:image');
      updateMeta('', window.location.href, 'og:url');
      updateMeta('', 'article', 'og:type');

      // 4. Twitter Card
      updateMeta('twitter:card', 'summary_large_image');
      updateMeta('twitter:title', post.title);
      updateMeta('twitter:description', post.excerpt);
      updateMeta('twitter:image', post.image);

      // 5. Schema.org (JSON-LD)
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": [post.image],
        "datePublished": post.date, 
        "dateModified": post.date,
        "author": {
          "@type": "Person",
          "name": post.author?.name || "فريق تلميذ"
        },
        "publisher": {
           "@type": "Organization",
           "name": "Tilmid",
           "logo": {
             "@type": "ImageObject",
             "url": "https://tilmide.ma/logo.png"
           }
        },
        "description": post.excerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
      };

      let script = document.querySelector('#article-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'article-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaData);
    }
  }, [post]);

  // Scroll Progress Logic
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = () => {
    const user = localStorage.getItem('tilmid_user');
    if (!user) {
      alert('المرجو تسجيل الدخول في مساحة الطالب لحفظ المقال.');
      return;
    }

    if (!id) return;

    const bookmarks = JSON.parse(localStorage.getItem('tilmid_bookmarks') || '[]');
    let newBookmarks;
    
    if (bookmarks.includes(id)) {
      newBookmarks = bookmarks.filter((bId: string) => bId !== id);
      setIsBookmarked(false);
    } else {
      newBookmarks = [...bookmarks, id];
      setIsBookmarked(true);
    }
    
    localStorage.setItem('tilmid_bookmarks', JSON.stringify(newBookmarks));
  };

  if (!post) {
    return (
       <div className="container mx-auto py-32 text-center px-4">
        <h1 className="text-3xl font-bold text-gray-300 mb-4">المقال غير موجود</h1>
        <p className="text-gray-500">عذراً، لم نتمكن من العثور على المقال الذي تبحث عنه.</p>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `اقرأ هذا المقال المميز على منصة تلميذ: ${post.title}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('تم نسخ رابط المقال بنجاح');
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 h-1.5 bg-gray-200 w-full z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-primary to-royal transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="container mx-auto py-12 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold bg-blue-50 px-4 py-1.5 rounded-full text-sm inline-block">
                {post.category}
              </span>
              <button 
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                  isBookmarked 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? 'محفوظ' : 'حفظ'}
              </button>
            </div>
            <p className="text-gray-500 flex items-center gap-2 text-sm">
               <span>نشر في {post.date}</span>
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="relative aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-xl font-medium text-gray-900 mb-8 border-r-4 border-primary pr-4 bg-gray-50 p-6 rounded-r-xl">
              {post.excerpt}
            </p>
            
            {/* If custom content exists, render it, otherwise fallback to standard template */}
            {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
                <div className="space-y-8">
                <p>
                    يواجه العديد من الطلاب تحديات كبيرة في تنظيم وقتهم وزيادة إنتاجيتهم الدراسية. في هذا المقال، سنتطرق بعمق إلى هذا الموضوع الحيوي ونشرح كيفية تحويل هذه التحديات إلى فرص للنجاح والتفوق. إن الفهم العميق لهذه الاستراتيجيات لا يساعد فقط في اجتياز الامتحانات، بل يبني عادات نجاح تستمر مدى الحياة.
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    لماذا تعتبر هذه الخطوة حاسمة؟
                    </h2>
                    <p>
                    أثبتت الدراسات الحديثة في علم النفس التربوي أن الطلاب الذين يتبعون منهجيات مدروسة بدلاً من "الدراسة العشوائية" يحققون نتائج أفضل بنسبة تتجاوز 40% مع بذل جهد أقل. السر لا يكمن في عدد الساعات التي تقضيها أمام الكتب، بل في "جودة" تلك الساعات وكيفية استثمار طاقة عقلك بذكاء.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-royal rounded-full"></span>
                    خطوات عملية للتطبيق الفوري
                    </h2>
                    <p className="mb-4">لتحقيق أقصى استفادة، ننصحك باتباع هذه الخطوات العملية:</p>
                    <div className="grid gap-4">
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex gap-4">
                        <div className="bg-blue-100 text-primary font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">1</div>
                        <div>
                        <h4 className="font-bold text-gray-900 mb-1">التخطيط المسبق</h4>
                        <p className="text-sm text-gray-600">لا تبدأ يومك دون خطة واضحة. حدد 3 مهام رئيسية تريد إنجازها.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex gap-4">
                        <div className="bg-blue-100 text-primary font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">2</div>
                        <div>
                        <h4 className="font-bold text-gray-900 mb-1">تقسيم المهام الكبيرة</h4>
                        <p className="text-sm text-gray-600">جزّء الدروس الطويلة إلى وحدات صغيرة (Chunking) لتسهيل الهضم العقلي للمعلومة.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex gap-4">
                        <div className="bg-blue-100 text-primary font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">3</div>
                        <div>
                        <h4 className="font-bold text-gray-900 mb-1">المراجعة النشطة</h4>
                        <p className="text-sm text-gray-600">استخدم تقنيات الاسترجاع بدلاً من القراءة السلبية المتكررة.</p>
                        </div>
                    </div>
                    </div>
                </section>

                <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100 my-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">💡 مثال تطبيقي:</h3>
                    <p className="italic text-gray-600">
                    "لنقل أن لديك امتحاناً في مادة التاريخ بعد أسبوع. بدلاً من قراءة الكتاب كاملاً دفعة واحدة، قم بتطبيق هذه التقنية: خصص اليوم الأول لرسم خريطة ذهنية للعصور، واليوم الثاني لحفظ التواريخ باستخدام البطاقات التعليمية (Flashcards)، وهكذا..."
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">نصائح إضافية للنجاح</h2>
                    <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
                        <span><strong>ابتعد عن المشتتات:</strong> ضع هاتفك في غرفة أخرى أثناء جلسات التركيز العميق.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
                        <span><strong>كافئ نفسك:</strong> اربط إنجاز المهام بمكافآت صغيرة (راحة، وجبة خفيفة، تصفح سريع).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
                        <span><strong>النوم الكافي:</strong> الذاكرة تترسخ أثناء النوم، لذا لا تضحي بساعات نومك.</span>
                    </li>
                    </ul>
                </section>

                <p className="text-lg font-medium text-primary mt-8">
                    تذكر دائماً أن الرحلة نحو التفوق تبدأ بخطوة صغيرة ولكن مستمرة. طبق ما تعلمته اليوم وشاركونا نتائجكم!
                </p>
                </div>
            )}
          </div>

          {/* Social Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Share2 size={22} className="text-primary" />
              شارك المقال مع أصدقائك
            </h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1877F2] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
              >
                <Facebook size={20} /> Facebook
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-sky-200"
              >
                <Twitter size={20} /> Twitter
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A66C2] text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
              >
                <Linkedin size={20} /> LinkedIn
              </button>
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                <LinkIcon size={20} /> نسخ الرابط
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/program/:id" element={<ProgramDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-area" element={<StudentArea />} />
          <Route path="/coaching-offer" element={<CoachingOffer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
