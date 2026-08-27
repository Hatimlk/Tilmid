import React, { useState } from 'react';
import { MessageCircle, ChevronDown, LifeBuoy, Users } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card } from '../../components/student/primitives';

const FAQS = [
  { q: 'Comment contacter mon coach ?', a: "Les échanges liés au coaching se font lors de vos séances et via vos Check-ins. Pour toute question générale, utilisez le support Tilmid ci-dessous." },
  { q: 'Comment fonctionne le groupe WhatsApp Mouwakaba ?', a: "Le groupe WhatsApp est un espace collectif pour poser vos questions pendant les créneaux dédiés — il est distinct du support technique Tilmid." },
  { q: 'Je rencontre un problème technique, que faire ?', a: "Contactez le support Tilmid via WhatsApp en décrivant le problème rencontré, nous vous répondrons rapidement." },
  { q: 'J\'ai une question sur ma formule', a: 'Contactez notre équipe pour toute question concernant votre formule Mouwakaba active ou une mise à niveau.' },
];

export const Support: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <PageHeader title="Centre d'aide" subtitle="Une question ? Notre équipe est là pour vous aider." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"><LifeBuoy size={19} /></span>
          <p className="font-black text-slate-900 text-[15px] mb-1">Support Tilmid</p>
          <p className="text-slate-500 text-[13px] font-medium mb-4">Questions techniques ou générales sur votre espace.</p>
          <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#25D366] text-white rounded-xl font-bold text-[13px]">
            <MessageCircle size={16} /> Contacter le support
          </a>
        </Card>

        {entitlements.collectiveSupport && (
          <Card className="p-6">
            <span className="w-11 h-11 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-3"><Users size={19} /></span>
            <p className="font-black text-slate-900 text-[15px] mb-1">Groupe WhatsApp Mouwakaba</p>
            <p className="text-slate-500 text-[13px] font-medium mb-4">Espace collectif pour vos questions pendant les créneaux dédiés.</p>
            <a href="https://wa.me/message/GN4XKUOMHNHGO1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-primary text-white rounded-xl font-bold text-[13px]">
              <MessageCircle size={16} /> Rejoindre le groupe
            </a>
          </Card>
        )}
      </div>

      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Questions fréquentes</p>
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-3 p-5 min-h-[44px] text-start">
                <span className="font-bold text-slate-800 text-[13.5px]">{f.q}</span>
                <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <p className="px-5 pb-5 text-slate-500 text-[13px] font-medium leading-relaxed">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
