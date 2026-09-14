/**
 * PORTFOLIO DATA CONTEXT
 * Sumber data terpusat untuk profil, skills, pengalaman, sertifikat, dan proyek.
 */

const portfolioContext = {
    info: {
        nama: "I Gede Wirawan",
        role: ["Frontend Developer", "Cyber Security Enthusiast", "Tech Explorer"],
        deskripsi: "I build fast, secure, and scalable web applications with high visual fidelity and robust architecture.",
        foto: "/images/profile.jpeg",
        lokasi: "Bali, Indonesia",
        email: "wirawanw62@gmail.com",
        github: "https://github.com/wiraputra",
        linkedin: "https://www.linkedin.com/in/i-gede-wirawan-849651172/",
        cvUrl: "/cv.pdf",
        cvFilename: "CV_I_Gede_Wirawan.pdf"
    },
    skills: [
        // Frontend
        { nama: "React", category: "Frontend", icon: "fab fa-react", color: "#61DAFB" },
        { nama: "TypeScript", category: "Frontend", icon: "fas fa-code", color: "#3178C6" },
        { nama: "JavaScript", category: "Frontend", icon: "fab fa-js", color: "#F7DF1E" },
        { nama: "Vue.js", category: "Frontend", icon: "fab fa-vuejs", color: "#4FC08D" },
        { nama: "HTML5", category: "Frontend", icon: "fab fa-html5", color: "#E34F26" },
        { nama: "CSS3", category: "Frontend", icon: "fab fa-css3-alt", color: "#1572B6" },
        { nama: "Tailwind CSS", category: "Frontend", icon: "fas fa-wind", color: "#06B6D4" },
        { nama: "Bootstrap", category: "Frontend", icon: "fab fa-bootstrap", color: "#7952B3" },

        // Backend
        { nama: "Laravel", category: "Backend", icon: "fab fa-laravel", color: "#FF2D20" },
        { nama: "Node.js", category: "Backend", icon: "fab fa-node-js", color: "#339933" },
        { nama: "PHP", category: "Backend", icon: "fab fa-php", color: "#777BB4" },
        { nama: "Python", category: "Backend", icon: "fab fa-python", color: "#3776AB" },
        { nama: "Java", category: "Backend", icon: "fab fa-java", color: "#007396" },
        { nama: "MySQL", category: "Backend", icon: "fas fa-database", color: "#4479A1" },
        { nama: "SQLite", category: "Backend", icon: "fas fa-server", color: "#003B57" },

        // Mobile & Tools
        { nama: "Flutter", category: "Mobile & Tools", icon: "fas fa-mobile-screen", color: "#02569B" },
        { nama: "Dart", category: "Mobile & Tools", icon: "fas fa-bullseye", color: "#0175C2" },
        { nama: "Figma", category: "Mobile & Tools", icon: "fab fa-figma", color: "#F24E1E" },
        { nama: "Android Studio", category: "Mobile & Tools", icon: "fab fa-android", color: "#3DDC84" },
        { nama: "Anaconda", category: "Mobile & Tools", icon: "fas fa-circle-nodes", color: "#44A833" }
    ],
    resume: {
        experience: [
            {
                title: "Full Stack Developer (Magang Berdampak)",
                place: "Interlace Studies Bali",
                date: "2026 - Present",
                desc: "Developing the 'Genuine Solution' platform, an application that connects employers and job seekers, featuring an admin panel to mediate and facilitate the process between both parties."
            },
            {
                title: "Frontend Developer",
                place: "Interlace Studies Bali",
                date: "2025 - 2026",
                desc: "Building fast interfaces for web applications using React and modern component-driven architectures."
            }
        ],
        education: [
            {
                title: "Bachelor of Applied Computer Science",
                place: "Bali State Polytechnic",
                date: "2023 - 2027",
                desc: "Focus on software engineering, database design, information security, and modern web technologies."
            },
            {
                title: "Audio Video Engineering (Electronics)",
                place: "State Vocational High School 1 Denpasar",
                date: "2018 - 2021",
                desc: "Basics of electronics, installation, operation, maintenance, and repair of sound (audio) and image (video) systems and supporting hardware & software."
            }
        ]
    },
    certificates: [
        {
            id: "cert7",
            title: "Magang Berdampak MBKM — Interlace Studies",
            issuer: "PT. Jalinan Studi Internusa",
            img: "/images/cert7.png",
            desc: "Telah berhasil menyelesaikan Program Merdeka Belajar Kampus Merdeka (MBKM) di Interlace Studies Bali yang dikelola oleh PT. Jalinan Studi Internusa, berlangsung pada 5 Maret – 31 Juli 2026. Nomor: 07/MBKM/JSI/VII/2026.",
            link: "#"
        },
        {
            id: "cert6",
            title: "Minicredentials Information System Security",
            issuer: "Sawah Cyber Security",
            img: "/images/cert6.jpg",
            desc: "Has demonstrated fundamental competency in ethical hacking principles by applying the Cyber Kill Chain framework, identifying OWASP Top 10 vulnerabilities, and utilizing industry standard penetration testing tools during a hands-on penetration testing project.",
            link: "https://academy.sawahcyber.id/credentials/scs-coc-mciss-0210-2026-kb24vr"
        },
        {
            id: "cert5",
            title: "MiniCredential Information System Security",
            issuer: "Sawah Cyber Security",
            img: "/images/cert5.jpg",
            desc: "Participated in comprehensive presentation sessions and hands-on Capture The Flag (CTF) practical exercises in information system security.",
            link: "https://academy.sawahcyber.id/credentials/scs-cop-mciss-0210-2026-kaxhur"
        },
        {
            id: "cert1",
            title: "Masterclass Ethical Hacking",
            issuer: "Sawah Cyber Security",
            img: "/images/cert1.jpg", 
            desc: "Completed an intensive Ethical Hacking Masterclass certification covering network reconnaissance, vulnerability analysis, and security hardening.",
            link: "https://www.linkedin.com/in/i-gede-wirawan-849651172/details/certifications/1751696849497/single-media-viewer/?profileId=ACoAACkHyHkBVcXhh8p5HfYxunAjSHHRXG9fH9g"
        },
        {
            id: "cert2",
            title: "React.js : Beginner to Advanced",
            issuer: "Udemy - Programmer Zaman Now",
            img: "/images/cert2.jpg",
            desc: "Comprehensive React training including hooks, state management, routing, performance optimization, and clean component architecture.",
            link: "https://www.linkedin.com/in/i-gede-wirawan-849651172/details/certifications/1759843624784/single-media-viewer/?profileId=ACoAACkHyHkBVcXhh8p5HfYxunAjSHHRXG9fH9g"
        },
        {
            id: "cert3",
            title: "Junior Web Developer Certification",
            issuer: "Digitalent - Ministry of Communication and Information Technology",
            img: "/images/cert3.jpg",
            desc: "Complete Junior Web Developer national certification with competency standards in responsive web design, backend programming, and databases.",
            link: "https://www.linkedin.com/in/i-gede-wirawan-849651172/details/certifications/1755056900288/single-media-viewer/?profileId=ACoAACkHyHkBVcXhh8p5HfYxunAjSHHRXG9fH9g"
        },
        {
            id: "cert4",
            title: "Code Generation and Optimization using IBM Granite",
            issuer: "IBM",
            img: "/images/cert4.jpg",
            desc: "Trained on prompt engineering, generative AI code assistance, and software optimization utilizing IBM Granite foundational models.",
            link: "https://www.credly.com/badges/8209c5f4-8bbe-4622-bf4e-c839eb96da26/linked_in_profile"
        }
    ],
    projects: [
        { 
            id: "genuine-solutions",
            judul: "Genuine Solutions", 
            deskripsi: "An internal recruitment and job-matching platform connecting employers and job seekers with an admin mediation panel.", 
            tags: ["Laravel", "Inertia.js", "React", "TypeScript"],
            featured: true,
            img: "/images/genuine-solutions-hero.png",
            detailDesc: "Genuine Solutions is a modern full-stack recruitment management and Applicant Tracking System (ATS) platform designed to streamline the hiring process for agencies, employers, and job seekers. The system optimizes the recruitment pipeline through an automated skill-based matchmaking engine, bulk lead processing, and AI-driven candidate onboarding.",
            detailImg: "/images/genuine-solutions-dashboard.png",
            demo: "https://www.zenuinesolutions.com.au/"
        },
        { 
            id: "campus-info",
            judul: "Campus Information Application", 
            deskripsi: "A mobile application providing dynamic news, academic announcements, and campus directory for Bali State Polytechnic.", 
            tags: ["Dart", "Flutter", "Mobile"],
            featured: false,
            link: "https://github.com/wiraputra/aplikasi_informasi_kampus"
        },
        { 
            id: "kenangan-senja",
            judul: "Kenangan Senja", 
            deskripsi: "A web-based order and inventory management application for coffee shops with real-time cashier transactions.", 
            tags: ["Blade", "Laravel", "PHP", "MySQL"],
            featured: false,
            link: "https://github.com/wiraputra/kenangansenja" 
        },
        { 
            id: "travel-mind",
            judul: "Travel Mind", 
            deskripsi: "An intelligent itinerary planning website providing customized travel schedules based on tourist preferences.", 
            tags: ["Vue.js", "JavaScript", "REST API"],
            featured: false,
            link: "https://github.com/wiraputra/travel-mind" 
        },
        { 
            id: "teknosolusi",
            judul: "TeknoSolusi", 
            deskripsi: "Corporate profile and digital services showcase website for 'TeknoSolusi Digital' agency.", 
            tags: ["PHP", "JavaScript", "Tailwind CSS"],
            featured: false,
            link: "https://github.com/wiraputra/teknosolusi" 
        },
        { 
            id: "building-asset-management",
            judul: "Building Asset Management", 
            deskripsi: "An integrated building asset management platform featuring interactive 3D visualization, real-time monitoring, and web-based intelligent analytics.", 
            tags: ["Three.js", "3D Visualization", "Real-Time Monitoring", "Analytics"],
            featured: false,
            link: "https://github.com/wiraputra/bams-project" 
        },
        { 
            id: "log-gates",
            judul: "Log Gates", 
            deskripsi: "A digital internship logbook and daily activity reporting platform built for students and mentors to record, track, and evaluate workplace internship milestones in real time.", 
            tags: ["Next.js", "Vercel", "Tailwind CSS", "Activity Tracking"],
            featured: false,
            demo: "https://pkl-logbook.vercel.app/login",
            link: "https://github.com/wiraputra/PKL-Logbook" 
        }
    ],
    games: [
        {
            id: "code-breaker",
            title: "Cyber Code Breaker",
            category: "Cyber Puzzle",
            badge: "Hacking Challenge",
            desc: "Crack a randomized 4-digit firewall passcode in 45 seconds using logical deduction and vulnerability clues.",
            img: "/images/game-code-breaker.jpg",
            icon: "fas fa-user-secret",
            instructions: "Guess the 4-digit security PIN. Green = correct digit & position, Yellow = correct digit in wrong position, Gray = digit not in PIN."
        },
        {
            id: "binary-snake",
            title: "Binary Snake",
            category: "Retro Arcade",
            badge: "Data Stream",
            desc: "Navigate a glowing binary snake through cyberspace, devour software bugs 🐛, and compile the longest data packet.",
            img: "/images/game-binary-snake.jpg",
            icon: "fas fa-terminal",
            instructions: "Use Arrow keys or WASD (or on-screen D-Pad) to steer. Eat bugs to grow and score points. Avoid crashing into walls or yourself!"
        },
        {
            id: "particle-blaster",
            title: "3D Particle Blaster",
            category: "3D WebGL Action",
            badge: "Three.js Engine",
            desc: "Aim crosshairs and blast floating 3D spatial threat nodes into spectacular particle explosions in real-time.",
            img: "/images/game-particle-blaster.jpg",
            icon: "fas fa-atom",
            instructions: "Move your mouse or touch the screen to aim crosshairs at rotating 3D polygonal nodes. Click or tap to shoot laser blasts and chain combos!"
        }
    ]
};

module.exports = portfolioContext;
