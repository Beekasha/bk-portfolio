// ===== Theme Switcher =====
const themeToggle = document.getElementById('themeToggle');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
document.documentElement.setAttribute('data-theme', savedTheme);
updateActiveTheme(savedTheme);

// Toggle dropdown
themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    themeDropdown.classList.remove('open');
});

// Theme selection
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        updateActiveTheme(theme);
        themeDropdown.classList.remove('open');
    });
});

function updateActiveTheme(theme) {
    themeOptions.forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });
}

// ===== Cursor Glow Effect =====
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Hide cursor glow on mobile
if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
}

// ===== Navigation Scroll Effect =====
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Terminal Typing Effect =====
const terminalText = document.getElementById('terminalText');
const phrases = [
    'npx create-next-app portfolio',
    'Building something awesome...',
    'git commit -m "Ready to hire"',
    'npm run deploy:production',
    'console.log("Hello, world!")',
    'const developer = "Brian Kleiner"'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        terminalText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        terminalText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before next phrase
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after a short delay
setTimeout(typeEffect, 1000);

// ===== GSAP Animations =====
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from('.hero-terminal', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.hero-title .hero-line', {
    duration: 1,
    y: 100,
    opacity: 0,
    stagger: 0.15,
    delay: 0.6,
    ease: 'power3.out'
});

gsap.from('.hero-subtitle', {
    duration: 0.8,
    y: 20,
    opacity: 0,
    delay: 1,
    ease: 'power3.out'
});

gsap.from('.hero-tagline', {
    duration: 0.8,
    y: 20,
    opacity: 0,
    delay: 1.2,
    ease: 'power3.out'
});

gsap.from('.hero-cta', {
    duration: 0.8,
    y: 20,
    opacity: 0,
    delay: 1.4,
    ease: 'power3.out'
});

gsap.from('.scroll-indicator', {
    duration: 1,
    opacity: 0,
    delay: 2,
    ease: 'power3.out'
});

// Gradient orb parallax
gsap.to('.orb-1', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: 200,
    scale: 0.8
});

gsap.to('.orb-2', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -150,
    scale: 1.2
});

// Section title animations
gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left');

revealElements.forEach((el) => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('revealed'),
        once: true
    });
});

// Staggered skill items animation
gsap.utils.toArray('.skill-category').forEach((category) => {
    const items = category.querySelectorAll('.skill-item');
    
    gsap.from(items, {
        scrollTrigger: {
            trigger: category,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.05,
        ease: 'power3.out'
    });
});

// Timeline markers pulse animation
gsap.utils.toArray('.timeline-marker').forEach((marker) => {
    gsap.to(marker, {
        scrollTrigger: {
            trigger: marker,
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        duration: 0.3,
        scale: 1.5,
        ease: 'power3.out',
        onComplete: () => {
            gsap.to(marker, {
                duration: 0.3,
                scale: 1,
                ease: 'power3.in'
            });
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power3.inOut'
            });
        }
    });
});

// Magnetic button effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            duration: 0.3,
            x: x * 0.2,
            y: y * 0.2,
            ease: 'power3.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            duration: 0.3,
            x: 0,
            y: 0,
            ease: 'power3.out'
        });
    });
});

// Stat counter animation
gsap.utils.toArray('.stat-number').forEach((stat) => {
    const value = stat.textContent;
    
    // Only animate numeric values
    if (!isNaN(parseFloat(value))) {
        const endValue = parseFloat(value);
        stat.textContent = '0';
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(stat, {
                    duration: 2,
                    innerHTML: endValue,
                    snap: { innerHTML: endValue % 1 === 0 ? 1 : 0.1 },
                    ease: 'power3.out',
                    onUpdate: function() {
                        const current = parseFloat(stat.innerHTML);
                        if (endValue % 1 !== 0) {
                            stat.innerHTML = current.toFixed(1);
                        }
                    }
                });
            },
            once: true
        });
    }
});

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console easter egg
console.log('%c👋 Hey there, curious developer!', 'font-size: 24px; font-weight: bold;');
console.log('%cLooking for someone who pays attention to detail? You found him.', 'font-size: 14px;');
console.log('%c📧 brian.j.kleiner@gmail.com', 'font-size: 14px; color: #6366f1;');
