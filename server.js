import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAllScholarships,
  getFeaturedScholarships,
  findScholarshipById,
  getApplicationState,
  toCatalogSummary,
} from './data/scholarships.js';
import { enrichScholarshipRecord } from './data/scholarshipCatalog.js';
import {
  syncBeasiswaToAppState,
  getSyncState,
} from './services/beasiswaApiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Halaman utama
app.get('/', (req, res) => {
  const all = getAllScholarships();
  const featuredScholarships = getFeaturedScholarships(6);
  res.render('welcome', {
    featuredScholarships,
    beasiswasCount: all.length,
  });
});

// Pencarian & Katalog Beasiswa
app.get('/cari-beasiswa', (req, res) => {
  const campusScholarships = getAllScholarships().map(toCatalogSummary);
  res.render('cari-beasiswa', { campusScholarships });
});

// Detail Beasiswa
app.get('/scholarship/:id', (req, res) => {
  const found = findScholarshipById(req.params.id);
  if (found) {
    return res.render('detail', { scholarship: found });
  }

  if (req.query.title) {
    const rawUrl = req.query.url ? String(req.query.url) : null;
    let safeUrl = null;
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          safeUrl = parsed.toString();
        }
      } catch {
        safeUrl = null;
      }
    }

    const scholarship = enrichScholarshipRecord({
      id: req.params.id,
      title: String(req.query.title),
      provider: req.query.provider ? String(req.query.provider) : null,
      institution: req.query.provider ? String(req.query.provider) : null,
      level: req.query.level ? String(req.query.level) : null,
      education_level: req.query.level ? String(req.query.level) : null,
      funding: req.query.funding ? String(req.query.funding) : null,
      funding_type: req.query.funding ? String(req.query.funding) : null,
      location: req.query.location ? String(req.query.location) : null,
      deadline: req.query.deadline ? String(req.query.deadline) : null,
      status: req.query.status ? String(req.query.status) : 'active',
      url: safeUrl,
      source_url: safeUrl,
      program_type: req.query.category ? String(req.query.category) : 'Beasiswa',
      category: req.query.category ? String(req.query.category) : 'Beasiswa',
      description: req.query.description ? String(req.query.description) : null,
    });
    return res.render('detail', { scholarship });
  }

  return res.status(404).send('Beasiswa tidak ditemukan.');
});

// Halaman pendukung
app.get('/bookmark', (req, res) => {
  res.render('bookmark');
});

app.get('/tips-panduan', (req, res) => {
  res.render('tips-panduan');
});

app.get('/kontak', (req, res) => {
  res.render('kontak');
});

// API State & Sinkronisasi Beasiswa
app.get('/api/scholarships', (req, res) => {
  const state = getApplicationState();
  let list = state.scholarships;

  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  const category =
    typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
  const level =
    typeof req.query.level === 'string' ? req.query.level.trim().toLowerCase() : '';
  const status =
    typeof req.query.status === 'string' ? req.query.status.trim().toLowerCase() : '';

  if (q) {
    list = list.filter((item) =>
      [
        item.title,
        item.institution,
        item.category,
        item.education_level,
        item.location,
        item.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }

  if (category) {
    list = list.filter((item) =>
      String(item.category || '').toLowerCase().includes(category)
    );
  }

  if (level) {
    list = list.filter((item) =>
      String(item.education_level || item.level || '').toLowerCase().includes(level)
    );
  }

  if (status) {
    list = list.filter((item) => String(item.status || '').toLowerCase() === status);
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const hasLimit = req.query.limit !== undefined;
  const limit = hasLimit
    ? Math.min(Math.max(Number(req.query.limit) || 20, 1), 500)
    : list.length;

  const offset = hasLimit ? (page - 1) * limit : 0;
  const paginated = hasLimit ? list.slice(offset, offset + limit) : list;

  return res.json({
    data: paginated,
    meta: {
      total: state.total,
      filtered: list.length,
      page: hasLimit ? page : 1,
      limit,
      totalPages: hasLimit ? Math.max(Math.ceil(list.length / limit), 1) : 1,
      sync: getSyncState(),
    },
  });
});

app.get('/api/scholarships/:id', (req, res) => {
  const found = findScholarshipById(req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'Beasiswa tidak ditemukan' });
  }
  return res.json({ data: found });
});

app.post('/api/scholarships/sync', async (req, res) => {
  const result = await syncBeasiswaToAppState();
  const state = getApplicationState();
  const statusCode = result.ok ? 200 : 502;
  return res.status(statusCode).json({
    ok: result.ok,
    syncedCount: result.syncedCount,
    fetchedCount: result.fetchedCount || 0,
    totalCount: state.total,
    sync: state.sync,
    error: result.error || null,
  });
});

// Stub remaining Laravel Breeze / Auth / Admin routes
const stubbedExactPaths = new Set([
  '/login',
  '/logout',
  '/register',
  '/dashboard',
  '/profile',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/confirm-password',
  '/password',
  '/admin',
]);

app.use((req, res, next) => {
  if (
    stubbedExactPaths.has(req.path) ||
    req.path.startsWith('/reset-password/') ||
    req.path.startsWith('/verify-email/') ||
    req.path.startsWith('/admin/')
  ) {
    return res.status(501).json({ error: 'Not yet migrated' });
  }
  return next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CariBeasiswa ID server listening on http://0.0.0.0:${PORT}`);

  if (process.env.BEASISWA_API_BASE_URL) {
    syncBeasiswaToAppState().catch(() => {});
  }
});
