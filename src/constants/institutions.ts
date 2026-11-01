import { School, SchoolType, SCHOOLS, toSlug } from './schools';

export interface Institution {
  id: string;
  favoriteId: string;
  slug: string;
  acronym?: string;
  name: string;
  type: SchoolType;
  rawTypes: string[];
  campuses: School[];
  cities: string[];
  fields: string[];
  accessLevels: string[];
  admissionMethods: string[];
  degrees: string[];
  bacProfiles: string[];
  domains: string[];
  authorities: string[];
  sourceUrls: string[];
  isNetwork: boolean;
}

/**
 * Explicit, source-backed network mappings only. Generic faculty acronyms and
 * similarly named private schools are intentionally not grouped.
 */
export const VERIFIED_NETWORKS = {
  ENCG: { sourceCategory: 'ENCG', name: 'Écoles Nationales de Commerce et de Gestion' },
  ENSA: { sourceCategory: 'ENSA', name: 'Écoles Nationales des Sciences Appliquées' },
  ENSAM: { sourceCategory: 'ENSAM', name: 'Écoles Nationales Supérieures d’Arts et Métiers' },
  EST: { sourceCategory: 'EST', name: 'Écoles Supérieures de Technologie' },
  FST: { sourceCategory: 'FST', name: 'Facultés des Sciences et Techniques' },
  ENS: { sourceCategory: 'ENS / Éducation', name: 'Écoles Normales Supérieures' },
  ESEF: { sourceCategory: 'ESEF / Éducation', name: 'Écoles Supérieures de l’Éducation et de la Formation' },
  ENA: { sourceCategory: 'ENA Architecture', name: 'Écoles Nationales d’Architecture' },
} as const;

const unique = (values: Array<string | undefined>) => [...new Set(values.filter(Boolean) as string[])];

const buildInstitution = (id: string, name: string, acronym: string | undefined, campuses: School[], isNetwork: boolean): Institution => ({
  id,
  favoriteId: `institution:${id}`,
  slug: isNetwork ? toSlug(acronym || name) : campuses[0].slug,
  acronym,
  name,
  type: campuses.every((campus) => campus.type === 'private') ? 'private' : 'public',
  rawTypes: unique(campuses.map((campus) => campus.rawType)),
  campuses,
  cities: unique(campuses.map((campus) => campus.city)).sort((a, b) => a.localeCompare(b, 'fr')),
  fields: unique(campuses.flatMap((campus) => campus.fields)),
  accessLevels: unique(campuses.flatMap((campus) => campus.accessLevels)),
  admissionMethods: unique(campuses.flatMap((campus) => campus.admissionMethods)),
  degrees: unique(campuses.map((campus) => campus.degree)),
  bacProfiles: unique(campuses.map((campus) => campus.bacProfiles)),
  domains: unique(campuses.map((campus) => campus.domain)),
  authorities: unique(campuses.map((campus) => campus.authority)),
  sourceUrls: unique(campuses.map((campus) => campus.sourceUrl)),
  isNetwork,
});

const groupedCampusIds = new Set<string>();
const networkInstitutions = Object.entries(VERIFIED_NETWORKS).map(([acronym, config]) => {
  const campuses = SCHOOLS.filter((school) => school.network === config.sourceCategory);
  campuses.forEach((campus) => groupedCampusIds.add(campus.id));
  return buildInstitution(`network-${acronym.toLowerCase()}`, config.name, acronym, campuses, true);
}).filter((institution) => institution.campuses.length > 0);

const independentInstitutions = SCHOOLS
  .filter((school) => !groupedCampusIds.has(school.id))
  .map((school) => buildInstitution(`school-${school.id}`, school.name, school.acronym, [school], false));

export const INSTITUTIONS: Institution[] = [...networkInstitutions, ...independentInstitutions]
  .sort((a, b) => (a.acronym || a.name).localeCompare(b.acronym || b.name, 'fr'));

export const INSTITUTION_CITIES = unique(INSTITUTIONS.flatMap((institution) => institution.cities)).sort((a, b) => a.localeCompare(b, 'fr'));
export const INSTITUTION_FIELDS = unique(INSTITUTIONS.flatMap((institution) => institution.fields)).sort((a, b) => a.localeCompare(b, 'fr'));
export const INSTITUTION_DEGREES = unique(INSTITUTIONS.flatMap((institution) => institution.degrees)).sort((a, b) => a.localeCompare(b, 'fr'));

export interface InstitutionFilters {
  query: string;
  types: SchoolType[];
  cities: string[];
  fields: string[];
  degrees: string[];
}

export const EMPTY_INSTITUTION_FILTERS: InstitutionFilters = { query: '', types: [], cities: [], fields: [], degrees: [] };

const normalize = (value: string | undefined) => String(value || '').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const matchingCampuses = (institution: Institution, filters: InstitutionFilters): School[] => {
  const query = normalize(filters.query.trim());
  const institutionMatchesQuery = !query || [institution.name, institution.acronym, ...institution.domains, ...institution.degrees, ...institution.bacProfiles]
    .some((value) => normalize(value).includes(query));

  return institution.campuses.filter((campus) => {
    if (filters.types.length && !filters.types.includes(campus.type)) return false;
    if (filters.cities.length && !filters.cities.includes(campus.city)) return false;
    if (filters.fields.length && !filters.fields.some((field) => campus.fields.includes(field))) return false;
    if (filters.degrees.length && (!campus.degree || !filters.degrees.includes(campus.degree))) return false;
    if (query && !institutionMatchesQuery) {
      const campusHaystack = [campus.name, campus.acronym, campus.city, campus.domain, campus.degree, campus.bacProfiles, ...campus.fields].map(normalize);
      if (!campusHaystack.some((value) => value.includes(query))) return false;
    }
    return true;
  });
};

export const filterInstitutions = (institutions: Institution[], filters: InstitutionFilters) =>
  institutions.filter((institution) => matchingCampuses(institution, filters).length > 0);

export const getInstitutionBySlug = (slug: string | undefined) => INSTITUTIONS.find((institution) => institution.slug === slug);
