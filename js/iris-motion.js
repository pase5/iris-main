class IrisMotion {
    constructor(canvasId = 'antigravity-bg', options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000, active: false };

        // Default Config
        const defaultConfig = {
            count: 70,
            colors: ['#FFD1DC', '#FFB6C1', '#FFF0F5'],
            magnetRadius: 250,
            lerpSpeed: 0.03,
            waveAmplitude: 3,
            waveSpeed: 0.2,
            fieldStrength: 5,
            opacityRange: [0.1, 0.4]
        };

        this.config = { ...defaultConfig, ...options };

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
                opacity: Math.random() * (this.config.opacityRange[1] - this.config.opacityRange[0]) + this.config.opacityRange[0]
            });
        }
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    listeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
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

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-size, -size, -size * 1.5, size / 2, 0, size * 1.5);
        this.ctx.bezierCurveTo(size * 1.5, size / 2, size, -size, 0, 0);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const time = Date.now() * 0.001;

        this.particles.forEach(p => {
            const fieldX = Math.sin(time * this.config.waveSpeed + p.seed) * this.config.waveAmplitude;
            const fieldY = 0.5 + Math.cos(time * this.config.waveSpeed * 0.5 + p.seed) * 0.5;

            p.originX += fieldX * 0.1;
            p.originY += fieldY;

            let targetX = p.originX;
            let targetY = p.originY;

            if (this.mouse.active) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.config.magnetRadius) {
                    const force = (this.config.magnetRadius - dist) / this.config.magnetRadius;
                    const angle = Math.atan2(dy, dx);
                    targetX -= Math.cos(angle + 0.5) * force * this.config.fieldStrength * 10;
                    targetY -= Math.sin(angle + 0.5) * force * this.config.fieldStrength * 10;
                }
            }

            p.x += (targetX - p.x) * this.config.lerpSpeed;
            p.y += (targetY - p.y) * this.config.lerpSpeed;
            p.angle += p.spin + Math.sin(time + p.seed) * 0.01;

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
    // Hero/Main Particles
    new IrisMotion('motion-bg');

    // Footer Particles (New)
    new IrisMotion('footer-particles', {
        count: 40,
        magnetRadius: 150,
        opacityRange: [0.05, 0.2]
    });
});
