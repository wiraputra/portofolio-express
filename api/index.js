const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
// Pastikan path ini benar mengarah ke folder views
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// --- DATA DATABASE BARU ---
const dataPortfolio = {
    info: {
        nama: "I Gede Wirawan", 
        role: ["Frontend Developer", "Cyber Security Enthusiast", "Tech Explorer"],
        deskripsi: "Saya membangun aplikasi web yang cepat, aman, dan scalable.",
        foto: "/images/profile.jpeg" 
    },
    skills: [
        // --- Baris 1 ---
        { nama: "JavaScript", icon: "fab fa-js", color: "#F7DF1E" },
        { nama: "HTML5", icon: "fab fa-html5", color: "#E34F26" },
        { nama: "CSS3", icon: "fab fa-css3-alt", color: "#1572B6" },
        { nama: "PHP", icon: "fab fa-php", color: "#777BB4" },
        { nama: "Python", icon: "fab fa-python", color: "#3776AB" },
        { nama: "Java", icon: "fab fa-java", color: "#007396" },
        { nama: "Flutter", icon: "fas fa-mobile-screen", color: "#02569B" }, // Ikon alternatif (Mobile)
        { nama: "Dart", icon: "fas fa-bullseye", color: "#0175C2" }, // Ikon alternatif (Dart target)
        { nama: "Bootstrap", icon: "fab fa-bootstrap", color: "#7952B3" },

        // --- Baris 2 ---
        { nama: "Figma", icon: "fab fa-figma", color: "#F24E1E" },
        { nama: "Anaconda", icon: "fas fa-circle-nodes", color: "#44A833" }, // Ikon alternatif (Nodes)
        { nama: "Android Studio", icon: "fab fa-android", color: "#3DDC84" },
        { nama: "Vue.js", icon: "fab fa-vuejs", color: "#4FC08D" },
        { nama: "Laravel", icon: "fab fa-laravel", color: "#FF2D20" },
        { nama: "MySQL", icon: "fas fa-database", color: "#4479A1" },
        { nama: "Node.js", icon: "fab fa-node-js", color: "#339933" },
        { nama: "SQLite", icon: "fas fa-server", color: "#003B57" },
        { nama: "Tailwind CSS", icon: "fas fa-wind", color: "#06B6D4" } // Ikon alternatif (Angin)
    ],
    resume: {
        experience: [
            {
                title: "Frontend Developer",
                place: "Interlace Studies Bali",
                date: "2025 - Present",
                desc: "Building fast interfaces for web applications using React."
            }
        ],
        education: [
            {
                title: "Bachelor of Applied Computer Science",
                place: "Bali State Polytechnic",
                date: "2023 - 2027",
                desc: "Focus on software engineering and web technologies."
            },
            {
                title: "Audio Video Engineering (Electronics)",
                place: "State Vocational High School 1 Denpasar",
                date: "2018 - 2021",
                desc: "basics of electronics, installation, operation, maintenance, and repair of sound (audio) and image (video) systems and understanding of supporting hardware and software."
            }
        ]
    },
    // TAMBAHKAN DATA SERTIFIKAT DI SINI:
    certificates: [
        {
            title: "Masterclass Ethical Hacking",
            issuer: "Sawah Cyber Security",
            img: "/images/cert1.jpg", 
            desc: "attend an Ethical Hacking Masterclass certification.",
            link: "https://www.linkedin.com/in/i-gede-wirawan-849651172/details/certifications/1751696849497/single-media-viewer/?profileId=ACoAACkHyHkBVcXhh8p5HfYxunAjSHHRXG9fH9g"
        },
        {
            title: "React.js : Beginner to Advanced",
            issuer: "Udemy - Programmer Zaman Now",
            img: "/images/cert2.jpg",
            desc: "React training successfully completed.",
            link: "https://www.linkedin.com/in/i-gede-wirawan-849651172/details/certifications/1759843624784/single-media-viewer/?profileId=ACoAACkHyHkBVcXhh8p5HfYxunAjSHHRXG9fH9g"
        },
        {
            title: "Junior Web Developer Certification",
            issuer: "Digitalent - Ministry of Communication and Information Technology",
            img: "/images/cert3.jpg",
            desc: "Complete Junior Web Developer training.",
            link: "https://www.linkedin.com/in/i-gede-wirawan-849651172/details/certifications/1755056900288/single-media-viewer/?profileId=ACoAACkHyHkBVcXhh8p5HfYxunAjSHHRXG9fH9g"
        },
        {
            title: "Code Generation and Optimization using IBM Granite",
            issuer: "IBM",
            img: "/images/cert4.jpg",
            desc: "Complete IBM Granite training.",
            link: "https://www.credly.com/badges/8209c5f4-8bbe-4622-bf4e-c839eb96da26/linked_in_profile"
        }
    ],
    projects: [
        { 
            judul: "Aplikasi Informasi Kampus", 
            deskripsi: "Aplikasi Informasi Kampus PNB.", 
            tags: ["Dart", "Flutter", "Mobile"],
            link: "https://github.com/wiraputra/aplikasi_informasi_kampus" // Ganti dengan link asli
        },
        { 
            judul: "Kenangan Senja", 
            deskripsi: "Aplikasi pengelolaan Coffeeshop berbasis Website.", 
            tags: ["Blade", "Laravel", "PHP"],
            link: "https://github.com/wiraputra/kenangansenja" 
        },
        { 
            judul: "Travel Mind", 
            deskripsi: "Website Penyusunan Itinerary Berdasarkan Preferensi Wisatawan.", 
            tags: ["Vue.js", "JavaScript"],
            link: "https://github.com/wiraputra/travel-mind" 
        },
        { 
            judul: "TeknoSolusi", 
            deskripsi: "Website Company Profile 'TeknoSolusi Digital'.", 
            tags: ["PHP", "Web Development"],
            link: "https://github.com/wiraputra/teknosolusi" 
        },
        { 
            judul: "IBM Granite", 
            deskripsi: "Membuat Project Sederhana menggunakan IBM Granite.", 
            tags: ["Jupyter Notebook", "AI", "Python"],
            link: "https://github.com/wiraputra/IBM_Granite" 
        }
    ]
};

// Route Home
app.get('/', (req, res) => {
    // Kita harus mengirim object dengan key 'data' agar terbaca di EJS
    res.render('home', { data: dataPortfolio });
});

// Route API Projects (Opsional jika ingin akses JSON)
app.get('/api/projects', (req, res) => {
    res.json(dataPortfolio.projects);
});

// Route 404 (Wajib ditaruh paling bawah)
app.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = app;