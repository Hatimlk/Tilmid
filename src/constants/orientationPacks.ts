import { Info, FlaskConical, TrendingUp, Crown } from 'lucide-react';

export type OrientationPackTrack = 'universal' | 'science' | 'eco';
export type OrientationPackTier = 'info' | 'normal' | 'complet';

export interface OrientationPackDef {
  name: string;
  price: string;
  audience: string;
  track: OrientationPackTrack;
  tier: OrientationPackTier;
  idealFor?: string;
  badge?: string;
  icon: typeof Info;
  features: string[];
  positioning: string;
}

export const ORIENTATION_PACKS: OrientationPackDef[] = [
  {
    name: 'Pack Info',
    price: '500 DH',
    audience: 'Toutes filières',
    track: 'universal',
    tier: 'info',
    idealFor: 'Idéal pour les élèves autonomes qui veulent gérer eux-mêmes leurs candidatures sans rater les dates importantes.',
    icon: Info,
    features: [
      "Alertes d'ouverture des inscriptions",
      'Dates limites et calendrier des concours',
      'Informations sur les écoles et formations',
      "Conditions d'accès et critères d'admission",
      "Annonces des résultats et listes d'attente",
      'Alertes bourses et opportunités',
      "Conseiller WhatsApp pour les questions d'orientation",
      'Suivi des nouveautés jusqu\'à la fin de la période des concours',
    ],
    positioning: 'Toutes les informations essentielles pour gérer vous-même vos candidatures.',
  },
  {
    name: 'Pack Science Normal',
    price: '1 500 DH',
    audience: 'PC, SM, SVT, STE, STM…',
    track: 'science',
    tier: 'normal',
    icon: FlaskConical,
    features: [
      'Tout le Pack Info',
      'Sélection des écoles adaptées au profil de l\'élève',
      'Accès à une sélection d\'écoles scientifiques et techniques',
      'Assistance aux inscriptions aux concours',
      'Vérification des documents administratifs',
      'Suivi des candidatures et dates limites',
      'Alertes concernant concours et résultats',
      'Accompagnement pour les écoles publiques et privées',
      'Conseiller dédié via WhatsApp',
      'Suivi jusqu\'aux résultats d\'admission',
    ],
    positioning: 'Nous vous accompagnons dans vos inscriptions aux principales écoles scientifiques et techniques.',
  },
  {
    name: 'Pack Science Complet',
    price: '2 300 DH',
    audience: 'PC, SM, SVT…',
    track: 'science',
    tier: 'complet',
    badge: 'Le plus demandé',
    icon: Crown,
    features: [
      'Tout le Pack Science Normal',
      'Analyse complète du profil et des notes de l\'élève',
      'Élaboration d\'une stratégie de candidatures',
      'Sélection personnalisée des écoles prioritaires',
      'Inscription prise en charge de A à Z',
      'Vérification complète des documents',
      'Suivi simultané de toutes les candidatures',
      'Suivi des concours, présélections et listes d\'attente',
      'Conseiller personnel dédié',
      'Communication directe via WhatsApp',
      'Relances et suivi des résultats',
      'Accompagnement dans le choix entre plusieurs admissions',
      'Suivi jusqu\'à l\'inscription définitive dans l\'établissement',
    ],
    positioning: 'Notre accompagnement premium : nous prenons en charge vos candidatures de A à Z jusqu\'à votre inscription finale.',
  },
  {
    name: 'Pack Eco Normal',
    price: '1 000 DH',
    audience: 'ECO, SGC…',
    track: 'eco',
    tier: 'normal',
    icon: TrendingUp,
    features: [
      'Tout le Pack Info',
      'Sélection des écoles adaptées au profil de l\'élève',
      'Accompagnement pour les écoles d\'économie, commerce et gestion',
      'Assistance aux inscriptions',
      'Vérification des dossiers administratifs',
      'Suivi des candidatures dans plusieurs établissements',
      'Gestion des dates limites d\'inscription',
      'Préparation et informations pour ENCG, ISCAE, FEG, EST, BTS, etc.',
      'Conseiller dédié via WhatsApp',
      'Suivi jusqu\'aux résultats d\'admission',
    ],
    positioning: 'Un accompagnement spécialisé pour les études de commerce, économie et gestion.',
  },
  {
    name: 'Pack Eco Complet',
    price: '1 800 DH',
    audience: 'ECO, SGC…',
    track: 'eco',
    tier: 'complet',
    badge: 'Recommandé',
    icon: Crown,
    features: [
      'Tout le Pack Eco Normal',
      'Analyse complète du profil et des notes de l\'élève',
      'Élaboration d\'une stratégie de candidatures',
      'Sélection personnalisée des écoles prioritaires (ENCG, ISCAE, FEG, EST, BTS…)',
      'Inscription prise en charge de A à Z',
      'Vérification complète des documents',
      'Suivi simultané de toutes les candidatures',
      'Suivi des concours, présélections et listes d\'attente',
      'Conseiller personnel dédié',
      'Communication directe via WhatsApp',
      'Relances et suivi des résultats',
      'Accompagnement dans le choix entre plusieurs admissions',
      'Suivi jusqu\'à l\'inscription définitive dans l\'établissement',
    ],
    positioning: 'Notre accompagnement premium pour les études de commerce, économie et gestion : nous prenons en charge vos candidatures de A à Z jusqu\'à votre inscription finale.',
  },
];
