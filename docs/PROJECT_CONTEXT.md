# Project Context & Architecture Documentation

Dokumen ini mendokumentasikan arsitektur, struktur data, dan sistem desain landing page portofolio **I Gede Wirawan**.

---

## 1. Ringkasan Arsitektur & Teknologi

Proyek ini dibangun dengan arsitektur **Express.js Server-Side Rendering (SSR)** dengan template engine **EJS**, serta terintegrasi dengan **Vercel Serverless Function** (`/api/index.js`):

- **Backend Runtime**: Node.js & Express.js (v5)
- **Template Engine**: EJS (Embedded JavaScript)
- **Design Style**: Full-Width Edge-to-Edge Layout terinspirasi dari desain Yogi Pradnyana (`yogipradnyana.netlify.app`) dengan palet warna **Soft Mint Pastel Gradient** dan **Forest Green Accent** (`#1b4332`, `#2d6a4f`)
- **Interactive 3D**: Three.js (r128) Particle Constellation interaktif yang responsif terhadap pergerakan mouse
- **Theme Support**: Dual Theme (Light & Dark Mode) dengan penyimpanan preferensi di `localStorage`
- **Deployment Target**: Vercel (`vercel.json` rewrites ke `/api/index.js`)

---

## 2. Struktur Folder Proyek

```text
portofolio-express/
├── api/
│   └── index.js             # Entry point serverless Express untuk Vercel
├── context/
│   └── portfolioContext.js  # [DATA CONTEXT] Pusat data profil, skills, proyek, dll
├── docs/
│   └── PROJECT_CONTEXT.md   # [DOKUMEN INI] Panduan arsitektur & konteks proyek
├── public/
│   ├── images/              # Aset gambar profil, sertifikat, dan proyek
│   ├── cv.pdf               # File Curriculum Vitae yang dapat diunduh
│   ├── script.js            # Interaksi client-side (Three.js, theme toggle, drawer, modal)
│   └── style.css            # Sistem styling full-width, mint pastel, dan dual theme
├── views/
│   ├── home.ejs             # Template landing page utama (Full-Width, 2-Column Hero)
│   └── 404.ejs              # Halaman 404 Not Found
├── package.json             # Dependensi dan npm scripts
├── server.js                # Local development server runner (port 3000)
└── vercel.json              # Konfigurasi routing Vercel
```

---

## 3. Data Context (`context/portfolioContext.js`)

Data aplikasi dipisahkan secara modular ke dalam file context [`context/portfolioContext.js`](file:///c:/Users/Wirawan/Documents/Portofolio/portofolio-express/context/portfolioContext.js). File ini mengisolasi data dari logika routing agar mudah diperbarui tanpa risiko merusak server logic.

### Skema Data Utama

| Key | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `info` | `Object` | Informasi identitas: nama, array role dinamis, bio, lokasi, email, link GitHub, LinkedIn, URL CV. |
| `skills` | `Array<Object>` | Daftar keahlian teknis beserta nama, kategori (`Frontend`, `Backend`, `Mobile & Tools`), ikon Font Awesome, dan kode warna. |
| `resume.experience` | `Array<Object>` | Pengalaman kerja & magang (Posisi, Perusahaan, Periode, Deskripsi). |
| `resume.education` | `Array<Object>` | Riwayat pendidikan formal (Jurusan/Gelar, Institusi, Periode, Deskripsi). |
| `certificates` | `Array<Object>` | Daftar sertifikat kredensial (Judul, Penerbit, Path Gambar, Deskripsi, Link verifikasi). |
| `projects` | `Array<Object>` | Portofolio proyek (Judul, Deskripsi, Tags, Featured flag, Detail modal, Link GitHub). |

---

## 4. Desain Sistem & Tata Letak

Desain mengadopsi tata letak **Full-Width Edge-to-Edge** yang bersih, lega, dan modern:

### Color Tokens

- **Light Mode Background Gradient**: `linear-gradient(135deg, #F7FDFA 0%, #D9F3E7 50%, #C7EFDD 100%)`
- **Dark Mode Background Gradient**: `linear-gradient(135deg, #06150f 0%, #0b2219 50%, #071711 100%)`
- **Primary Forest Green**: `#1b4332` (Judul besar, tombol pill, link aktif)
- **Primary Hover**: `#2d6a4f`
- **Tilted Card Accent**: `#387a64` (Teal/mint miring di belakang kartu foto profil)
- **Card Background**: `#ffffff` (Light) / `rgba(15, 36, 28, 0.85)` (Dark)
- **Typography**: `Poppins` untuk heading & tombol pill, `Inter` untuk body copy

### Komponen Kunci

1. **Floating Pill Navbar**:
   - Navbar putih melayang membulat (`rounded-full`) dengan logo inisial `GW`.
   - Menu navigasi ke setiap seksi (`Home`, `Skills`, `Projects`, `Experience`, `Certificates`) dengan *smooth scrolling*.
   - Tombol pill hijau `Get in Touch` dan tombol switch tema `☀️ / 🌙`.

2. **Hero Section 2-Kolom**:
   - Kolom Kiri: Greeting `"Hello There 👋"`, Judul nama besar `"I Gede Wirawan"` berwarna hijau botol, dynamic role typing subtitle, bio, dan tombol pill `"Download CV"`.
   - Kolom Kanan: **Signature Tilted Card** (kartu teal miring `-rotate-6` di belakang foto profil squircle beresolusi tinggi dengan radius `2.8rem`).

3. **My Skills Section (Full-Width)**:
   - Filter pill kategori interaktif (`All`, `Frontend`, `Backend`, `Mobile & Tools`).
   - Kartu-kartu skill dengan ikon warna asli dan efek angkat lembut saat hover.

4. **Featured Projects Section**:
   - Kartu proyek highlight *Genuine Solutions* berlabel `Featured Platform`.
   - Kartu-kartu proyek lainnya dengan badge teknologi dan modal popup detail.

5. **Experience & Education**:
   - Timeline vertikal 2-kolom dengan penanda titik hijau dan kartu bersih.

6. **Certifications**:
   - Grid 7 sertifikat kredensial dengan modal lightbox preview resolusi penuh.

7. **Interactive 3D Animation Engine & Switcher**:
   - Background canvas Three.js interaktif dengan 4 variasi gaya visual:
     - 🪐 **3D Torus Knot** (Wireframe Torus Knot + Icosahedron Sphere)
     - 🌊 **3D Digital Wave** (Gelombang partikel digital 3D bergelombang dinamis)
     - ✨ **Constellation Network** (Partikel dengan garis koneksi proximity interaktif)
     - 🌌 **Ambient Stardust** (Partikel bintang mengambang halus)
   - Menu dropdown **3D FX Switcher** di navbar untuk memilih efek secara instan.
   - Pilihan efek tersimpan di `localStorage` dan tersinkronisasi otomatis dengan tema Light & Dark.

---

## 5. Panduan Menambahkan Konten

### Menambah Proyek Baru

Buka `context/portfolioContext.js`, lalu tambahkan item baru pada array `projects`:

```javascript
{
    id: "nama-proyek-unik",
    judul: "Judul Proyek",
    deskripsi: "Deskripsi ringkas proyek...",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    featured: false, // set true jika ingin ditampilkan sebagai featured card
    link: "https://github.com/wiraputra/nama-repo"
}
```

### Menambah Sertifikat Baru

Simpan gambar sertifikat di folder `public/images/`, lalu tambahkan pada array `certificates` di `context/portfolioContext.js`:

```javascript
{
    id: "cert8",
    title: "Nama Sertifikasi",
    issuer: "Lembaga Penerbit",
    img: "/images/cert8.jpg",
    desc: "Deskripsi kompetensi yang diraih...",
    link: "https://link-verifikasi-kredensial.com"
}
```

---

## 6. Menjalankan Proyek Secara Lokal

```bash
# Menjalankan server development dengan nodemon
npm run dev

# Atau menjalankan langsung dengan Node
npm start
```

Akses di browser pada: `http://localhost:3000`
