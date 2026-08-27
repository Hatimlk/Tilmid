/**
 * Static directory of well-known Moroccan higher-education institutions.
 *
 * Scope discipline: every field below is either publicly well-known
 * (name, city, public/private status, broad field of study, general
 * admission route) or intentionally omitted. We do NOT include tuition
 * amounts, deadlines, rankings, acceptance rates or program-level detail —
 * those vary by year and by program and would require live verification
 * we don't have. Missing fields render as "Information non disponible"
 * wherever they're shown, rather than being guessed.
 */

export type SchoolType = 'public' | 'private';

export interface School {
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  type: SchoolType;
  city: string;
  fields: string[];
  accessLevels: string[];
  admissionMethods: string[];
}

export const FIELDS = [
  'Ingénierie',
  'Informatique & Digital',
  'Médecine & Santé',
  'Commerce & Management',
  'Architecture',
  'Sciences',
  'Agriculture & Vétérinaire',
  'Économie & Statistique',
] as const;

export const ACCESS_LEVELS = ['Après le bac', 'Bac +2', 'Master'] as const;

export const ADMISSION_METHODS = ['Concours', 'Dossier', 'Sélection'] as const;

export const SCHOOLS: School[] = [
  { id: '1', slug: 'emi-rabat', name: "École Mohammadia d'Ingénieurs", acronym: 'EMI', type: 'public', city: 'Rabat', fields: ['Ingénierie'], accessLevels: ['Bac +2'], admissionMethods: ['Concours'] },
  { id: '2', slug: 'ensias-rabat', name: 'École Nationale Supérieure d\'Informatique et d\'Analyse des Systèmes', acronym: 'ENSIAS', type: 'public', city: 'Rabat', fields: ['Informatique & Digital', 'Ingénierie'], accessLevels: ['Après le bac', 'Bac +2'], admissionMethods: ['Concours'] },
  { id: '3', slug: 'inpt-rabat', name: 'Institut National des Postes et Télécommunications', acronym: 'INPT', type: 'public', city: 'Rabat', fields: ['Ingénierie', 'Informatique & Digital'], accessLevels: ['Bac +2'], admissionMethods: ['Concours'] },
  { id: '4', slug: 'ehtp-casablanca', name: 'École Hassania des Travaux Publics', acronym: 'EHTP', type: 'public', city: 'Casablanca', fields: ['Ingénierie'], accessLevels: ['Bac +2'], admissionMethods: ['Concours'] },
  { id: '5', slug: 'ensa-rabat', name: 'École Nationale des Sciences Appliquées de Rabat', acronym: 'ENSA Rabat', type: 'public', city: 'Rabat', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '6', slug: 'ensa-casablanca', name: 'École Nationale des Sciences Appliquées de Casablanca', acronym: 'ENSA Casablanca', type: 'public', city: 'Casablanca', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '7', slug: 'ensa-marrakech', name: 'École Nationale des Sciences Appliquées de Marrakech', acronym: 'ENSA Marrakech', type: 'public', city: 'Marrakech', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '8', slug: 'ensa-fes', name: 'École Nationale des Sciences Appliquées de Fès', acronym: 'ENSA Fès', type: 'public', city: 'Fès', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '9', slug: 'ensa-tanger', name: 'École Nationale des Sciences Appliquées de Tanger', acronym: 'ENSA Tanger', type: 'public', city: 'Tanger', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '10', slug: 'ensa-agadir', name: 'École Nationale des Sciences Appliquées d\'Agadir', acronym: 'ENSA Agadir', type: 'public', city: 'Agadir', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '11', slug: 'ensa-kenitra', name: 'École Nationale des Sciences Appliquées de Kénitra', acronym: 'ENSA Kénitra', type: 'public', city: 'Kénitra', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '12', slug: 'encg-casablanca', name: 'École Nationale de Commerce et de Gestion de Casablanca', acronym: 'ENCG Casablanca', type: 'public', city: 'Casablanca', fields: ['Commerce & Management'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '13', slug: 'encg-rabat', name: 'École Nationale de Commerce et de Gestion de Rabat', acronym: 'ENCG Rabat', type: 'public', city: 'Rabat', fields: ['Commerce & Management'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '14', slug: 'encg-agadir', name: 'École Nationale de Commerce et de Gestion d\'Agadir', acronym: 'ENCG Agadir', type: 'public', city: 'Agadir', fields: ['Commerce & Management'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '15', slug: 'encg-settat', name: 'École Nationale de Commerce et de Gestion de Settat', acronym: 'ENCG Settat', type: 'public', city: 'Settat', fields: ['Commerce & Management'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '16', slug: 'encg-tanger', name: 'École Nationale de Commerce et de Gestion de Tanger', acronym: 'ENCG Tanger', type: 'public', city: 'Tanger', fields: ['Commerce & Management'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '17', slug: 'iscae-casablanca', name: 'Institut Supérieur de Commerce et d\'Administration des Entreprises', acronym: 'ISCAE', type: 'public', city: 'Casablanca', fields: ['Commerce & Management'], accessLevels: ['Après le bac', 'Bac +2'], admissionMethods: ['Concours'] },
  { id: '18', slug: 'ena-rabat', name: 'École Nationale d\'Architecture', acronym: 'ENA', type: 'public', city: 'Rabat', fields: ['Architecture'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '19', slug: 'iav-hassan2-rabat', name: 'Institut Agronomique et Vétérinaire Hassan II', acronym: 'IAV Hassan II', type: 'public', city: 'Rabat', fields: ['Agriculture & Vétérinaire'], accessLevels: ['Après le bac', 'Bac +2'], admissionMethods: ['Concours'] },
  { id: '20', slug: 'insea-rabat', name: 'Institut National de Statistique et d\'Économie Appliquée', acronym: 'INSEA', type: 'public', city: 'Rabat', fields: ['Économie & Statistique', 'Sciences'], accessLevels: ['Après le bac', 'Bac +2'], admissionMethods: ['Concours'] },
  { id: '21', slug: 'fmp-rabat', name: 'Faculté de Médecine et de Pharmacie de Rabat', acronym: 'FMP Rabat', type: 'public', city: 'Rabat', fields: ['Médecine & Santé'], accessLevels: ['Après le bac'], admissionMethods: ['Sélection'] },
  { id: '22', slug: 'fmp-casablanca', name: 'Faculté de Médecine et de Pharmacie de Casablanca', acronym: 'FMP Casablanca', type: 'public', city: 'Casablanca', fields: ['Médecine & Santé'], accessLevels: ['Après le bac'], admissionMethods: ['Sélection'] },
  { id: '23', slug: 'esith-casablanca', name: 'École Supérieure des Industries du Textile et de l\'Habillement', acronym: 'ESITH', type: 'public', city: 'Casablanca', fields: ['Ingénierie'], accessLevels: ['Après le bac'], admissionMethods: ['Concours'] },
  { id: '24', slug: 'hem-casablanca', name: 'Institut des Hautes Études de Management', acronym: 'HEM', type: 'private', city: 'Casablanca', fields: ['Commerce & Management'], accessLevels: ['Après le bac'], admissionMethods: ['Dossier'] },
  { id: '25', slug: 'uir-rabat', name: 'Université Internationale de Rabat', acronym: 'UIR', type: 'private', city: 'Rabat', fields: ['Ingénierie', 'Commerce & Management', 'Architecture'], accessLevels: ['Après le bac'], admissionMethods: ['Dossier'] },
  { id: '26', slug: 'um6p-benguerir', name: 'Université Mohammed VI Polytechnique', acronym: 'UM6P', type: 'private', city: 'Benguerir', fields: ['Ingénierie', 'Sciences', 'Agriculture & Vétérinaire'], accessLevels: ['Après le bac'], admissionMethods: ['Dossier', 'Concours'] },
];

export const CITIES = Array.from(new Set(SCHOOLS.map((s) => s.city))).sort((a, b) => a.localeCompare(b, 'fr'));

export const getFieldCounts = () => {
  const counts = new Map<string, number>();
  FIELDS.forEach((f) => counts.set(f, 0));
  SCHOOLS.forEach((s) => s.fields.forEach((f) => counts.set(f, (counts.get(f) || 0) + 1)));
  return counts;
};

export const getCityCounts = () => {
  const counts = new Map<string, number>();
  SCHOOLS.forEach((s) => counts.set(s.city, (counts.get(s.city) || 0) + 1));
  return counts;
};

export interface SchoolFilters {
  types: SchoolType[];
  cities: string[];
  fields: string[];
  accessLevels: string[];
  admissionMethods: string[];
  query: string;
}

export const EMPTY_FILTERS: SchoolFilters = {
  types: [],
  cities: [],
  fields: [],
  accessLevels: [],
  admissionMethods: [],
  query: '',
};

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const matchesQuery = (school: School, query: string): boolean => {
  if (!query.trim()) return true;
  const q = normalize(query);
  return (
    normalize(school.name).includes(q) ||
    (school.acronym ? normalize(school.acronym).includes(q) : false) ||
    normalize(school.city).includes(q) ||
    school.fields.some((f) => normalize(f).includes(q))
  );
};

export const filterSchools = (schools: School[], filters: SchoolFilters): School[] =>
  schools.filter((s) => {
    if (filters.types.length && !filters.types.includes(s.type)) return false;
    if (filters.cities.length && !filters.cities.includes(s.city)) return false;
    if (filters.fields.length && !filters.fields.some((f) => s.fields.includes(f))) return false;
    if (filters.accessLevels.length && !filters.accessLevels.some((a) => s.accessLevels.includes(a))) return false;
    if (filters.admissionMethods.length && !filters.admissionMethods.some((a) => s.admissionMethods.includes(a))) return false;
    if (!matchesQuery(s, filters.query)) return false;
    return true;
  });

export interface SearchSuggestions {
  schools: School[];
  fields: string[];
  cities: string[];
}

export const getSuggestions = (query: string, limit = 5): SearchSuggestions => {
  const q = normalize(query.trim());
  if (!q) return { schools: [], fields: [], cities: [] };
  return {
    schools: SCHOOLS.filter((s) => normalize(s.name).includes(q) || (s.acronym && normalize(s.acronym).includes(q))).slice(0, limit),
    fields: FIELDS.filter((f) => normalize(f).includes(q)).slice(0, limit),
    cities: CITIES.filter((c) => normalize(c).includes(q)).slice(0, limit),
  };
};
