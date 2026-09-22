/**
 * PORTFOLIO CLIENT SCRIPT — SIGNATURE FULL-WIDTH EDITION
 * Matches Yogi Pradnyana design reference with smooth scrolling,
 * interactive 3D Three.js background, and theme switcher.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DATA INITIALIZATION
    // =========================================================================
    let clientData = { roles: ["Frontend Developer", "Cyber Security Enthusiast", "Tech Explorer"], email: "wirawanw62@gmail.com" };
    try {
        const dataScript = document.getElementById('portfolio-client-data');
        if (dataScript) {
            clientData = JSON.parse(dataScript.textContent);
        }
    } catch (e) {
        console.warn('Failed to parse portfolio-client-data, using defaults.', e);
    }

    // =========================================================================
    // 2. THEME TOGGLE (LIGHT / DARK MODE)
    // =========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme');

    // Default to Light Mode to match reference image, unless user chose dark
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
            
            if (window.updateThreeTheme) {
                window.updateThreeTheme(isDark);
            }

            showToast(isDark ? 'Switched to Dark Theme' : 'Switched to Light Theme');
        });
    }

    // =========================================================================
    // 3. THREE.JS 3D ANIMATION ENGINE WITH INTERACTIVE SWITCHER
    // =========================================================================
    function initThreeBackground() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 210;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Colors
        let isDark = document.body.classList.contains('dark-theme');
        const lightMintColor = new THREE.Color(0x1b4332); // Deep forest green for light theme
        const darkMintColor  = new THREE.Color(0x52b788); // Glowing emerald mint for dark theme
        const getColor = () => isDark ? darkMintColor : lightMintColor;

        // Root Group for switching objects
        const rootGroup = new THREE.Group();
        scene.add(rootGroup);

        // State & Callbacks
        let currentFx = localStorage.getItem('portfolio-3d-fx') || 'torus';
        let updateFxFrame = null;
        let updateFxTheme = null;

        // --- EFFECT 1: Torus Knot + Geodesic Sphere ---
        function buildTorusKnot() {
            rootGroup.clear();
            camera.position.set(0, 0, 210);
            camera.rotation.set(0, 0, 0);

            const knotGeometry = new THREE.TorusKnotGeometry(52, 15, 140, 22, 2, 3);
            const knotMaterial = new THREE.MeshBasicMaterial({
                color: getColor(),
                wireframe: true,
                transparent: true,
                opacity: isDark ? 0.35 : 0.22
            });
            const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);

            const knotPointsMaterial = new THREE.PointsMaterial({
                color: getColor(),
                size: 2.8,
                transparent: true,
                opacity: isDark ? 0.85 : 0.65
            });
            const knotPoints = new THREE.Points(knotGeometry, knotPointsMaterial);

            const sphereGeometry = new THREE.IcosahedronGeometry(92, 2);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: getColor(),
                wireframe: true,
                transparent: true,
                opacity: isDark ? 0.14 : 0.08
            });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

            const starCount = 100;
            const starGeometry = new THREE.BufferGeometry();
            const starPositions = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount * 3; i += 3) {
                starPositions[i]     = (Math.random() - 0.5) * 400;
                starPositions[i + 1] = (Math.random() - 0.5) * 400;
                starPositions[i + 2] = (Math.random() - 0.5) * 300;
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
            const starMaterial = new THREE.PointsMaterial({
                color: getColor(),
                size: 2.2,
                transparent: true,
                opacity: isDark ? 0.5 : 0.3
            });
            const starPoints = new THREE.Points(starGeometry, starMaterial);

            const group = new THREE.Group();
            group.add(knotMesh);
            group.add(knotPoints);
            rootGroup.add(group);
            rootGroup.add(sphereMesh);
            rootGroup.add(starPoints);

            updateFxFrame = (delta) => {
                group.rotation.x += 0.22 * delta;
                group.rotation.y += 0.35 * delta;
                sphereMesh.rotation.x -= 0.12 * delta;
                sphereMesh.rotation.y += 0.18 * delta;
                starPoints.rotation.y += 0.03 * delta;
            };

            updateFxTheme = () => {
                const c = getColor();
                knotMaterial.color = c; knotMaterial.opacity = isDark ? 0.35 : 0.22;
                knotPointsMaterial.color = c; knotPointsMaterial.opacity = isDark ? 0.85 : 0.65;
                sphereMaterial.color = c; sphereMaterial.opacity = isDark ? 0.14 : 0.08;
                starMaterial.color = c; starMaterial.opacity = isDark ? 0.5 : 0.3;
            };
        }

        // --- EFFECT 2: 3D Digital Wave / Terrain Mesh ---
        function buildWaveTerrain() {
            rootGroup.clear();
            camera.position.set(0, -32, 175);
            camera.rotation.set(0.18, 0, 0);

            const cols = 44;
            const rows = 44;
            const count = cols * rows;
            const waveGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);

            let idx = 0;
            const spacing = 10.5;
            const xOffset = (cols * spacing) / 2;
            const yOffset = (rows * spacing) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    positions[idx]     = c * spacing - xOffset;
                    positions[idx + 1] = r * spacing - yOffset;
                    positions[idx + 2] = 0;
                    idx += 3;
                }
            }
            waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const waveMaterial = new THREE.PointsMaterial({
                color: getColor(),
                size: 2.8,
                transparent: true,
                opacity: isDark ? 0.75 : 0.52
            });
            const waveMesh = new THREE.Points(waveGeometry, waveMaterial);
            waveMesh.rotation.x = -Math.PI * 0.34;
            rootGroup.add(waveMesh);

            let waveClock = 0;
            updateFxFrame = (delta) => {
                waveClock += delta * 1.6;
                const pos = waveGeometry.attributes.position.array;
                let k = 0;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        pos[k + 2] = Math.sin(c * 0.32 + waveClock) * 15 + Math.cos(r * 0.32 + waveClock) * 15;
                        k += 3;
                    }
                }
                waveGeometry.attributes.position.needsUpdate = true;
            };

            updateFxTheme = () => {
                waveMaterial.color = getColor();
                waveMaterial.opacity = isDark ? 0.75 : 0.52;
            };
        }

        // --- EFFECT 3: Constellation Network ---
        function buildConstellation() {
            rootGroup.clear();
            camera.position.set(0, 0, 190);
            camera.rotation.set(0, 0, 0);

            const pCount = 180;
            const pGeometry = new THREE.BufferGeometry();
            const pPositions = new Float32Array(pCount * 3);
            const vels = [];
            const range = 240;

            for (let i = 0; i < pCount * 3; i += 3) {
                pPositions[i]     = (Math.random() - 0.5) * range;
                pPositions[i + 1] = (Math.random() - 0.5) * range;
                pPositions[i + 2] = (Math.random() - 0.5) * range * 0.7;
                vels.push({
                    x: (Math.random() - 0.5) * 0.22,
                    y: (Math.random() - 0.5) * 0.22,
                    z: (Math.random() - 0.5) * 0.12
                });
            }
            pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

            const pMaterial = new THREE.PointsMaterial({
                color: getColor(),
                size: 3.2,
                transparent: true,
                opacity: isDark ? 0.75 : 0.5
            });
            const pPoints = new THREE.Points(pGeometry, pMaterial);
            rootGroup.add(pPoints);

            const maxLines = pCount * 4;
            const lPositions = new Float32Array(maxLines * 6);
            const lGeometry = new THREE.BufferGeometry();
            lGeometry.setAttribute('position', new THREE.BufferAttribute(lPositions, 3));
            const lMaterial = new THREE.LineBasicMaterial({
                color: getColor(),
                transparent: true,
                opacity: isDark ? 0.16 : 0.12
            });
            const lMesh = new THREE.LineSegments(lGeometry, lMaterial);
            rootGroup.add(lMesh);

            updateFxFrame = () => {
                pPoints.rotation.y += 0.0008;
                lMesh.rotation.y += 0.0008;
                const posArr = pGeometry.attributes.position.array;
                const lineArr = lGeometry.attributes.position.array;
                let lIdx = 0;

                for (let i = 0; i < pCount; i++) {
                    const i3 = i * 3;
                    posArr[i3]     += vels[i].x;
                    posArr[i3 + 1] += vels[i].y;
                    posArr[i3 + 2] += vels[i].z;

                    if (posArr[i3] > range / 2 || posArr[i3] < -range / 2) vels[i].x *= -1;
                    if (posArr[i3 + 1] > range / 2 || posArr[i3 + 1] < -range / 2) vels[i].y *= -1;
                    if (posArr[i3 + 2] > range * 0.35 || posArr[i3 + 2] < -range * 0.35) vels[i].z *= -1;

                    for (let j = i + 1; j < pCount; j++) {
                        const j3 = j * 3;
                        const dx = posArr[i3] - posArr[j3];
                        const dy = posArr[i3 + 1] - posArr[j3 + 1];
                        const dz = posArr[i3 + 2] - posArr[j3 + 2];
                        const distSq = dx * dx + dy * dy + dz * dz;

                        if (distSq < 1100 && lIdx < maxLines * 6 - 6) {
                            lineArr[lIdx++] = posArr[i3];
                            lineArr[lIdx++] = posArr[i3 + 1];
                            lineArr[lIdx++] = posArr[i3 + 2];
                            lineArr[lIdx++] = posArr[j3];
                            lineArr[lIdx++] = posArr[j3 + 1];
                            lineArr[lIdx++] = posArr[j3 + 2];
                        }
                    }
                }
                pGeometry.attributes.position.needsUpdate = true;
                lGeometry.attributes.position.needsUpdate = true;
                lGeometry.setDrawRange(0, lIdx / 3);
            };

            updateFxTheme = () => {
                const c = getColor();
                pMaterial.color = c; pMaterial.opacity = isDark ? 0.75 : 0.5;
                lMaterial.color = c; lMaterial.opacity = isDark ? 0.16 : 0.12;
            };
        }

        // --- EFFECT 4: Ambient Stardust ---
        function buildStardust() {
            rootGroup.clear();
            camera.position.set(0, 0, 200);
            camera.rotation.set(0, 0, 0);

            const starCount = 500;
            const starGeometry = new THREE.BufferGeometry();
            const pos = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount * 3; i += 3) {
                pos[i]     = (Math.random() - 0.5) * 500;
                pos[i + 1] = (Math.random() - 0.5) * 500;
                pos[i + 2] = (Math.random() - 0.5) * 400;
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const starMaterial = new THREE.PointsMaterial({
                color: getColor(),
                size: 2.5,
                transparent: true,
                opacity: isDark ? 0.75 : 0.48
            });
            const stars = new THREE.Points(starGeometry, starMaterial);
            rootGroup.add(stars);

            updateFxFrame = (delta) => {
                stars.rotation.y += 0.06 * delta;
                stars.rotation.x += 0.03 * delta;
            };

            updateFxTheme = () => {
                starMaterial.color = getColor();
                starMaterial.opacity = isDark ? 0.75 : 0.48;
            };
        }

        // --- Switcher Manager ---
        const fxLabels = {
            'torus': '3D: Torus Knot',
            'wave': '3D: Digital Wave',
            'constellation': '3D: Constellation',
            'stardust': '3D: Stardust'
        };

        function setEffect(fxName, notify = false) {
            currentFx = fxName;
            localStorage.setItem('portfolio-3d-fx', fxName);

            if (fxName === 'wave') buildWaveTerrain();
            else if (fxName === 'constellation') buildConstellation();
            else if (fxName === 'stardust') buildStardust();
            else buildTorusKnot();

            // Update UI Button Label
            const labelEl = document.getElementById('fx-active-label');
            if (labelEl) labelEl.textContent = fxLabels[fxName] || '3D FX';

            // Update active state in dropdown
            document.querySelectorAll('.fx-dropdown-item').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-fx') === fxName);
            });

            if (notify && window.showToast) {
                window.showToast(`3D Effect: ${fxLabels[fxName] || fxName}`);
            }
        }

        // Initialize active effect
        setEffect(currentFx, false);

        // Theme Switcher Sync Handler
        window.updateThreeTheme = function(newIsDark) {
            isDark = newIsDark;
            updateFxTheme?.();
        };

        // UI Event Listeners for Switcher
        const fxWrapper = document.querySelector('.fx-dropdown-wrapper');
        const fxBtn = document.getElementById('fx-switcher-btn');
        fxBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            fxWrapper?.classList.toggle('open');
        });

        document.querySelectorAll('.fx-dropdown-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const fx = btn.getAttribute('data-fx');
                setEffect(fx, true);
                fxWrapper?.classList.remove('open');
            });
        });

        document.addEventListener('click', () => {
            fxWrapper?.classList.remove('open');
        });

        // Mouse Interactivity
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - windowHalfX) * 0.0008;
            mouseY = (e.clientY - windowHalfY) * 0.0008;
        }, { passive: true });

        // Window Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });

        // Animation Loop
        let clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            // Run active effect frame update
            updateFxFrame?.(delta);

            // Smooth mouse tilt & inertia
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            if (currentFx === 'torus') {
                camera.position.x = targetX * 70;
                camera.position.y = -targetY * 70;
            } else if (currentFx === 'wave') {
                camera.position.x = targetX * 120;
            } else {
                camera.position.x = targetX * 60;
                camera.position.y = -targetY * 60;
            }
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();
    }

    initThreeBackground();

    // =========================================================================
    // 4. DYNAMIC ROLE TYPING EFFECT
    // =========================================================================
    const roleTarget = document.getElementById('typing-role');
    const roles = clientData.roles || ["Frontend Developer"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeRoles() {
        if (!roleTarget || !roles.length) return;

        const currentRole = roles[roleIdx];

        if (isDeleting) {
            roleTarget.textContent = currentRole.substring(0, --charIdx);
        } else {
            roleTarget.textContent = currentRole.substring(0, ++charIdx);
        }

        let typeDelay = isDeleting ? 35 : 75;

        if (!isDeleting && charIdx === currentRole.length) {
            typeDelay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeDelay = 400;
        }

        setTimeout(typeRoles, typeDelay);
    }

    typeRoles();

    // =========================================================================
    // 5. SMOOTH SCROLLING & ACTIVE NAV LINK HIGHLIGHT
    // =========================================================================
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href')?.replace('#', '');
            if (!targetId) return;

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                e.preventDefault();
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetSection.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                closeMobileMenu();
            }
        });
    });

    // Navbar expansion on scroll (Pill to Full-Width Edge-to-Edge)
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const floatingNavbar = document.querySelector('.floating-navbar');

    function handleNavbarScroll() {
        const isScrolled = window.scrollY > 25;
        navbarWrapper?.classList.toggle('is-scrolled', isScrolled);
        floatingNavbar?.classList.toggle('is-scrolled', isScrolled);
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Run immediately on load

    // Active link on scroll
    window.addEventListener('scroll', () => {
        let current = 'home';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // =========================================================================
    // 6. MOBILE MENU (HAMBURGER & DRAWER)
    // =========================================================================
    const hamburgerBtn = document.getElementById('nav-hamburger');
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        drawer?.classList.add('open');
        overlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        drawer?.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburgerBtn?.addEventListener('click', openMobileMenu);
    closeBtn?.addEventListener('click', closeMobileMenu);
    overlay?.addEventListener('click', closeMobileMenu);

    // =========================================================================
    // 7. SKILLS CATEGORY FILTER
    // =========================================================================
    const filterButtons = document.querySelectorAll('.filter-pill');
    const skillCards = document.querySelectorAll('.skill-pill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Apply dynamic skill icon colors from data-color attribute
    document.querySelectorAll('.skill-pill-icon[data-color]').forEach(icon => {
        const color = icon.getAttribute('data-color');
        if (color) icon.style.color = color;
    });

    // =========================================================================
    // 7B. CERTIFICATIONS CATEGORY FILTER
    // =========================================================================
    const certFilterButtons = document.querySelectorAll('.cert-filter-pill');
    const certCards = document.querySelectorAll('.cert-showcase-card');

    certFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            certFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            certCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(8px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 8. TOAST NOTIFICATION & COPY EMAIL
    // =========================================================================
    const toast = document.getElementById('app-toast');
    const toastMsg = document.getElementById('toast-message');
    let toastTimeout;

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email') || clientData.email;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copied to clipboard!');
                }).catch(() => fallbackCopy(email));
            } else {
                fallbackCopy(email);
            }
        });
    }

    function fallbackCopy(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Email copied to clipboard!');
    }

    window.showToast = showToast;

    // =========================================================================
    // 9. DYNAMIC PROJECT SEARCH & FILTER SYSTEM
    // =========================================================================
    const searchInput = document.getElementById('project-search-input');
    const searchClearBtn = document.getElementById('project-search-clear');
    const filterPills = document.querySelectorAll('#projects-filter-pills .project-filter-pill');
    const projectCards = document.querySelectorAll('#projects-grid .project-showcase-card');
    const emptyState = document.getElementById('projects-empty-state');
    let currentActiveTag = 'all';

    function filterProjects() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        let visibleCount = 0;

        projectCards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const desc = card.getAttribute('data-desc') || '';
            const tags = card.getAttribute('data-tags') || '';

            // Tag check
            const matchesTag = (currentActiveTag === 'all') || tags.includes(currentActiveTag.toLowerCase());

            // Search query check (matches title, desc, or tags)
            const matchesQuery = !query || 
                title.includes(query) || 
                desc.includes(query) || 
                tags.includes(query);

            if (matchesTag && matchesQuery) {
                card.style.display = '';
                card.classList.remove('is-hidden');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.add('is-hidden');
            }
        });

        if (emptyState) {
            emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (searchClearBtn) {
                searchClearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
            }
            filterProjects();
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchClearBtn.style.display = 'none';
                searchInput.focus();
            }
            filterProjects();
        });
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentActiveTag = pill.getAttribute('data-tag') || 'all';
            filterProjects();
        });
    });

    window.resetProjectFilters = function() {
        if (searchInput) {
            searchInput.value = '';
            if (searchClearBtn) searchClearBtn.style.display = 'none';
        }
        currentActiveTag = 'all';
        filterPills.forEach(p => {
            if (p.getAttribute('data-tag') === 'all') {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
        filterProjects();
    };

    // =========================================================================
    // 10. LIVE GITHUB ACTIVITY & STATS LOADER
    // =========================================================================
    const languageColors = {
        'TypeScript': '#3178c6',
        'JavaScript': '#f7df1e',
        'Python': '#3572A5',
        'Blade': '#f7523f',
        'Dart': '#00B4AB',
        'PHP': '#4F5D95',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Vue': '#41b883',
        'Code': '#52b788'
    };

    // =========================================================================
    // SCROLL-TRIGGERED NUMBER COUNT-UP ANIMATION
    // =========================================================================
    function animateNumberCount(el, target, duration = 1400, startFrom = 0) {
        if (!el || isNaN(target)) return;

        el.classList.add('counting');
        const start = startFrom;
        const diff = target - start;
        const startTime = performance.now();

        function frame(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart curve for smooth deceleration
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + diff * ease);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                el.textContent = target;
                el.classList.remove('counting');
                el.classList.add('count-completed');
                setTimeout(() => el.classList.remove('count-completed'), 450);
            }
        }

        requestAnimationFrame(frame);
    }

    let isMetricsInView = false;
    let hasTriggeredMetricsCount = false;

    function runMetricsCountUp() {
        const elRepos = document.getElementById('gh-repos');
        const elStars = document.getElementById('gh-stars');
        const elFollowers = document.getElementById('gh-followers');
        const elMemberYear = document.getElementById('gh-member-year');

        if (elRepos && elRepos.dataset.target) {
            animateNumberCount(elRepos, parseInt(elRepos.dataset.target, 10), 1300, 0);
        }
        if (elStars && elStars.dataset.target) {
            animateNumberCount(elStars, parseInt(elStars.dataset.target, 10), 1100, 0);
        }
        if (elFollowers && elFollowers.dataset.target) {
            animateNumberCount(elFollowers, parseInt(elFollowers.dataset.target, 10), 1200, 0);
        }
        if (elMemberYear && elMemberYear.dataset.target) {
            const targetYear = parseInt(elMemberYear.dataset.target, 10);
            animateNumberCount(elMemberYear, targetYear, 1600, Math.max(0, targetYear - 35));
        }
    }

    // Observer to detect when user scrolls to GitHub Stats section
    const metricsSection = document.getElementById('github-activity');
    if (metricsSection && 'IntersectionObserver' in window) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isMetricsInView = true;
                    const elRepos = document.getElementById('gh-repos');
                    if (elRepos && elRepos.dataset.target && !hasTriggeredMetricsCount) {
                        hasTriggeredMetricsCount = true;
                        runMetricsCountUp();
                    }
                } else {
                    // Reset so scrolling back down triggers counting again
                    hasTriggeredMetricsCount = false;
                    isMetricsInView = false;
                }
            });
        }, {
            threshold: 0.25
        });
        metricsObserver.observe(metricsSection);
    }

    async function loadGitHubStats() {
        const skeleton = document.getElementById('github-skeleton');
        const liveContent = document.getElementById('github-live-content');
        if (!liveContent) return;

        try {
            const res = await fetch('/api/github-stats');
            if (!res.ok) throw new Error('API response not ok');
            const data = await res.json();

            if (!data.success) throw new Error('API returned failure');

            const profile = data.profile || {};
            const topLanguages = data.topLanguages || [];
            const recentRepos = data.recentRepos || [];

            // Populate Overview Metrics with target data attributes
            const elRepos = document.getElementById('gh-repos');
            const elStars = document.getElementById('gh-stars');
            const elFollowers = document.getElementById('gh-followers');
            const elMemberYear = document.getElementById('gh-member-year');

            const valRepos = String(profile.publicRepos ?? 12);
            const valStars = String(profile.totalStars ?? 6);
            const valFollowers = String(profile.followers ?? 8);
            const valYear = String(profile.createdAt ? new Date(profile.createdAt).getFullYear() : 2018);

            if (elRepos) elRepos.dataset.target = valRepos;
            if (elStars) elStars.dataset.target = valStars;
            if (elFollowers) elFollowers.dataset.target = valFollowers;
            if (elMemberYear) elMemberYear.dataset.target = valYear;

            // If section is already visible in viewport, trigger counting immediately
            if (isMetricsInView && !hasTriggeredMetricsCount) {
                hasTriggeredMetricsCount = true;
                runMetricsCountUp();
            } else if (!isMetricsInView) {
                // Initialize to starting numbers before scrolled into view
                if (elRepos) elRepos.textContent = '0';
                if (elStars) elStars.textContent = '0';
                if (elFollowers) elFollowers.textContent = '0';
                if (elMemberYear) elMemberYear.textContent = String(Math.max(0, parseInt(valYear, 10) - 35));
            }

            // Populate Profile Card
            const elAvatar = document.getElementById('gh-avatar');
            const elName = document.getElementById('gh-name');
            const elHandle = document.getElementById('gh-handle');
            const elBio = document.getElementById('gh-bio');

            if (elAvatar && profile.avatarUrl) elAvatar.src = profile.avatarUrl;
            if (elName && profile.name) elName.textContent = profile.name;
            if (elHandle && profile.username) elHandle.innerHTML = `@${profile.username} <i class="fas fa-external-link-alt"></i>`;
            if (elBio && profile.bio) elBio.textContent = profile.bio;

            // Cache badge indicator
            const cacheBadge = document.getElementById('gh-cache-badge');
            if (cacheBadge) {
                cacheBadge.textContent = data.cached ? 'Cached (Fast)' : 'Live API';
            }

            // Populate Top Languages Stacked Bar & Legend
            const progressContainer = document.getElementById('gh-lang-progress');
            const legendContainer = document.getElementById('gh-lang-legend');

            if (progressContainer && legendContainer) {
                progressContainer.innerHTML = '';
                legendContainer.innerHTML = '';

                topLanguages.forEach(item => {
                    const color = languageColors[item.language] || '#2d6a4f';

                    // Stacked bar segment
                    const segment = document.createElement('div');
                    segment.className = 'lang-bar-segment';
                    segment.style.width = `${item.percentage}%`;
                    segment.style.backgroundColor = color;
                    segment.title = `${item.language}: ${item.percentage}%`;
                    progressContainer.appendChild(segment);

                    // Legend item
                    const legend = document.createElement('div');
                    legend.className = 'lang-legend-item';
                    legend.innerHTML = `
                        <span class="lang-color-dot" style="background-color: ${color}"></span>
                        <span class="lang-name">${item.language}</span>
                        <span class="lang-percent">${item.percentage}%</span>
                    `;
                    legendContainer.appendChild(legend);
                });
            }

            // Populate Recent Repositories Grid
            const reposContainer = document.getElementById('gh-recent-repos');
            if (reposContainer && recentRepos.length > 0) {
                reposContainer.innerHTML = '';
                recentRepos.forEach(repo => {
                    const langColor = languageColors[repo.language] || '#52b788';
                    const card = document.createElement('a');
                    card.href = repo.url;
                    card.target = '_blank';
                    card.rel = 'noopener noreferrer';
                    card.className = 'github-repo-card';

                    const updatedDate = repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                    }) : '';

                    card.innerHTML = `
                        <div class="repo-card-top">
                            <i class="fas fa-book-bookmark repo-book-icon"></i>
                            <span class="repo-name">${escapeHtml(repo.name)}</span>
                            <i class="fas fa-external-link-alt repo-ext-icon"></i>
                        </div>
                        <p class="repo-description">${escapeHtml(repo.description)}</p>
                        <div class="repo-card-meta">
                            <span class="repo-lang-pill">
                                <span class="repo-lang-dot" style="background-color: ${langColor};"></span>
                                ${escapeHtml(repo.language)}
                            </span>
                            <div class="repo-stat-badges">
                                <span class="repo-stat-chip" title="Stars"><i class="fas fa-star"></i> ${repo.stars}</span>
                                <span class="repo-stat-chip" title="Forks"><i class="fas fa-code-fork"></i> ${repo.forks}</span>
                            </div>
                        </div>
                    `;
                    reposContainer.appendChild(card);
                });
            }

            // Smooth transition from skeleton to live content
            if (skeleton) skeleton.style.display = 'none';
            liveContent.style.display = 'block';
            liveContent.classList.add('fade-in-ready');

        } catch (err) {
            console.warn('Could not load live GitHub stats:', err);
            const elRepos = document.getElementById('gh-repos');
            const elStars = document.getElementById('gh-stars');
            const elFollowers = document.getElementById('gh-followers');
            const elMemberYear = document.getElementById('gh-member-year');

            if (elRepos) elRepos.dataset.target = '12';
            if (elStars) elStars.dataset.target = '6';
            if (elFollowers) elFollowers.dataset.target = '8';
            if (elMemberYear) elMemberYear.dataset.target = '2018';

            if (skeleton) skeleton.style.display = 'none';
            liveContent.style.display = 'block';

            if (isMetricsInView && !hasTriggeredMetricsCount) {
                hasTriggeredMetricsCount = true;
                runMetricsCountUp();
            } else if (!isMetricsInView) {
                if (elRepos) elRepos.textContent = '0';
                if (elStars) elStars.textContent = '0';
                if (elFollowers) elFollowers.textContent = '0';
                if (elMemberYear) elMemberYear.textContent = '1983';
            }
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Call stats loader
    loadGitHubStats();

});

// =========================================================================
// 11. GLOBAL MODAL HANDLERS (PROJECT DETAILS, MOCKUP SWITCHER, LIGHTBOX, CV)
// =========================================================================
function switchMockupDevice(mode) {
    const viewport = document.getElementById('mockup-viewport');
    const tabDesktop = document.getElementById('mockup-tab-desktop');
    const tabMobile = document.getElementById('mockup-tab-mobile');
    const headerDesktop = document.getElementById('mockup-desktop-header');
    const headerMobile = document.getElementById('mockup-mobile-header');

    if (!viewport) return;

    if (mode === 'mobile') {
        viewport.classList.remove('desktop-frame');
        viewport.classList.add('mobile-frame');

        if (tabDesktop) tabDesktop.classList.remove('active');
        if (tabMobile) tabMobile.classList.add('active');

        if (headerDesktop) headerDesktop.style.display = 'none';
        if (headerMobile) headerMobile.style.display = 'flex';
    } else {
        viewport.classList.remove('mobile-frame');
        viewport.classList.add('desktop-frame');

        if (tabDesktop) tabDesktop.classList.add('active');
        if (tabMobile) tabMobile.classList.remove('active');

        if (headerDesktop) headerDesktop.style.display = 'flex';
        if (headerMobile) headerMobile.style.display = 'none';
    }
}

function openProjectModal(btn) {
    const modal = document.getElementById('project-modal');
    const titleEl = document.getElementById('modal-project-title');
    const descEl = document.getElementById('modal-project-desc');
    const imgEl = document.getElementById('modal-project-img');
    const tagsEl = document.getElementById('modal-project-tags');
    const urlEl = document.getElementById('mockup-address-url');
    const linksEl = document.getElementById('modal-project-links');

    if (!modal) return;

    const title = btn.getAttribute('data-judul') || '';
    const desc = btn.getAttribute('data-desc') || '';
    const img = btn.getAttribute('data-img') || '';
    const demo = btn.getAttribute('data-demo') || '';
    const link = btn.getAttribute('data-link') || '';

    let tags = [];
    try {
        tags = JSON.parse(btn.getAttribute('data-tags') || '[]');
    } catch (e) {}

    titleEl.textContent = title;
    descEl.textContent = desc;

    // Set mockup address bar URL
    if (urlEl) {
        if (demo) {
            urlEl.textContent = demo.replace(/^https?:\/\//, '').replace(/\/$/, '');
        } else if (link) {
            urlEl.textContent = link.replace(/^https?:\/\//, '').replace(/\/$/, '');
        } else {
            urlEl.textContent = `${title.toLowerCase().replace(/\s+/g, '-')}.app`;
        }
    }

    // Set external action buttons in modal
    if (linksEl) {
        linksEl.innerHTML = '';
        if (demo) {
            const demoBtn = document.createElement('a');
            demoBtn.href = demo;
            demoBtn.target = '_blank';
            demoBtn.rel = 'noopener noreferrer';
            demoBtn.className = 'btn-pill-cta modal-action-btn';
            demoBtn.innerHTML = '<i class="fas fa-globe"></i> Live Demo';
            linksEl.appendChild(demoBtn);
        }
        if (link) {
            const repoBtn = document.createElement('a');
            repoBtn.href = link;
            repoBtn.target = '_blank';
            repoBtn.rel = 'noopener noreferrer';
            repoBtn.className = 'btn-pill-secondary modal-action-btn';
            repoBtn.innerHTML = '<i class="fab fa-github"></i> Repository';
            linksEl.appendChild(repoBtn);
        }
    }

    if (img) {
        imgEl.src = img;
        imgEl.style.display = 'block';
    } else {
        imgEl.style.display = 'none';
    }

    tagsEl.innerHTML = '';
    tags.forEach(t => {
        const pill = document.createElement('span');
        pill.className = 'tag-chip';
        pill.textContent = t;
        tagsEl.appendChild(pill);
    });

    // Always reset to desktop mockup view initially
    switchMockupDevice('desktop');

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Lightbox Modal
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imageSrc;
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    if (lightbox) {
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// In-App CV Quick View Modal
function openCvModal() {
    const cvModal = document.getElementById('cv-modal');
    const cvIframe = document.getElementById('cv-iframe');
    const fallbackMsg = document.getElementById('cv-fallback-msg');

    if (!cvModal) return;

    if (cvIframe) {
        // Embed PDF with no toolbar for clean display
        cvIframe.src = '/cv.pdf#toolbar=0&navpanes=0';
        cvIframe.style.display = 'block';
        if (fallbackMsg) fallbackMsg.style.display = 'none';
    }

    cvModal.classList.add('is-active');
    cvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCvModal() {
    const cvModal = document.getElementById('cv-modal');
    const cvIframe = document.getElementById('cv-iframe');

    if (cvModal) {
        cvModal.classList.remove('is-active');
        cvModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (cvIframe) {
        // Free memory when closed
        cvIframe.src = '';
    }
}

// Global Keyboard Handler (Escape closes active modals)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeLightbox();
        closeCvModal();
    }
});