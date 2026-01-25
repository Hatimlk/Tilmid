
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../constants';
import { dataManager } from '../utils/dataManager';
import { BlogCard } from './BlogCard';

export const LatestArticles: React.FC = () => {
  // Fetch and sort posts
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await dataManager.getPosts();
        // Filter published and slice first 3
        const published = posts.filter(p => p.status === 'published');
        setLatestPosts(published.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    fetchPosts();
  }, []);

  if (latestPosts.length === 0) return null;

  return (
    <section className="py-10 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[80px] opacity-60 mix-blend-multiply"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] opacity-60 mix-blend-multiply"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-primary font-bold text-xs uppercase tracking-wider rounded-full">
              <Sparkles size={14} className="fill-blue-500 text-blue-500" />
              <span>جديد المدونة</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              آخر <span className="text-primary">المقالات</span> والنصائح
            </h2>
          </div>

          <Link to="/blog" className="group flex items-center gap-3 px-8 py-4 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white rounded-2xl font-black transition-all duration-300">
            <span>تصفح جميع المقالات</span>
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post, idx) => (
            <BlogCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
