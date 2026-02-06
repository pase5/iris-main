function createPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;

    const count = 40;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';

        const size = Math.random() * 12 + 8;
        const startX = Math.random() * 100;
        const duration = Math.random() * 8 + 7;
        const delay = Math.random() * 10;

        petal.style.width = `${size}px`;
        petal.style.height = `${size * 0.7}px`;
        petal.style.left = `${startX}%`;
        petal.style.animation = `drift ${duration}s ease-in-out -${delay}s infinite`;

        container.appendChild(petal);
    }
}

function reveal() {
    const reveals = document.querySelectorAll(".reveal-up");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

// Poster Carousel Logic
function initCarousel() {
    const items = document.querySelectorAll('.poster-item');
    if (items.length === 0) return;

    let currentIndex = 0;

    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next', 'far-left', 'far-right');

            if (index === currentIndex) {
                item.classList.add('active');
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add('prev');
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add('next');
            } else if (index < currentIndex) {
                item.classList.add('far-left');
            } else {
                item.classList.add('far-right');
            }
        });
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto rotate every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }, 5000);

    updateCarousel();
}

window.addEventListener("scroll", reveal);
document.addEventListener('DOMContentLoaded', () => {
    createPetals();
    initCarousel();
    setTimeout(reveal, 100);
});

// Mouse Tracking for Background Spotlight
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.body.style.setProperty('--mouse-x', `${x}%`);
    document.body.style.setProperty('--mouse-y', `${y}%`);
});
