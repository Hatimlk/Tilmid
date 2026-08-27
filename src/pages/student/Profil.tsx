import React from 'react';
import { User, GraduationCap, Package, Globe, ShieldCheck, LogOut } from 'lucide-react';
import { Student } from '../../types';
import { Entitlements, PACKAGE_TONE } from '../../utils/entitlements';
import { PageHeader, Card, PackageBadge } from '../../components/student/primitives';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

const INCLUDED_BY_PACKAGE: Record<string, string[]> = {
  Essentiel: ['Plateforme', 'Contenus & outils', 'Accompagnement collectif'],
  Boost: ['Plateforme', 'Contenus & outils', 'Accompagnement collectif', '1 coaching individuel', 'Plan 30 jours', '1 Check-in'],
  Premium: ['Plateforme', 'Contenus & outils', 'Accompagnement collectif', '3 coachings individuels', 'Plan 90 jours', 'Check-ins toutes les 2 semaines', 'Rapport final'],
};

export const Profil: React.FC<{ student: Student; entitlements: Entitlements; onLogout: () => void }> = ({ student, entitlements, onLogout }) => {
  const tone = student.package ? PACKAGE_TONE[student.package] : null;

  return (
    <div>
      <PageHeader title="Mon profil" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-primary" />
            <p className="font-black text-slate-900 text-[14px]">Informations personnelles</p>
          </div>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-slate-400 text-[13px] font-semibold">Nom</dt><dd className="text-slate-800 text-[13px] font-bold">{student.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400 text-[13px] font-semibold">Identifiant</dt><dd className="text-slate-800 text-[13px] font-bold" dir="ltr">{student.username}</dd></div>
          </dl>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap size={16} className="text-primary" />
            <p className="font-black text-slate-900 text-[14px]">Parcours scolaire</p>
          </div>
          <dl className="space-y-3">
            <div className="flex justify-between"><dt className="text-slate-400 text-[13px] font-semibold">Niveau</dt><dd className="text-slate-800 text-[13px] font-bold">{student.grade}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400 text-[13px] font-semibold">Statut</dt><dd className="text-emerald-600 text-[13px] font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Actif</dd></div>
          </dl>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-primary" />
              <p className="font-black text-slate-900 text-[14px]">Ma formule</p>
            </div>
            {student.package && tone && <PackageBadge label={entitlements.label} tone={tone} />}
          </div>
          {student.package ? (
            <div>
              <p className="text-slate-500 text-[13px] font-medium mb-4">Inclus dans votre formule :</p>
              <div className="flex flex-wrap gap-2">
                {(INCLUDED_BY_PACKAGE[entitlements.label] || []).map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-[12px] font-bold">{item}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-[13px] font-medium">Aucune formule Mouwakaba active sur votre compte.</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={16} className="text-primary" />
            <p className="font-black text-slate-900 text-[14px]">Langue</p>
          </div>
          <LanguageSwitcher />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={16} className="text-primary" />
            <p className="font-black text-slate-900 text-[14px]">Sécurité</p>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-red-50 text-red-600 rounded-xl font-bold text-[13px] hover:bg-red-100 transition-colors">
            <LogOut size={15} /> Se déconnecter
          </button>
        </Card>
      </div>
    </div>
  );
};
