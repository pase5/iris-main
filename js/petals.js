function createPetals() {
    createPetalsInContainer('petals-container', 20); // Reduced from 40
}

function createPetalsInContainer(containerId, count, isPink = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = isPink ? 'petal-premium-pink' : 'petal';

        const size = Math.random() * (isPink ? 15 : 12) + (isPink ? 10 : 8);
        const startX = Math.random() * 100;
        // Significantly slowed down (12s to 25s)
        const duration = Math.random() * 13 + 12;
        const delay = Math.random() * 20; // Increased delay buffer
        const rotation = Math.random() * 360;

        petal.style.width = `${size}px`;
        petal.style.height = `${size * 0.9}px`;
        petal.style.left = `${startX}%`;
        petal.style.opacity = Math.random() * 0.4 + 0.3; // Slightly more transparent
        petal.style.transform = `rotate(${rotation}deg)`;
        petal.style.animation = `petalFloat ${duration}s ease-in-out -${delay}s infinite`;

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
