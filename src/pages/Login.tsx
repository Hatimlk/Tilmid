import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Success! Redirect to Admin Dashboard
            navigate('/admin');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else if (err.code === 'auth/too-many-requests') {
                setError('محاولات كثيرة خاطئة، يرجى المحاولة لاحقاً');
            } else {
                setError('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-blob">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="mt-2 text-3xl font-black text-gray-900 tracking-tight">تسجيل الدخول</h2>
                    <p className="mt-2 text-sm text-gray-600 font-bold">لوحة تحكم المسؤول - تلميذ</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                            <div className="relative group">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-primary/20 sm:text-sm font-medium transition-all"
                                    placeholder="admin@tilmid.ma"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">كلمة السر</label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-2xl placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-primary/20 sm:text-sm font-medium transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-center gap-3 animate-head-shake">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <p className="text-sm font-bold text-red-600">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-slate-900 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 hover:shadow-primary/30"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    تسجيل الدخول <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
