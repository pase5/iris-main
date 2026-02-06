class AntigravityEngine {
    constructor() {
        this.canvas = document.getElementById('antigravity-bg');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, active: false };

        // Sakura Blossom Parameters
        this.config = {
            count: 70, // Balanced density
            colors: ['#FFD1DC', '#FFB6C1', '#FFF0F5'], // Sakura pink shades
            magnetRadius: 250,
            lerpSpeed: 0.03,
            waveAmplitude: 3,
            waveSpeed: 0.2,
            fieldStrength: 5
        };

        this.init();
        this.animate();
        this.listeners();
    }

    init() {
        this.resize();
        this.particles = [];
        for (let i = 0; i < this.config.count; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.particles.push({
                x: x,
                y: y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0,
                angle: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.02,
                size: Math.random() * 4 + 4,
                seed: Math.random() * 100,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    listeners() {
        window.addEventListener('resize', () => this.init());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
        });
        document.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });
    }

    drawPetal(x, y, size, angle, opacity, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;

        // Heart-like Sakura Petal Shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-size, -size, -size * 1.5, size / 2, 0, size * 1.5);
        this.ctx.bezierCurveTo(size * 1.5, size / 2, size, -size, 0, 0);
        this.ctx.fill();

        // Add a subtle center line for detail
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, size);
        this.ctx.stroke();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const time = Date.now() * 0.001;

        this.particles.forEach(p => {
            // Calm Falling Motion (Cherry Blossom Style)
            const fieldX = Math.sin(time * this.config.waveSpeed + p.seed) * this.config.waveAmplitude;
            const fieldY = 0.5 + Math.cos(time * this.config.waveSpeed * 0.5 + p.seed) * 0.5;

            p.originX += fieldX * 0.1;
            p.originY += fieldY; // Constant downward drift

            let targetX = p.originX;
            let targetY = p.originY;

            // Soft Magnetic Interaction
            if (this.mouse.active) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.config.magnetRadius) {
                    const force = (this.config.magnetRadius - dist) / this.config.magnetRadius;
                    const angle = Math.atan2(dy, dx);
                    // Swirl away gently
                    targetX -= Math.cos(angle + 0.5) * force * this.config.fieldStrength * 10;
                    targetY -= Math.sin(angle + 0.5) * force * this.config.fieldStrength * 10;
                }
            }

            // Smooth Interpolation
            p.x += (targetX - p.x) * this.config.lerpSpeed;
            p.y += (targetY - p.y) * this.config.lerpSpeed;
            p.angle += p.spin + Math.sin(time + p.seed) * 0.01;

            // Screen Wrap (Falling reset)
            if (p.originX < -100) p.originX = this.canvas.width + 100;
            if (p.originX > this.canvas.width + 100) p.originX = -100;
            if (p.originY > this.canvas.height + 100) {
                p.originY = -100;
                p.originX = Math.random() * this.canvas.width;
            }

            this.drawPetal(p.x, p.y, p.size, p.angle, p.opacity, p.color);
        });

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AntigravityEngine();
});
