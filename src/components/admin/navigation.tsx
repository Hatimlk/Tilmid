import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Users, Layers, Target, Presentation, CheckSquare, MessageSquare,
  TrendingUp, CalendarClock, CalendarRange, PlayCircle, Library, Wrench,
  MessageCircle, Bell, Star, BarChart3, Activity, GraduationCap, KeyRound,
  Settings, ChevronsLeft, ChevronsRight, X, LogOut,
} from 'lucide-react';
import { IMAGES } from '../../constants/images';

export interface AdminNavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
  { title: 'Vue générale', items: [{ path: '/admin', label: 'Tableau de bord', icon: LayoutGrid }] },
  {
    title: 'Étudiants',
    items: [
      { path: '/admin/students', label: 'Étudiants', icon: Users },
      { path: '/admin/packages', label: 'Formules & accès', icon: Layers },
    ],
  },
  {
    title: 'Mouwakaba',
    items: [
      { path: '/admin/plans', label: "Plans d'accompagnement", icon: Target },
      { path: '/admin/coaching', label: 'Coaching', icon: Presentation },
      { path: '/admin/check-ins', label: 'Check-ins', icon: CheckSquare },
      { path: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
      { path: '/admin/progress', label: 'Progression', icon: TrendingUp },
    ],
  },
  {
    title: 'Planning',
    items: [
      { path: '/admin/appointments', label: 'Rendez-vous', icon: CalendarClock },
      { path: '/admin/collective-sessions', label: 'Sessions collectives', icon: CalendarRange },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { path: '/admin/content', label: 'Modules & vidéos', icon: PlayCircle },
      { path: '/admin/library', label: 'Bibliothèque', icon: Library },
      { path: '/admin/tools', label: 'Outils', icon: Wrench },
    ],
  },
  {
    title: 'Communication',
    items: [
      { path: '/admin/messages', label: 'Messages', icon: MessageCircle },
      { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  { title: 'Publication', items: [{ path: '/admin/stories', label: 'Témoignages', icon: Star }] },
  {
    title: 'Analyse',
    items: [
      { path: '/admin/reports', label: 'Rapports', icon: BarChart3 },
      { path: '/admin/activity', label: 'Activité', icon: Activity },
    ],
  },
  {
    title: 'Administration',
    items: [
      { path: '/admin/coaches', label: 'Coachs', icon: GraduationCap },
      { path: '/admin/users', label: 'Utilisateurs & rôles', icon: KeyRound },
      { path: '/admin/settings', label: 'Paramètres', icon: Settings },
    ],
  },
];

export const getPageMeta = (pathname: string): { title: string; breadcrumb: string } => {
  if (pathname.match(/^\/admin\/students\/[^/]+$/)) {
    return { title: 'Dossier étudiant', breadcrumb: 'Administration / Étudiants' };
  }
  for (const section of ADMIN_NAV) {
    const item = section.items.find((i) => i.path === pathname);
    if (item) return { title: item.label, breadcrumb: `Administration / ${section.title}` };
  }
  return { title: 'Administration', breadcrumb: 'Administration' };
};

const COLLAPSE_KEY = 'tilmid_admin_sidebar_collapsed';

export const useSidebarCollapsed = () => {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(COLLAPSE_KEY) === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch { /* ignore */ }
  }, [collapsed]);
  return [collapsed, setCollapsed] as const;
};

const NavRow: React.FC<{ item: AdminNavItem; collapsed: boolean; onNavigate?: () => void }> = ({ item, collapsed, onNavigate }) => (
  <NavLink
    to={item.path}
    end={item.path === '/admin'}
    onClick={onNavigate}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-3 py-2.5 min-h-[40px] rounded-xl text-[13px] font-bold transition-colors ${collapsed ? 'justify-center' : ''
      } ${isActive ? 'bg-primary text-white shadow-[0_4px_14px_rgba(22,139,255,0.35)]' : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <item.icon size={17} className="shrink-0" />
    {!collapsed && <span className="truncate">{item.label}</span>}
    {collapsed && (
      <span className="pointer-events-none absolute start-full ms-2 z-50 whitespace-nowrap rounded-lg bg-slate-900 text-white text-[12px] font-bold px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.label}
      </span>
    )}
  </NavLink>
);

const SidebarContent: React.FC<{
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  onCloseMobile?: () => void;
}> = ({ collapsed, onToggleCollapse, onLogout, onCloseMobile }) => (
    <div className="flex flex-col h-full" style={{ background: '#08142F' }}>
      <div className={`flex items-center gap-2.5 px-4 pt-5 pb-6 ${collapsed ? 'justify-center px-2' : ''}`}>
        <img src={IMAGES.LOGOS.WHITE} alt="Tilmid" className={collapsed ? 'h-7 w-auto' : 'h-8 w-auto'} />
        {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.14em] text-blue-100/50">Admin</span>}
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="ms-auto lg:hidden text-blue-100/60 hover:text-white p-1">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 pb-4 space-y-5">
        {ADMIN_NAV.map((section) => (
          <div key={section.title}>
            {!collapsed && <p className="px-3 mb-1.5 text-[10.5px] font-black uppercase tracking-widest text-blue-100/35">{section.title}</p>}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavRow key={item.path} item={item} collapsed={collapsed} onNavigate={onCloseMobile} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-2.5 space-y-0.5">
        <button
          onClick={onToggleCollapse}
          className={`hidden lg:flex w-full items-center gap-3 px-3 py-2.5 min-h-[40px] rounded-xl text-[13px] font-bold text-blue-100/50 hover:bg-white/5 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
          {!collapsed && <span>Réduire</span>}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[40px] rounded-xl text-[13px] font-bold text-rose-300/80 hover:bg-rose-500/10 hover:text-rose-200 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </div>
  );

export const AdminSidebar: React.FC<{
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}> = ({ collapsed, onToggleCollapse, onLogout, mobileOpen, onCloseMobile }) => (
  <>
    <aside className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-200 ${collapsed ? 'w-[76px]' : 'w-[264px]'}`}>
      <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} onLogout={onLogout} />
    </aside>

    {mobileOpen && (
      <div className="lg:hidden fixed inset-0 z-[80]">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCloseMobile} />
        <div className="absolute inset-y-0 start-0 w-[280px]">
          {/* Mobile drawer always shows the full (uncollapsed) sidebar — the desktop
              collapse preference is a desktop-only affordance. */}
          <SidebarContent collapsed={false} onToggleCollapse={onToggleCollapse} onLogout={onLogout} onCloseMobile={onCloseMobile} />
        </div>
      </div>
    )}
  </>
);
