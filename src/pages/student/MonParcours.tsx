import React from 'react';
import { Student } from '../../types';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, JourneyTimeline, JourneyStepDef, EmptyState } from '../../components/student/primitives';
import { useSelfGuidedPlan, useCheckIns } from '../../hooks/useStudentData';
import { Compass } from 'lucide-react';

export const MonParcours: React.FC<{ student: Student; entitlements: Entitlements }> = ({ student, entitlements }) => {
  const plan = useSelfGuidedPlan(student.username);
  const checkIns = useCheckIns(student.username);
  const hasPlan = plan.record.actions.length > 0;
  const planDone = plan.record.actions.filter((a) => a.done).length;
  const planTotal = plan.record.actions.length;
  const planApplied = planTotal > 0 && planDone === planTotal;

  let steps: JourneyStepDef[] = [];

  if (!entitlements.hasCoachingPack) {
    return (
      <div>
        <PageHeader title="Mon parcours" subtitle="Visualisez où vous en êtes, ce que vous avez déjà accompli et vos prochaines étapes." />
        <Card className="p-8">
          <EmptyState icon={Compass} title="Aucun parcours Mouwakaba actif" description="Votre parcours s'affichera ici une fois une formule Mouwakaba activée sur votre compte." />
        </Card>
      </div>
    );
  }

  if (entitlements.label === 'Essentiel') {
    steps = [
      { label: 'Diagnostic personnel', state: hasPlan ? 'done' : 'active' },
      { label: 'Module Organisation', state: hasPlan ? 'active' : 'upcoming' },
      { label: 'Programme hebdomadaire', state: 'upcoming' },
      { label: 'Techniques de révision', state: 'upcoming' },
      { label: 'Gestion de la procrastination', state: 'upcoming' },
      { label: 'Préparation aux examens', state: 'upcoming' },
      { label: 'Bilan personnel', state: 'upcoming' },
    ];
  } else if (entitlements.label === 'Boost') {
    steps = [
      { label: 'Diagnostic', state: 'done' },
      { label: 'Coaching individuel', state: 'active' },
      { label: 'Plan 30 jours', state: hasPlan ? (planApplied ? 'done' : 'active') : 'upcoming' },
      { label: 'Check-in J+14', state: checkIns.items.length > 0 ? 'done' : 'upcoming' },
      { label: 'Feedback', state: 'upcoming' },
      { label: 'Bilan personnel', state: 'upcoming' },
    ];
  } else {
    steps = [
      { label: 'Diagnostic initial', state: 'done' },
      { label: 'Séance 01 — Construction du système', state: 'active' },
      { label: "Phase d'application", state: hasPlan ? 'active' : 'upcoming' },
      { label: 'Check-in', state: checkIns.items.length > 0 ? 'done' : 'upcoming' },
      { label: 'Séance 02 — Ajustements', state: 'upcoming' },
      { label: 'Check-in', state: 'upcoming' },
      { label: 'Phase de consolidation', state: 'upcoming' },
      { label: 'Check-in', state: 'upcoming' },
      { label: 'Séance 03 — Bilan & autonomie', state: 'upcoming' },
      { label: 'Rapport final', state: 'upcoming' },
    ];
  }

  return (
    <div>
      <PageHeader title="Mon parcours" subtitle="Visualisez où vous en êtes, ce que vous avez déjà accompli et vos prochaines étapes." />
      <Card className="p-6 md:p-8 max-w-2xl">
        <JourneyTimeline steps={steps} />
      </Card>
    </div>
  );
};
