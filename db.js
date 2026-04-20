// ============================================================
// e-Audit Dana Desa — Shared Data & Utility Layer
// ============================================================

const DB = {
  getDesas: () => JSON.parse(localStorage.getItem('eaudit_desas') || '[]'),
  getLaporan: () => JSON.parse(localStorage.getItem('eaudit_laporan') || '[]'),
  saveLaporan: (data) => localStorage.setItem('eaudit_laporan', JSON.stringify(data)),
  saveDesas: (data) => localStorage.setItem('eaudit_desas', JSON.stringify(data)),

  getLaporanByDesa: (desaId) => DB.getLaporan().filter(l => l.desaId === desaId),

  getLaporanById: (id) => DB.getLaporan().find(l => l.id === id),

  upsertLaporan: (laporan) => {
    const all = DB.getLaporan();
    const idx = all.findIndex(l => l.id === laporan.id);
    if (idx >= 0) all[idx] = laporan;
    else all.push(laporan);
    DB.saveLaporan(all);
  },

  addCatatan: (laporanId, catatan) => {
    const all = DB.getLaporan();
    const lap = all.find(l => l.id === laporanId);
    if (lap) {
      lap.catatan = lap.catatan || [];
      lap.catatan.push(catatan);
      DB.saveLaporan(all);
    }
  },

  updateStatus: (laporanId, status) => {
    const all = DB.getLaporan();
    const lap = all.find(l => l.id === laporanId);
    if (lap) { lap.status = status; DB.saveLaporan(all); }
  },

  updateCatatanStatus: (laporanId, catatanId, status) => {
    const all = DB.getLaporan();
    const lap = all.find(l => l.id === laporanId);
    if (lap) {
      const cat = lap.catatan.find(c => c.id === catatanId);
      if (cat) cat.status = status;
      DB.saveLaporan(all);
    }
  },

  getStats: () => {
    const desas = DB.getDesas();
    const laporan = DB.getLaporan();
    const byStatus = { 'Belum lapor': 0, 'Draf': 0, 'Dalam review': 0, 'Perlu koreksi': 0, 'Selesai': 0 };
    const laporanDesaIds = new Set(laporan.map(l => l.desaId));
    const belumLapor = desas.filter(d => !laporanDesaIds.has(d.id)).length;
    laporan.forEach(l => { if (byStatus[l.status] !== undefined) byStatus[l.status]++; });
    byStatus['Belum lapor'] = belumLapor;
    return { total: desas.length, masuk: laporan.length, byStatus };
  }
};

const Auth = {
  getUser: () => JSON.parse(sessionStorage.getItem('eaudit_user') || 'null'),
  getRole: () => sessionStorage.getItem('eaudit_role'),
  requireRole: (role) => {
    const r = Auth.getRole();
    if (!r || r !== role) { window.location.href = '../index.html'; }
    return Auth.getUser();
  },
  logout: () => {
    sessionStorage.clear();
    window.location.href = '../index.html';
  }
};

const Fmt = {
  rupiah: (n) => 'Rp ' + Number(n).toLocaleString('id-ID'),
  rupiahShort: (n) => {
    if (n >= 1e9) return 'Rp ' + (n/1e9).toFixed(2) + ' M';
    if (n >= 1e6) return 'Rp ' + (n/1e6).toFixed(1) + ' jt';
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  },
  pct: (real, pagu) => pagu > 0 ? ((real/pagu)*100).toFixed(1) + '%' : '0%',
  totalReal: (r) => Object.values(r || {}).reduce((a,b) => a + Number(b), 0),
  date: (d) => d ? new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) : '—',
  id: (prefix) => prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
};

const STATUS_BADGE = {
  'Belum lapor': 'badge-gray',
  'Draf': 'badge-gray',
  'Dalam review': 'badge-amber',
  'Perlu koreksi': 'badge-blue',
  'Selesai': 'badge-green',
};

const RISIKO_BADGE = { 'Rendah': 'badge-green', 'Sedang': 'badge-amber', 'Tinggi': 'badge-red' };

// Parse Siskeudes CSV export format
const Siskeudes = {
  parse: (csvText) => {
    const lines = csvText.trim().split('\n');
    const result = { pemerintahan: 0, pembangunan: 0, pembinaan: 0, pemberdayaan: 0, penanggulangan: 0, raw: [] };
    const BIDANG_MAP = {
      '1': 'pemerintahan', 'penyelenggaraan': 'pemerintahan', 'pemerintahan': 'pemerintahan',
      '2': 'pembangunan', 'pembangunan': 'pembangunan', 'pelaksanaan pembangunan': 'pembangunan',
      '3': 'pembinaan', 'pembinaan': 'pembinaan', 'pembinaan kemasyarakatan': 'pembinaan',
      '4': 'pemberdayaan', 'pemberdayaan': 'pemberdayaan', 'pemberdayaan masyarakat': 'pemberdayaan',
      '5': 'penanggulangan', 'penanggulangan': 'penanggulangan', 'bencana': 'penanggulangan',
    };

    const header = lines[0].split(';').map(h => h.trim().replace(/"/g,'').toLowerCase());
    const bidangIdx = header.findIndex(h => h.includes('bidang') || h.includes('uraian'));
    const realIdx = header.findIndex(h => h.includes('realisasi') || h.includes('real'));
    const angIdx = header.findIndex(h => h.includes('anggaran') || h.includes('pagu'));

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(';').map(c => c.trim().replace(/"/g,'').replace(/\./g,'').replace(/,/g,'.'));
      if (cols.length < 2) continue;
      const bidangRaw = (cols[bidangIdx] || cols[0] || '').toLowerCase();
      const realisasi = parseFloat(cols[realIdx] || cols[2] || 0) || 0;
      const anggaran = parseFloat(cols[angIdx] || cols[1] || 0) || 0;
      result.raw.push({ bidang: bidangRaw, anggaran, realisasi });
      for (const [key, val] of Object.entries(BIDANG_MAP)) {
        if (bidangRaw.includes(key)) { result[val] += realisasi; break; }
      }
    }
    return result;
  }
};
