import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Plus, Bell, ChevronDown, UserPlus, CalendarPlus, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { getPageMeta } from './navigation';
import { Avatar } from './primitives';

export const AdminTopbar: React.FC<{
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onCreateStudent: () => void;
  onCreateAppointment: () => void;
}> = ({ onOpenMobileSidebar, onOpenSearch, onCreateStudent, onCreateAppointment }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { appointments, messages } = useAdminData();
  const { title, breadcrumb } = getPageMeta(location.pathname);

  const [quickOpen, setQuickOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const quickRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const pendingAppointments = appointments.data.filter((a) => a.status === 'pending');
  const unreadMessages = messages.data.filter((m) => m.status === 'new');
  const notifCount = pendingAppointments.length + unreadMessages.length;

  const displayName = user?.username || user?.name || 'Admin';
  const initials = displayName.trim().slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-100 px-4 lg:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenMobileSidebar} className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-500 -ms-1 shrink-0" aria-label="Ouvrir la navigation">
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-slate-400 truncate">{breadcrumb}</p>
          <h1 className="text-[18px] lg:text-[20px] font-black text-slate-900 tracking-tight truncate">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-2.5 shrink-0">
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 w-64 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-[13px] font-medium hover:border-slate-300 transition-colors"
        >
          <Search size={15} />
          <span className="flex-1 text-start">Rechercher...</span>
          <kbd className="text-[10px] font-bold bg-white border border-slate-200 rounded px-1.5 py-0.5">Ctrl K</kbd>
        </button>
        <button onClick={onOpenSearch} className="md:hidden w-9 h-9 flex items-center justify-center text-slate-500 rounded-xl hover:bg-slate-50">
          <Search size={18} />
        </button>

        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickOpen((v) => !v)}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-primary text-white font-bold text-[13px] hover:bg-[#0875E8] transition-colors"
          >
            <Plus size={15} /> <span className="hidden sm:inline">Nouveau</span>
          </button>
          {quickOpen && (
            <div className="absolute end-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-2 z-40">
              <button onClick={() => { onCreateStudent(); setQuickOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50">
                <UserPlus size={16} className="text-primary" /> Ajouter un étudiant
              </button>
              <button onClick={() => { onCreateAppointment(); setQuickOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50">
                <CalendarPlus size={16} className="text-primary" /> Créer un rendez-vous
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-10 h-10 flex items-center justify-center text-slate-500 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <Bell size={18} />
            {notifCount > 0 && (
              <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute end-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-2 z-40 max-h-96 overflow-y-auto">
              <p className="px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400">Notifications</p>
              {notifCount === 0 && (
                <p className="text-center py-8 text-[13px] font-bold text-slate-400">Aucune notification pour le moment</p>
              )}
              {pendingAppointments.slice(0, 4).map((a) => (
                <button key={`a-${a.id}`} onClick={() => { navigate('/admin/appointments'); setNotifOpen(false); }} className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-start hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Clock size={14} /></span>
                  <span className="min-w-0">
                    <span className="block font-bold text-[12.5px] text-slate-800 truncate">Rendez-vous à confirmer</span>
                    <span className="block text-[11.5px] font-medium text-slate-400 truncate">{a.studentName} · {a.title}</span>
                  </span>
                </button>
              ))}
              {unreadMessages.slice(0, 4).map((m) => (
                <button key={`m-${m.id}`} onClick={() => { navigate('/admin/messages'); setNotifOpen(false); }} className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-start hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0"><MessageCircle size={14} /></span>
                  <span className="min-w-0">
                    <span className="block font-bold text-[12.5px] text-slate-800 truncate">Nouveau message</span>
                    <span className="block text-[11.5px] font-medium text-slate-400 truncate">{m.name}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 ps-1 pe-2 h-10 rounded-xl hover:bg-slate-50">
            <Avatar name={displayName} size={32} />
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute end-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-[0_18px_44px_rgba(15,23,42,0.12)] p-2 z-40">
              <div className="px-3 py-2 border-b border-slate-50 mb-1">
                <p className="font-black text-[13px] text-slate-800 truncate">{displayName}</p>
                <p className="text-[11.5px] font-bold text-slate-400">Super Admin</p>
              </div>
              <button onClick={() => { navigate('/login'); logout(); }} className="w-full text-start px-3 py-2.5 min-h-[40px] rounded-xl text-[13px] font-bold text-rose-600 hover:bg-rose-50">
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
