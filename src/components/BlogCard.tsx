
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowUpRight, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import { IMAGES } from '../constants/images';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  return (
    <article
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full opacity-0 animate-fade-in-up hover:-translate-y-2 relative"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Poster Style Thumbnail */}
      <div className="relative overflow-hidden shrink-0 h-72 bg-gradient-to-br from-[#0037ff] to-[#001254] p-6 flex items-center justify-center">

        {/* Background Texture & Noise */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>

        {/* Branding: White Logo */}
        <div className="absolute top-5 right-5 z-20">
          <img
            src={IMAGES.LOGOS.WHITE}
            alt="Tilmid"
            className="w-20 h-auto opacity-90 drop-shadow-md"
          />
        </div>

        {/* Central 3D/Sticker Image */}
        <div className="relative z-10 w-40 h-40 md:w-48 md:h-48 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out">
          <div className="absolute inset-0 bg-black/20 rounded-full blur-xl transform translate-y-4"></div>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl relative z-10 masking-image"
            style={{ boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)' }}
          />

          {/* Floating Element Effect (Lightning/Decor) */}
          <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 p-2 rounded-xl shadow-lg transform rotate-12 animate-pulse">
            <Sparkles size={20} fill="currentColor" />
          </div>
        </div>

        {/* Category "Tape" Label */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-6 text-center">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-black px-6 py-2 rounded-xl shadow-lg transform -rotate-1 relative overflow-hidden group-hover:rotate-0 transition-transform duration-300">
            <span className="relative z-10 uppercase tracking-wider text-shadow-sm">{post.category}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-8 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-end gap-4 text-xs font-bold text-slate-400 mb-4 dir-ltr">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
              <Clock size={14} className="text-primary" />
              <span className="mt-0.5">{post.readingTime || '5 min'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
              <Calendar size={14} className="text-primary" />
              <span className="mt-0.5">{post.date}</span>
            </div>
          </div>

          <h3 className="font-black text-2xl text-slate-900 leading-snug mb-4 group-hover:text-primary transition-colors text-right line-clamp-2">
            <Link to={`/blog/${post.id}`}>{post.title}</Link>
          </h3>

          <p className="text-slate-500 font-bold leading-relaxed mb-8 text-sm line-clamp-3 text-right">
            {post.excerpt}
          </p>
        </div>

        {/* Footer - Author & Action */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
          <Link to={`/blog/${post.id}`} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:-translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight size={22} strokeWidth={3} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-black text-slate-900">{post.author?.name || 'الأستاذ ياسين'}</p>
            </div>
            <img src={post.author?.avatar || IMAGES.AVATARS.YASSINE} className="w-10 h-10 rounded-full border-2 border-white shadow-md ring-2 ring-slate-50" alt="" />
          </div>
        </div>
      </div>
    </article>
  );
};
