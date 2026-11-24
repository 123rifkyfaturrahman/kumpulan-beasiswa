import {
  enrichScholarshipRecord,
  generateExtendedScholarships,
} from './scholarshipCatalog.js';

const coreScholarships = [
  {
    id: '1',
    source_identifier: 'lpdp-tu-braunschweig',
    title: 'LPDP - TU Braunschweig',
    institution: 'LPDP dan TU Braunschweig',
    provider: 'LPDP dan TU Braunschweig',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/LPDP-TUBraunschweig/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/LPDP-TUBraunschweig/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S3',
    level: 'S3',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Jerman',
    icon: 'LP',
  },
  {
    id: '2',
    source_identifier: 'lpdp-queensland',
    title: 'LPDP - University of Queensland',
    institution: 'LPDP dan University of Queensland',
    provider: 'LPDP dan University of Queensland',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/Beasiswa_LPDP%E2%80%93The_University_of_Queensland_Program_Doktor/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/Beasiswa_LPDP%E2%80%93The_University_of_Queensland_Program_Doktor/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S3',
    level: 'S3',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Australia',
    icon: 'LP',
  },
  {
    id: '3',
    source_identifier: 'lpdp-washington',
    title: 'LPDP - Washington University',
    institution: 'LPDP dan Washington University in St. Louis',
    provider: 'LPDP dan Washington University in St. Louis',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-washingtondoctor/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-washingtondoctor/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S3',
    level: 'S3',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Amerika Serikat',
    icon: 'LP',
  },
  {
    id: '4',
    source_identifier: 'lpdp-uc-davis',
    title: 'LPDP - UC Davis',
    institution: 'LPDP dan University of California Davis',
    provider: 'LPDP dan University of California Davis',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-davisdoktor2026/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-davisdoktor2026/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S3',
    level: 'S3',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Amerika Serikat',
    icon: 'LP',
  },
  {
    id: '5',
    source_identifier: 'lpdp-sydney',
    title: 'LPDP - University of Sydney',
    institution: 'LPDP dan University of Sydney',
    provider: 'LPDP dan University of Sydney',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-usydteknik2026/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-usydteknik2026/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S3',
    level: 'S3',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Australia',
    icon: 'LP',
  },
  {
    id: '6',
    source_identifier: 'lpdp-ucd',
    title: 'LPDP - University College Dublin',
    institution: 'LPDP dan University College Dublin',
    provider: 'LPDP dan University College Dublin',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-ucd2026/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-ucd2026/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S2',
    level: 'S2',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Irlandia',
    icon: 'LP',
  },
  {
    id: '7',
    source_identifier: 'lpdp-naist',
    title: 'LPDP - NAIST',
    institution: 'LPDP dan Nara Institute of Science and Technology',
    provider: 'LPDP dan Nara Institute of Science and Technology',
    source_domain: 'lpdp.kemenkeu.go.id',
    source_url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-naist2026/',
    url: 'https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-naist2026/',
    category: 'Internasional',
    program_type: 'Internasional',
    description: 'Program beasiswa kerja sama LPDP dengan perguruan tinggi luar negeri melalui skema co-funding. Persyaratan, bidang studi, dan ketentuan setiap program dapat berbeda. Silakan periksa panduan resmi LPDP.',
    deadline: '2026-12-01',
    deadlineFormatted: '01-12-2026',
    status: 'active',
    education_level: 'S2, S3',
    level: 'S2, S3',
    funding_type: 'Co-funding',
    funding: 'Co-funding',
    location: 'Jepang',
    icon: 'LP',
  },
  {
    id: '8',
    source_identifier: 'beasiswa-unggulan-2026',
    title: 'Beasiswa Unggulan Masyarakat Berprestasi 2026',
    institution: 'Kementerian Pendidikan Dasar dan Menengah RI',
    provider: 'Kementerian Pendidikan Dasar dan Menengah RI',
    source_domain: 'beasiswaunggulan.kemendikdasmen.go.id',
    source_url: 'https://beasiswaunggulan.kemendikdasmen.go.id/',
    url: 'https://beasiswaunggulan.kemendikdasmen.go.id/',
    category: 'Pemerintah',
    program_type: 'Pemerintah',
    description: 'Program beasiswa pemerintah untuk masyarakat berprestasi jenjang Sarjana (S1), Magister (S2), dan Doktoral (S3) di perguruan tinggi dalam negeri maupun luar negeri.',
    deadline: '2026-12-15',
    deadlineFormatted: '15-12-2026',
    status: 'active',
    education_level: 'S1, S2, S3',
    level: 'S1, S2, S3',
    funding_type: 'Fully Funded (Penuh)',
    funding: 'Fully Funded (Penuh)',
    location: 'Dalam Negeri (Indonesia)',
    icon: 'BU',
  },
  {
    id: '9',
    source_identifier: 'mext-2027',
    title: 'Beasiswa Pemerintah Jepang (MEXT) 2027',
    institution: 'Kedutaan Besar Jepang & Monbukagakusho',
    provider: 'Kedutaan Besar Jepang & Monbukagakusho',
    source_domain: 'www.id.emb-japan.go.jp',
    source_url: 'https://www.id.emb-japan.go.jp/itpr_id/beasiswa.html',
    url: 'https://www.id.emb-japan.go.jp/itpr_id/beasiswa.html',
    category: 'Internasional',
    program_type: 'Beasiswa Luar Negeri',
    description: 'Beasiswa pemerintah Jepang untuk berbagai jenjang studi. Periksa pengumuman Kedutaan untuk jadwal dan persyaratan.',
    deadline: '2026-12-20',
    deadlineFormatted: '20-12-2026',
    status: 'active',
    education_level: 'S1, S2, & S3 (Research)',
    level: 'S1, S2, & S3 (Research)',
    funding_type: 'Fully Funded (Penuh)',
    funding: 'Fully Funded (Penuh)',
    location: 'Luar Negeri (Jepang)',
    icon: 'MX',
  },
  {
    id: '10',
    source_identifier: 'erasmus-mundus-2027',
    title: 'Erasmus Mundus Joint Masters 2027',
    institution: 'Uni Eropa',
    provider: 'Uni Eropa',
    source_domain: 'www.eacea.ec.europa.eu',
    source_url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
    category: 'Internasional',
    program_type: 'Beasiswa Luar Negeri',
    description: 'Katalog program Erasmus Mundus Joint Masters. Pilih program untuk melihat persyaratan dan tenggat di situs penyelenggara.',
    deadline: '2027-01-15',
    deadlineFormatted: '15-01-2027',
    status: 'active',
    education_level: 'Magister (S2)',
    level: 'Magister (S2)',
    funding_type: 'Fully Funded (Penuh)',
    funding: 'Fully Funded (Penuh)',
    location: 'Luar Negeri (Eropa)',
    icon: 'EU',
  },
];

const initialScholarships = [
  ...coreScholarships.map((item, idx) => enrichScholarshipRecord(item, idx)),
  ...generateExtendedScholarships(coreScholarships.length + 1),
];

// In-memory application state replacing Eloquent / SQLite / MySQL
export const scholarshipStore = new Map(
  initialScholarships.map((item) => [item.id, item])
);

export const appState = {
  scholarships: scholarshipStore,
  sync: {
    status: 'idle',
    baseUrl: process.env.BEASISWA_API_BASE_URL || 'https://use.apiindonesia.id',
    lastSyncedAt: null,
    lastFetchedCount: 0,
    lastUpsertedCount: 0,
    lastError: null,
  },
};

export function getAllScholarships() {
  return Array.from(scholarshipStore.values());
}

export function getFeaturedScholarships(limit = 6) {
  return getAllScholarships()
    .filter((s) => s.status === 'active')
    .slice(0, limit);
}

export function findScholarshipById(id) {
  const direct = scholarshipStore.get(String(id));
  if (direct) return direct;
  return getAllScholarships().find((s) => s.source_identifier === String(id)) || null;
}

export function updateSyncState(patch) {
  Object.assign(appState.sync, patch);
  return { ...appState.sync };
}

export function upsertScholarships(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return { upsertedCount: 0, totalCount: scholarshipStore.size };
  }

  let upsertedCount = 0;

  for (const item of items) {
    if (!item || typeof item !== 'object' || !item.title) {
      continue;
    }

    const existing =
      (item.id && scholarshipStore.get(String(item.id))) ||
      (item.source_identifier &&
        getAllScholarships().find(
          (entry) => entry.source_identifier === String(item.source_identifier)
        ));

    const resolvedId = existing
      ? existing.id
      : String(item.id || item.source_identifier || scholarshipStore.size + 1);

    const merged = enrichScholarshipRecord({
      ...(existing || {}),
      ...item,
      id: resolvedId,
    });

    scholarshipStore.set(resolvedId, merged);
    upsertedCount += 1;
  }

  return {
    upsertedCount,
    totalCount: scholarshipStore.size,
  };
}

export function toCatalogSummary(item) {
  return {
    id: item.id,
    title: item.title,
    institution: item.institution || item.provider,
    category: item.category || item.program_type,
    education_level: item.education_level || item.level,
    funding_type: item.funding_type || item.funding,
    location: item.location,
    deadline: item.deadline,
    deadlineFormatted: item.deadlineFormatted,
    status: item.status,
    source_url: item.source_url || item.url,
    description: item.description,
    icon: item.icon,
    quota: item.quota,
    language_requirement: item.language_requirement,
  };
}

export function getApplicationState() {
  return {
    scholarships: getAllScholarships(),
    total: scholarshipStore.size,
    sync: { ...appState.sync },
  };
}

