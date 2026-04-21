// ADVANCED REVEAL ANIMATION ON SCROLL
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Check if it's a container designed for staggered children
            if (entry.target.classList.contains('reveal-container')) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 100); // 100ms delay between each item
                });
                entry.target.classList.add('active');
            } else {
                entry.target.classList.add('active');
            }
            // Once revealed, we can stop observing this specific element if desired
            // revealObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.1, // Trigger earlier for better feel
    rootMargin: '0px 0px -50px 0px' // Slightly before it hits the viewport
});

// Observe both individual reveals and reveal containers
document.querySelectorAll('.reveal, .reveal-container').forEach(el => revealObserver.observe(el));

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
    if (e.key === "Escape") closeModal();
});

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    
    // Smooth scroll for nav links
    document.querySelectorAll('nav a, .scroll-indicator').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Support both data-target and href for simplicity
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
});