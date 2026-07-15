// INITIALIZE GSAP & SCROLLTRIGGER
gsap.registerPlugin(ScrollTrigger);

function initGSAP() {
    // Initial Load Animation for the first viewport (Hero Bento)
    const heroTl = gsap.timeline();
    heroTl.from(".hero-bento .gsap-bento", {
        scale: 0.9,
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        delay: 0.2
    });

    // Scroll Animations for the rest of Bento items
    const bentoContainers = [".resume-bento", ".projects-bento", ".cert-bento"];
    
    bentoContainers.forEach(container => {
        gsap.from(`${container} .gsap-bento`, {
            scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            scale: 0.9,
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.2)"
        });
    });

    // Section Headers
    gsap.utils.toArray(".section-header.gsap-bento").forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });
    
    // Footer
    gsap.from("footer .gsap-bento", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 95%",
            toggleActions: "play none none none"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
}

// STICKY NAVBAR LOGIC
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
});

// TYPING EFFECT
const typingElement = document.getElementById('typing-text');
const portfolioDataEl = document.getElementById('portfolio-data');
let roles = [];

if (portfolioDataEl) {
    try {
        roles = JSON.parse(portfolioDataEl.getAttribute('data-roles'));
    } catch(e) {
        console.error("Failed to parse roles");
    }
}

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingElement || roles.length === 0) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2500; // Hold for 2.5s
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// MODAL LOGIC
const modal = document.getElementById("certModal");
const modalImg = document.getElementById("modalImage");

function openModal(imageSrc) {
    if (!modal || !modalImg) return;
    modal.style.display = "flex";
    modalImg.src = imageSrc;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Close modal on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
        closeProjectModal();
    }
});

// PROJECT MODAL LOGIC
const projModal = document.getElementById("projectModal");
const projModalImg = document.getElementById("projectModalImg");
const projModalTitle = document.getElementById("projectModalTitle");
const projModalDesc = document.getElementById("projectModalDesc");
const projModalTags = document.getElementById("projectModalTags");

function openProjectModal(btn) {
    if (!projModal) return;
    
    const judul = btn.getAttribute('data-judul');
    const desc = btn.getAttribute('data-desc');
    const img = btn.getAttribute('data-img');
    const tags = JSON.parse(btn.getAttribute('data-tags') || '[]');
    
    projModalTitle.textContent = judul;
    projModalDesc.textContent = desc;
    projModalImg.src = img || 'https://via.placeholder.com/800x450?text=No+Image';
    
    // Clear and render tags
    projModalTags.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        projModalTags.appendChild(span);
    });
    
    projModal.classList.add('active');
    document.body.style.overflow = "hidden";
}

function closeProjectModal() {
    if (!projModal) return;
    projModal.classList.remove('active');
    document.body.style.overflow = "auto";
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    initGSAP();
    
    // Smooth scroll for nav links
    document.querySelectorAll('nav a, .scroll-indicator').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const targetId = href ? href.substring(1) : this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // SPOTLIGHT EFFECT FOR BENTO ITEMS
    document.querySelectorAll('.bento-item').forEach(item => {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});