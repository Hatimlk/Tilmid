import React from 'react';
import { Lock, Inbox, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { StudentStatus, Appointment, MouwakabaPackage } from '../../types';
import { PACKAGE_TONE } from '../../utils/entitlements';

/* -------------------------------------------------------------------------- */
/* Card system — smaller radii than the marketing pages, per admin spec       */
/* -------------------------------------------------------------------------- */

export const AdminCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-[#E6EBF2] rounded-[18px] shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${className}`}>
    {children}
  </div>
);

export const AdminPageHeader: React.FC<{ title: string; breadcrumb?: string; description?: string; action?: React.ReactNode }> = ({ title, breadcrumb, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
    <div>
      {breadcrumb && <p className="text-[12px] font-bold text-slate-400 mb-1">{breadcrumb}</p>}
      <h1 className="text-[26px] md:text-[30px] font-black text-slate-900 tracking-tight">{title}</h1>
      {description && <p className="text-slate-500 text-[13.5px] font-medium mt-1 max-w-xl">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/* -------------------------------------------------------------------------- */
/* KPI card                                                                   */
/* -------------------------------------------------------------------------- */

export const KpiCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: number | string;
  tone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple';
  linkLabel?: string;
  onLinkClick?: () => void;
}> = ({ icon: Icon, label, value, tone = 'blue', linkLabel, onLinkClick }) => {
  const toneMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-primary' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  };
  const t = toneMap[tone];
  return (
    <AdminCard className="p-5">
      <div className="flex items-start justify-between mb-4">
        <span className={`w-10 h-10 rounded-xl ${t.bg} ${t.text} flex items-center justify-center`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="text-[26px] font-black text-slate-900 leading-none mb-1.5">{value}</p>
      <p className="text-[12.5px] font-bold text-slate-500">{label}</p>
      {linkLabel && (
        <button onClick={onLinkClick} className="mt-3 text-[12px] font-bold text-primary hover:underline">
          {linkLabel} →
        </button>
      )}
    </AdminCard>
  );
};

/* -------------------------------------------------------------------------- */
/* Status badges                                                              */
/* -------------------------------------------------------------------------- */

export const STUDENT_STATUS_MAP: Record<StudentStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Actif', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending_activation: { label: "En attente d'activation", bg: 'bg-amber-50', text: 'text-amber-700' },
  suspended: { label: 'Suspendu', bg: 'bg-rose-50', text: 'text-rose-700' },
  completed: { label: 'Programme terminé', bg: 'bg-purple-50', text: 'text-purple-700' },
  archived: { label: 'Archivé', bg: 'bg-slate-100', text: 'text-slate-500' },
};

export const StudentStatusBadge: React.FC<{ status: StudentStatus }> = ({ status }) => {
  const s = STUDENT_STATUS_MAP[status] || STUDENT_STATUS_MAP.active;
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${s.bg} ${s.text}`}>{s.label}</span>;
};

export const APPOINTMENT_STATUS_MAP: Record<Appointment['status'], { label: string; bg: string; text: string }> = {
  pending: { label: 'En attente', bg: 'bg-amber-50', text: 'text-amber-700' },
  confirmed: { label: 'Confirmé', bg: 'bg-blue-50', text: 'text-primary' },
  completed: { label: 'Terminé', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  cancelled: { label: 'Annulé', bg: 'bg-rose-50', text: 'text-rose-700' },
};

export const AppointmentStatusBadge: React.FC<{ status: Appointment['status'] }> = ({ status }) => {
  const s = APPOINTMENT_STATUS_MAP[status] || APPOINTMENT_STATUS_MAP.pending;
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${s.bg} ${s.text}`}>{s.label}</span>;
};

export const PackageBadge: React.FC<{ pkg: MouwakabaPackage | null | undefined }> = ({ pkg }) => {
  if (!pkg) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-400">Aucune</span>;
  const tone = PACKAGE_TONE[pkg];
  const label = pkg.charAt(0).toUpperCase() + pkg.slice(1);
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${tone.bg} ${tone.text}`}>{label}</span>;
};

/* -------------------------------------------------------------------------- */
/* Empty / error / coming-soon states                                        */
/* -------------------------------------------------------------------------- */

export const AdminEmptyState: React.FC<{
  icon?: React.ElementType;
  title: string;
  description?: string;
  cta?: { label: string; onClick: () => void };
}> = ({ icon: Icon = Inbox, title, description, cta }) => (
  <div className="text-center py-14 px-6">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-3">
      <Icon size={20} />
    </div>
    <h3 className="font-black text-slate-800 text-[14px] mb-1">{title}</h3>
    {description && <p className="text-slate-500 text-[13px] font-medium max-w-sm mx-auto leading-relaxed">{description}</p>}
    {cta && (
      <button onClick={cta.onClick} className="inline-flex items-center gap-1.5 mt-4 px-4 py-2.5 min-h-[40px] bg-slate-900 text-white rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-all">
        {cta.label}
      </button>
    )}
  </div>
);

export const AdminErrorState: React.FC<{ title?: string; onRetry?: () => void }> = ({ title = 'Impossible de charger les données', onRetry }) => (
  <div className="text-center py-14 px-6">
    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
      <AlertTriangle size={20} />
    </div>
    <p className="font-black text-slate-800 text-[14px] mb-1">{title}</p>
    <p className="text-slate-500 text-[13px] font-medium mb-4">Une erreur est survenue lors du chargement.</p>
    {onRetry && (
      <button onClick={onRetry} className="inline-flex items-center gap-1.5 text-primary font-bold text-[13px] hover:underline">
        <RefreshCw size={13} /> Réessayer
      </button>
    )}
  </div>
);

export const ModuleComingSoon: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <AdminCard className="p-14 text-center max-w-lg mx-auto">
    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mx-auto mb-5">
      <Icon size={20} />
    </div>
    <h3 className="font-black text-slate-900 text-[17px] mb-2">{title}</h3>
    <p className="text-slate-500 text-[13.5px] font-medium leading-relaxed mb-4">{description}</p>
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-slate-100 text-slate-500">
      Module à venir
    </span>
  </AdminCard>
);

/* -------------------------------------------------------------------------- */
/* Confirm dialog                                                             */
/* -------------------------------------------------------------------------- */

export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, description, confirmLabel, tone = 'default', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-[20px] w-full max-w-sm shadow-2xl p-6">
        <h3 className="font-black text-slate-900 text-[17px] mb-2">{title}</h3>
        <p className="text-slate-500 text-[13.5px] font-medium leading-relaxed mb-6">{description}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 h-11 rounded-xl border border-slate-200 font-bold text-[13px] text-slate-600 hover:bg-slate-50">Annuler</button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-xl font-bold text-[13px] text-white ${tone === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Drawer (generic side panel used by student quick-view etc.)               */
/* -------------------------------------------------------------------------- */

export const Drawer: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 end-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h3 className="font-black text-slate-900 text-[16px]">{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

export const Avatar: React.FC<{ name: string; src?: string | null; size?: number }> = ({ name, src, size = 40 }) => {
  const initials = name?.trim().slice(0, 2).toUpperCase() || '—';
  if (src) {
    return <img src={src} alt="" style={{ width: size, height: size }} className="rounded-xl object-cover bg-slate-100 shrink-0" />;
  }
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      className="rounded-xl bg-gradient-to-tr from-indigo-500 to-primary text-white font-black flex items-center justify-center shrink-0"
    >
      {initials}
    </span>
  );
};

export const LockedNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
    <Lock size={12} /> {children}
  </p>
);
