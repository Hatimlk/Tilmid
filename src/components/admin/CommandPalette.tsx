import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, CalendarClock, MessageCircle, CornerDownLeft } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface Result {
  id: string;
  icon: React.ElementType;
  label: string;
  meta: string;
  onSelect: () => void;
}

export const CommandPalette: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { students, appointments, messages } = useAdminData();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results: Result[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];

    students.data
      .filter((s) => s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q))
      .slice(0, 6)
      .forEach((s) => out.push({
        id: `student-${s.id}`, icon: Users, label: s.name, meta: `Étudiant · ${s.grade}`,
        onSelect: () => { navigate(`/admin/students/${s.id}`); onClose(); },
      }));

    appointments.data
      .filter((a) => a.title.toLowerCase().includes(q) || a.studentName.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((a) => out.push({
        id: `appt-${a.id}`, icon: CalendarClock, label: a.title, meta: `Rendez-vous · ${a.studentName} · ${a.date}`,
        onSelect: () => { navigate('/admin/appointments'); onClose(); },
      }));

    messages.data
      .filter((m) => m.name.toLowerCase().includes(q) || m.message?.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((m) => out.push({
        id: `msg-${m.id}`, icon: MessageCircle, label: m.name, meta: 'Message',
        onSelect: () => { navigate('/admin/messages'); onClose(); },
      }));

    return out;
  }, [query, students.data, appointments.data, messages.data, navigate, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-[20px] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un étudiant, rendez-vous, message..."
            className="flex-1 h-full outline-none font-medium text-[14.5px] text-slate-800 placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">Échap</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <p className="text-center py-10 text-[13px] font-bold text-slate-400">Aucun résultat pour « {query} »</p>
          )}
          {!query.trim() && (
            <p className="text-center py-10 text-[13px] font-bold text-slate-400">Commencez à taper pour rechercher</p>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              onClick={r.onSelect}
              className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl hover:bg-slate-50 text-start group"
            >
              <span className="w-9 h-9 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-primary flex items-center justify-center shrink-0">
                <r.icon size={16} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-[13.5px] text-slate-800 truncate">{r.label}</span>
                <span className="block text-[12px] font-medium text-slate-400 truncate">{r.meta}</span>
              </span>
              <CornerDownLeft size={14} className="text-slate-300 shrink-0 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
