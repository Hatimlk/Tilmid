import React, { useState } from 'react';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { AdminCard, AdminPageHeader, AdminEmptyState, AdminErrorState } from '../../components/admin/primitives';

type Filter = 'all' | 'new' | 'read';

export const AdminMessages: React.FC = () => {
  const { messages, refreshMessages } = useAdminData();
  const [filter, setFilter] = useState<Filter>('all');

  const list = messages.data.filter((m) => filter === 'all' || m.status === filter);

  if (messages.error) {
    return (
      <div>
        <AdminPageHeader title="Messages" breadcrumb="Administration / Communication" />
        <AdminCard><AdminErrorState onRetry={refreshMessages} /></AdminCard>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        breadcrumb="Administration / Communication"
        description="Support général — messages reçus via le formulaire de contact du site."
      />

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5 w-fit">
        {(['all', 'new', 'read'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-lg text-[12.5px] font-bold transition-colors ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f === 'all' ? 'Tous' : f === 'new' ? 'Non lus' : 'Lus'}
          </button>
        ))}
      </div>

      {messages.loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-slate-50 animate-pulse" />)}</div>
      ) : list.length === 0 ? (
        <AdminCard><AdminEmptyState icon={MessageCircle} title="Aucun nouveau message" description="Les nouveaux messages de support apparaîtront ici." /></AdminCard>
      ) : (
        <div className="space-y-3">
          {list.map((msg) => (
            <AdminCard key={msg.id} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-black text-slate-800 text-[14.5px]">{msg.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-[12px] font-bold text-slate-400">
                    {msg.phone && <span className="flex items-center gap-1"><Phone size={11} /> {msg.phone}</span>}
                    {msg.email && <span className="flex items-center gap-1"><Mail size={11} /> {msg.email}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-wide text-primary bg-blue-50 px-2.5 py-1 rounded-full">{msg.type}</span>
                  {msg.status === 'new' && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </div>
              <p className="text-slate-600 font-medium text-[13.5px] leading-relaxed bg-slate-50 rounded-xl p-3.5">{msg.message || 'Aucun message additionnel.'}</p>
              <p className="text-[11.5px] font-bold text-slate-400 mt-2">{new Date(msg.created_at).toLocaleString('fr-FR')}</p>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
};
