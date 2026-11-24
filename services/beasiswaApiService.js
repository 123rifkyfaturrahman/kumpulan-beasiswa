import axios from 'axios';
import { enrichScholarshipRecord } from '../data/scholarshipCatalog.js';
import {
  getApplicationState,
  updateSyncState,
  upsertScholarships,
} from '../data/scholarships.js';

const DEFAULT_BASE_URL = 'https://use.apiindonesia.id';
const DEFAULT_PATHS = ['/api/beasiswa'];
const REQUEST_TIMEOUT_MS = 10000;

function isRestrictedHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  if (!host) return true;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '[::1]' ||
    host === '0.0.0.0' ||
    host === '169.254.169.254' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }

  if (/^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) {
    return true;
  }

  const match172 = host.match(/^172\.(\d+)\./);
  if (match172) {
    const secondOctet = Number(match172[1]);
    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  return false;
}

export function resolveConfiguredBaseUrl(overrideUrl) {
  const raw = String(
    overrideUrl || process.env.BEASISWA_API_BASE_URL || DEFAULT_BASE_URL
  ).trim();

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('Invalid BEASISWA_API_BASE_URL format');
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('BEASISWA_API_BASE_URL must use http or https protocol');
  }

  if (isRestrictedHost(parsed.hostname)) {
    throw new Error('BEASISWA_API_BASE_URL host is not permitted');
  }

  return parsed.toString().replace(/\/+$/, '');
}

export function parseConfiguredSources(rawSources = process.env.BEASISWA_SOURCES) {
  if (!rawSources) {
    return DEFAULT_PATHS.map((p) => ({ path: p, params: {} }));
  }

  let parsedList = [];
  if (Array.isArray(rawSources)) {
    parsedList = rawSources;
  } else {
    const trimmed = String(rawSources).trim();
    if (!trimmed || trimmed === '[]') {
      return DEFAULT_PATHS.map((p) => ({ path: p, params: {} }));
    }

    try {
      const json = JSON.parse(trimmed);
      parsedList = Array.isArray(json) ? json : [json];
    } catch {
      parsedList = trimmed
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }

  const sources = parsedList
    .map((entry) => {
      if (typeof entry === 'string') {
        const cleanPath = entry.startsWith('/') ? entry : `/${entry}`;
        return { path: cleanPath, params: {} };
      }

      if (entry && typeof entry === 'object' && typeof entry.path === 'string') {
        const cleanPath = entry.path.startsWith('/') ? entry.path : `/${entry.path}`;
        return {
          path: cleanPath,
          params: entry.params && typeof entry.params === 'object' ? entry.params : {},
          category: typeof entry.category === 'string' ? entry.category : undefined,
        };
      }

      return null;
    })
    .filter(Boolean);

  return sources.length > 0 ? sources : DEFAULT_PATHS.map((p) => ({ path: p, params: {} }));
}

function sanitizeExternalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}

function formatDeadline(rawDeadline) {
  if (!rawDeadline) return { deadline: null, deadlineFormatted: null };
  const text = String(rawDeadline).trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;
    return {
      deadline: `${yyyy}-${mm}-${dd}`,
      deadlineFormatted: `${dd}-${mm}-${yyyy}`,
    };
  }
  return {
    deadline: text,
    deadlineFormatted: text,
  };
}

function createSlug(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function deriveIcon(provider, title) {
  const words = String(provider || title || 'CB')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return String(words[0] || 'CB').slice(0, 2).toUpperCase();
}

export function normalizeApiScholarship(rawItem, index = 0, sourceMeta = {}) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const title = String(
    rawItem.title || rawItem.judul || rawItem.nama || rawItem.name || ''
  ).trim();
  if (!title) return null;

  const institution = String(
    rawItem.institution ||
      rawItem.provider ||
      rawItem.penyelenggara ||
      rawItem.organizer ||
      rawItem.instansi ||
      'Penyelenggara Resmi'
  ).trim();

  const safeUrl = sanitizeExternalUrl(
    rawItem.source_url || rawItem.url || rawItem.link || rawItem.portal_url
  );

  let sourceDomain = rawItem.source_domain ? String(rawItem.source_domain) : null;
  if (!sourceDomain && safeUrl) {
    try {
      sourceDomain = new URL(safeUrl).hostname;
    } catch {
      sourceDomain = null;
    }
  }

  const category = String(
    rawItem.category ||
      rawItem.program_type ||
      rawItem.kategori ||
      sourceMeta.category ||
      'Beasiswa'
  ).trim();

  const educationLevel = String(
    rawItem.education_level || rawItem.level || rawItem.jenjang || 'S1, S2, S3'
  ).trim();

  const fundingType = String(
    rawItem.funding_type || rawItem.funding || rawItem.pendanaan || 'Fully Funded'
  ).trim();

  const location = String(
    rawItem.location || rawItem.lokasi || rawItem.country || rawItem.negara || 'Indonesia'
  ).trim();

  const description = String(
    rawItem.description ||
      rawItem.deskripsi ||
      rawItem.summary ||
      'Informasi program beasiswa dari API Beasiswa Indonesia.'
  ).trim();

  const rawStatus = String(rawItem.status || 'active').toLowerCase();
  const status =
    rawStatus === 'closed' || rawStatus === 'tutup' || rawStatus === 'inactive'
      ? 'closed'
      : 'active';

  const { deadline, deadlineFormatted } = formatDeadline(
    rawItem.deadline || rawItem.batas_pendaftaran || rawItem.tenggat
  );

  const sourceIdentifier = String(
    rawItem.source_identifier ||
      rawItem.slug ||
      rawItem.id ||
      `api-${createSlug(title) || index + 1}`
  );

  return enrichScholarshipRecord(
    {
      id: rawItem.id ? `api-${String(rawItem.id)}` : sourceIdentifier,
      source_identifier: sourceIdentifier,
      title,
      institution,
      provider: institution,
      source_domain: sourceDomain,
      source_url: safeUrl,
      url: safeUrl,
      category,
      program_type: category,
      description,
      deadline,
      deadlineFormatted,
      status,
      education_level: educationLevel,
      level: educationLevel,
      funding_type: fundingType,
      funding: fundingType,
      location,
      icon: rawItem.icon ? String(rawItem.icon).slice(0, 3) : deriveIcon(institution, title),
      benefits: Array.isArray(rawItem.benefits) ? rawItem.benefits : undefined,
      requirements: Array.isArray(rawItem.requirements) ? rawItem.requirements : undefined,
      documents: Array.isArray(rawItem.documents) ? rawItem.documents : undefined,
      selection_stages: Array.isArray(rawItem.selection_stages) ? rawItem.selection_stages : undefined,
      quota: rawItem.quota ? String(rawItem.quota) : undefined,
      age_limit: rawItem.age_limit ? String(rawItem.age_limit) : undefined,
      study_duration: rawItem.study_duration ? String(rawItem.study_duration) : undefined,
      min_gpa_or_grade: rawItem.min_gpa_or_grade ? String(rawItem.min_gpa_or_grade) : undefined,
      language_requirement: rawItem.language_requirement ? String(rawItem.language_requirement) : undefined,
      target_group: rawItem.target_group ? String(rawItem.target_group) : undefined,
      api_source: sourceMeta.path || DEFAULT_PATHS[0],
      fetched_at: new Date().toISOString(),
    },
    index
  );
}

function extractItemsArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.scholarships)) return payload.scholarships;
  if (Array.isArray(payload.beasiswa)) return payload.beasiswa;
  if (payload.data && typeof payload.data === 'object') {
    if (Array.isArray(payload.data.items)) return payload.data.items;
    if (Array.isArray(payload.data.results)) return payload.data.results;
    if (Array.isArray(payload.data.scholarships)) return payload.data.scholarships;
  }

  return [];
}

export function createBeasiswaApiClient(options = {}) {
  const baseURL = resolveConfiguredBaseUrl(options.baseUrl);
  const apiKey = String(options.apiKey || process.env.BEASISWA_API_KEY || '').trim();

  const headers = {
    Accept: 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
    headers['X-API-Key'] = apiKey;
  }

  return axios.create({
    baseURL,
    timeout: Number(options.timeoutMs) || REQUEST_TIMEOUT_MS,
    headers,
  });
}

function extractNextPage(payload, currentPage) {
  if (!payload || typeof payload !== 'object') return null;

  const meta = payload.meta || payload.pagination || payload.data?.meta;
  if (meta && typeof meta === 'object') {
    const lastPage = Number(meta.last_page || meta.total_pages || meta.totalPages);
    const pageNow = Number(meta.current_page || meta.page || currentPage);
    if (Number.isFinite(lastPage) && pageNow < lastPage) {
      return pageNow + 1;
    }
  }

  if (typeof payload.next_page_url === 'string' && payload.next_page_url) {
    return currentPage + 1;
  }

  if (typeof payload.next === 'string' && payload.next) {
    return currentPage + 1;
  }

  return null;
}

export async function fetchBeasiswaFromApi(options = {}) {
  const baseUrl = resolveConfiguredBaseUrl(options.baseUrl);
  const client = createBeasiswaApiClient({ ...options, baseUrl });
  const sources = parseConfiguredSources(options.sources);
  const maxPages = Math.min(Math.max(Number(options.maxPages) || 20, 1), 100);

  const items = [];
  const errors = [];

  for (const source of sources) {
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= maxPages) {
      try {
        const requestParams = {
          ...(source.params || {}),
          ...(options.params || {}),
        };
        if (page > 1 || options.paginate !== false) {
          requestParams.page = page;
        }

        const response = await client.get(source.path, {
          params: requestParams,
        });

        const rawList = extractItemsArray(response.data);
        rawList.forEach((rawItem, idx) => {
          const normalized = normalizeApiScholarship(
            rawItem,
            items.length + idx,
            source
          );
          if (normalized) {
            items.push(normalized);
          }
        });

        const nextPage = extractNextPage(response.data, page);
        if (nextPage && rawList.length > 0) {
          page = nextPage;
        } else {
          hasMore = false;
        }
      } catch (error) {
        const status = error?.response?.status;
        const message = status
          ? `Request to ${source.path} (page ${page}) failed with status ${status}`
          : error?.message || `Request to ${source.path} failed`;
        errors.push({ path: source.path, page, message });
        hasMore = false;
      }
    }
  }

  return {
    baseUrl,
    items,
    errors,
  };
}

export async function syncBeasiswaToAppState(options = {}) {
  let baseUrl = DEFAULT_BASE_URL;

  try {
    baseUrl = resolveConfiguredBaseUrl(options.baseUrl);
  } catch (error) {
    const sync = updateSyncState({
      status: 'error',
      lastSyncedAt: new Date().toISOString(),
      lastError: error.message,
    });
    return {
      ok: false,
      syncedCount: 0,
      totalCount: getApplicationState().total,
      sync,
      error: error.message,
    };
  }

  updateSyncState({
    status: 'syncing',
    baseUrl,
    lastError: null,
  });

  const { items, errors } = await fetchBeasiswaFromApi({ ...options, baseUrl });

  if (items.length === 0 && errors.length > 0) {
    const errorMessage = errors.map((e) => e.message).join('; ');
    const sync = updateSyncState({
      status: 'error',
      baseUrl,
      lastSyncedAt: new Date().toISOString(),
      lastFetchedCount: 0,
      lastUpsertedCount: 0,
      lastError: errorMessage,
    });

    return {
      ok: false,
      syncedCount: 0,
      totalCount: getApplicationState().total,
      sync,
      error: errorMessage,
    };
  }

  const { upsertedCount, totalCount } = upsertScholarships(items);
  const partialError =
    errors.length > 0 ? errors.map((e) => e.message).join('; ') : null;

  const sync = updateSyncState({
    status: 'synced',
    baseUrl,
    lastSyncedAt: new Date().toISOString(),
    lastFetchedCount: items.length,
    lastUpsertedCount: upsertedCount,
    lastError: partialError,
  });

  return {
    ok: true,
    syncedCount: upsertedCount,
    fetchedCount: items.length,
    totalCount,
    sync,
    error: partialError,
  };
}

export function getSyncState() {
  return getApplicationState().sync;
}
