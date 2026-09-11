import React, { useEffect, useState } from 'react';
import { Users, Calendar, CalendarRange, Check } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState } from '../../components/student/primitives';
import { dataManager } from '../../utils/dataManager';
import { Appointment, CollectiveSession } from '../../types';

const CollectiveSessionsSection: React.FC = () => {
  const [sessions, setSessions] = useState<CollectiveSession[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    try {
      setSessions(await dataManager.getCollectiveSessions());
    } catch {
      setSessions([]);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (s: CollectiveSession) => {
    setBusyId(s.id);
    try {
      if (s.myRegistration) await dataManager.unregisterFromCollectiveSession(s.id);
      else await dataManager.registerForCollectiveSession(s.id);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (sessions === null) return <Card className="p-8"><div className="h-20 rounded-xl bg-slate-50 animate-pulse" /></Card>;

  const upcoming = sessions.filter((s) => s.status === 'scheduled').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div>
      <h2 className="font-black text-slate-900 text-[16px] mb-3 flex items-center gap-2"><CalendarRange size={17} className="text-primary" /> Sessions collectives</h2>
      {upcoming.length === 0 ? (
        <Card className="p-8"><EmptyState icon={CalendarRange} title="Aucune session collective programmée" description="Les prochaines sessions collectives apparaîtront ici." /></Card>
      ) : (
        <div className="space-y-3">
          {upcoming.map((s) => {
            const full = s.capacity !== null && s.registeredCount >= s.capacity && !s.myRegistration;
            return (
              <Card key={s.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 text-[14.5px]">{s.title}</p>
                  {s.description && <p className="text-slate-500 text-[13px] font-medium mt-0.5">{s.description}</p>}
                  <p className="text-[12.5px] font-bold text-slate-400 mt-1.5">{new Date(s.date).toLocaleDateString('fr-FR')} · {s.time} · {s.registeredCount}{s.capacity ? ` / ${s.capacity}` : ''} inscrit{s.registeredCount > 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => toggle(s)}
                  disabled={busyId === s.id || full}
                  className={`inline-flex items-center gap-1.5 h-11 px-4 rounded-xl font-bold text-[13px] shrink-0 transition-colors disabled:opacity-60 ${s.myRegistration ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-900 text-white hover:bg-primary'}`}
                >
                  {s.myRegistration ? <><Check size={14} /> Inscrit</> : full ? 'Complet' : "S'inscrire"}
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const IndividualSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Appointment[] | null>(null);

  useEffect(() => {
    dataManager.getCoachingSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  if (sessions === null) return <Card className="p-8"><div className="h-20 rounded-xl bg-slate-50 animate-pulse" /></Card>;

  if (sessions.length === 0) {
    return (
      <Card className="p-8 max-w-lg">
        <EmptyState
          icon={Calendar}
          title="Aucune séance programmée"
          description="Contactez votre coach pour planifier votre première séance de coaching."
          cta={{ label: 'Planifier sur WhatsApp', href: 'https://wa.me/212703749901' }}
        />
      </Card>
    );
  }

  const sorted = [...sessions].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  return (
    <div className="space-y-3">
      {sorted.map((a) => (
        <Card key={a.id} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-black text-slate-900 text-[14.5px]">{a.title}</p>
              <p className="text-[12.5px] font-bold text-slate-400 mt-1">{new Date(a.date).toLocaleDateString('fr-FR')} · {a.time}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black ${a.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : a.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-primary'}`}>
              {a.status === 'completed' ? 'Terminée' : a.status === 'cancelled' ? 'Annulée' : a.status === 'pending' ? 'En attente' : 'Confirmée'}
            </span>
          </div>
          {a.notes && <p className="text-[13px] text-slate-600 mt-3 pt-3 border-t border-slate-50 whitespace-pre-line">{a.notes}</p>}
        </Card>
      ))}
    </div>
  );
};

export const Coaching: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
  return (
    <div>
      <PageHeader
        title="Mes séances de coaching"
        subtitle={entitlements.coachingSessions > 0 ? `Votre formule ${entitlements.label} inclut ${entitlements.coachingSessions} séance${entitlements.coachingSessions > 1 ? 's' : ''} individuelle${entitlements.coachingSessions > 1 ? 's' : ''} de 45 minutes.` : undefined}
      />

      {entitlements.coachingSessions === 0 ? (
        <LockedState
          title="Les séances individuelles ne sont pas incluses dans votre formule"
          description={
            entitlements.hasCoachingPack
              ? 'Votre Pack Essentiel comprend les contenus, outils et accompagnements collectifs.'
              : "Aucune formule Mouwakaba n'est active sur votre compte."
          }
          cta={{ label: 'Découvrir Boost', onClick: () => window.open('/coaching-offer', '_blank') }}
        />
      ) : (
        <>
          <IndividualSessions />
          {entitlements.priorityBooking && (
            <p className="mt-4 text-[12.5px] font-bold text-purple-600 flex items-center gap-1.5">
              <Users size={13} /> Votre formule Premium bénéficie d'une priorité de réservation pour vos séances.
            </p>
          )}
        </>
      )}

      {entitlements.collectiveSupport && (
        <div className="mt-8">
          <CollectiveSessionsSection />
        </div>
      )}
    </div>
  );
};
