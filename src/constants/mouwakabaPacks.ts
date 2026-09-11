export type PackTier = 'essentiel' | 'boost' | 'premium';

export interface PackDef {
  tier: PackTier;
  label: string;
  badge?: string;
  price: string;
  audience: string;
  smallLabel: string;
  supportLevel: 1 | 2 | 3;
  highlights: string[];
  duration: string;
  personalSupport: string;
  result: string;
  ctaLabel: string;
  microcopy: string;
}

export const PACKS: PackDef[] = [
  {
    tier: 'essentiel',
    label: 'Essentiel',
    price: '299 DH',
    audience: "Pour l'étudiant capable d'appliquer les méthodes de manière autonome, mais qui a besoin d'une structure claire, d'outils pratiques et de techniques modernes de révision.",
    smallLabel: 'Autonomie guidée',
    supportLevel: 1,
    highlights: [
      'Accès plateforme privée : sept. 2026 → juin 2027',
      'Bibliothèque de 10 vidéos essentielles',
      'Les 5 axes clés de la méthode Mouwakaba',
      'Outils pratiques prêts à l’emploi',
      'Groupe WhatsApp privé',
      'Session collective de 60 minutes',
    ],
    duration: 'Accès plateforme 10 mois',
    personalSupport: 'Accompagnement collectif',
    result: 'Une méthode claire et des outils pratiques pour éviter le travail désorganisé et construire un système de révision que vous pouvez appliquer de manière autonome.',
    ctaLabel: 'Choisir Essentiel',
    microcopy: 'Idéal pour construire votre propre système de travail.',
  },
  {
    tier: 'boost',
    label: 'Boost',
    badge: 'Le plus choisi',
    price: '599 DH',
    audience: "Pour l'étudiant qui a besoin d'un diagnostic personnel et d'un plan clair pour avancer vers son objectif scolaire ou professionnel avec des étapes organisées.",
    smallLabel: 'Accompagnement personnalisé',
    supportLevel: 2,
    highlights: [
      'Tout le Pack Essentiel',
      'Diagnostic personnalisé avant la séance',
      '1 séance de coaching individuel (45 min)',
      'Plan d’action personnalisé sur 30 jours',
      'Résumé écrit après la séance',
      '1 Check-in à 14 jours + feedback',
    ],
    duration: 'Plan personnalisé sur 30 jours',
    personalSupport: '1 séance individuelle + 1 Check-in',
    result: 'Vous repartez avec un diagnostic clair et un plan personnalisé sur 30 jours. Vous savez précisément quoi faire et comment mesurer votre progression.',
    ctaLabel: 'Choisir Boost',
    microcopy: 'Diagnostic personnel + plan d’action de 30 jours.',
  },
  {
    tier: 'premium',
    label: 'Premium',
    badge: 'Accompagnement complet',
    price: '999 DH',
    audience: "Pour l'étudiant qui a besoin d'un accompagnement individuel plus approfondi, d'un suivi de l'application et d'ajustements réguliers afin de construire un système stable et devenir progressivement plus autonome.",
    smallLabel: 'Suivi approfondi',
    supportLevel: 3,
    highlights: [
      'Tout Essentiel + Boost',
      'Accompagnement personnalisé sur 90 jours',
      '3 séances individuelles de coaching (45 min)',
      'Questionnaire de diagnostic détaillé',
      'Check-in toutes les 2 semaines + feedback',
      'Rapport final de progression',
    ],
    duration: '90 jours d’accompagnement',
    personalSupport: '3 séances individuelles + Check-ins bimensuels',
    result: 'Trois étapes individuelles pour planifier, suivre l’application, traiter les obstacles et ajuster la stratégie afin de construire progressivement une méthode de travail autonome et durable.',
    ctaLabel: 'Choisir Premium',
    microcopy: '90 jours d’accompagnement et de suivi personnalisé.',
  },
];

export const NOT_INCLUDED = [
  'Messages privés individuels',
  'Correction des exercices et matières scolaires',
  'Accompagnement individuel quotidien',
];

export const PREMIUM_JOURNEY = [
  { title: 'Diagnostic & construction du système', items: ['Analyse de la situation', "Définition de l'objectif", 'Construction du système personnel'] },
  { title: 'Suivi & ajustements', items: ["Évaluation de l'application", 'Identification des obstacles', 'Ajustement du plan'] },
  { title: 'Progression & autonomie', items: ['Mesure des résultats', "Préparation de l'étape suivante", "Construction de l'autonomie"] },
];

export const GRADE_OPTIONS = ['Tronc Commun', '1ère Bac', '2ème Bac', 'Étudiant(e)'];
