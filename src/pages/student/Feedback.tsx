import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState } from '../../components/student/primitives';

export const Feedback: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
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
      <Card className="p-8 max-w-lg">
        <EmptyState icon={MessageSquare} title="Votre feedback apparaîtra ici après son envoi" description="Après votre première séance ou votre premier Check-in, le feedback de votre coach sera disponible sur cette page." />
      </Card>
    </div>
  );
};
