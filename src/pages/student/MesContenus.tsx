import React from 'react';
import { Link } from 'react-router-dom';
import { Target, CalendarDays, Zap, BookOpen, GraduationCap, PlayCircle } from 'lucide-react';
import { Entitlements } from '../../utils/entitlements';
import { PageHeader, Card, LockedState } from '../../components/student/primitives';

const MODULES = [
  { icon: Target, title: 'Faire le point & définir ses objectifs', desc: 'Diagnostic de votre situation actuelle et définition de vos objectifs.' },
  { icon: CalendarDays, title: 'Construire un planning efficace', desc: "Organisation et création d'un programme hebdomadaire." },
  { icon: Zap, title: 'Vaincre la procrastination', desc: 'Lutte contre la procrastination et les distractions.' },
  { icon: BookOpen, title: 'Réviser plus efficacement', desc: "Techniques de révision et d'apprentissage." },
  { icon: GraduationCap, title: 'Préparer les examens & gérer la pression', desc: 'Préparation aux examens et gestion de la pression.' },
];

export const MesContenus: React.FC<{ entitlements: Entitlements }> = ({ entitlements }) => {
  if (!entitlements.learningContent) {
    return (
      <div>
        <PageHeader title="Mes contenus" />
        <LockedState
          title="Aucun contenu actif"
          description="Les contenus Mouwakaba sont inclus avec les formules Essentiel, Boost et Premium."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Mes contenus" subtitle="Votre programme est organisé en 5 modules, dans l'ordre recommandé." />
      <div className="space-y-3">
        {MODULES.map((m, i) => (
          <Card key={m.title} className="p-5 flex items-center gap-4">
            <span className="w-11 h-11 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-black text-[13px]">
              0{i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 text-[14.5px]">{m.title}</p>
              <p className="text-slate-400 text-[12.5px] font-medium">{m.desc}</p>
            </div>
            <span className="shrink-0 text-[11.5px] font-bold text-slate-300 flex items-center gap-1.5">
              <PlayCircle size={14} /> Contenu à venir
            </span>
          </Card>
        ))}
      </div>
      <p className="text-slate-400 text-[12.5px] font-medium mt-6 text-center">
        Les vidéos de chaque module seront disponibles ici prochainement. En attendant, découvrez le programme complet sur{' '}
        <Link to="/coaching-offer" className="text-primary font-bold hover:underline">la page Mouwakaba</Link>.
      </p>
    </div>
  );
};
