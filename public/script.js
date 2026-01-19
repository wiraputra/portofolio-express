// Inisialisasi Library Animasi (AOS)
AOS.init({
    duration: 1000, // Durasi animasi 1 detik
    once: true,     // Animasi hanya berjalan sekali saat scroll
});

// Efek Mengetik (Typing Effect)
const typingElement = document.getElementById('typing-text');
// Variabel 'roles' diambil dari EJS di file home.ejs
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Tunggu 2 detik setelah selesai mengetik
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Mulai efek mengetik setelah halaman dimuat
document.addEventListener('DOMContentLoaded', typeEffect);

// --- LOGIKA MODAL IMAGE ---

const modal = document.getElementById("certModal");
const modalImg = document.getElementById("modalImage");

// Fungsi Buka Modal
function openModal(imageSrc) {
    modal.style.display = "flex"; // Gunakan flex agar rata tengah
    modal.style.alignItems = "center"; // Vertikal tengah
    modal.style.justifyContent = "center"; // Horizontal tengah
    modalImg.src = imageSrc; // Isi gambar modal dengan URL dari parameter
}

// Fungsi Tutup Modal
function closeModal() {
    modal.style.display = "none";
}

// Opsional: Tutup modal jika tombol ESC ditekan
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});