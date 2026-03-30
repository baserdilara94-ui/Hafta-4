/**
 * Portfolio JS - Galaxy Particles & Mouse Glow
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Glow Tracking Effect
    const glow = document.createElement('div');
    glow.classList.add('mouse-glow');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });

    // 2. Canvas Particles (Galaxy Effect)
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let w, h;
    let particles = [];
    
    // Resize handler
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    // Mouse state
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.angle = Math.random() * 360;
            this.velocity = Math.random() * 0.5 + 0.2;
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Slight drifting
            this.angle += 0.02;
            this.x += Math.cos(this.angle) * this.velocity;
            this.y += Math.sin(this.angle) * this.velocity;
            
            // Loop around screen edge if drifted too far
            if(this.x < 0) this.x = w;
            if(this.x > w) this.x = 0;
            if(this.y < 0) this.y = h;
            if(this.y > h) this.y = 0;

            // Mouse interaction push
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                // Max distance, past that the force is 0
                let force = (mouse.radius - distance) / mouse.radius;
                
                if (distance < mouse.radius) {
                    this.x -= forceDirectionX * force * this.density;
                    this.y -= forceDirectionY * force * this.density;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        let numParticles = (w * h) / 10000; // responsive density
        if (numParticles > 150) numParticles = 150; // hard limit
        
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                // If particles are close enough, connect with a line
                if (distance < (w/10) * (h/10)) {
                    // Line opacity depends on distance
                    let opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(165, 94, 234, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        // Create trailing effect by drawing semi-transparent background
        ctx.fillStyle = 'rgba(15, 12, 41, 0.2)'; // Fades out the old frames
        ctx.fillRect(0, 0, w, h);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // --- 3. Custom Cursor Mouse Logic ---
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    
    if (dot && ring) {
        document.addEventListener('mousemove', (e) => {
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';
            ring.style.left = e.clientX + 'px';
            ring.style.top = e.clientY + 'px';
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .profile-img');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('hovering-dot');
                ring.classList.add('hovering-ring');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('hovering-dot');
                ring.classList.remove('hovering-ring');
            });
        });
    }

    // --- 4. Bottom to Top Floating Particles ---
    const pContainer = document.getElementById('particles-container');
    if (pContainer) {
        function spawnFloatingParticle() {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            // Randomize X position
            particle.style.left = Math.random() * 100 + 'vw';
            
            // Randomize size slightly
            const size = Math.random() * 8 + 4; // 4px to 12px
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Randomize animation duration for different speeds
            const duration = Math.random() * 10 + 10; // 10s to 20s
            particle.style.animation = `floatUp ${duration}s linear infinite`;
            
            pContainer.appendChild(particle);
            
            // Clean up to prevent DOM bloat
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }
        
        // Spawn particles initially
        for (let i = 0; i < 20; i++) {
            // Random delay to make them appear naturally
            setTimeout(spawnFloatingParticle, Math.random() * 8000);
        }
        // Then keep spawning them over time
        setInterval(spawnFloatingParticle, 800);
    }
});
