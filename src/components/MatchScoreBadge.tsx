import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { MatchResult } from '../constants/schools';

const toneFor = (pct: number) =>
  pct >= 75
    ? { bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:bg-emerald-100' }
    : pct >= 50
      ? { bg: 'bg-blue-50', text: 'text-primary', hover: 'hover:bg-blue-100' }
      : { bg: 'bg-slate-100', text: 'text-slate-500', hover: 'hover:bg-slate-200' };

/** Compact "compatibility" badge — click reveals which real criteria matched, so the
 * number is never a black box. Never implies an admission chance. */
export const MatchScoreBadge: React.FC<{ match: MatchResult; className?: string }> = ({ match, className = '' }) => {
  const [open, setOpen] = useState(false);
  const tone = toneFor(match.pct);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-colors ${tone.bg} ${tone.text} ${tone.hover}`}
        aria-expanded={open}
      >
        {match.pct}% compatible
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-30 mt-2 w-60 bg-white border border-slate-100 rounded-xl shadow-lg p-3 space-y-1.5 text-start"
        >
          {match.checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-[12px] font-semibold">
              {c.met
                ? <Check size={13} className="text-emerald-500 shrink-0" />
                : <X size={13} className="text-slate-300 shrink-0" />}
              <span className={c.met ? 'text-slate-700' : 'text-slate-400'}>{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
