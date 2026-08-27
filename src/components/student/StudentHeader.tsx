import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, User, Package, LogOut, Menu } from 'lucide-react';
import { Student } from '../../types';
import { Entitlements, PACKAGE_TONE } from '../../utils/entitlements';
import { PackageBadge } from './primitives';
import { StudentTab } from './navigation';

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
    </header>
  );
};
