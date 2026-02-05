import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';
import { BlogCard } from './BlogCard';
import { dataManager } from '../utils/dataManager';

interface RelatedArticlesProps {
    relatedIds?: string[];
    title?: string;
    limit?: number;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
    relatedIds,
    title = "مقالات قد تهمك",
    limit = 3
}) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // If IDs are provided, fetch/filter them
                if (relatedIds && relatedIds.length > 0) {
                    const allPosts = await dataManager.getPosts();
                    const filtered = allPosts.filter(p => relatedIds.includes(p.id));
                    setPosts(filtered);
                } else {
                    // Fallback: Fetch latest posts
                    const allPosts = await dataManager.getPosts();
                    const published = allPosts.filter(p => p.status === 'published');
                    setPosts(published.slice(0, limit));
                }
            } catch (error) {
                console.error("Failed to fetch related articles", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [relatedIds, limit]);

    if (!loading && posts.length === 0) return null;

    return (
        <section id="related-blogs" className="space-y-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center`}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1">اكتشف المزيد من المحتوى المفيد</p>
                    </div>
                </div>

                <Link to="/blog" className="group flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors">
                    <span>عرض كل المقالات</span>
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                    <BlogCard key={post.id} post={post} index={idx} />
                ))}
            </div>
        </section>
    );
};
