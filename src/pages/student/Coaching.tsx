import React from 'react';
import { Users, MessageCircle, Calendar } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState, EmptyState } from '../../components/student/primitives';

export const Coaching: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
  if (entitlements.coachingSessions === 0) {
    return (
      <div>
        <PageHeader title="Mes séances de coaching" />
        <LockedState
          title="Les séances individuelles ne sont pas incluses dans votre formule"
          description={
            entitlements.hasCoachingPack
              ? 'Votre Pack Essentiel comprend les contenus, outils et accompagnements collectifs.'
              : "Aucune formule Mouwakaba n'est active sur votre compte."
          }
          cta={{ label: 'Découvrir Boost', onClick: () => window.open('/coaching-offer', '_blank') }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Mes séances de coaching" subtitle={`Votre formule ${entitlements.label} inclut ${entitlements.coachingSessions} séance${entitlements.coachingSessions > 1 ? 's' : ''} individuelle${entitlements.coachingSessions > 1 ? 's' : ''} de 45 minutes.`} />
      <Card className="p-8 max-w-lg">
        <EmptyState
          icon={Calendar}
          title="Aucune séance programmée"
          description="Contactez votre coach pour planifier votre première séance de coaching."
          cta={{ label: 'Planifier sur WhatsApp', href: 'https://wa.me/212703749901' }}
        />
      </Card>
      {entitlements.priorityBooking && (
        <p className="mt-4 text-[12.5px] font-bold text-purple-600 flex items-center gap-1.5">
          <Users size={13} /> Votre formule Premium bénéficie d'une priorité de réservation pour vos séances.
        </p>
      )}
    </div>
  );
};
