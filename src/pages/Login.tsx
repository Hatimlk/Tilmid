import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../lib/api';
import {
  ShieldCheck, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle,
  WifiOff, Clock, Keyboard, ArrowLeft, Gauge, KeyRound, Activity,
  Users, Calendar, MessageSquare, Star,
} from 'lucide-react';
import SEO from '../components/SEO';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { IMAGES } from '../constants/images';

/* -------------------------------------------------------------------------- */
/* Static content                                                             */
/* -------------------------------------------------------------------------- */

const PANEL_ITEMS = [
  { icon: Gauge, title: 'Gestion centralisée', desc: 'Pilotez les données et opérations depuis un espace unique.' },
  { icon: ShieldCheck, title: 'Accès contrôlé', desc: 'Portail réservé aux comptes administrateurs autorisés.' },
  { icon: Activity, title: 'Suivi opérationnel', desc: 'Accédez aux modules nécessaires à la gestion quotidienne.' },
];

const MODULE_CHIPS = [
  { icon: Users, label: 'Étudiants' },
  { icon: Calendar, label: 'Rendez-vous' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: Star, label: 'Témoignages' },
];

const SUPPORT_URL = 'https://wa.me/message/GN4XKUOMHNHGO1';

type FormErrorKind = 'invalid' | 'network' | 'rateLimit' | null;

/* -------------------------------------------------------------------------- */
/* Alert                                                                      */
/* -------------------------------------------------------------------------- */

const AuthAlert: React.FC<{ kind: FormErrorKind }> = ({ kind }) => {
  if (!kind) return null;
  const content = {
    invalid: {
      title: 'Connexion impossible',
      desc: "L'identifiant ou le mot de passe est incorrect. Vérifiez vos informations puis réessayez.",
      icon: AlertCircle,
    },
    rateLimit: {
      title: 'Accès temporairement limité',
      desc: 'Plusieurs tentatives de connexion ont été détectées. Veuillez patienter avant de réessayer.',
      icon: Clock,
    },
    network: {
      title: 'Service momentanément indisponible',
      desc: 'Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.',
      icon: WifiOff,
    },
  }[kind];

  return (
    <div role="alert" aria-live="polite" className="rounded-2xl p-4 border bg-red-50 border-red-100 flex items-start gap-3">
      <content.icon size={18} className="shrink-0 mt-0.5 text-[#D92D20]" />
      <div>
        <p className="font-black text-sm text-[#D92D20]">{content.title}</p>
        <p className="text-[13px] font-medium text-[#D92D20]/80 mt-0.5">{content.desc}</p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Context panel — desktop only                                              */
/* -------------------------------------------------------------------------- */

const AdminContextPanel: React.FC = () => (
  <div
    className="relative hidden lg:flex flex-col justify-between w-full p-10 xl:p-12 text-white overflow-hidden"
    style={{ background: 'linear-gradient(145deg, #07142F 0%, #0D1D42 55%, #12316D 100%)' }}
  >
    <div className="absolute -top-20 -end-20 w-72 h-72 bg-[#168BFF]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div className="absolute bottom-0 start-0 w-56 h-56 bg-[#168BFF]/5 rounded-full blur-3xl pointer-events-none"></div>
    <div
      className="absolute inset-0 opacity-[0.12] pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_30%_20%,black,transparent)]"
      style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
    ></div>

    <div className="relative z-10">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-white/10 ring-1 ring-white/15 mb-8">
        <ShieldCheck size={13} />
        Portail interne
      </span>
      <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight mb-4">
        Administration Tilmid
      </h1>
      <p className="text-blue-100/75 text-[15px] font-medium leading-relaxed max-w-sm">
        Accédez aux outils de gestion de la plateforme, des étudiants, des programmes et des opérations Tilmid.
      </p>
    </div>

    <div className="relative z-10 space-y-5 mt-10">
      {PANEL_ITEMS.map((item) => (
        <div key={item.title} className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 ring-1 ring-white/10">
          <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <item.icon size={18} />
          </span>
          <div>
            <p className="font-black text-[14px] mb-0.5">{item.title}</p>
            <p className="text-blue-100/65 text-[13px] font-medium leading-snug">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="relative z-10 mt-10 pt-8 border-t border-white/10">
      <p className="text-[11px] font-black uppercase tracking-widest text-blue-100/50 mb-3">Modules de gestion</p>
      <div className="flex flex-wrap gap-2">
        {MODULE_CHIPS.map((m) => (
          <span key={m.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-[12px] font-bold text-blue-100/80">
            <m.icon size={13} />
            {m.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<FormErrorKind>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!authLoading && isAdmin) return <Navigate to="/admin" replace />;

  const handlePasswordKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Veuillez saisir votre identifiant.';
    if (!password) errors.password = 'Veuillez saisir votre mot de passe.';
    setFieldErrors(errors);
    if (errors.email || errors.password) return;

    setFormError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (!response.token) throw new Error('No token received');

      login(response.user, response.token);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate(response.user.role === 'admin' ? '/admin' : '/student-area', { replace: true });
      }, 450);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.status === 429) setFormError('rateLimit');
      else if (apiErr?.status === 400) setFormError('invalid');
      else setFormError('network');
      setLoading(false);
    }
  };

  return (
    <div dir="ltr" className="min-h-screen flex flex-col font-sans text-slate-800" style={{
      background: 'radial-gradient(circle at 18% 20%, rgba(22,139,255,0.06), transparent 28%), radial-gradient(circle at 85% 80%, rgba(15,23,42,0.04), transparent 30%), #F7F9FC',
    }}>
      <SEO title="Connexion Administration" description="Portail d'administration Tilmid, réservé aux utilisateurs autorisés." noindex />

      {/* Minimal auth header */}
      <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={IMAGES.LOGOS.OFFICIAL} alt="Tilmid" className="h-8 md:h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={15} />
            Retour à Tilmid
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-14">
        <div
          className={`w-full max-w-[1080px] mx-auto grid lg:grid-cols-[42%_58%] rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.09)] border border-slate-100 bg-white transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
        >
          <AdminContextPanel />

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="max-w-sm mx-auto">
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1739] to-[#12316D] ring-4 ring-[#0B1739]/5 flex items-center justify-center mb-6">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.14em] bg-[#0B1739]/5 text-[#0B1739] ring-1 ring-[#0B1739]/10 mb-4">
                  Administration
                </span>
                <h2 className="text-[26px] sm:text-[30px] font-black text-slate-900 tracking-tight leading-tight mb-2">Connexion au portail</h2>
                <p className="text-slate-500 text-[14.5px] font-medium leading-relaxed mb-3">Identifiez-vous pour accéder à l'espace d'administration Tilmid.</p>
                <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-slate-400">
                  <Lock size={12} />
                  Accès réservé aux utilisateurs autorisés.
                </p>
              </div>

              {success ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 flex items-center gap-3 justify-center">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <span className="font-black text-emerald-700 text-sm">Connexion réussie ✓</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <AuthAlert kind={formError} />

                  <div>
                    <label htmlFor="admin-email" className="block text-[13px] font-bold text-slate-700 mb-2">Identifiant ou adresse e-mail</label>
                    <div className="relative">
                      <User size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        id="admin-email"
                        type="text"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: undefined })); }}
                        placeholder="Entrez votre identifiant"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'admin-email-error' : undefined}
                        className={`w-full h-[54px] ps-11 pe-4 rounded-[14px] border outline-none font-medium text-[15px] bg-[#F9FAFC] transition-all focus:bg-white ${fieldErrors.email ? 'border-[#F04438]' : 'border-[#DDE4ED] focus:border-[#168BFF]'
                          }`}
                        style={fieldErrors.email ? { boxShadow: '0 0 0 4px rgba(240,68,56,.08)' } : undefined}
                        onFocus={(e) => { if (!fieldErrors.email) e.currentTarget.style.boxShadow = '0 0 0 4px rgba(22,139,255,.10)'; }}
                        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                    {fieldErrors.email && <p id="admin-email-error" className="mt-1.5 text-[12px] font-bold text-[#D92D20]">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="admin-password" className="block text-[13px] font-bold text-slate-700 mb-2">Mot de passe</label>
                    <div className="relative">
                      <Lock size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: undefined })); }}
                        onKeyUp={handlePasswordKeyEvent}
                        onKeyDown={handlePasswordKeyEvent}
                        placeholder="Entrez votre mot de passe"
                        aria-invalid={!!fieldErrors.password}
                        aria-describedby={fieldErrors.password ? 'admin-password-error' : undefined}
                        className={`w-full h-[54px] ps-11 pe-11 rounded-[14px] border outline-none font-medium text-[15px] bg-[#F9FAFC] transition-all focus:bg-white ${fieldErrors.password ? 'border-[#F04438]' : 'border-[#DDE4ED] focus:border-[#168BFF]'
                          }`}
                        style={fieldErrors.password ? { boxShadow: '0 0 0 4px rgba(240,68,56,.08)' } : undefined}
                        onFocus={(e) => { if (!fieldErrors.password) e.currentTarget.style.boxShadow = '0 0 0 4px rgba(22,139,255,.10)'; }}
                        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className="absolute end-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && <p id="admin-password-error" className="mt-1.5 text-[12px] font-bold text-[#D92D20]">{fieldErrors.password}</p>}
                    {capsLockOn && !fieldErrors.password && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-bold text-amber-600">
                        <Keyboard size={13} /> Verr. Maj. est activée
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-[#0B1739] hover:underline">
                      Problème d'accès ?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[54px] text-white rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ background: '#0B1739' }}
                    onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = '#122653'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#0B1739'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Connexion en cours…</span>
                      </>
                    ) : (
                      <span>Se connecter à l'administration</span>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-7 pt-6 border-t border-slate-100">
                <p className="text-[13px] font-bold text-slate-700 mb-1">Besoin d'aide pour accéder au portail ?</p>
                <p className="text-[12.5px] text-slate-400 font-medium leading-relaxed mb-3">Contactez le responsable technique si vous rencontrez un problème avec votre compte administrateur.</p>
                <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B1739] hover:gap-2.5 transition-all">
                  Contacter le support <ArrowLeft size={14} className="rotate-180" />
                </a>
              </div>

              <p className="flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-slate-400 mt-6">
                <KeyRound size={13} />
                Portail réservé à l'équipe Tilmid
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Compact admin footer */}
      <footer className="py-6 px-4 border-t border-slate-100 bg-white">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] font-semibold text-slate-400">
          <span>© 2026 Tilmid</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-slate-600 transition-colors">Politique de confidentialité</Link>
            <Link to="/" className="hover:text-slate-600 transition-colors">Retour au site</Link>
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">Support technique</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
