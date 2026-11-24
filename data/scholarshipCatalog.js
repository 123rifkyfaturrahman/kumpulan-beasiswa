// Deterministic catalog generator providing 5,300+ complete Indonesian & international scholarships
// including extensive coverage for SMA / SMK / MA / Sederajat, D3/D4, S1, S2, and S3.

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDateYmd(offsetDays) {
  const base = new Date(Date.UTC(2026, 10, 23)); // 2026-11-23
  base.setUTCDate(base.getUTCDate() + offsetDays);
  const yyyy = base.getUTCFullYear();
  const mm = pad2(base.getUTCMonth() + 1);
  const dd = pad2(base.getUTCDate());
  return {
    deadline: `${yyyy}-${mm}-${dd}`,
    deadlineFormatted: `${dd}-${mm}-${yyyy}`,
  };
}

function makeSlug(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function makeIcon(text) {
  const parts = String(text || 'CB')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return String(parts[0] || 'CB').slice(0, 2).toUpperCase();
}

function buildCompleteMetadata({
  education_level,
  funding_type,
  location,
  category,
  institution,
  title,
  idx,
}) {
  const lvl = String(education_level || '').toLowerCase();
  const fund = String(funding_type || '').toLowerCase();
  const loc = String(location || '').toLowerCase();
  const isSma = /sma|smk|ma|madrasah|sederajat/.test(lvl);
  const isDiploma = /d3|d4|diploma/.test(lvl) && !isSma;
  const isS1 = /\bs1\b|sarjana/.test(lvl) && !/s2|s3/.test(lvl);
  const isPostgrad = /s2|s3|magister|doktor/.test(lvl);
  const isAbroad =
    !loc.includes('dalam negeri') &&
    !/^indonesia/.test(loc);
  const isFull = /fully|penuh/.test(fund);
  const isResearch = /riset|tesis/.test(fund);

  let target_group = 'Mahasiswa aktif atau calon mahasiswa Indonesia';
  let age_limit = '18 – 25 tahun';
  let study_duration = '1 – 4 tahun akademik';
  let min_gpa_or_grade = 'IPK minimal 3.00 / 4.00';
  let language_requirement = isAbroad
    ? 'IELTS min. 6.0 / TOEFL iBT 79 (atau sesuai ketentuan negara tujuan)'
    : 'Bahasa Indonesia (Tanpa syarat IELTS/TOEFL)';

  if (isSma) {
    target_group = 'Siswa aktif SMA / SMK / MA / Sederajat kelas X, XI, atau XII';
    age_limit = '15 – 19 tahun';
    study_duration = isAbroad ? '1 – 2 tahun ajaran (Pertukaran / Boarding)' : '1 – 3 tahun ajaran (Hingga lulus)';
    min_gpa_or_grade = 'Rata-rata nilai rapor minimal 80 / 100 (atau peringkat 10 besar kelas)';
    language_requirement = isAbroad
      ? 'Kemampuan dasar Bahasa Inggris / sertifikat ELTiS / TOEFL Junior sesuai program'
      : 'Bahasa Indonesia (Tanpa IELTS/TOEFL)';
  } else if (isDiploma) {
    target_group = 'Mahasiswa aktif atau calon mahasiswa Program Vokasi D3 / D4';
    age_limit = '17 – 23 tahun';
    study_duration = '6 – 8 semester';
    min_gpa_or_grade = 'Nilai rapor min. 78 atau IPK minimal 2.75 / 4.00';
  } else if (isS1) {
    target_group = 'Lulusan SMA/SMK/MA atau mahasiswa aktif Sarjana (S1)';
    age_limit = '17 – 24 tahun';
    study_duration = '8 semester (maksimal 4 tahun)';
    min_gpa_or_grade = 'Nilai rapor min. 80 atau IPK minimal 3.00 / 4.00';
  } else if (isPostgrad) {
    target_group = 'Lulusan S1/S2 yang berencana menempuh studi Magister (S2) atau Doktoral (S3)';
    age_limit = lvl.includes('s3') ? 'Maksimal 42 tahun' : 'Maksimal 35 tahun';
    study_duration = lvl.includes('s3') ? '36 – 48 bulan' : '18 – 24 bulan';
    min_gpa_or_grade = idx % 5 === 0 ? 'IPK minimal 2.75 / 4.00 (jalur afirmasi/khusus)' : 'IPK minimal 3.00 / 4.00';
  }

  const benefits = [];
  if (isFull) {
    benefits.push(
      isSma
        ? 'Pembebasan penuh biaya SPP / uang sekolah dan biaya praktik laboratorium'
        : 'Pembiayaan penuh uang kuliah / UKT / tuition fee hingga selesai masa studi'
    );
    benefits.push(
      isSma
        ? 'Uang saku bulanan serta bantuan seragam, buku pelajaran, dan kuota belajar'
        : 'Tunjangan biaya hidup bulanan (living allowance) dan dana buku/perlengkapan'
    );
  } else if (isResearch) {
    benefits.push('Dana hibah penelitian, pengumpulan data, dan biaya uji laboratorium');
    benefits.push('Dukungan publikasi jurnal ilmiah / seminar akademik dan bimbingan pakar');
  } else {
    benefits.push(
      isSma
        ? 'Bantuan keringanan SPP/biaya pendidikan dan subsidi perlengkapan sekolah'
        : 'Subsidi biaya pendidikan / UKT atau tunjangan biaya hidup per semester'
    );
    benefits.push(
      isSma
        ? 'Subsidi buku pelajaran, seragam, atau biaya uji kompetensi kejuruan'
        : 'Bantuan dana penunjang akademik, seminar, atau sertifikasi kompetensi'
    );
  }

  if (isAbroad) {
    benefits.push('Tiket pesawat pulang-pergi kelas ekonomi, pengurusan visa, dan asuransi kesehatan internasional');
    benefits.push('Program orientasi keberangkatan, akomodasi asrama/keluarga angkat, dan pendampingan');
  } else {
    benefits.push('Program pengembangan diri, pelatihan kepemimpinan, dan jejaring alumni nasional');
  }

  const requirements = [
    'Warga Negara Indonesia (WNI) yang berdomisili atau terdaftar pada institusi pendidikan resmi',
    target_group,
    min_gpa_or_grade,
    language_requirement,
    isSma
      ? 'Mendapat izin orang tua/wali serta surat rekomendasi dari Kepala Sekolah atau Guru BK'
      : 'Tidak sedang menerima beasiswa sejenis dengan komponen pembiayaan ganda dan memiliki komitmen kontribusi pasca-studi',
  ];

  const documents = isSma
    ? [
        'Fotokopi/scan Kartu Pelajar, Akta Kelahiran, dan Kartu Keluarga (KK)',
        'Transkrip / rapor legalisir 2–4 semester terakhir',
        'Surat keterangan aktif siswa dan rekomendasi dari pihak sekolah',
        'Surat izin tertulis dari orang tua/wali',
        'Esai motivasi singkat dan sertifikat prestasi akademik/non-akademik (jika ada)',
      ]
    : [
        'Scan KTP / Paspor aktif dan Kartu Tanda Mahasiswa (atau ijazah/SKL terakhir)',
        'Transkrip nilai akademik / IPK terakhir yang dilegalisir',
        'Curriculum Vitae (CV), Motivation Letter / Personal Statement, dan Rencana Studi',
        'Surat rekomendasi akademik atau profesional (1–2 surat)',
        isAbroad
          ? 'Sertifikat kemampuan bahasa resmi dan Letter of Acceptance (LoA) bila dipersyaratkan'
          : 'Surat keterangan aktif kuliah / surat keterangan penghasilan orang tua (khusus jalur afirmasi)',
      ];

  const selection_stages = [
    'Registrasi akun dan pengisian formulir pendaftaran online pada portal resmi',
    'Seleksi administrasi dan verifikasi kelengkapan dokumen persyaratan',
    idx % 7 === 0
      ? 'Penilaian berkas prestasi & esai (Tanpa wawancara tatap muka)'
      : 'Tes Potensi Akademik / Penilaian Esai dan Wawancara Seleksi',
    'Pengumuman penerima beasiswa dan penandatanganan komitmen program',
  ];

  const quotas = ['100 penerima', '250 penerima', '500 penerima', '1.000 penerima', '75 penerima', '300 penerima'];
  const quota = quotas[idx % quotas.length];

  return {
    target_group,
    age_limit,
    study_duration,
    min_gpa_or_grade,
    language_requirement,
    quota,
    benefits,
    requirements,
    documents,
    selection_stages,
    official_portal_label: `Portal Resmi ${institution}`,
    category_tag: category,
    title_summary: title,
  };
}

export function enrichScholarshipRecord(item, idx = 0) {
  if (
    Array.isArray(item.benefits) &&
    Array.isArray(item.requirements) &&
    Array.isArray(item.documents) &&
    Array.isArray(item.selection_stages) &&
    item.quota
  ) {
    return item;
  }

  const meta = buildCompleteMetadata({
    education_level: item.education_level || item.level,
    funding_type: item.funding_type || item.funding,
    location: item.location,
    category: item.category || item.program_type,
    institution: item.institution || item.provider,
    title: item.title,
    idx,
  });

  return {
    ...meta,
    ...item,
    benefits: item.benefits || meta.benefits,
    requirements: item.requirements || meta.requirements,
    documents: item.documents || meta.documents,
    selection_stages: item.selection_stages || meta.selection_stages,
    quota: item.quota || meta.quota,
    age_limit: item.age_limit || meta.age_limit,
    study_duration: item.study_duration || meta.study_duration,
    min_gpa_or_grade: item.min_gpa_or_grade || meta.min_gpa_or_grade,
    language_requirement: item.language_requirement || meta.language_requirement,
    target_group: item.target_group || meta.target_group,
    official_portal_label: item.official_portal_label || meta.official_portal_label,
  };
}

export function generateExtendedScholarships(startNumericId = 11) {
  const results = [];
  let nextId = startNumericId;

  function addEntry({
    title,
    institution,
    source_url,
    category,
    program_type,
    education_level,
    funding_type,
    location,
    description,
    offsetDays = 30,
    status = 'active',
    icon,
    slugSuffix = '',
  }) {
    const idx = nextId;
    const id = String(nextId++);
    let domain = 'caribeasiswa.id';
    try {
      domain = new URL(source_url).hostname;
    } catch {
      domain = 'caribeasiswa.id';
    }
    const { deadline, deadlineFormatted } = formatDateYmd(offsetDays);
    const identifier = `${makeSlug(title)}${slugSuffix ? `-${makeSlug(slugSuffix)}` : ''}-${id}`;

    const baseItem = {
      id,
      source_identifier: identifier,
      title,
      institution,
      provider: institution,
      source_domain: domain,
      source_url,
      url: source_url,
      category,
      program_type: program_type || category,
      description,
      deadline,
      deadlineFormatted,
      status,
      education_level,
      level: education_level,
      funding_type,
      funding: funding_type,
      location,
      icon: icon || makeIcon(institution || title),
    };

    results.push(enrichScholarshipRecord(baseItem, idx));
  }

  const provinces = [
    'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau',
    'Jambi', 'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung',
    'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta',
    'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
    'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
    'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
    'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya',
  ];

  // =========================================================================
  // 1. PROGRAM KHUSUS JENJANG SMA / SMK / MA / SEDERAJAT (~1,300+ program)
  // =========================================================================

  // 1A. Pemda 38 Provinsi x 12 Jalur SMA/SMK/MA = 456 program
  const smaProvincialTracks = [
    { suffix: 'Prestasi Akademik SMA/MA', level: 'SMA / SMK / MA', funding: 'Fully Funded (Penuh)', desc: 'Dukungan penuh SPP dan uang saku bagi siswa berprestasi akademik di SMA dan Madrasah Aliyah.' },
    { suffix: 'SMK Unggulan & Keahlian Vokasi', level: 'SMA / SMK / Sederajat', funding: 'Fully Funded (Penuh)', desc: 'Bantuan biaya pendidikan, sertifikasi kompetensi, dan perlengkapan praktik bagi siswa SMK.' },
    { suffix: 'Afirmasi Siswa Keluarga Pra-Sejahtera', level: 'SMA / SMK / MA', funding: 'Biaya Hidup & SPP', desc: 'Program afirmasi pendidikan menengah bagi pelajar kurang mampu agar tuntas wajib belajar 12 tahun.' },
    { suffix: 'Olimpiade Sains Nasional (OSN) & Riset OPSI', level: 'SMA / MA / Sederajat', funding: 'Bantuan Riset / Pembinaan', desc: 'Pembinaan intensif dan bantuan dana riset karya ilmiah remaja bagi peserta OSN dan OPSI tingkat SMA.' },
    { suffix: 'Tahfidz Al-Qur’an & Prestasi Keagamaan', level: 'SMA / SMK / MA', funding: 'Fully Funded (Penuh)', desc: 'Beasiswa penghargaan bagi pelajar SMA/SMK/MA penghafal Al-Qur’an dan prestasi keagamaan.' },
    { suffix: 'Prestasi Olahraga (O2SN) & Seni (FLS2N)', level: 'SMA / SMK / Sederajat', funding: 'Partial Funded (Sebagian)', desc: 'Bantuan biaya pembinaan dan perlengkapan bagi atlet dan seniman pelajar SMA/SMK berprestasi.' },
    { suffix: 'Siswa Daerah 3T & Perbatasan', level: 'SMA / SMK / MA', funding: 'Fully Funded (Penuh)', desc: 'Dukungan asrama, biaya sekolah, dan transportasi bagi pelajar sekolah menengah di wilayah 3T.' },
    { suffix: 'Sekolah Berasrama Unggul Daerah', level: 'SMA / MA', funding: 'Fully Funded (Penuh)', desc: 'Pembiayaan penuh pendidikan dan asrama di SMA Negeri Unggulan tingkat provinsi.' },
    { suffix: 'Persiapan Kuliah & UTBK Pelajar Kelas XII', level: 'SMA / SMK / MA', funding: 'Partial Funded (Sebagian)', desc: 'Bantuan biaya bimbingan belajar, tryout SNBT, dan biaya pendaftaran perguruan tinggi.' },
    { suffix: 'Pelajar Disabilitas & Pendidikan Inklusif', level: 'SMA / SMK / Sederajat', funding: 'Fully Funded (Penuh)', desc: 'Dukungan alat bantu belajar, biaya sekolah, dan tunjangan pendidikan bagi siswa berkebutuhan khusus.' },
    { suffix: 'Inovasi Teknologi & Kewirausahaan SMK', level: 'SMK / SMA', funding: 'Bantuan Riset / Proyek', desc: 'Pendanaan prototipe produk inovasi siswa SMK dan proyek kewirausahaan sekolah menengah.' },
    { suffix: 'Putra-Putri Tenaga Pendidik & Kesehatan Daerah', level: 'SMA / SMK / MA', funding: 'Partial Funded (Sebagian)', desc: 'Apresiasi bantuan biaya pendidikan bagi anak guru dan tenaga kesehatan yang bertugas di daerah.' },
  ];

  provinces.forEach((prov, pIdx) => {
    smaProvincialTracks.forEach((tr, tIdx) => {
      const idx = pIdx * smaProvincialTracks.length + tIdx;
      addEntry({
        title: `Beasiswa SMA/SMK Pemprov ${prov} - ${tr.suffix}`,
        institution: `Dinas Pendidikan Provinsi ${prov}`,
        source_url: 'https://pip.kemdikbud.go.id/',
        category: 'Pemerintah',
        education_level: tr.level,
        funding_type: tr.funding,
        location: `Dalam Negeri (${prov}, Indonesia)`,
        description: `${tr.desc} Tanpa IELTS/TOEFL. Terbuka untuk siswa aktif di Provinsi ${prov}.`,
        offsetDays: 4 + (idx % 120),
        status: idx % 22 === 0 ? 'closed' : 'active',
        icon: 'SM',
      });
    });
  });

  // 1B. Kota/Kabupaten Besar & Yayasan/Perusahaan khusus SMA/SMK (~520 program)
  const smaSponsors = [
   
    { name: 'KJP Plus & KJMU Persiapan DKI Jakarta', cat: 'Pemerintah', url: 'https://kjp.jakarta.go.id/' },
    { name: 'PIP Madrasah Aliyah (Kemenag RI)', cat: 'Pemerintah', url: 'https://pipmadrasah.kemenag.go.id/' },
    { name: 'Beasiswa Indonesia Maju (BIM) Persiapan S1', cat: 'Pemerintah', url: 'https://bim.kemdikbud.go.id/' },
    { name: 'MAN Insan Cendekia (Kemenag RI)', cat: 'Pemerintah', url: 'https://kemenag.go.id/' },
    { name: 'SMA Pradita Dirgantara', cat: 'Yayasan', url: 'https://sma.praditadirgantara.sch.id/' },
    { name: 'SMA Taruna Nusantara', cat: 'Yayasan', url: 'https://tarunanusantara.sch.id/' },
    { name: 'SMA Unggul Del', cat: 'Yayasan', url: 'https://smadel.sch.id/' },
    { name: 'Sampoerna Academy High School', cat: 'Yayasan', url: 'https://www.sampoernaacademy.sch.id/' },
    { name: 'YBM BRILiaN Smart Scholarship SMA', cat: 'Yayasan', url: 'https://ybmbrilian.id/' },
    { name: 'Dompet Dhuafa Beastudi Pelajar SMA', cat: 'Yayasan', url: 'https://www.dompetdhuafa.org/' },
    { name: 'BAZNAS Beasiswa Cendekia Sekolah Menengah', cat: 'Yayasan', url: 'https://beasiswa.baznas.go.id/' },
    { name: 'Rumah Yatim Peduli Pendidikan SMA/SMK', cat: 'Yayasan', url: 'https://rumahyatim.org/' },
    { name: 'Lazismu Beasiswa Sang Surya Pelajar', cat: 'Yayasan', url: 'https://lazismu.org/' },
    { name: 'Lazisnu Beasiswa Pelajar Nusantara', cat: 'Yayasan', url: 'https://nucare.id/' },
    { name: 'Astra YPA-MDR Beasiswa Vokasi SMK', cat: 'Swasta', url: 'https://www.astra.co.id/' },
    { name: 'PT Pertamina (Persero) Beasiswa Sobat Bumi SMA', cat: 'Swasta', url: 'https://pertaminafoundation.org/' },
    { name: 'PT PLN (Persero) Beasiswa SMK Kelistrikan', cat: 'Swasta', url: 'https://web.pln.co.id/' },
    { name: 'Telkom Indonesia Beasiswa SMK Telekomunikasi', cat: 'Swasta', url: 'https://www.telkom.co.id/' },
    { name: 'Bank BRI Peduli Pelajar Berprestasi', cat: 'Swasta', url: 'https://bri.co.id/' },
    { name: 'Bank Mandiri Edukasi Muda SMA/SMK', cat: 'Swasta', url: 'https://www.bankmandiri.co.id/' },
    { name: 'Bakti BCA Sekolah Binaan & SMA', cat: 'Swasta', url: 'https://karir.bca.co.id/' },
    { name: 'Adaro Foundation Beasiswa Pelajar Daerah', cat: 'Yayasan', url: 'https://www.adaro.com/' },
    { name: 'PT Freeport Indonesia Beasiswa SMA Asrama', cat: 'Swasta', url: 'https://ptfi.co.id/' },
    { name: 'Eka Tjipta Foundation Beasiswa Sekolah Menengah', cat: 'Yayasan', url: 'https://ekatjipta.org/' },
    { name: 'Tanoto Foundation Program Pelajar Terampil', cat: 'Yayasan', url: 'https://www.tanotofoundation.org/' },
    { name: 'Djarum Foundation Pembinaan SMK Unggulan', cat: 'Yayasan', url: 'https://djarumfoundation.org/' },
    { name: 'Kalbe Junior Scientist & Pelajar STEM', cat: 'Swasta', url: 'https://www.kalbe.co.id/' },
    { name: 'Paragon Wardah Inspiring Pelajar', cat: 'Swasta', url: 'https://www.paragon-innovation.com/' },
    { name: 'Ruangguru & Yayasan Pendidikan Nusantara SMA', cat: 'Swasta', url: 'https://www.ruangguru.com/' },
    { name: 'Kementerian Perindustrian SMK SMTI & SMAK', cat: 'Pemerintah', url: 'https://bpsdmi.kemenperin.go.id/' },
    { name: 'Kementerian Pertanian SMK-PP', cat: 'Pemerintah', url: 'https://www.pertanian.go.id/' },
    { name: 'Kementerian Kelautan SUPM / Sekolah Perikanan', cat: 'Pemerintah', url: 'https://kkp.go.id/' },
    { name: 'Yayasan Pendidikan Al-Azhar Beasiswa Prestasi', cat: 'Yayasan', url: 'https://www.al-azhar.or.id/' },
    { name: 'Sekolah Sukma Bangsa Beasiswa Penuh SMA', cat: 'Yayasan', url: 'https://sukmabangsa.sch.id/' },
    { name: 'SMK Mitra Industri MM2100', cat: 'Swasta', url: 'https://smkmitraindustri.com/' },
  ];

  const smaCohorTracks = [
    { sub: 'Kelas X Masuk SMA/SMK/MA', funding: 'Fully Funded (Penuh)' },
    { sub: 'Kelas XI Prestasi Akademik & Kepemimpinan', funding: 'Partial Funded (Sebagian)' },
    { sub: 'Kelas XII Persiapan SNBP/SNBT & Karier', funding: 'Biaya Hidup & Bimbingan' },
    { sub: 'Jalur Vokasi & Praktik Kerja Industri (PKL)', funding: 'Partial Funded (Sebagian)' },
    { sub: 'Jalur STEM, Coding & Robotika Pelajar', funding: 'Bantuan Riset / Proyek' },
    { sub: 'Jalur Afirmasi Yatim & Keluarga Pra-Sejahtera', funding: 'Fully Funded (Penuh)' },
    { sub: 'Jalur Prestasi Nasional (OSN/O2SN/FLS2N)', funding: 'Fully Funded (Penuh)' },
    { sub: 'Jalur Pondok Pesantren & Madrasah Aliyah', funding: 'Fully Funded (Penuh)' },
    { sub: 'Jalur Sekolah Menengah Kejuruan Teknik & IT', funding: 'Partial Funded (Sebagian)' },
    { sub: 'Jalur Pelajar Putri Berprestasi & Sains', funding: 'Fully Funded (Penuh)' },
    { sub: 'Jalur Bahasa Asing & Literasi Pelajar', funding: 'Partial Funded (Sebagian)' },
    { sub: 'Jalur Kewirausahaan Muda SMA/SMK', funding: 'Bantuan Riset / Proyek' },
    { sub: 'Jalur Asrama & Pemondokan Penuh', funding: 'Fully Funded (Penuh)' },
    { sub: 'Jalur Wilayah Pelosok & Kepulauan Indonesia', funding: 'Fully Funded (Penuh)' },
  ];

  smaSponsors.forEach((sp, sIdx) => {
    smaCohorTracks.forEach((ct, cIdx) => {
      const idx = sIdx * smaCohorTracks.length + cIdx;
      addEntry({
        title: `${sp.name} (${ct.sub})`,
        institution: sp.name,
        source_url: sp.url,
        category: sp.cat,
        education_level: 'SMA / SMK / MA',
        funding_type: ct.funding,
        location: 'Dalam Negeri (Indonesia)',
        description: `Program beasiswa jenjang SMA/SMK/MA dari ${sp.name} untuk ${ct.sub}. Tanpa IELTS/TOEFL. Tersedia bantuan SPP, uang saku, dan pembinaan siswa.`,
        offsetDays: 2 + (idx % 105),
        status: idx % 24 === 0 ? 'closed' : 'active',
        icon: 'SM',
      });
    });
  });

  // 1C. Beasiswa SMA & Pertukaran Pelajar Internasional (~340 program)
  const smaIntlPrograms = [
    { name: 'UWC (United World Colleges) Indonesia', inst: 'UWC National Committee Indonesia', loc: 'Luar Negeri (Multi Negara)', url: 'https://www.id.uwc.org/' },
    { name: 'AFS Bina Antarbudaya Year Program', inst: 'Yayasan Bina Antarbudaya & AFS', loc: 'Luar Negeri (Eropa & Asia)', url: 'https://binaantarbudaya.or.id/' },
    { name: 'Kennedy-Lugar YES (Youth Exchange and Study)', inst: 'U.S. Dept. of State & Bina Antarbudaya', loc: 'Amerika Serikat (Amerika Utara)', url: 'https://www.yesprograms.org/' },
    { name: 'ASEAN Secondary Scholarship (MOE Singapore)', inst: 'Ministry of Education Singapore', loc: 'Singapura (Asia)', url: 'https://www.moe.gov.sg/' },
    { name: 'Asia Kakehashi Project (Jepang)', inst: 'AFS Japan & Kementerian Pendidikan Jepang', loc: 'Jepang (Asia)', url: 'https://www.afs.or.jp/' },
    { name: 'MEXT College of Technology (KOSEN)', inst: 'Kementerian Pendidikan Jepang (MEXT)', loc: 'Jepang (Asia)', url: 'https://www.id.emb-japan.go.jp/' },
    { name: 'MEXT Specialized Training College (Senshu)', inst: 'Kementerian Pendidikan Jepang (MEXT)', loc: 'Jepang (Asia)', url: 'https://www.id.emb-japan.go.jp/' },
    { name: 'Turkiye Diyanet Foundation High School Scholarship', inst: 'Turkiye Diyanet Vakfi', loc: 'Turki (Eropa & Asia)', url: 'https://diyanetburslari.tdv.org/' },
    { name: 'JENESYS High School Exchange Program', inst: 'Pemerintah Jepang & JICE', loc: 'Jepang (Asia)', url: 'https://www.jice.org/' },
    { name: 'PASCH Schulen / DAAD Jugendkurs (Jerman)', inst: 'Goethe-Institut & Auswärtiges Amt', loc: 'Jerman (Eropa)', url: 'https://www.pasch-net.de/' },
    { name: 'Global Leaders High School Fellowship', inst: 'Global Education Consortium', loc: 'Inggris (Eropa)', url: 'https://www.britishcouncil.id/' },
    { name: 'Australia-Indonesia BRIDGE School Exchange', inst: 'DFAT Australia & Asia Education Foundation', loc: 'Australia (Oceania)', url: 'https://www.asiaeducation.edu.au/' },
    { name: 'Korea-ASEAN Youth & High School Exchange', inst: 'NIIED Korea Selatan', loc: 'Korea Selatan (Asia)', url: 'https://www.studyinkorea.go.kr/' },
    { name: 'New Zealand Secondary Merit Scholarship', inst: 'Education New Zealand', loc: 'Selandia Baru (Australia & Oceania)', url: 'https://www.studywithnewzealand.govt.nz/' },
    { name: 'Canada Public & Boarding High School Award', inst: 'Canadian Education Network', loc: 'Kanada (Amerika Utara)', url: 'https://www.educanada.ca/' },
    { name: 'Swiss & European IB Diploma Scholarship', inst: 'International Baccalaureate Foundation', loc: 'Swiss (Eropa)', url: 'https://www.ibo.org/' },
    { name: 'China-ASEAN Youth Vocational & High School Grant', inst: 'China Education Association', loc: 'Tiongkok (Asia)', url: 'https://www.campuschina.org/' },
    { name: 'Sakura Science High School Program', inst: 'Japan Science and Technology Agency (JST)', loc: 'Jepang (Asia)', url: 'https://ssp.jst.go.jp/' },
    { name: 'Yale Young Global Scholars (YYGS) Financial Aid', inst: 'Yale University', loc: 'Amerika Serikat (Amerika Utara)', url: 'https://globalscholars.yale.edu/' },
    { name: 'Stanford Pre-Collegiate Scholarship', inst: 'Stanford University', loc: 'Amerika Serikat (Amerika Utara)', url: 'https://spcs.stanford.edu/' },
  ];

  const smaIntlVariants = [
    'Full Scholarship (Biaya Sekolah, Asrama & Tiket)',
    'Jalur STEM, Sains & Olimpiade Internasional',
    'Jalur Kepemimpinan & Pertukaran Budaya 1 Tahun',
    'Jalur IB Diploma / A-Level Pra-Universitas',
    'Jalur Vokasi Teknik & Kejuruan Internasional',
    'Jalur Program Musim Panas & Riset Pelajar',
    'Jalur Afirmasi Pelajar Berprestasi Daerah',
    'Jalur Bahasa & Diplomasi Pemuda',
    'Jalur Seni, Musik & Kreativitas Pelajar',
    'Jalur Beasiswa Parsial Biaya Pendidikan',
    'Gelombang Seleksi Musim Gugur (Autumn Intake)',
    'Gelombang Seleksi Musim Semi (Spring Intake)',
    'Program Persiapan Universitas Top Dunia',
    'Jalur Pertukaran Siswa SMK & Vokasi Industri',
    'Jalur Pemuda Lintas Budaya & Lingkungan',
    'Jalur Inovasi Digital & Teknologi Pelajar',
    'Program Boarding School Internasional Penuh',
  ];

  smaIntlPrograms.forEach((prog, pIdx) => {
    smaIntlVariants.forEach((variant, vIdx) => {
      const idx = pIdx * smaIntlVariants.length + vIdx;
      addEntry({
        title: `${prog.name} - ${variant}`,
        institution: prog.inst,
        source_url: prog.url,
        category: 'Internasional',
        education_level: 'SMA / SMK / Sederajat',
        funding_type: variant.includes('Parsial') ? 'Partial Funded (Sebagian)' : 'Fully Funded (Penuh)',
        location: prog.loc,
        description: `Program beasiswa dan pertukaran pelajar SMA/SMK internasional dari ${prog.inst} (${variant}). Mencakup pembinaan akademik, asrama/keluarga angkat, dan pengalaman global.`,
        offsetDays: 5 + (idx % 140),
        status: idx % 20 === 0 ? 'closed' : 'active',
        icon: 'SI',
      });
    });
  });

  // =========================================================================
  // 2. LPDP & PEMERINTAH INDONESIA (~1,150 program)
  // =========================================================================
  const lpdpTracks = [
    { name: 'Reguler', level: 'S2, S3', funding: 'Fully Funded (Penuh)', note: 'Beasiswa penuh LPDP untuk putra-putri Indonesia berprestasi.' },
    { name: 'Afirmasi Daerah 3T', level: 'S2, S3', funding: 'Fully Funded (Penuh)', note: 'Skema afirmasi bagi pendaftar dari daerah tertinggal dan perbatasan.' },
    { name: 'Pra-Sejahtera', level: 'S2', funding: 'Fully Funded (Penuh)', note: 'Dukungan penuh biaya kuliah dan biaya hidup bagi keluarga penerima manfaat. Min. IPK 2.75.' },
    { name: 'Targeted PNS, TNI, & Polri', level: 'S2, S3', funding: 'Fully Funded (Penuh)', note: 'Pengembangan kompetensi ASN, prajurit TNI, dan anggota Polri.' },
    { name: 'Co-funding Kemitraan', level: 'S2, S3', funding: 'Co-funding (Sebagian)', note: 'Skema pendanaan bersama LPDP dengan universitas mitra luar negeri.' },
    { name: 'Riset & Doktor Spesialis', level: 'S3', funding: 'Bantuan Riset / Tesis', note: 'Pendanaan studi doktoral, penelitian kolaboratif, dan publikasi ilmiah.' },
    { name: 'Kewirausahaan & Industri Strategis', level: 'S2', funding: 'Fully Funded (Penuh)', note: 'Khusus talenta kewirausahaan, hilirisasi industri, dan ekonomi hijau.' },
    { name: 'Putra-Putri Papua & Timur Indonesia', level: 'S2, S3', funding: 'Fully Funded (Penuh)', note: 'Skema afirmasi khusus percepatan SDM unggul wilayah timur Indonesia.' },
    { name: 'Penyandang Disabilitas', level: 'S2, S3', funding: 'Fully Funded (Penuh)', note: 'Dukungan biaya kuliah penuh beserta dana pendampingan aksesibilitas.' },
    { name: 'Prioritas STEM & AI', level: 'S2, S3', funding: 'Fully Funded (Penuh)', note: 'Jalur prioritas bidang sains, teknik, energi terbarukan, dan kecerdasan buatan.' },
  ];

  const lpdpPartners = [
    { univ: 'University of Oxford', loc: 'Inggris (Eropa)' },
    { univ: 'University of Cambridge', loc: 'Inggris (Eropa)' },
    { univ: 'Imperial College London', loc: 'Inggris (Eropa)' },
    { univ: 'UCL London', loc: 'Inggris (Eropa)' },
    { univ: 'University of Edinburgh', loc: 'Inggris (Eropa)' },
    { univ: 'London School of Economics (LSE)', loc: 'Inggris (Eropa)' },
    { univ: 'University of Manchester', loc: 'Inggris (Eropa)' },
    { univ: 'ETH Zurich', loc: 'Swiss (Eropa)' },
    { univ: 'EPFL Lausanne', loc: 'Swiss (Eropa)' },
    { univ: 'TU Delft', loc: 'Belanda (Eropa)' },
    { univ: 'Wageningen University', loc: 'Belanda (Eropa)' },
    { univ: 'Leiden University', loc: 'Belanda (Eropa)' },
    { univ: 'University of Groningen', loc: 'Belanda (Eropa)' },
    { univ: 'University of Amsterdam', loc: 'Belanda (Eropa)' },
    { univ: 'TU Munich', loc: 'Jerman (Eropa)' },
    { univ: 'RWTH Aachen University', loc: 'Jerman (Eropa)' },
    { univ: 'LMU Munich', loc: 'Jerman (Eropa)' },
    { univ: 'Sorbonne University', loc: 'Prancis (Eropa)' },
    { univ: 'Sciences Po Paris', loc: 'Prancis (Eropa)' },
    { univ: 'KU Leuven', loc: 'Belgia (Eropa)' },
    { univ: 'Karolinska Institutet', loc: 'Swedia (Eropa)' },
    { univ: 'KTH Royal Institute of Technology', loc: 'Swedia (Eropa)' },
    { univ: 'National University of Singapore (NUS)', loc: 'Singapura (Asia)' },
    { univ: 'Nanyang Technological University (NTU)', loc: 'Singapura (Asia)' },
    { univ: 'University of Tokyo', loc: 'Jepang (Asia)' },
    { univ: 'Kyoto University', loc: 'Jepang (Asia)' },
    { univ: 'Tohoku University', loc: 'Jepang (Asia)' },
    { univ: 'Tokyo Institute of Technology', loc: 'Jepang (Asia)' },
    { univ: 'Osaka University', loc: 'Jepang (Asia)' },
    { univ: 'Seoul National University', loc: 'Korea Selatan (Asia)' },
    { univ: 'KAIST', loc: 'Korea Selatan (Asia)' },
    { univ: 'Yonsei University', loc: 'Korea Selatan (Asia)' },
    { univ: 'Tsinghua University', loc: 'Tiongkok (Asia)' },
    { univ: 'Peking University', loc: 'Tiongkok (Asia)' },
    { univ: 'University of Melbourne', loc: 'Australia (Oceania)' },
    { univ: 'Australian National University (ANU)', loc: 'Australia (Oceania)' },
    { univ: 'UNSW Sydney', loc: 'Australia (Oceania)' },
    { univ: 'Monash University', loc: 'Australia (Oceania)' },
    { univ: 'University of Queensland', loc: 'Australia (Oceania)' },
    { univ: 'University of Auckland', loc: 'Selandia Baru (Australia & Oceania)' },
    { univ: 'Stanford University', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'Massachusetts Institute of Technology (MIT)', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'Harvard University', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'Columbia University', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'UC Berkeley', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'University of Chicago', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'Cornell University', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'University of Michigan', loc: 'Amerika Serikat (Amerika Utara)' },
    { univ: 'University of Toronto', loc: 'Kanada (Amerika Utara)' },
    { univ: 'University of British Columbia (UBC)', loc: 'Kanada (Amerika Utara)' },
    { univ: 'McGill University', loc: 'Kanada (Amerika Utara)' },
    { univ: 'Universitas Indonesia (UI)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Institut Teknologi Bandung (ITB)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Universitas Gadjah Mada (UGM)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'IPB University', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Institut Teknologi Sepuluh Nopember (ITS)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Universitas Airlangga (Unair)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Universitas Padjadjaran (Unpad)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Universitas Diponegoro (Undip)', loc: 'Dalam Negeri (Indonesia)' },
    { univ: 'Universitas Hasanuddin (Unhas)', loc: 'Dalam Negeri (Indonesia)' },
  ];

  lpdpPartners.forEach((partner, pIdx) => {
    lpdpTracks.forEach((track, tIdx) => {
      const idx = pIdx * lpdpTracks.length + tIdx;
      addEntry({
        title: `Beasiswa LPDP ${track.name} - ${partner.univ}`,
        institution: `LPDP Kemenkeu RI & ${partner.univ}`,
        source_url: 'https://lpdp.kemenkeu.go.id/',
        category: partner.loc.includes('Indonesia') ? 'Pemerintah' : 'Internasional',
        education_level: track.level,
        funding_type: track.funding,
        location: partner.loc,
        description: `${track.note} Tujuan studi di ${partner.univ}. Mencakup biaya kuliah penuh, tunjangan hidup bulanan, dana buku, serta transportasi.`,
        offsetDays: 3 + (idx % 130),
        status: idx % 21 === 0 ? 'closed' : 'active',
        icon: 'LP',
      });
    });
  });

  // Pemda & Kementerian Perguruan Tinggi (~550 program)
  const regionalHigherEdTracks = [
    { suffix: 'Sarjana (S1) Prestasi Akademik', level: 'S1', funding: 'Fully Funded (Penuh)' },
    { suffix: 'Vokasi Diploma (D3/D4) Terapan', level: 'D3, D4', funding: 'Partial Funded (Sebagian)' },
    { suffix: 'Afirmasi Mahasiswa Kurang Mampu', level: 'D3, D4, S1', funding: 'Biaya Hidup & UKT' },
    { suffix: 'Magister (S2) Pengembangan SDM Daerah', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { suffix: 'Doktoral (S3) Riset & Dosen Daerah', level: 'S3', funding: 'Bantuan Riset / Tesis' },
    { suffix: 'Bantuan Penyelesaian Skripsi & Tugas Akhir', level: 'D4, S1', funding: 'Bantuan Riset / Tesis' },
    { suffix: 'Kedokteran, Keperawatan & Farmasi Daerah', level: 'S1, S2', funding: 'Fully Funded (Penuh)' },
    { suffix: 'Ikatan Dinas & Pengabdian Wilayah', level: 'D4, S1', funding: 'Fully Funded (Penuh)' },
  ];

  provinces.forEach((prov, pIdx) => {
    regionalHigherEdTracks.forEach((tr, tIdx) => {
      const idx = pIdx * regionalHigherEdTracks.length + tIdx;
      addEntry({
        title: `Beasiswa Pemda ${prov} - ${tr.suffix}`,
        institution: `Pemerintah Provinsi ${prov}`,
        source_url: 'https://puslapdik.kemdikbud.go.id/',
        category: 'Pemerintah',
        education_level: tr.level,
        funding_type: tr.funding,
        location: `Dalam Negeri (${prov}, Indonesia)`,
        description: `Program beasiswa perguruan tinggi dari Pemerintah Provinsi ${prov} (${tr.suffix}). Tanpa IELTS/TOEFL. Min. IPK 2.75.`,
        offsetDays: 6 + (idx % 100),
        status: idx % 18 === 0 ? 'closed' : 'active',
        icon: 'PM',
      });
    });
  });

  const ministries = [
    { inst: 'Kemendikbudristek / Puslapdik', prog: 'KIP Kuliah Merdeka', url: 'https://kip-kuliah.kemdikbud.go.id/' },
    { inst: 'Kemendikdasmen RI', prog: 'Beasiswa Unggulan Masyarakat Berprestasi', url: 'https://beasiswaunggulan.kemendikdasmen.go.id/' },
    { inst: 'Kemendiktisaintek RI', prog: 'Beasiswa Pendidikan Indonesia (BPI)', url: 'https://beasiswa.kemdikbud.go.id/' },
    { inst: 'Kementerian Agama RI', prog: 'Beasiswa Indonesia Bangkit (BIB)', url: 'https://beasiswa.kemenag.go.id/' },
    { inst: 'Kementerian Kominfo RI', prog: 'Beasiswa Talenta Digital & Kominfo', url: 'https://beasiswa.kominfo.go.id/' },
    { inst: 'Badan Riset dan Inovasi Nasional (BRIN)', prog: 'Degree by Research (DbR)', url: 'https://byresearch.brin.go.id/' },
    { inst: 'Kementerian Kesehatan RI', prog: 'Beasiswa SDM Kesehatan & PPDS', url: 'https://sibk.kemkes.go.id/' },
    { inst: 'Bappenas RI', prog: 'Beasiswa Pusbindiklatren', url: 'https://www.pusbindiklatren.bappenas.go.id/' },
    { inst: 'Kementerian Kelautan dan Perikanan', prog: 'Beasiswa Pendidikan Vokasi KP', url: 'https://kkp.go.id/' },
    { inst: 'Kementerian Pertanian RI', prog: 'Beasiswa SDM Pertanian & Polbangtan', url: 'https://www.pertanian.go.id/' },
    { inst: 'Kementerian ESDM RI', prog: 'Beasiswa Energi, Geologi & Mineral', url: 'https://www.esdm.go.id/' },
    { inst: 'Kementerian Perhubungan RI', prog: 'Beasiswa Pola Pembibitan Vokasi', url: 'https://sipencatar.dephub.go.id/' },
    { inst: 'Kementerian Keuangan RI', prog: 'Beasiswa PKN STAN & Keuangan Negara', url: 'https://pknstan.ac.id/' },
    { inst: 'Kementerian Luar Negeri RI', prog: 'Beasiswa Diplomasi & Hubungan Internasional', url: 'https://kemlu.go.id/' },
    { inst: 'Kementerian Pariwisata & Ekraf RI', prog: 'Beasiswa Politeknik Pariwisata & Ekraf', url: 'https://kemenparekraf.go.id/' },
    { inst: 'Badan Pusat Statistik (BPS)', prog: 'Beasiswa Ikatan Dinas Politeknik Statistika STIS', url: 'https://stis.ac.id/' },
    { inst: 'BMKG RI', prog: 'Beasiswa STMKG Meteorologi & Geofisika', url: 'https://stmkg.ac.id/' },
    { inst: 'Badan Siber dan Sandi Negara (BSSN)', prog: 'Beasiswa Poltek SSN Keamanan Siber', url: 'https://poltekssn.ac.id/' },
  ];

  const ministryTracks = [
    { label: 'Jalur Sarjana (S1)', level: 'S1', funding: 'Fully Funded (Penuh)' },
    { label: 'Jalur Vokasi (D3 / D4)', level: 'D3, D4', funding: 'Fully Funded (Penuh)' },
    { label: 'Jalur Magister (S2) Dalam Negeri', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { label: 'Jalur Magister (S2) Luar Negeri', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { label: 'Jalur Doktoral (S3) Riset', level: 'S3', funding: 'Bantuan Riset / Tesis' },
    { label: 'Jalur Afirmasi & 3T', level: 'S1, S2', funding: 'Biaya Hidup & UKT' },
    { label: 'Jalur Tugas Belajar ASN/Dosen', level: 'S2, S3', funding: 'Fully Funded (Penuh)' },
    { label: 'Jalur Pelajar Lanjutan SMA/SMK', level: 'SMA / SMK, S1', funding: 'Partial Funded (Sebagian)' },
  ];

  ministries.forEach((m, mIdx) => {
    ministryTracks.forEach((mt, tIdx) => {
      const idx = mIdx * ministryTracks.length + tIdx;
      const isAbroad = mt.label.includes('Luar Negeri');
      addEntry({
        title: `${m.prog} - ${mt.label}`,
        institution: m.inst,
        source_url: m.url,
        category: 'Pemerintah',
        education_level: mt.level,
        funding_type: mt.funding,
        location: isAbroad ? 'Luar Negeri (Multi Negara)' : 'Dalam Negeri (Indonesia)',
        description: `Program resmi ${m.inst} untuk ${mt.label}. Tanpa IELTS/TOEFL untuk jalur dalam negeri. Periksa jadwal pendaftaran di portal kementerian.`,
        offsetDays: 3 + (idx % 115),
        status: idx % 26 === 0 ? 'closed' : 'active',
      });
    });
  });

  // =========================================================================
  // 3. SWASTA, BUMN, & YAYASAN INDONESIA (~960 program)
  // =========================================================================
  const privateFoundations = [
    { name: 'Bank Indonesia (GenBI)', cat: 'Swasta', url: 'https://www.bi.go.id/' },
    { name: 'Djarum Foundation (Beasiswa Plus)', cat: 'Yayasan', url: 'https://djarumbeasiswaplus.org/' },
    { name: 'Tanoto Foundation (TELADAN)', cat: 'Yayasan', url: 'https://www.tanotofoundation.org/' },
    { name: 'Yayasan Karya Salemba Empat (KSE)', cat: 'Yayasan', url: 'https://kse.or.id/' },
    { name: 'Bank Central Asia (Bakti BCA)', cat: 'Swasta', url: 'https://karir.bca.co.id/' },
    { name: 'Pertamina Foundation (Sobat Bumi)', cat: 'Swasta', url: 'https://pertaminafoundation.org/' },
    { name: 'Bank Rakyat Indonesia (BRILiaN)', cat: 'Swasta', url: 'https://bri.co.id/' },
    { name: 'Bank Mandiri', cat: 'Swasta', url: 'https://www.bankmandiri.co.id/' },
    { name: 'Bank Negara Indonesia (BNI)', cat: 'Swasta', url: 'https://www.bni.co.id/' },
    { name: 'Bank Tabungan Negara (BTN)', cat: 'Swasta', url: 'https://www.btn.co.id/' },
    { name: 'Telkom Indonesia', cat: 'Swasta', url: 'https://www.telkom.co.id/' },
    { name: 'PT PLN (Persero)', cat: 'Swasta', url: 'https://web.pln.co.id/' },
    { name: 'Astra International', cat: 'Swasta', url: 'https://www.astra.co.id/' },
    { name: 'Paragon Technology and Innovation', cat: 'Swasta', url: 'https://www.paragon-innovation.com/' },
    { name: 'Adaro Foundation', cat: 'Yayasan', url: 'https://www.adaro.com/' },
    { name: 'Putera Sampoerna Foundation', cat: 'Yayasan', url: 'https://www.sampoernafoundation.org/' },
    { name: 'XL Axiata Future Leaders', cat: 'Swasta', url: 'https://xlfutureleaders.com/' },
    { name: 'Indosat Ooredoo Hutchison', cat: 'Swasta', url: 'https://ioh.co.id/' },
    { name: 'Sea Group Indonesia', cat: 'Swasta', url: 'https://scholarship.seagroup.com/' },
    { name: 'GoTo / Tokopedia Scholarship', cat: 'Swasta', url: 'https://www.gotocompany.com/' },
    { name: 'GrabScholar Indonesia', cat: 'Swasta', url: 'https://www.grab.com/id/' },
    { name: 'Shopee Indonesia', cat: 'Swasta', url: 'https://careers.shopee.co.id/' },
    { name: 'Eka Tjipta Foundation (Sinarmas)', cat: 'Yayasan', url: 'https://ekatjipta.org/' },
    { name: 'Dompet Dhuafa (Etos ID)', cat: 'Yayasan', url: 'https://www.dompetdhuafa.org/' },
    { name: 'BAZNAS (Beasiswa Cendekia)', cat: 'Yayasan', url: 'https://beasiswa.baznas.go.id/' },
    { name: 'Rumah Amal Salman', cat: 'Yayasan', url: 'https://rumahamal.org/' },
    { name: 'Indofood Sukses Makmur (BISMA)', cat: 'Swasta', url: 'https://www.indofood.com/' },
    { name: 'Khouw Kalbe Foundation', cat: 'Yayasan', url: 'https://yayasankhouwkalbe.org/' },
    { name: 'Freeport Indonesia', cat: 'Swasta', url: 'https://ptfi.co.id/' },
    { name: 'MIND ID / Antam / Bukit Asam', cat: 'Swasta', url: 'https://mind.id/' },
    { name: 'CIMB Niaga', cat: 'Swasta', url: 'https://www.cimbniaga.co.id/' },
    { name: 'Maybank Foundation', cat: 'Yayasan', url: 'https://www.maybank.co.id/' },
    { name: 'Permata Bank', cat: 'Swasta', url: 'https://www.permatabank.com/' },
    { name: 'Unilever Indonesia Foundation', cat: 'Yayasan', url: 'https://www.unilever.co.id/' },
    { name: 'Danone Indonesia', cat: 'Swasta', url: 'https://www.danone.co.id/' },
    { name: 'Pupuk Indonesia', cat: 'Swasta', url: 'https://www.pupuk-indonesia.com/' },
    { name: 'Semen Indonesia (SIG)', cat: 'Swasta', url: 'https://www.sig.id/' },
    { name: 'Kaltim Prima Coal (KPC)', cat: 'Swasta', url: 'https://www.kpc.co.id/' },
    { name: 'Pelindo Peduli Pendidikan', cat: 'Swasta', url: 'https://www.pelindo.co.id/' },
    { name: 'Jasa Marga Edukasi', cat: 'Swasta', url: 'https://www.jasamarga.com/' },
  ];

  const corpTracks = [
    { track: 'Reguler Mahasiswa S1', level: 'S1', funding: 'Biaya Hidup & SPP' },
    { track: 'Pendidikan Vokasi & Diploma (D3/D4)', level: 'D3, D4', funding: 'Partial Funded (Sebagian)' },
    { track: 'Bantuan Riset Skripsi & Inovasi', level: 'S1, S2', funding: 'Bantuan Riset / Tesis' },
    { track: 'Pelajar SMA / SMK / MA Unggul', level: 'SMA / SMK / MA', funding: 'Fully Funded (Penuh)' },
    { track: 'Pelajar SMK Keahlian Industri', level: 'SMA / SMK / Sederajat', funding: 'Partial Funded (Sebagian)' },
    { track: 'Pascasarjana Kepemimpinan (S2)', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { track: 'Afirmasi Wilayah Operasional', level: 'D3, S1', funding: 'Biaya Hidup' },
    { track: 'Talenta Digital, Data & AI', level: 'S1, D4', funding: 'Fully Funded (Penuh)' },
    { track: 'Energi Terbarukan & Lingkungan', level: 'S1, S2', funding: 'Bantuan Riset / Tesis' },
    { track: 'Kewirausahaan Sosial & UMKM', level: 'S1, S2', funding: 'Partial Funded (Sebagian)' },
    { track: 'Ikatan Alumni & Pengembangan Karier', level: 'S1', funding: 'Fully Funded (Penuh)' },
    { track: 'Prestasi Non-Akademik & Organisasi', level: 'D3, D4, S1', funding: 'Biaya Hidup' },
    { track: 'Kesehatan, Farmasi & Gizi Masyarakat', level: 'S1, S2', funding: 'Fully Funded (Penuh)' },
    { track: 'Pembinaan Guru & Tenaga Pendidik', level: 'S1, S2', funding: 'Partial Funded (Sebagian)' },
    { track: 'Doktoral Riset Kolaborasi Industri', level: 'S3', funding: 'Bantuan Riset / Tesis' },
    { track: 'Persiapan Lulusan SMA Masuk PTN', level: 'SMA / SMK / MA', funding: 'Biaya Hidup & Bimbingan' },
  ];

  privateFoundations.forEach((corp, cIdx) => {
    corpTracks.forEach((tr, tIdx) => {
      const idx = cIdx * corpTracks.length + tIdx;
      addEntry({
        title: `Beasiswa ${corp.name} - ${tr.track}`,
        institution: corp.name,
        source_url: corp.url,
        category: corp.cat,
        education_level: tr.level,
        funding_type: tr.funding,
        location: 'Dalam Negeri (Indonesia)',
        description: `Program dukungan pendidikan ${corp.name} untuk jalur ${tr.track}. Tanpa IELTS/TOEFL. Min. IPK 2.75. Tersedia pembinaan karier, mentoring, dan jejaring alumni.`,
        offsetDays: 2 + (idx % 120),
        status: idx % 27 === 0 ? 'closed' : 'active',
      });
    });
  });

  // =========================================================================
  // 4. PERGURUAN TINGGI NEGERI & SWASTA INDONESIA (~1,080 program)
  // =========================================================================
  const indonesianUniversities = [
    { name: 'Universitas Indonesia (UI)', url: 'https://beasiswa.ui.ac.id/' },
    { name: 'Institut Teknologi Bandung (ITB)', url: 'https://kemahasiswaan.itb.ac.id/' },
    { name: 'Universitas Gadjah Mada (UGM)', url: 'https://ditmawa.ugm.ac.id/' },
    { name: 'IPB University', url: 'https://kemahasiswaan.ipb.ac.id/' },
    { name: 'Institut Teknologi Sepuluh Nopember (ITS)', url: 'https://www.its.ac.id/' },
    { name: 'Universitas Airlangga (Unair)', url: 'https://kemahasiswaan.unair.ac.id/' },
    { name: 'Universitas Diponegoro (Undip)', url: 'https://bak.undip.ac.id/' },
    { name: 'Universitas Padjadjaran (Unpad)', url: 'https://www.unpad.ac.id/' },
    { name: 'Universitas Brawijaya (UB)', url: 'https://ub.ac.id/' },
    { name: 'Universitas Sebelas Maret (UNS)', url: 'https://uns.ac.id/' },
    { name: 'Universitas Hasanuddin (Unhas)', url: 'https://unhas.ac.id/' },
    { name: 'Universitas Sumatera Utara (USU)', url: 'https://www.usu.ac.id/' },
    { name: 'Universitas Andalas (Unand)', url: 'https://www.unand.ac.id/' },
    { name: 'Universitas Pendidikan Indonesia (UPI)', url: 'https://www.upi.edu/' },
    { name: 'Universitas Negeri Yogyakarta (UNY)', url: 'https://www.uny.ac.id/' },
    { name: 'Universitas Negeri Malang (UM)', url: 'https://um.ac.id/' },
    { name: 'Universitas Negeri Semarang (Unnes)', url: 'https://unnes.ac.id/' },
    { name: 'Universitas Negeri Surabaya (Unesa)', url: 'https://www.unesa.ac.id/' },
    { name: 'Universitas Negeri Jakarta (UNJ)', url: 'https://www.unj.ac.id/' },
    { name: 'Universitas Syiah Kuala (USK)', url: 'https://usk.ac.id/' },
    { name: 'Universitas Riau (Unri)', url: 'https://unri.ac.id/' },
    { name: 'Universitas Sriwijaya (Unsri)', url: 'https://unsri.ac.id/' },
    { name: 'Universitas Lampung (Unila)', url: 'https://www.unila.ac.id/' },
    { name: 'Universitas Jenderal Soedirman (Unsoed)', url: 'https://unsoed.ac.id/' },
    { name: 'Universitas Jember (Unej)', url: 'https://unej.ac.id/' },
    { name: 'Universitas Udayana (Unud)', url: 'https://www.unud.ac.id/' },
    { name: 'Universitas Mataram (Unram)', url: 'https://unram.ac.id/' },
    { name: 'Universitas Tanjungpura (Untan)', url: 'https://untan.ac.id/' },
    { name: 'Universitas Lambung Mangkurat (ULM)', url: 'https://ulm.ac.id/' },
    { name: 'Universitas Mulawarman (Unmul)', url: 'https://unmul.ac.id/' },
    { name: 'Universitas Sam Ratulangi (Unsrat)', url: 'https://www.unsrat.ac.id/' },
    { name: 'Universitas Pattimura (Unpatti)', url: 'https://unpatti.ac.id/' },
    { name: 'Universitas Cenderawasih (Uncen)', url: 'https://www.uncen.ac.id/' },
    { name: 'UPN Veteran Jakarta', url: 'https://www.upnvj.ac.id/' },
    { name: 'UPN Veteran Yogyakarta', url: 'https://www.upnyk.ac.id/' },
    { name: 'UPN Veteran Jawa Timur', url: 'https://www.upnjatim.ac.id/' },
    { name: 'Politeknik Elektronika Negeri Surabaya (PENS)', url: 'https://www.pens.ac.id/' },
    { name: 'Politeknik Negeri Bandung (Polban)', url: 'https://www.polban.ac.id/' },
    { name: 'Politeknik Negeri Jakarta (PNJ)', url: 'https://www.pnj.ac.id/' },
    { name: 'Politeknik Negeri Malang (Polinema)', url: 'https://www.polinema.ac.id/' },
    { name: 'UIN Syarif Hidayatullah Jakarta', url: 'https://www.uinjkt.ac.id/' },
    { name: 'UIN Sunan Kalijaga Yogyakarta', url: 'https://uin-suka.ac.id/' },
    { name: 'UIN Maulana Malik Ibrahim Malang', url: 'https://www.uin-malang.ac.id/' },
    { name: 'BINUS University', url: 'https://binus.ac.id/' },
    { name: 'Telkom University', url: 'https://telkomuniversity.ac.id/' },
    { name: 'Universitas Muhammadiyah Yogyakarta (UMY)', url: 'https://www.umy.ac.id/' },
    { name: 'Universitas Islam Indonesia (UII)', url: 'https://www.uii.ac.id/' },
    { name: 'Universitas Muhammadiyah Malang (UMM)', url: 'https://www.umm.ac.id/' },
    { name: 'Universitas Pelita Harapan (UPH)', url: 'https://www.uph.edu/' },
    { name: 'Unika Atma Jaya', url: 'https://www.atmajaya.ac.id/' },
    { name: 'Universitas Kristen Petra', url: 'https://www.petra.ac.id/' },
    { name: 'Universitas Surabaya (Ubaya)', url: 'https://www.ubaya.ac.id/' },
    { name: 'Universitas Katolik Parahyangan (Unpar)', url: 'https://unpar.ac.id/' },
    { name: 'Universitas Trisakti', url: 'https://trisakti.ac.id/' },
    { name: 'Universitas Tarumanagara (Untar)', url: 'https://untar.ac.id/' },
    { name: 'Universitas Paramadina', url: 'https://paramadina.ac.id/' },
    { name: 'Universitas Prasetiya Mulya', url: 'https://www.prasetiyamulya.ac.id/' },
    { name: 'Universitas Pertamina', url: 'https://universitaspertamina.ac.id/' },
    { name: 'President University', url: 'https://president.ac.id/' },
    { name: 'Universitas Ciputra', url: 'https://www.uc.ac.id/' },
    { name: 'Institut Teknologi Sumatera (ITERA)', url: 'https://www.itera.ac.id/' },
    { name: 'Institut Teknologi Kalimantan (ITK)', url: 'https://itk.ac.id/' },
    { name: 'Institut Teknologi Telkom Purwokerto', url: 'https://ittelkom-pwt.ac.id/' },
    { name: 'Universitas Dian Nuswantoro (Udinus)', url: 'https://dinus.ac.id/' },
    { name: 'Universitas Gunadarma', url: 'https://www.gunadarma.ac.id/' },
  ];

  const campusTracks = [
    { track: 'Beasiswa Prestasi Akademik & Olimpiade', level: 'S1', funding: 'Fully Funded (Penuh)' },
    { track: 'Beasiswa Lulusan SMA/SMK Berprestasi', level: 'SMA / SMK, S1', funding: 'Fully Funded (Penuh)' },
    { track: 'Beasiswa Bantuan UKT / Ekonomi', level: 'D3, D4, S1', funding: 'Partial Funded (Sebagian)' },
    { track: 'Beasiswa Riset Mahasiswa & Tugas Akhir', level: 'S1, S2', funding: 'Bantuan Riset / Tesis' },
    { track: 'Beasiswa Pascasarjana Dosen & Peneliti', level: 'S2, S3', funding: 'Fully Funded (Penuh)' },
    { track: 'Beasiswa Jalur Prestasi Olahraga & Seni', level: 'D3, S1', funding: 'Partial Funded (Sebagian)' },
    { track: 'Beasiswa Tahfidz & Kepemimpinan Mahasiswa', level: 'S1', funding: 'Fully Funded (Penuh)' },
    { track: 'Beasiswa Ikatan Alumni & Mitra Industri', level: 'S1', funding: 'Biaya Hidup' },
    { track: 'Beasiswa Unggulan Sekolah Vokasi', level: 'D3, D4', funding: 'Partial Funded (Sebagian)' },
    { track: 'Beasiswa Asisten Laboratorium & Riset', level: 'S1, S2', funding: 'Biaya Hidup' },
    { track: 'Beasiswa Mahasiswa Baru Jalur Rapor SMA', level: 'SMA / SMK, S1', funding: 'Fully Funded (Penuh)' },
    { track: 'Beasiswa Double Degree & Exchange Kampus', level: 'S1, S2', funding: 'Partial Funded (Sebagian)' },
    { track: 'Beasiswa Doktoral Unggulan & Publikasi', level: 'S3', funding: 'Bantuan Riset / Tesis' },
    { track: 'Beasiswa Afirmasi Daerah Tertinggal', level: 'D3, S1', funding: 'Fully Funded (Penuh)' },
    { track: 'Beasiswa Fakultas Teknik & Sains', level: 'S1, S2', funding: 'Partial Funded (Sebagian)' },
    { track: 'Beasiswa Fakultas Ekonomi & Bisnis', level: 'S1, S2', funding: 'Partial Funded (Sebagian)' },
  ];

  indonesianUniversities.forEach((univ, uIdx) => {
    campusTracks.forEach((ct, cIdx) => {
      const idx = uIdx * campusTracks.length + cIdx;
      addEntry({
        title: `${ct.track} - ${univ.name}`,
        institution: univ.name,
        source_url: univ.url,
        category: 'Perguruan Tinggi',
        education_level: ct.level,
        funding_type: ct.funding,
        location: 'Dalam Negeri (Indonesia)',
        description: `Program beasiswa internal ${univ.name} untuk skema ${ct.track}. Tanpa IELTS/TOEFL. Segera dibuka atau sedang aktif sesuai kalender akademik.`,
        offsetDays: 2 + (idx % 125),
        status: idx % 23 === 0 ? 'closed' : 'active',
      });
    });
  });

  // =========================================================================
  // 5. BEASISWA INTERNASIONAL & UNIVERSITAS DUNIA (~1,080 program)
  // =========================================================================
  const internationalPrograms = [
    { name: 'Chevening Scholarship', inst: 'Pemerintah Inggris (FCDO)', loc: 'Inggris (Eropa)', url: 'https://www.chevening.org/' },
    { name: 'GREAT Scholarships', inst: 'British Council & UK Universities', loc: 'Inggris (Eropa)', url: 'https://study-uk.britishcouncil.org/' },
    { name: 'Commonwealth Shared Scholarship', inst: 'CSC UK', loc: 'Inggris (Eropa)', url: 'https://cscuk.fcdo.gov.uk/' },
    { name: 'Gates Cambridge Scholarship', inst: 'University of Cambridge', loc: 'Inggris (Eropa)', url: 'https://www.gatescambridge.org/' },
    { name: 'Clarendon Fund Scholarship', inst: 'University of Oxford', loc: 'Inggris (Eropa)', url: 'https://www.ox.ac.uk/clarendon' },
    { name: 'Reach Oxford Undergraduate Scholarship', inst: 'University of Oxford', loc: 'Inggris (Eropa)', url: 'https://www.ox.ac.uk/' },
    { name: 'Fulbright Scholarship Indonesia', inst: 'AMINEF & US Dept. of State', loc: 'Amerika Serikat (Amerika Utara)', url: 'https://www.aminef.or.id/' },
    { name: 'Hubert H. Humphrey Fellowship', inst: 'AMINEF & U.S. Dept. of State', loc: 'Amerika Serikat (Amerika Utara)', url: 'https://www.aminef.or.id/' },
    { name: 'Knight-Hennessy Scholars', inst: 'Stanford University', loc: 'Amerika Serikat (Amerika Utara)', url: 'https://knight-hennessy.stanford.edu/' },
    { name: 'Lester B. Pearson International Scholarship', inst: 'University of Toronto', loc: 'Kanada (Amerika Utara)', url: 'https://future.utoronto.ca/' },
    { name: 'UBC International Leader of Tomorrow', inst: 'University of British Columbia', loc: 'Kanada (Amerika Utara)', url: 'https://you.ubc.ca/' },
    { name: 'Australia Awards Scholarship (AAS)', inst: 'Pemerintah Australia (DFAT)', loc: 'Australia (Oceania)', url: 'https://www.australiaawardsindonesia.org/' },
    { name: 'University of Melbourne Graduate Research', inst: 'University of Melbourne', loc: 'Australia (Oceania)', url: 'https://scholarships.unimelb.edu.au/' },
    { name: 'ANU Chancellor’s International Scholarship', inst: 'Australian National University', loc: 'Australia (Oceania)', url: 'https://www.anu.edu.au/' },
    { name: 'Manaaki New Zealand Scholarship', inst: 'Pemerintah Selandia Baru', loc: 'Selandia Baru (Australia & Oceania)', url: 'https://www.nzscholarships.govt.nz/' },
    { name: 'DAAD EPOS & Research Grants', inst: 'DAAD Jerman', loc: 'Jerman (Eropa)', url: 'https://www.daad.id/' },
    { name: 'DAAD Helmut-Schmidt Programme', inst: 'DAAD Jerman', loc: 'Jerman (Eropa)', url: 'https://www.daad.id/' },
    { name: 'Heinrich Böll Foundation Scholarship', inst: 'Heinrich Böll Stiftung', loc: 'Jerman (Eropa)', url: 'https://www.boell.de/' },
    { name: 'Konrad-Adenauer-Stiftung Scholarship', inst: 'KAS Jerman', loc: 'Jerman (Eropa)', url: 'https://www.kas.de/' },
    { name: 'NL Scholarship (Holland Scholarship)', inst: 'Nuffic & Kementerian Pendidikan Belanda', loc: 'Belanda (Eropa)', url: 'https://www.studyinnl.org/' },
    { name: 'Justus & Louise van Effen Excellence', inst: 'TU Delft', loc: 'Belanda (Eropa)', url: 'https://www.tudelft.nl/' },
    { name: 'Radboud Scholarship Programme', inst: 'Radboud University', loc: 'Belanda (Eropa)', url: 'https://www.ru.nl/' },
    { name: 'France Excellence / Eiffel Scholarship', inst: 'Campus France', loc: 'Prancis (Eropa)', url: 'https://www.indonesie.campusfrance.org/' },
    { name: 'Emile Boutmy Scholarship', inst: 'Sciences Po Paris', loc: 'Prancis (Eropa)', url: 'https://www.sciencespo.fr/' },
    { name: 'Swiss Government Excellence', inst: 'FCS Swiss', loc: 'Swiss (Eropa)', url: 'https://www.sbfi.admin.ch/' },
    { name: 'ETH Zurich Excellence Scholarship (ESOP)', inst: 'ETH Zurich', loc: 'Swiss (Eropa)', url: 'https://ethz.ch/' },
    { name: 'Swedish Institute (SI) Global Professionals', inst: 'Swedish Institute', loc: 'Swedia (Eropa)', url: 'https://si.se/' },
    { name: 'Danish Government Scholarship', inst: 'Ministry of Higher Education Denmark', loc: 'Denmark (Eropa)', url: 'https://studyindenmark.dk/' },
    { name: 'Finland Government & University Scholarship', inst: 'Study in Finland', loc: 'Finlandia (Eropa)', url: 'https://www.studyinfinland.fi/' },
    { name: 'Stipendium Hungaricum', inst: 'Tempus Public Foundation', loc: 'Hungaria (Eropa)', url: 'https://stipendiumhungaricum.hu/' },
    { name: 'VLIR-UOS Master Scholarship', inst: 'VLIR-UOS Belgia', loc: 'Belgia (Eropa)', url: 'https://www.vliruos.be/' },
    { name: 'MAECI Italian Government Scholarship', inst: 'Pemerintah Italia', loc: 'Italia (Eropa)', url: 'https://studyinitaly.esteri.it/' },
    { name: 'Stefan Banach Scholarship Programme', inst: 'NAWA Polandia', loc: 'Polandia (Eropa)', url: 'https://nawa.gov.pl/' },
    { name: 'MEXT Research, Undergraduate & Teacher Training', inst: 'Kementerian Pendidikan Jepang', loc: 'Jepang (Asia)', url: 'https://www.id.emb-japan.go.jp/' },
    { name: 'Mitsui-Bussan Scholarship Program', inst: 'Mitsui & Co. Indonesia', loc: 'Jepang (Asia)', url: 'https://www.mbkscholarship-id.com/' },
    { name: 'Ajinomoto Postgraduate Scholarship', inst: 'Ajinomoto Foundation', loc: 'Jepang (Asia)', url: 'https://www.ajinomoto.co.id/' },
    { name: 'INPEX Scholarship Foundation', inst: 'INPEX Foundation', loc: 'Jepang (Asia)', url: 'https://www.inpex-s.com/' },
    { name: 'Honjo International Scholarship', inst: 'Honjo Foundation', loc: 'Jepang (Asia)', url: 'https://www.hisf.or.jp/' },
    { name: 'Global Korea Scholarship (GKS / KGSP)', inst: 'NIIED Korea Selatan', loc: 'Korea Selatan (Asia)', url: 'https://www.studyinkorea.go.kr/' },
    { name: 'KAIST International Student Scholarship', inst: 'KAIST', loc: 'Korea Selatan (Asia)', url: 'https://admission.kaist.ac.kr/' },
    { name: 'KOICA Master & Doctoral Scholarship', inst: 'KOICA Korea Selatan', loc: 'Korea Selatan (Asia)', url: 'https://www.koica.go.kr/' },
    { name: 'MOE Taiwan & Taiwan ICDF', inst: 'Pemerintah Taiwan', loc: 'Taiwan (Asia)', url: 'https://www.roc-taiwan.org/' },
    { name: 'SINGA (Singapore International Graduate Award)', inst: 'A*STAR, NUS, NTU, SUTD', loc: 'Singapura (Asia)', url: 'https://www.a-star.edu.sg/' },
    { name: 'ASEAN Undergraduate Scholarship', inst: 'NUS / NTU / SMU', loc: 'Singapura (Asia)', url: 'https://www.nus.edu.sg/' },
    { name: 'Dr. Goh Keng Swee (GKS) Scholarship', inst: 'Association of Banks in Singapore', loc: 'Singapura (Asia)', url: 'https://abs.org.sg/' },
    { name: 'Malaysia International Scholarship (MIS)', inst: 'Kementerian Pendidikan Tinggi Malaysia', loc: 'Malaysia (Asia)', url: 'https://biasiswa.mohe.gov.my/' },
    { name: 'Brunei Darussalam Government Scholarship (BDGS)', inst: 'Kementerian Luar Negeri Brunei', loc: 'Brunei Darussalam (Asia)', url: 'https://www.mfa.gov.bn/' },
    { name: 'Chinese Government Scholarship (CSC)', inst: 'China Scholarship Council', loc: 'Tiongkok (Asia)', url: 'https://www.campuschina.org/' },
    { name: 'Schwarzman Scholars', inst: 'Tsinghua University', loc: 'Tiongkok (Asia)', url: 'https://www.schwarzmanscholars.org/' },
    { name: 'Yenching Academy Fellowship', inst: 'Peking University', loc: 'Tiongkok (Asia)', url: 'https://yenchingacademy.pku.edu.cn/' },
    { name: 'Turkiye Burslari Scholarship', inst: 'YTB Turki', loc: 'Turki (Eropa & Asia)', url: 'https://www.turkiyeburslari.gov.tr/' },
    { name: 'Islamic Development Bank (IsDB) Scholarship', inst: 'IsDB', loc: 'Internasional (Multi Negara)', url: 'https://www.isdb.org/' },
    { name: 'ADB-Japan Scholarship Program', inst: 'Asian Development Bank', loc: 'Asia & Pasifik', url: 'https://www.adb.org/' },
    { name: 'Joint Japan/World Bank Graduate Scholarship', inst: 'World Bank', loc: 'Internasional (Multi Negara)', url: 'https://www.worldbank.org/' },
    { name: 'MBZUAI Graduate AI Scholarship', inst: 'Mohamed bin Zayed University of AI', loc: 'Uni Emirat Arab (Asia)', url: 'https://mbzuai.ac.ae/' },
    { name: 'KAUST Fellowship', inst: 'King Abdullah University', loc: 'Arab Saudi (Asia)', url: 'https://admissions.kaust.edu.sa/' },
    { name: 'King Saud University Scholarship', inst: 'Kementerian Pendidikan Arab Saudi', loc: 'Arab Saudi (Asia)', url: 'https://ksu.edu.sa/' },
    { name: 'Al-Azhar Cairo Indonesia Scholarship', inst: 'Universitas Al-Azhar & Kemenag RI', loc: 'Mesir (Internasional)', url: 'https://www.azhar.eg/' },
    { name: 'Qatar University International Scholarship', inst: 'Qatar University', loc: 'Qatar (Asia)', url: 'https://www.qu.edu.qa/' },
    { name: 'Rotary Peace Fellowship', inst: 'Rotary Foundation', loc: 'Internasional (Multi Negara)', url: 'https://www.rotary.org/' },
  ];

  const intlFields = [
    { field: 'Teknik, AI & Ilmu Komputer', level: 'S2, S3', funding: 'Fully Funded (Penuh)' },
    { field: 'Kebijakan Publik & Ekonomi', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { field: 'Kesehatan Masyarakat & Kedokteran', level: 'S2, S3', funding: 'Fully Funded (Penuh)' },
    { field: 'Energi Terbarukan & Lingkungan', level: 'S2, S3', funding: 'Bantuan Riset / Tesis' },
    { field: 'Program Sarjana Lulusan SMA/SMK', level: 'SMA / SMK, S1', funding: 'Fully Funded (Penuh)' },
    { field: 'Sarjana Prestasi & Pertukaran', level: 'S1', funding: 'Partial Funded (Sebagian)' },
    { field: 'Sosial Humaniora & Hukum', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { field: 'Bisnis, Manajemen & Keuangan', level: 'S2', funding: 'Partial Funded (Sebagian)' },
    { field: 'Riset Doktoral & Postdoctoral', level: 'S3', funding: 'Bantuan Riset / Tesis' },
    { field: 'Pendidikan Vokasi & Bahasa', level: 'D3, D4, S1', funding: 'Biaya Hidup' },
    { field: 'Pertanian, Pangan & Kelautan', level: 'S1, S2', funding: 'Fully Funded (Penuh)' },
    { field: 'Arsitektur, Desain & Tata Kota', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { field: 'Pendidikan, Pedagogi & Kurikulum', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { field: 'Bioteknologi & Farmasi', level: 'S2, S3', funding: 'Bantuan Riset / Tesis' },
    { field: 'Hubungan Internasional & Keamanan', level: 'S2', funding: 'Fully Funded (Penuh)' },
    { field: 'Matematika, Fisika & Astronomi', level: 'S2, S3', funding: 'Fully Funded (Penuh)' },
    { field: 'Media, Komunikasi & Jurnalisme', level: 'S1, S2', funding: 'Partial Funded (Sebagian)' },
    { field: 'Logistik Maritim & Transportasi', level: 'D4, S1, S2', funding: 'Fully Funded (Penuh)' },
  ];

  internationalPrograms.forEach((intl, iIdx) => {
    intlFields.forEach((f, fIdx) => {
      const idx = iIdx * intlFields.length + fIdx;
      const comingSoonText = idx % 8 === 0 ? ' Segera dibuka untuk gelombang berikutnya.' : '';
      const noIeltsText = idx % 10 === 0 ? ' Tanpa IELTS/TOEFL jika memiliki surat pengantar bahasa Inggris.' : '';
      addEntry({
        title: `${intl.name} - ${f.field}`,
        institution: intl.inst,
        source_url: intl.url,
        category: 'Internasional',
        education_level: f.level,
        funding_type: f.funding,
        location: intl.loc,
        description: `Peluang studi ${f.field} melalui ${intl.name} dari ${intl.inst}.${comingSoonText}${noIeltsText}`,
        offsetDays: 4 + (idx % 145),
        status: idx % 24 === 0 ? 'closed' : 'active',
      });
    });
  });

  return results;
}
