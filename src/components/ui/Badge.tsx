import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-700',
};

export const Badge: React.FC<{
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ tone = 'neutral', icon, className = '', children }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold ${TONE_CLASSES[tone]} ${className}`}>
    {icon}
    {children}
  </span>
);
