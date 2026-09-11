import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState } from '../../components/student/primitives';
import { dataManager } from '../../utils/dataManager';
import { FeedbackEntry } from '../../types';

export const Feedback: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
  const [entries, setEntries] = useState<FeedbackEntry[] | null>(null);

  useEffect(() => {
    if (!entitlements.personalFeedback) return;
    dataManager.getFeedback().then(setEntries).catch(() => setEntries([]));
  }, [entitlements.personalFeedback]);

  if (!entitlements.personalFeedback) {
    return (
      <div>
        <PageHeader title="Feedback" />
        <LockedState title="Le feedback personnalisé n'est pas inclus dans votre formule" description="Le feedback de votre coach est disponible avec les formules Boost et Premium." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Feedback" subtitle="Retrouvez ici le feedback personnalisé de votre coach après vos séances et Check-ins." />

      {entries === null ? (
        <Card className="p-8 max-w-lg"><div className="h-20 rounded-xl bg-slate-50 animate-pulse" /></Card>
      ) : entries.length === 0 ? (
        <Card className="p-8 max-w-lg">
          <EmptyState icon={MessageSquare} title="Votre feedback apparaîtra ici après son envoi" description="Après votre première séance ou votre premier Check-in, le feedback de votre coach sera disponible sur cette page." />
        </Card>
      ) : (
        <div className="space-y-3 max-w-lg">
          {entries.map((f) => (
            <Card key={f.id} className="p-5">
              <p className="text-[11.5px] font-bold text-slate-400 mb-1.5">{new Date(f.createdAt).toLocaleString('fr-FR')}</p>
              <p className="text-[14px] text-slate-700 leading-relaxed">{f.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
