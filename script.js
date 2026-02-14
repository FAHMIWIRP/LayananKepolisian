// ========== IMGBB API CONFIGURATION ==========
// Dapatkan API Key GRATIS di: https://api.imgbb.com/
const IMGBB_API_KEY = '326b8bd07f2650e3aedbe38698e29534'; // <-- GANTI INI DENGAN API KEY KAMU!

// Particles Animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal();

// Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });

        observer.observe(counter);
    });
}

// Modal Functions
function openModal(type) {
    const modals = {
        'skck': 'modalSKCK',
        'senjata': 'modalSenjata',
        'sim': 'modalSIM'
    };
    document.getElementById(modals[type]).classList.add('active');
}

function closeModal(type) {
    const modals = {
        'skck': 'modalSKCK',
        'senjata': 'modalSenjata',
        'sim': 'modalSIM'
    };
    document.getElementById(modals[type]).classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// FAQ Toggle
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.fa-chevron-down');
    
    answer.classList.toggle('active');
    
    if (answer.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// Image Preview
function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    if (file) {
        // Validasi ukuran file (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 5MB.');
            event.target.value = '';
            return;
        }

        // Validasi tipe file
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            alert('Format file tidak valid! Gunakan JPG atau PNG.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// ========== UPLOAD TO IMGBB FUNCTION ==========
async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            return data.data.url; // Return image URL
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Error uploading to ImgBB:', error);
        return null;
    }
}

// ========== FORM SUBMIT HANDLER WITH IMGBB ==========
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('serviceForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const namaIC = document.getElementById('namaIC').value.trim();
        const namaUCP = document.getElementById('namaUCP').value.trim();
        const jenisLayanan = document.getElementById('jenisLayanan').value;
        const fotoKTP = document.getElementById('fotoKTP').files[0];

        // Validasi
        if (!namaIC || !namaUCP || !jenisLayanan || !fotoKTP) {
            alert('⚠️ Semua field wajib diisi!');
            return;
        }

        // Cek API Key
        if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY') {
            alert('⚠️ API Key ImgBB belum diatur!\n\nSilakan:\n1. Daftar gratis di https://api.imgbb.com/\n2. Dapatkan API Key\n3. Ganti "YOUR_IMGBB_API_KEY" di file script.js dengan API key kamu');
            return;
        }

        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengupload...';

        // Show notification (uploading)
        const notification = document.getElementById('notification');
        notification.style.background = 'rgba(59, 130, 246, 0.9)';
        notification.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>Mengupload foto KTP ke server...</span>';
        notification.classList.add('active');

        // Upload image to ImgBB
        const imageUrl = await uploadToImgBB(fotoKTP);

        if (!imageUrl) {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Kirim Pengajuan';

            notification.style.background = 'rgba(239, 68, 68, 0.9)';
            notification.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i><span>Gagal upload foto! Periksa koneksi dan coba lagi.</span>';
            setTimeout(() => {
                notification.classList.remove('active');
                notification.style.background = 'rgba(34, 197, 94, 0.9)';
            }, 4000);
            return;
        }

        // Format pesan WhatsApp dengan link foto
        const message = `📌 *PENGAJUAN LAYANAN KEPOLISIAN*
━━━━━━━━━━━━━━━━━━━━━━

👤 *Nama IC* : ${namaIC}
👔 *Nama UCP* : ${namaUCP}
📋 *Jenis Layanan* : ${jenisLayanan}

📸 *Foto KTP* : 
${imageUrl}

━━━━━━━━━━━━━━━━━━━━━━
📝 *Keterangan* : 
Saya mengajukan permohonan pelayanan sesuai data di atas.

Terima kasih.

_Dikirim melalui Sistem Pelayanan Kepolisian Digital_`;

        // Update notification (success)
        notification.style.background = 'rgba(34, 197, 94, 0.9)';
        notification.innerHTML = '<i class="fas fa-check-circle mr-2"></i><span>Upload berhasil! Mengarahkan ke WhatsApp...</span>';

        // Redirect ke WhatsApp setelah 2 detik
        setTimeout(() => {
            const phoneNumber = '6283170564390';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            document.getElementById('serviceForm').reset();
            document.getElementById('imagePreview').style.display = 'none';
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Kirim Pengajuan';
            
            // Hide notification
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }, 2000);
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
createParticles();
animateCounter();

// Input Animation
document.querySelectorAll('.form-input, .dropdown-select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});
