/**
 * LOTUS TUBES - High-Precision Product Search & Filter Engine
 *
 * Provides comprehensive multi-attribute search across the complete Lotus Tubes catalogue:
 * - Product Name & Title
 * - SKU / Part Number / ID / Slug
 * - Category & Subcategories
 * - Material Grade (SS 304, SS 316L, Hastelloy, Silicone, EPDM, PTFE, Viton)
 * - Surface Finish & Roughness (Electro Polished / EP, Mechanically Polished / MP, Mirror, Satin, Ra values)
 * - Engineering Standards & Certifications (ASTM A270, ASTM A269, ASME BPE, 3-A, SMS, DIN 11851, EN 10204 3.1)
 * - Sizes, Wall Thicknesses & Lengths (e.g. 1/2", 1.5", 2", Schedule 5S/10S/40S, 12.7mm to 101.6mm)
 * - Product Types, End Connections & Applications (TC Ferrules, Pull-Handle, Cavity-Filled, WFI Loops, CIP/SIP)
 * - Technical Synonyms & Common Industry Term Equivalencies
 *
 * Matching Capabilities:
 * - Multi-token matching (AND logic across tokens)
 * - Case-insensitive & whitespace-tolerant
 * - Punctuation & unit normalization (e.g. "tri-clamp" = "tri clamp" = "tc", "316l" = "316 l" = "ss316l")
 * - Partial substring matching on any word boundary
 */

/**
 * Normalizes strings by lowercasing, trimming, and standardizing common industrial punctuation.
 */
export function normalizeQuery(str = '') {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[,\-_/\\()+]/g, ' ') // replace punctuation with spaces
    .replace(/["']/g, '')           // remove quotes
    .replace(/\s+/g, ' ')          // collapse multiple spaces
    .trim();
}

/**
 * Common industry abbreviations & synonym expansions
 */
const SYNONYM_MAP = {
  'ep': ['electropolished', 'electro polished', 'electropolish', 'mirror ep', 'mirror'],
  'mp': ['mechanically polished', 'mechanical polish', 'satin'],
  'tc': ['tri clamp', 'tri-clamp', 'triclamp', 'ferrule', 'clamp', 'sanitary clamp'],
  'tri clamp': ['tc', 'ferrule', 'clamp', 'tri-clamp'],
  '316': ['316l', 'ss 316', 'ss316', 'ss 316l', 'ss316l', 'stainless 316'],
  '316l': ['316', 'ss 316', 'ss316', 'ss 316l', 'ss316l'],
  '304': ['304l', 'ss 304', 'ss304', 'stainless 304'],
  'valve': ['valves', 'butterfly', 'ball', 'diaphragm', 'sampling', 'check', 'non return'],
  'valves': ['valve', 'butterfly', 'ball', 'diaphragm', 'sampling', 'check', 'non return'],
  'pipe': ['tube', 'tubing', 'pipes', 'tubes', 'spool'],
  'pipes': ['tube', 'tubing', 'pipe', 'tubes', 'spool'],
  'tube': ['pipe', 'pipes', 'tubing', 'tubes'],
  'tubes': ['pipe', 'pipes', 'tubing', 'tube'],
  'bend': ['elbow', '90 degree', '45 degree', 'bends', 'elbows'],
  'elbow': ['bend', '90 bend', 'bends', 'elbows'],
  'tee': ['equal tee', 'reducing tee', 'tees'],
  'gasket': ['seal', 'silicone', 'epdm', 'ptfe', 'viton', 'o-ring'],
  'mirror': ['ep', 'electro polished', 'ra 0.38', 'ra 0.4'],
  'satin': ['mp', 'mechanically polished', 'ra 0.8']
};

/**
 * Builds a comprehensive search index string for a product
 */
export function buildProductSearchIndex(product) {
  if (!product) return '';

  const parts = [
    product.name || '',
    product.sku || '',
    product.id || '',
    product.slug || '',
    product.category || '',
    product.categorySlug || '',
    product.material || '',
    product.finish || '',
    product.roughness || '',
    product.standard || '',
    product.connection || '',
    product.sizes || '',
    product.wallThickness || '',
    product.length || '',
    product.mtc || '',
    product.manufacturingType || '',
    product.availability || '',
    product.overview || '',
    ...(Array.isArray(product.applications) ? product.applications : []),
    ...(Array.isArray(product.seo?.keywords) ? product.seo.keywords : []),
    product.seo?.title || '',
    product.seo?.metaDescription || ''
  ];

  return normalizeQuery(parts.join(' '));
}

/**
 * Determines whether a product matches a given search query
 */
export function matchesSearchQuery(product, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return true;

  const normalized = normalizeQuery(rawQuery);
  if (!normalized) return true;

  const tokens = normalized.split(' ').filter(Boolean);
  if (tokens.length === 0) return true;

  const searchIndex = buildProductSearchIndex(product);

  // Every token in the query must match either directly or via industry synonyms
  return tokens.every((token) => {
    // 1. Direct substring match
    if (searchIndex.includes(token)) return true;

    // 2. Check synonyms
    const synonyms = SYNONYM_MAP[token];
    if (synonyms && synonyms.some((syn) => searchIndex.includes(normalizeQuery(syn)))) {
      return true;
    }

    return false;
  });
}

/**
 * Filters and sorts products using search query, category, material, finish, standard, and sort criteria.
 */
export function filterAndSearchProducts(products = [], filters = {}) {
  const {
    searchTerm = '',
    selectedCategory = 'all',
    selectedMaterial = 'all',
    selectedFinish = 'all',
    selectedStandard = 'all',
    sortBy = 'featured'
  } = filters;

  return products
    .filter((product) => {
      // 1. Search Query Filter
      if (searchTerm.trim() && !matchesSearchQuery(product, searchTerm)) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory && selectedCategory !== 'all') {
        const catMatch =
          product.categorySlug === selectedCategory ||
          product.category?.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // 3. Material Grade Filter
      if (selectedMaterial && selectedMaterial !== 'all') {
        if (selectedMaterial === 'ss-316l') {
          if (!product.material?.includes('316')) return false;
        } else if (selectedMaterial === 'ss-304') {
          if (!product.material?.includes('304')) return false;
        } else if (selectedMaterial === 'elastomers') {
          const isElastomer = /silicone|epdm|ptfe|viton|gasket/i.test(
            `${product.material} ${product.category}`
          );
          if (!isElastomer) return false;
        }
      }

      // 4. Surface Finish Filter
      if (selectedFinish && selectedFinish !== 'all') {
        if (selectedFinish === 'ep') {
          if (!product.finish?.includes('EP') && !product.finish?.includes('Electro')) return false;
        } else if (selectedFinish === 'mp') {
          if (!product.finish?.includes('MP') && !product.finish?.includes('Mechanical')) return false;
        } else if (selectedFinish === 'mirror') {
          if (!product.finish?.includes('Mirror')) return false;
        }
      }

      // 5. Engineering Standard Filter
      if (selectedStandard && selectedStandard !== 'all') {
        const stdMatch = (product.standard || '')
          .toLowerCase()
          .includes(selectedStandard.toLowerCase());
        if (!stdMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'grade') {
        const aIs316 = a.material?.includes('316');
        const bIs316 = b.material?.includes('316');
        if (aIs316 && !bIs316) return -1;
        if (!aIs316 && bIs316) return 1;
        return a.name.localeCompare(b.name);
      }
      return (a.priorityRank || 99) - (b.priorityRank || 99);
    });
}

