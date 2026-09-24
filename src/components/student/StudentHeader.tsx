import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, User, Package, LogOut, Menu, Bell } from 'lucide-react';
import { Student, StudentNotification } from '../../types';
import { Entitlements, PACKAGE_TONE } from '../../utils/entitlements';
import { PackageBadge } from './primitives';
import { StudentTab } from './navigation';
import { dataManager } from '../../utils/dataManager';

const NOTIF_POLL_MS = 30000;

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
};

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = () => {
    dataManager.getNotifications().then(setNotifications).catch(() => { /* keep previous */ });
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, NOTIF_POLL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markRead = async (n: StudentNotification) => {
    if (n.read_at) return;
    await dataManager.markNotificationRead(n.id);
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Notifications" className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500">
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-2 z-40 max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-[12.5px] font-medium text-slate-400 py-6">Aucune notification</p>
          ) : (
            notifications.map((n) => (
              <button key={n.id} onClick={() => markRead(n)} className={`w-full text-start p-3 rounded-xl hover:bg-slate-50 ${!n.read_at ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-start gap-2">
                  {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-[12.5px]">{n.title}</p>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const StudentHeader: React.FC<{
  student: Student;
  entitlements: Entitlements;
  onNavigate: (tab: StudentTab) => void;
  onLogout: () => void;
  onOpenMobileMenu?: () => void;
}> = ({ student, entitlements, onNavigate, onLogout, onOpenMobileMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initials = student.name?.trim().slice(0, 2).toUpperCase() || 'EL';
  const tone = student.package ? PACKAGE_TONE[student.package] : null;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobileMenu} className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-500 -ms-2" aria-label="Ouvrir le menu">
          <Menu size={20} />
        </button>
        <div>
          <p className="font-black text-slate-900 text-[13.5px] leading-none">Espace Étudiant</p>
          <p className="text-[11px] font-bold text-slate-400 mt-1">{student.grade}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
      <NotificationBell />
      <div className="relative" ref={menuRef}>
        <button onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} className="flex items-center gap-3 pe-1">
          <div className="hidden sm:block text-end">
            <p className="text-[13px] font-black text-slate-800 leading-none">{student.name}</p>
            <div className="flex items-center gap-1.5 justify-end mt-1">
              {tone ? (
                <PackageBadge label={entitlements.label} tone={tone} />
              ) : (
                <span className="text-[10.5px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Programme actif
                </span>
              )}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-primary flex items-center justify-center text-white font-black text-[12px] shrink-0">
            {initials}
          </div>
          <ChevronDown size={15} className="text-slate-400 hidden sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute end-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-2 z-40">
            <button onClick={() => { onNavigate('profil'); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50">
              <User size={15} /> Mon profil
            </button>
            <button onClick={() => { onNavigate('profil'); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50">
              <Package size={15} /> Ma formule
            </button>
            <div className="h-px bg-slate-50 my-1" />
            <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-[13px] font-bold text-red-600 hover:bg-red-50">
              <LogOut size={15} /> Se déconnecter
            </button>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};
