import React from 'react';
import { Lock, Inbox, RefreshCw } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Page header                                                                */
/* -------------------------------------------------------------------------- */

export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
    <div>
      <h1 className="text-2xl md:text-[28px] font-black text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 text-[14px] font-medium mt-1.5 max-w-xl">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export const Card: React.FC<{ children: React.ReactNode; className?: string; emphasis?: boolean }> = ({ children, className = '', emphasis }) => (
  <div
    className={`bg-white border border-[#E7ECF3] rounded-[20px] ${emphasis ? 'shadow-[0_18px_44px_rgba(15,23,42,0.08)]' : 'shadow-[0_10px_30px_rgba(15,23,42,0.05)]'} ${className}`}
  >
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Status system                                                              */
/* -------------------------------------------------------------------------- */

export type StudentStatus = 'a_faire' | 'en_cours' | 'termine' | 'a_venir' | 'en_retard' | 'a_revoir' | 'verrouille';

const STATUS_MAP: Record<StudentStatus, { label: string; bg: string; text: string }> = {
  a_faire: { label: 'À faire', bg: 'bg-slate-100', text: 'text-slate-600' },
  en_cours: { label: 'En cours', bg: 'bg-blue-50', text: 'text-primary' },
  termine: { label: 'Terminé', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  a_venir: { label: 'À venir', bg: 'bg-amber-50', text: 'text-amber-700' },
  en_retard: { label: 'En retard', bg: 'bg-red-50', text: 'text-red-700' },
  a_revoir: { label: 'À revoir', bg: 'bg-purple-50', text: 'text-purple-700' },
  verrouille: { label: 'Verrouillé', bg: 'bg-slate-100', text: 'text-slate-400' },
};

export const StatusPill: React.FC<{ status: StudentStatus; icon?: React.ElementType }> = ({ status, icon: Icon }) => {
  const s = STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${s.bg} ${s.text}`}>
      {Icon && <Icon size={11} />}
      {s.label}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Progress bar                                                               */
/* -------------------------------------------------------------------------- */

export const ProgressBar: React.FC<{ value: number; label?: string; tone?: 'primary' | 'emerald' }> = ({ value, label, tone = 'primary' }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] font-bold text-slate-500">{label}</span>
          <span className="text-[12px] font-black text-slate-700">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-all duration-500 ${tone === 'emerald' ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

export const EmptyState: React.FC<{
  icon?: React.ElementType;
  title: string;
  description?: string;
  cta?: { label: string; onClick?: () => void; href?: string };
}> = ({ icon: Icon = Inbox, title, description, cta }) => (
  <div className="text-center py-12 px-6">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
      <Icon size={24} />
    </div>
    <h3 className="font-black text-slate-800 text-[15px] mb-1.5">{title}</h3>
    {description && <p className="text-slate-500 text-[13px] font-medium max-w-sm mx-auto leading-relaxed">{description}</p>}
    {cta && (
      cta.href ? (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 min-h-[40px] bg-slate-900 text-white rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-all">
          {cta.label}
        </a>
      ) : (
        <button onClick={cta.onClick} className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 min-h-[40px] bg-slate-900 text-white rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-all">
          {cta.label}
        </button>
      )
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Locked state (feature outside the student's pack)                         */
/* -------------------------------------------------------------------------- */

export const LockedState: React.FC<{
  title: string;
  description: string;
  cta?: { label: string; onClick: () => void };
}> = ({ title, description, cta }) => (
  <Card className="p-10 text-center max-w-lg mx-auto">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-5">
      <Lock size={20} />
    </div>
    <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
    <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-6">{description}</p>
    {cta && (
      <button onClick={cta.onClick} className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-primary text-white rounded-xl font-bold text-sm hover:bg-[#0875E8] transition-all">
        {cta.label}
      </button>
    )}
  </Card>
);

/* -------------------------------------------------------------------------- */
/* Error state (widget-level, isolated failure)                              */
/* -------------------------------------------------------------------------- */

export const WidgetErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="text-center py-8 px-4">
    <p className="font-bold text-slate-700 text-sm mb-1">Impossible de charger ce contenu</p>
    <p className="text-slate-400 text-[12px] font-medium mb-4">Une erreur est survenue.</p>
    {onRetry && (
      <button onClick={onRetry} className="inline-flex items-center gap-1.5 text-primary font-bold text-[13px] hover:underline">
        <RefreshCw size={13} /> Réessayer
      </button>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Journey timeline                                                          */
/* -------------------------------------------------------------------------- */

export type JourneyStepState = 'done' | 'active' | 'upcoming';

export interface JourneyStepDef {
  label: string;
  state: JourneyStepState;
}

export const JourneyTimeline: React.FC<{ steps: JourneyStepDef[] }> = ({ steps }) => (
  <div className="flex flex-col">
    {steps.map((step, i) => (
      <div key={i} className="flex gap-4">
        <div className="flex flex-col items-center">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${step.state === 'done'
              ? 'bg-emerald-500 text-white'
              : step.state === 'active'
                ? 'bg-primary text-white ring-4 ring-primary/15'
                : 'bg-slate-100 text-slate-400'
              }`}
          >
            {step.state === 'done' ? '✓' : i + 1}
          </span>
          {i < steps.length - 1 && <span className={`w-px flex-1 min-h-[28px] ${step.state === 'done' ? 'bg-emerald-200' : 'bg-slate-200'}`} />}
        </div>
        <div className="pb-7">
          <p className={`text-[14px] font-black ${step.state === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>{step.label}</p>
        </div>
      </div>
    ))}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Package badge                                                             */
/* -------------------------------------------------------------------------- */

export const PackageBadge: React.FC<{ label: string; tone: { bg: string; text: string } }> = ({ label, tone }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${tone.bg} ${tone.text}`}>{label}</span>
);
