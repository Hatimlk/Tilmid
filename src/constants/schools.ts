import schoolsDataset from '../data/ecoles_superieures_maroc_2026_complet.json';

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

export const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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
  network?: string;
  authority?: string;
  domain?: string;
  degree?: string;
  bacProfiles?: string;
  deadline2026?: string;
  contestStatus2026?: string;
  sourceUrl?: string;
  contestSourceUrl?: string;
  verificationLevel?: string;
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

interface RawSchoolRecord {
  'Établissement': string;
  'Sigle': string;
  'Réseau / catégorie': string;
  'Statut': string;
  'Université / tutelle': string;
  'Ville': string;
  'Domaine principal': string;
  'Diplôme / niveau': string;
  "Mode d'accès": string;
  'Bacs / profils': string;
  'Date limite 2026': string;
  'Statut concours 2026': string;
  'Source principale': string;
  'Source concours': string;
  'Niveau de vérification': string;
}

interface SchoolsDataset {
  generated_on: string;
  count: number;
  scope: string;
  sources: string[];
  data: RawSchoolRecord[];
}

const dataset = schoolsDataset as SchoolsDataset;

const inferFields = (domain: string): string[] => {
  const value = domain.toLocaleLowerCase('fr');
  const fields = new Set<string>();
  if (/ingén|industrie|génie|technique|travaux publics|textile/.test(value)) fields.add('Ingénierie');
  if (/informatique|digital|numérique|intelligence artificielle|\bia\b/.test(value)) fields.add('Informatique & Digital');
  if (/médec|santé|pharma|dentaire|infirm/.test(value)) fields.add('Médecine & Santé');
  if (/commerce|gestion|business|management|finance|marketing/.test(value)) fields.add('Commerce & Management');
  if (/architecture|design|urbanisme/.test(value)) fields.add('Architecture');
  if (/science|chimie|physique|math|biologie/.test(value)) fields.add('Sciences');
  if (/agro|agri|vétérinaire/.test(value)) fields.add('Agriculture & Vétérinaire');
  if (/économie|statistique/.test(value)) fields.add('Économie & Statistique');
  if (fields.size === 0) fields.add('Sciences');
  return [...fields];
};

const inferAccessLevels = (degree: string, admission: string): string[] => {
  const value = `${degree} ${admission}`.toLocaleLowerCase('fr');
  const levels = new Set<string>();
  if (/bac\s*\+?\s*2|prépa|\bcnc\b|deug|dut|deust/.test(value)) levels.add('Bac +2');
  if (/master|bac\s*\+?\s*3|licence/.test(value)) levels.add('Master');
  if (levels.size === 0 || /après le bac|post.?bac|bachelier/.test(value)) levels.add('Après le bac');
  return [...levels];
};

const inferAdmissionMethods = (admission: string): string[] => {
  const value = admission.toLocaleLowerCase('fr');
  const methods = new Set<string>();
  if (/concours|tafem|\bcnc\b|test/.test(value)) methods.add('Concours');
  if (/dossier/.test(value)) methods.add('Dossier');
  if (/sélection|admission|orientation/.test(value)) methods.add('Sélection');
  if (methods.size === 0) methods.add('Sélection');
  return [...methods];
};

export const SCHOOL_DATASET_META = {
  generatedOn: dataset.generated_on,
  count: dataset.count,
  scope: dataset.scope,
  sources: dataset.sources,
};

export const SCHOOLS: School[] = dataset.data.map((row, index) => ({
  id: String(index + 1),
  slug: toSlug(`${row.Sigle || row.Établissement}-${row.Ville}`),
  name: row.Établissement,
  acronym: row.Sigle || undefined,
  type: row.Statut.toLocaleLowerCase('fr').includes('priv') ? 'private' : 'public',
  city: row.Ville || 'Non renseignée',
  fields: inferFields(row['Domaine principal']),
  accessLevels: inferAccessLevels(row['Diplôme / niveau'], row["Mode d'accès"]),
  admissionMethods: inferAdmissionMethods(row["Mode d'accès"]),
  network: row['Réseau / catégorie'] || undefined,
  authority: row['Université / tutelle'] || undefined,
  domain: row['Domaine principal'] || undefined,
  degree: row['Diplôme / niveau'] || undefined,
  bacProfiles: row['Bacs / profils'] || undefined,
  deadline2026: row['Date limite 2026'] || undefined,
  contestStatus2026: row['Statut concours 2026'] || undefined,
  sourceUrl: row['Source principale'] || undefined,
  contestSourceUrl: row['Source concours'] || undefined,
  verificationLevel: row['Niveau de vérification'] || undefined,
}));

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

/**
 * Profile-vs-school compatibility score. Purely a transparent overlap between
 * what the visitor tells us they want and this school's real, known attributes
 * — never a prediction of admission chances or a fabricated "selectivity" figure.
 */
export interface SchoolProfile {
  field?: string;
  city?: string;
  accessLevel?: string;
  type?: SchoolType;
}

export interface MatchCheck {
  label: string;
  met: boolean;
}

export interface MatchResult {
  pct: number;
  checks: MatchCheck[];
}

/** Brief: "the score should only be displayed when enough profile data exists." */
export const MIN_MATCH_DIMENSIONS = 2;

export const computeMatch = (school: School, profile: SchoolProfile): MatchResult | null => {
  const checks: MatchCheck[] = [];
  if (profile.field) checks.push({ label: `Filière : ${profile.field}`, met: school.fields.includes(profile.field) });
  if (profile.city) checks.push({ label: `Ville : ${profile.city}`, met: school.city === profile.city });
  if (profile.accessLevel) checks.push({ label: `Niveau : ${profile.accessLevel}`, met: school.accessLevels.includes(profile.accessLevel) });
  if (profile.type) checks.push({ label: profile.type === 'public' ? 'École publique' : 'École privée', met: school.type === profile.type });

  if (checks.length < MIN_MATCH_DIMENSIONS) return null;
  const met = checks.filter((c) => c.met).length;
  return { pct: Math.round((met / checks.length) * 100), checks };
};
