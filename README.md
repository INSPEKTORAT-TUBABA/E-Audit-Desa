# e-Audit Dana Desa
**Inspektorat Kabupaten Tulang Bawang Barat**

Sistem e-audit dana desa berbasis web — desa input laporan, inspektorat koreksi, semua terdokumentasi.

---

## Cara Deploy ke GitHub Pages

### 1. Upload ke GitHub
1. Buat repository baru di GitHub (misal: `e-audit-dana-desa`)
2. Upload semua file berikut dengan struktur:
   ```
   index.html
   css/shared.css
   js/db.js
   pages/inspektorat.html
   pages/desa.html
   README.md
   ```
3. Di Settings → Pages → Source: pilih `main` branch, folder `/ (root)`
4. Sistem akan live di: `https://[username].github.io/e-audit-dana-desa/`

---

## Akun Default

### Inspektorat
- **URL**: `pages/inspektorat.html` (login lewat `index.html`)
- **Username**: `admin`
- **Password**: `admin123`

### Operator Desa (contoh)
| Desa | Password |
|------|----------|
| Desa Panaragan | `panaragan2025` |
| Desa Tirta Kencana | `tirta2025` |
| Desa Mulya Kencana | `mulya2025` |
| Desa Bujuk Agung | `bujuk2025` |
| Desa Pagar Dewa | `pagar2025` |
| Desa Candra Kencana | `candra2025` |
| Desa Menggala Mas | `menggala2025` |
| Desa Kibang Yekti | `kibang2025` |

> Password dan daftar desa dapat dikelola langsung dari menu **Kelola Desa** di dashboard inspektorat.

---

## Fitur Sistem

### Inspektorat
- **Dashboard** — statistik real-time, progres per kecamatan, distribusi status audit
- **Daftar Laporan** — tabel semua laporan masuk, filter per status/kecamatan/nama desa
- **Koreksi & Catatan** — input temuan audit (jenis, risiko, uraian, rekomendasi), kirim ke desa
- **Status Audit** — ubah status tiap laporan (Dalam review → Perlu koreksi → Selesai)
- **Ekspor Laporan** — unduh rekap CSV semua desa atau catatan temuan saja
- **Kelola Desa** — tambah/edit data desa dan password login

### Operator Desa
- **Beranda** — ringkasan pagu, realisasi, status, catatan inspektorat terbaru
- **Input Laporan** — wizard 3 langkah (info umum → realisasi per bidang → kirim)
- **Import Siskeudes** — drag & drop file CSV export Siskeudes, otomatis isi form realisasi
- **Status Pengajuan** — riwayat semua laporan yang pernah dikirim
- **Catatan Inspektorat** — lihat dan tandai tindak lanjut catatan koreksi

---

## Import Data dari Siskeudes

Format CSV yang didukung (export dari Siskeudes → Laporan Realisasi APBDesa):

```
Bidang;Anggaran;Realisasi
Penyelenggaraan Pemerintahan;120000000;118000000
Pelaksanaan Pembangunan;650000000;635000000
Pembinaan Kemasyarakatan;100000000;95000000
Pemberdayaan Masyarakat;150000000;142000000
Penanggulangan Bencana;67000000;59000000
```

Sistem akan otomatis mengenali bidang berdasarkan kata kunci dalam nama bidang.

---

## Penyimpanan Data

Saat ini menggunakan **localStorage** browser — data tersimpan di perangkat masing-masing pengguna.

### Untuk produksi (multi-pengguna nyata):
Ganti `localStorage` di `js/db.js` dengan **Firebase Realtime Database** atau **Firestore**:
1. Buat project di [firebase.google.com](https://firebase.google.com)
2. Tambahkan Firebase SDK ke setiap halaman HTML
3. Ganti fungsi `DB.getLaporan()`, `DB.saveLaporan()` dll. dengan Firebase read/write
4. Aktifkan Firebase Authentication untuk login yang lebih aman

---

## Struktur File

```
e-audit-dana-desa/
├── index.html          # Halaman login
├── css/
│   └── shared.css      # Style bersama semua halaman
├── js/
│   └── db.js           # Logika data, utility, parser Siskeudes
├── pages/
│   ├── inspektorat.html  # Dashboard inspektorat
│   └── desa.html         # Portal operator desa
└── README.md
```
