import { LawItem, SearchFilters } from '../types';

export interface IndexedLaw {
  law: LawItem;
  id: string;
  normalizedQueryString: string;
  categoryId: string;
  stateApplicability: string;
  isBailable: boolean;
  isCognizable: boolean;
  featured: boolean;
  viewCount: number;
}

// In-memory index of laws for O(1) lookups and ultra-fast filtering
let cachedSourceLaws: LawItem[] | null = null;
let cachedIndexedLaws: IndexedLaw[] | null = null;
const queryResultCache = new Map<string, LawItem[]>();
const MAX_CACHE_SIZE = 120;

export function invalidateSearchCache(): void {
  cachedSourceLaws = null;
  cachedIndexedLaws = null;
  queryResultCache.clear();
}

export function buildSearchIndex(laws: LawItem[]): IndexedLaw[] {
  if (cachedIndexedLaws && cachedSourceLaws === laws && cachedIndexedLaws.length === laws.length) {
    return cachedIndexedLaws;
  }

  // Clear query cache when laws collection changes
  if (cachedSourceLaws !== laws) {
    queryResultCache.clear();
  }
  cachedSourceLaws = laws;

  cachedIndexedLaws = laws.map(law => {
    const tokens = [
      law.section_number,
      law.section_title,
      law.act_name,
      law.short_act || '',
      ...law.keywords,
      law.simple_explanation,
      law.punishment,
      law.fine,
      law.court_triable || '',
      law.actions_covered ? law.actions_covered.join(' ') : ''
    ].join(' ').toLowerCase();

    return {
      law,
      id: law.id,
      normalizedQueryString: tokens,
      categoryId: law.category_id,
      stateApplicability: law.state_applicability.toLowerCase(),
      isBailable: law.is_bailable,
      isCognizable: law.is_cognizable,
      featured: Boolean(law.featured),
      viewCount: law.view_count || 0
    };
  });

  return cachedIndexedLaws;
}

/**
 * Filter laws with instant indexed substring search and cached query results.
 */
export function searchIndexedLaws(
  laws: LawItem[],
  filters: SearchFilters
): LawItem[] {
  const index = buildSearchIndex(laws);
  const cacheKey = `${filters.query || ''}|${filters.category_id || 'all'}|${filters.bailable || 'all'}|${filters.cognizable || 'all'}|${filters.state || 'all'}`;

  const cached = queryResultCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const queryClean = filters.query ? filters.query.trim().toLowerCase() : '';
  const catFilter = filters.category_id && filters.category_id !== 'all' ? filters.category_id : null;
  const stateFilter = filters.state && filters.state !== 'all' && filters.state !== 'All India' 
    ? filters.state.toLowerCase() 
    : null;
  const bailFilter = filters.bailable && filters.bailable !== 'all' ? filters.bailable : null;
  const cogFilter = filters.cognizable && filters.cognizable !== 'all' ? filters.cognizable : null;

  // Split query into terms for multi-word precision
  const terms = queryClean ? queryClean.split(/\s+/).filter(Boolean) : [];

  const results: LawItem[] = [];

  for (let i = 0; i < index.length; i++) {
    const item = index[i];

    // Category filter
    if (catFilter && item.categoryId !== catFilter) {
      continue;
    }

    // State filter
    if (stateFilter) {
      if (item.stateApplicability !== 'all india' && !item.stateApplicability.includes(stateFilter)) {
        continue;
      }
    }

    // Bailable filter
    if (bailFilter) {
      if (bailFilter === 'bailable' && !item.isBailable) continue;
      if (bailFilter === 'non-bailable' && item.isBailable) continue;
    }

    // Cognizable filter
    if (cogFilter) {
      if (cogFilter === 'cognizable' && !item.isCognizable) continue;
      if (cogFilter === 'non-cognizable' && item.isCognizable) continue;
    }

    // Query terms match (all terms must be present)
    if (terms.length > 0) {
      let matches = true;
      for (let t = 0; t < terms.length; t++) {
        if (!item.normalizedQueryString.includes(terms[t])) {
          matches = false;
          break;
        }
      }
      if (!matches) continue;
    }

    results.push(item.law);
  }

  // Cache result for quick backspace / re-navigation
  if (queryResultCache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry
    const firstKey = queryResultCache.keys().next().value;
    if (firstKey) queryResultCache.delete(firstKey);
  }
  queryResultCache.set(cacheKey, results);

  return results;
}
