// ==============================================
// LENIS SMOOTH SCROLL
// ==============================================
let lenis;

function initLenis() {
    lenis = new Lenis({
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.85,
        smoothTouch: false,
        touchMultiplier: 1.5,
    });

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
}

// ==============================================
// GSAP REGISTRATION
// ==============================================
gsap.registerPlugin(ScrollTrigger);

// ==============================================
// CUSTOM CURSOR
// ==============================================
function initCustomCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    // Only run on real mouse devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        dot.style.display  = 'none';
        ring.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    // Dot: follows instantly via GSAP
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Reveal on first movement
        if (dot.style.opacity !== '1') {
            gsap.to([dot, ring], { opacity: 1, duration: 0.35 });
        }
        gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.06, ease: 'none', overwrite: true });
    });

    // Ring: lagged follow via RAF lerp
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;
        gsap.set(ring, { x: ringX, y: ringY });
        requestAnimationFrame(animateRing);
    })();

    // Interactive hover: ring expands, dot shrinks
    const hoverSelectors = [
        'a', 'button', '[role="button"]',
        '.bento-item', '.tag', '.hamburger',
        '.control-btn', '.stat-card', '.cert-card',
        '.drawer-social', '.project-card', '.back-to-top'
    ].join(', ');

    document.querySelectorAll(hoverSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('is-hovering');
            ring.classList.add('is-hovering');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('is-hovering');
            ring.classList.remove('is-hovering');
        });
    });

    // Click: quick squish
    document.addEventListener('mousedown', () => {
        dot.classList.add('is-clicking');
        ring.classList.add('is-clicking');
    });
    document.addEventListener('mouseup', () => {
        dot.classList.remove('is-clicking');
        ring.classList.remove('is-clicking');
    });

    // Hide when leaving browser window
    document.addEventListener('mouseleave', () => gsap.to([dot, ring], { opacity: 0, duration: 0.25 }));
    document.addEventListener('mouseenter', () => gsap.to([dot, ring], { opacity: 1, duration: 0.25 }));
}

// ==============================================
// GSAP ANIMATIONS  
// ==============================================
function initGSAP() {

    // ── Hero Bento: cinematic load-in ───────────
    // Each card flies in from a different direction
    const heroItems = gsap.utils.toArray('.hero-bento-grid .gsap-bento');
    const heroDirections = [
        { x: -60, y: -30 },  // item-1: top-left
        { x: -60, y:  30 },  // item-2: bottom-left
        { x:   0, y: -50 },  // item-3: top-center
        { x:  60, y: -30 },  // item-4: top-right
        { x:  60, y:  30 },  // item-5: bottom-right
        { x:   0, y:  40 },  // item-6: bottom-center
    ];
    heroItems.forEach((el, i) => {
        const dir = heroDirections[i] || { x: 0, y: 30 };
        gsap.from(el, {
            x: dir.x, y: dir.y,
            opacity: 0, scale: 0.92,
            duration: 1.0,
            delay: 0.2 + i * 0.1,
            ease: 'power3.out'
        });
    });

    // ── Resume: alternating left / right slide ──
    gsap.utils.toArray('.resume-bento .gsap-bento').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el, start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            x: i % 2 === 0 ? -70 : 70,
            y: 20, opacity: 0,
            duration: 0.9, ease: 'power3.out',
        });
    });

    // ── Projects: fan-out slide ─────────────────
    gsap.utils.toArray('.projects-bento .gsap-bento').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: '.projects-bento', start: 'top 86%',
                toggleActions: 'play none none reverse'
            },
            x: i % 3 === 0 ? -50 : i % 3 === 1 ? 0 : 50,
            y: 40, opacity: 0,
            duration: 0.8, ease: 'power2.out',
            delay: i * 0.09,
        });
    });

    // ── Certificates: stagger slide-up ──────────
    gsap.from('.cert-bento .gsap-bento', {
        scrollTrigger: {
            trigger: '.cert-bento', start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 60, opacity: 0,
        duration: 0.75, stagger: 0.12, ease: 'back.out(1.2)'
    });

    // ── Section headers: slide from alternating sides ─
    gsap.utils.toArray('.section-header.gsap-bento').forEach((header, i) => {
        gsap.from(header, {
            scrollTrigger: { trigger: header, start: 'top 90%', toggleActions: 'play none none reverse' },
            x: i % 2 === 0 ? -40 : 40,
            y: 16, opacity: 0,
            duration: 0.75, ease: 'power2.out'
        });
    });

    // ── Stats counter entrance ──────────────────
    ScrollTrigger.create({
        trigger: '.stats-section', start: 'top 80%', once: true,
        onEnter: () => {
            // Card fly-in animation
            gsap.from('.stat-card', {
                scale: 0.82, y: 30, opacity: 0,
                duration: 0.7, stagger: 0.12, ease: 'back.out(1.8)',
            });
            // Start counting 250ms after entrance (so user sees 0 first)
            setTimeout(() => animateCounters(), 250);
        }
    });

    // Fallback: IntersectionObserver (in case user scrolled fast past trigger)
    const statsEl = document.querySelector('.stats-section');
    if (statsEl) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.25 });
        statsObserver.observe(statsEl);
    }

    // ── Skills marquee reveal ───────────────────
    gsap.from('.skills-marquee-section .marquee-wrapper', {
        scrollTrigger: { trigger: '.skills-marquee-section', start: 'top 88%', toggleActions: 'play none none reverse' },
        opacity: 0, y: 24, duration: 0.65, stagger: 0.18, ease: 'power2.out'
    });

    // ── Footer ──────────────────────────────────
    gsap.from('footer .gsap-bento', {
        scrollTrigger: { trigger: 'footer', start: 'top 95%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
    });

    // ============================================
    // PARALLAX LAYERS (Lenis + GSAP scrub)
    // ============================================
    const bodyTrigger = {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    };

    gsap.to('#pxl-stellar', { y: '-14%', ease: 'none', scrollTrigger: { ...bodyTrigger, scrub: 0.8 } });
    gsap.to('#pxl-orbs',    { y: '-28%', ease: 'none', scrollTrigger: { ...bodyTrigger, scrub: 1.2 } });
    gsap.to('#pxl-shapes',  { y: '-44%', ease: 'none', scrollTrigger: { ...bodyTrigger, scrub: 1.6 } });
    gsap.to('#pxl-grid',    { y:  '10%', ease: 'none', scrollTrigger: { ...bodyTrigger, scrub: 0.5 } }); // opposite dir

    // ── Content parallax ────────────────────────
    gsap.to('.prism-text-bg', {
        y: -70, ease: 'none',
        scrollTrigger: { trigger: '.hero-bento-grid', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
    gsap.to('.glass-star-3d', {
        y: -45, ease: 'none',
        scrollTrigger: { trigger: '.hero-bento-grid', start: 'top top', end: 'bottom top', scrub: 2 }
    });
    gsap.to('.portrait-img', {
        y: -22, ease: 'none',
        scrollTrigger: { trigger: '.bento-item-4', start: 'top 80%', end: 'bottom top', scrub: 1.5 }
    });
}

// ==============================================
// STICKY NAVBAR
// ==============================================
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    nav?.classList.toggle('sticky', window.scrollY > 50);
}, { passive: true });

// ==============================================
// SCROLL PROGRESS BAR
// ==============================================
const progressBar = document.getElementById('scroll-progress-bar');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const d = document.documentElement;
        progressBar.style.width = d.scrollHeight - d.clientHeight > 0
            ? `${(window.scrollY / (d.scrollHeight - d.clientHeight)) * 100}%`
            : '0%';
    }, { passive: true });
}

// ==============================================
// BACK TO TOP BUTTON
// ==============================================
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    backToTopBtn.addEventListener('click', () => {
        if (lenis) lenis.scrollTo(0, { duration: 1.5 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==============================================
// HAMBURGER MENU & MOBILE DRAWER
// ==============================================
const hamburgerBtn   = document.getElementById('hamburger-btn');
const mobileDrawer   = document.getElementById('mobile-drawer');
const drawerOverlay  = document.getElementById('drawer-overlay');
const drawerCloseBtn = document.getElementById('drawer-close');

function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    hamburgerBtn?.classList.add('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
}
function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    hamburgerBtn?.classList.remove('open');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lenis?.start();
}

hamburgerBtn?.addEventListener('click', openDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);
drawerCloseBtn?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
        closeDrawer();
        const id = link.getAttribute('href')?.substring(1);
        const el = id ? document.getElementById(id) : null;
        if (el) setTimeout(() => {
            if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
            else window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
        }, 400);
    });
});

// ==============================================
// ACTIVE NAV HIGHLIGHT (Intersection Observer)
// ==============================================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links .nav-link');

new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === id));
        }
    });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0 }).observe;

sections.forEach(s => {
    new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === id));
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 }).observe(s);
});

// ==============================================
// STATS COUNTER ANIMATION
// ==============================================
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
        const target  = parseInt(el.getAttribute('data-target'), 10);
        const dur     = 2000; // ms
        const startTs = performance.now();

        // Reset to 0 first
        el.textContent = '0';

        function tick(now) {
            const elapsed  = now - startTs;
            const progress = Math.min(elapsed / dur, 1);
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = Math.floor(eased * target);
            el.textContent = current + (progress < 1 ? '' : '+');
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    });
}

// ==============================================
// MOUSE-TILT 3D ON GLASS STAR
// ==============================================
const glassStar  = document.getElementById('glass-star');
const bentoItem3 = document.querySelector('.bento-item-3');

if (glassStar && bentoItem3) {
    bentoItem3.addEventListener('mousemove', e => {
        const r  = bentoItem3.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) / r.width;
        const dy = (e.clientY - (r.top  + r.height / 2)) / r.height;
        gsap.to(glassStar, {
            rotateX: -dy * 15, rotateY: dx * 15,
            x: dx * 12,        y: dy * 12,
            duration: 0.6, ease: 'power2.out',
            transformPerspective: 800, overwrite: true
        });
    });
    bentoItem3.addEventListener('mouseleave', () => {
        gsap.to(glassStar, {
            rotateX: 0, rotateY: 0, x: 0, y: 0,
            duration: 0.8, ease: 'elastic.out(1, 0.5)', overwrite: true
        });
    });
}

// ==============================================
// TYPING EFFECT
// ==============================================
const typingElement   = document.getElementById('typing-text');
const portfolioDataEl = document.getElementById('portfolio-data');
let roles = [];
try {
    if (portfolioDataEl) roles = JSON.parse(portfolioDataEl.getAttribute('data-roles'));
} catch(e) { console.error('Failed to parse roles'); }

let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    if (!typingElement || !roles.length) return;
    const cur = roles[roleIndex];
    typingElement.textContent = isDeleting
        ? cur.substring(0, --charIndex)
        : cur.substring(0, ++charIndex);
    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === cur.length)  { speed = 2500; isDeleting = true; }
    else if (isDeleting && charIndex === 0)        { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 500; }
    setTimeout(typeEffect, speed);
}

// ==============================================
// CERTIFICATE MODAL
// ==============================================
const modal    = document.getElementById('certModal');
const modalImg = document.getElementById('modalImage');

function openModal(src) {
    if (!modal || !modalImg) return;
    modal.style.display = 'flex';
    modalImg.src = src;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
}
function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    lenis?.start();
}

// ==============================================
// PROJECT MODAL
// ==============================================
const projModal      = document.getElementById('projectModal');
const projModalImg   = document.getElementById('projectModalImg');
const projModalTitle = document.getElementById('projectModalTitle');
const projModalDesc  = document.getElementById('projectModalDesc');
const projModalTags  = document.getElementById('projectModalTags');

function openProjectModal(btn) {
    if (!projModal) return;
    projModalTitle.textContent = btn.getAttribute('data-judul');
    projModalDesc.textContent  = btn.getAttribute('data-desc');
    projModalImg.src           = btn.getAttribute('data-img') || '';
    projModalTags.innerHTML    = '';
    JSON.parse(btn.getAttribute('data-tags') || '[]').forEach(tag => {
        const s = document.createElement('span');
        s.className = 'tag'; s.textContent = tag;
        projModalTags.appendChild(s);
    });
    projModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
}
function closeProjectModal() {
    projModal?.classList.remove('active');
    document.body.style.overflow = '';
    lenis?.start();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeProjectModal(); closeDrawer(); }
});

// ==============================================
// PRELOADER TERMINAL ANIMATION
// ==============================================
function runPreloader(callback) {
    const typingEl    = document.getElementById('preloader-typing');
    const outputEl    = document.getElementById('preloader-output');
    const preloaderEl = document.getElementById('preloader');
    if (!typingEl || !outputEl || !preloaderEl) { callback?.(); return; }

    const cmd = 'npm run dev';
    let i = 0;
    const typeCmd = () => {
        if (i < cmd.length) { typingEl.textContent += cmd[i++]; setTimeout(typeCmd, 60); }
        else setTimeout(showOutput, 300);
    };

    const lines = [
        '<span class="out-info">> portofolio-express@1.0.0 dev</span>',
        '<span class="out-info">> nodemon server.js</span>',
        '',
        '<span class="out-green">[express] server at http://localhost:3000</span>',
        '<span class="out-blue">[lenis] smooth scroll ready</span>',
        '<span class="out-blue">[cursor] animated cursor initialized</span>',
        '<span class="out-blue">[gsap] parallax + scroll reveals active</span>',
        '<span class="out-success">🚀 launch successful!</span>'
    ];

    const showOutput = () => {
        let j = 0;
        const printLine = () => {
            if (j < lines.length) {
                const d = document.createElement('div');
                d.className = 'terminal-out-line';
                d.innerHTML = lines[j++];
                outputEl.appendChild(d);
                setTimeout(printLine, 110);
            } else setTimeout(fadeOut, 600);
        };
        printLine();
    };

    const fadeOut = () => {
        gsap.to(preloaderEl, {
            opacity: 0, duration: 0.6, ease: 'power2.out',
            onComplete: () => { preloaderEl.style.display = 'none'; callback?.(); }
        });
    };

    setTimeout(typeCmd, 400);
}

// ==============================================
// SPOTLIGHT EFFECT
// ==============================================
function initSpotlight() {
    document.querySelectorAll('.bento-item').forEach(item => {
        item.addEventListener('mousemove', e => {
            const r = item.getBoundingClientRect();
            item.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
            item.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        });
    });
}

// ==============================================
// SMOOTH SCROLL — Lenis nav links
// ==============================================
function initSmoothScroll() {
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const id = a.getAttribute('href')?.substring(1);
            const el = id ? document.getElementById(id) : null;
            if (!el) return;
            if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
            else window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
        });
    });
}

// ==============================================
// INITIALIZE EVERYTHING
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis (before GSAP ticker runs)
    initLenis();

    // 2. Custom cursor
    initCustomCursor();

    // 3. Other interactions
    typeEffect();
    initSpotlight();
    initSmoothScroll();

    // 4. Preloader → then GSAP (ScrollTrigger needs Lenis connected first)
    runPreloader(() => {
        initGSAP();
    });
});