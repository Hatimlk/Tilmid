
import React, { useState, useEffect, useRef } from 'react';
import {
  User, AlertCircle, Clock, Library, MessageCircle, GraduationCap, Target,
  Lock, Eye, EyeOff, Loader2, CheckCircle2, WifiOff, Keyboard, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { Student, StudyResource, TimetableTask } from '../types';
import { IMAGES } from '../constants/images';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../lib/api';
import { getEntitlements } from '../utils/entitlements';
import { StudentTab, StudentSidebar, StudentMobileNav } from '../components/student/navigation';
import { StudentHeader } from '../components/student/StudentHeader';
import { DashboardHome } from './student/DashboardHome';
import { MonParcours } from './student/MonParcours';
import { MonPlan } from './student/MonPlan';
import { Planning } from './student/Planning';
import { Progression } from './student/Progression';
import { MesContenus } from './student/MesContenus';
import { Bibliotheque } from './student/Bibliotheque';
import { MesOutils } from './student/MesOutils';
import { Coaching } from './student/Coaching';
import { CheckIns } from './student/CheckIns';
import { Feedback } from './student/Feedback';
import { Support } from './student/Support';
import { Profil } from './student/Profil';

/* -------------------------------------------------------------------------- */
/* Login gate — shown when there is no authenticated student session          */
/* -------------------------------------------------------------------------- */

type LoginErrorKind = 'invalid' | 'network' | 'rateLimit' | null;

const LoginAlert: React.FC<{ kind: LoginErrorKind; t: any }> = ({ kind, t }) => {
  if (!kind) return null;
  const content = {
    invalid: { title: t('studentLogin.errors.invalidTitle'), desc: t('studentLogin.errors.invalidDesc'), icon: AlertCircle, tone: 'red' },
    network: { title: t('studentLogin.errors.networkTitle'), desc: t('studentLogin.errors.networkDesc'), icon: WifiOff, tone: 'red' },
    rateLimit: { title: t('studentLogin.errors.rateLimitTitle'), desc: t('studentLogin.errors.rateLimitDesc'), icon: Clock, tone: 'blue' },
  }[kind];
  const toneClasses = content.tone === 'red'
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-blue-50 border-blue-200 text-blue-700';

  return (
    <div role="alert" aria-live="polite" className={`rounded-2xl p-4 border flex items-start gap-3 ${toneClasses}`}>
      <content.icon size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-black text-sm">{content.title}</p>
        <p className="text-[13px] font-medium opacity-90 mt-0.5">{content.desc}</p>
      </div>
    </div>
  );
};

const StudentWelcomePanel: React.FC<{ t: any }> = ({ t }) => {
  const benefits = (t('studentLogin.panel.benefits', { returnObjects: true }) as unknown as { title: string; desc: string }[]) || [];
  const icons = [Clock, Library, MessageCircle];
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full lg:w-[45%] p-10 xl:p-12 text-white overflow-hidden" style={{ background: 'linear-gradient(145deg, #0B1A3D 0%, #10285E 55%, #1449C9 100%)' }}>
      <div className="absolute -top-20 -end-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 start-0 w-56 h-56 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none [mask-image:radial-gradient(ellipse_60%_60%_at_30%_20%,black,transparent)]"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
      ></div>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-white/10 ring-1 ring-white/15 mb-8">
          <GraduationCap size={13} />
          {t('studentLogin.panel.badge')}
        </span>
        <h2 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight mb-4">
          {t('studentLogin.panel.title1')}<br />{t('studentLogin.panel.title2')}
        </h2>
        <p className="text-blue-100/80 text-[15px] font-medium leading-relaxed max-w-sm">{t('studentLogin.panel.description')}</p>
      </div>

      <div className="relative z-10 space-y-5 mt-10">
        {benefits.map((b, i) => {
          const Icon = icons[i] || Target;
          return (
            <div key={b.title} className="flex items-start gap-4 bg-white/5 rounded-2xl p-4 ring-1 ring-white/10">
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </span>
              <div>
                <p className="font-black text-[14px] mb-0.5">{b.title}</p>
                <p className="text-blue-100/70 text-[13px] font-medium leading-snug">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StudentLoginGate: React.FC<{
  onLogin: (username: string, password: string) => Promise<void>;
  loginPending: boolean;
  errorKind: LoginErrorKind;
  loginSuccess: boolean;
}> = ({ onLogin, loginPending, errorKind, loginSuccess }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) errors.username = t('studentLogin.errors.emptyIdentifier');
    if (!password) errors.password = t('studentLogin.errors.emptyPassword');
    setFieldErrors(errors);
    if (errors.username) { usernameRef.current?.focus(); return; }
    if (errors.password) return;
    onLogin(username, password);
  };

  const handlePasswordKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-6 font-sans relative overflow-hidden">
      <SEO
        title="Connexion Espace Étudiant | Tilmid"
        description="Connectez-vous à votre espace étudiant Tilmid pour accéder à vos contenus et services."
        noindex
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 20% 20%, rgba(22,139,255,0.08), transparent 30%), radial-gradient(circle at 85% 75%, rgba(139,92,246,0.05), transparent 32%), #F7F9FC' }}
      ></div>

      <div className="relative z-10 w-full max-w-[1080px] bg-white rounded-[28px] shadow-[0_24px_60px_rgba(15,23,42,0.09)] border border-slate-100 flex overflow-hidden">
        <StudentWelcomePanel t={t} />

        <div className="w-full lg:w-[55%] p-6 sm:p-10 lg:p-12">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              <img src={IMAGES.LOGOS.OFFICIAL} alt="Tilmid" className="h-14 w-auto mx-auto mb-6" />
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.14em] bg-primary/5 text-primary ring-1 ring-primary/10 mb-4">
                {t('studentLogin.eyebrow')}
              </span>
              <h1 className="text-[28px] sm:text-[32px] font-black text-slate-900 tracking-tight leading-tight mb-2">{t('studentLogin.title')}</h1>
              <p className="text-slate-500 text-[15px] font-medium leading-relaxed">{t('studentLogin.subtitle')}</p>
            </div>

            {loginSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 flex items-center gap-3 justify-center">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span className="font-black text-emerald-700 text-sm">{t('studentLogin.submitSuccess')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {errorKind && <LoginAlert kind={errorKind} t={t} />}

                <div>
                  <label htmlFor="student-username" className="block text-[13px] font-bold text-slate-700 mb-2">{t('studentLogin.identifierLabel')}</label>
                  <div className="relative">
                    <User size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="student-username"
                      ref={usernameRef}
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setFieldErrors((f) => ({ ...f, username: undefined })); }}
                      placeholder={t('studentLogin.identifierPlaceholder')}
                      aria-invalid={!!fieldErrors.username}
                      aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                      className={`w-full h-14 ps-11 pe-4 rounded-2xl border outline-none font-medium text-[15px] bg-[#F9FAFC] transition-all focus:bg-white ${fieldErrors.username ? 'border-red-400' : 'border-slate-200 focus:border-primary'
                        }`}
                      style={fieldErrors.username ? { boxShadow: '0 0 0 4px rgba(240,68,56,.08)' } : undefined}
                      onFocus={(e) => { if (!fieldErrors.username) e.currentTarget.style.boxShadow = '0 0 0 4px rgba(22,139,255,.10)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {fieldErrors.username && <p id="username-error" className="mt-1.5 text-[12px] font-bold text-red-500">{fieldErrors.username}</p>}
                </div>

                <div>
                  <label htmlFor="student-password" className="block text-[13px] font-bold text-slate-700 mb-2">{t('studentLogin.passwordLabel')}</label>
                  <div className="relative">
                    <Lock size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id="student-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: undefined })); }}
                      onKeyUp={handlePasswordKeyEvent}
                      onKeyDown={handlePasswordKeyEvent}
                      placeholder={t('studentLogin.passwordPlaceholder')}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                      className={`w-full h-14 ps-11 pe-11 rounded-2xl border outline-none font-medium text-[15px] bg-[#F9FAFC] transition-all focus:bg-white ${fieldErrors.password ? 'border-red-400' : 'border-slate-200 focus:border-primary'
                        }`}
                      style={fieldErrors.password ? { boxShadow: '0 0 0 4px rgba(240,68,56,.08)' } : undefined}
                      onFocus={(e) => { if (!fieldErrors.password) e.currentTarget.style.boxShadow = '0 0 0 4px rgba(22,139,255,.10)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? t('studentLogin.hidePassword') : t('studentLogin.showPassword')}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p id="password-error" className="mt-1.5 text-[12px] font-bold text-red-500">{fieldErrors.password}</p>}
                  {capsLockOn && !fieldErrors.password && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-bold text-amber-600">
                      <Keyboard size={13} /> {t('studentLogin.capsLock')}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-primary hover:underline">
                    {t('studentLogin.helpLink')}
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loginPending}
                  className="w-full h-[54px] bg-primary text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#0875E8] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loginPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{t('studentLogin.submitLoading')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('studentLogin.submit')}</span>
                      <ArrowLeft size={17} className="transform ltr:rotate-180" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-7 pt-6 border-t border-slate-100">
              <p className="text-[13px] font-bold text-slate-700 mb-1">{t('studentLogin.noAccount.title')}</p>
              <p className="text-[12.5px] text-slate-400 font-medium leading-relaxed mb-3">{t('studentLogin.noAccount.desc')}</p>
              <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5 transition-all">
                {t('studentLogin.noAccount.cta')} <ArrowLeft size={14} className="transform ltr:rotate-180" />
              </a>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-[11.5px] font-bold text-slate-400 mt-6">
              <ShieldCheck size={13} />
              {t('studentLogin.trust')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export const StudentArea: React.FC = () => {
  const { user: authUser, isStudent, loading: authLoading, login, logout: authLogout } = useAuth();
  const [loginPending, setLoginPending] = useState(false);
  const [loginErrorKind, setLoginErrorKind] = useState<LoginErrorKind>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = isStudent ? (authUser as unknown as Student) : null;
  const entitlements = getEntitlements(user?.package);

  // Timetable state — real, on-device (no backend model exists for it yet)
  const [timetable, setTimetable] = useState<TimetableTask[]>([]);
  // Resources — real data from the backend
  const [resources, setResources] = useState<StudyResource[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadStudentData = async () => {
      try {
        const res = await dataManager.getResources();
        setResources(res);
        const storedTable = localStorage.getItem(`timetable_${user.username}`);
        if (storedTable) setTimetable(JSON.parse(storedTable));
      } catch (e) {
        console.error("Error loading student data", e);
      }
    };
    loadStudentData();
  }, [user?.username]);

  const handleLogin = async (username: string, password: string) => {
    setLoginErrorKind(null);
    setLoginPending(true);
    try {
      const { token, user: account } = await dataManager.loginStudent(username, password);
      setLoginPending(false);
      setLoginSuccess(true);
      // Brief confirmation before handing off to the dashboard — avoids an
      // instant, jarring swap from the login card straight to the app shell.
      setTimeout(() => login({ ...account, role: 'student' }, token), 450);
    } catch (e) {
      const apiErr = e as ApiError;
      if (apiErr?.status === 429) setLoginErrorKind('rateLimit');
      else if (apiErr?.status === 400) setLoginErrorKind('invalid');
      else setLoginErrorKind('network');
      setLoginPending(false);
    }
  };

  const addTimetableTask = (task: TimetableTask) => {
    setTimetable((prev) => {
      const updated = [...prev, task];
      localStorage.setItem(`timetable_${user!.username}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeTimetableTask = (id: string) => {
    setTimetable((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(`timetable_${user!.username}`, JSON.stringify(updated));
      return updated;
    });
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <StudentLoginGate
        onLogin={handleLogin}
        loginPending={loginPending}
        errorKind={loginErrorKind}
        loginSuccess={loginSuccess}
      />
    );
  }

  return (
    <div dir="ltr" className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 text-start">
      <SEO title="Espace Étudiant | Tilmid" description="Votre espace personnel Tilmid : parcours Mouwakaba, planning, contenus et outils." noindex />

      <StudentHeader student={user} entitlements={entitlements} onNavigate={setActiveTab} onLogout={authLogout} onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex">
        <StudentSidebar active={activeTab} onSelect={setActiveTab} entitlements={entitlements} />

        <main className="flex-1 min-w-0 p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardHome student={user} entitlements={entitlements} timetable={timetable} onNavigate={setActiveTab} />}
            {activeTab === 'parcours' && <MonParcours student={user} entitlements={entitlements} />}
            {activeTab === 'plan' && <MonPlan student={user} entitlements={entitlements} onNavigate={setActiveTab} />}
            {activeTab === 'planning' && <Planning timetable={timetable} onAdd={addTimetableTask} onRemove={removeTimetableTask} />}
            {activeTab === 'progression' && <Progression student={user} timetable={timetable} />}
            {activeTab === 'contenus' && <MesContenus entitlements={entitlements} />}
            {activeTab === 'bibliotheque' && <Bibliotheque entitlements={entitlements} resources={resources} onNavigate={setActiveTab} />}
            {activeTab === 'outils' && <MesOutils student={user} entitlements={entitlements} />}
            {activeTab === 'coaching' && <Coaching entitlements={entitlements} />}
            {activeTab === 'checkins' && <CheckIns student={user} entitlements={entitlements} />}
            {activeTab === 'feedback' && <Feedback entitlements={entitlements} />}
            {activeTab === 'support' && <Support entitlements={entitlements} />}
            {activeTab === 'profil' && <Profil student={user} entitlements={entitlements} onLogout={authLogout} />}
          </div>
        </main>
      </div>

      <StudentMobileNav active={activeTab} onSelect={setActiveTab} entitlements={entitlements} />

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <StudentSidebar active={activeTab} onSelect={(t) => { setActiveTab(t); setMobileMenuOpen(false); }} entitlements={entitlements} />
          </div>
        </div>
      )}
    </div>
  );
};
