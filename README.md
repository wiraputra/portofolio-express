# Minimalist Developer Portfolio — I Gede Wirawan

Landing page portofolio minimalis modern berbasis **Express.js + EJS** dengan tema warna **Mint Green**, **Profile Hero Card**, dan navigasi **Functional Tabs** bergaya **Shadcn/UI**.

![Mint Theme](https://img.shields.io/badge/Theme-Mint%20Green-10b981)
![UI Style](https://img.shields.io/badge/UI-Shadcn%20Minimalist-09090b)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20EJS-blue)

---

## ✨ Fitur Utama

- **Profile Hero Card**: Card profil minimalis yang bersih memuat foto profil, nama, dynamic typing role, bio singkat, lokasi, dan quick actions (Contact, Download CV, GitHub, LinkedIn).
- **Mint Green Color System**: Palet warna mint elegan (`#10b981` / `#00f5a0`) di atas dark zinc background (`#09090b`).
- **Shadcn-Style Functional Tabs**:
  - 👤 **Overview**: Ringkasan personal, metrik/statistik, dan area fokus utama.
  - 💻 **Projects**: Katalog 6 proyek dengan featured project *Genuine Solutions*, tag teknologi, dan modal detail.
  - 💼 **Experience & Education**: Timeline vertikal pengalaman magang di Interlace Studies dan studi di Politeknik Negeri Bali.
  - 🏆 **Certifications**: Grid 7 sertifikat kredensial dengan modal preview lightbox dan link verifikasi.
  - ⚡ **Skills**: Filter kategori skill (Frontend, Backend, Mobile & Tools).
- **Data Context Modular**: Seluruh data disimpan terpusat di [`context/portfolioContext.js`](context/portfolioContext.js).
- **Zero Heavy React Overhead**: Desain dan interaksi shadcn yang ringan dan cepat langsung di EJS & Vanilla JS.

---

## 🚀 Menjalankan Proyek

### 1. Prasyarat
Pastikan Node.js (v18+) telah terpasang.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Lokal
```bash
# Menjalankan server lokal
npm start

# Atau dengan nodemon untuk auto-reload
npm run dev
```

Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 📁 Dokumentasi Lebih Lanjut
Untuk penjelasan arsitektur sistem, skema context data, dan panduan kustomisasi selengkapnya, silakan baca [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).
