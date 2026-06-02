// ===== SoloTrainer landing page =====

const RELEASES_REPO = 'Beekasha/SoloTrainer-releases';
const RELEASES_PAGE = `https://github.com/${RELEASES_REPO}/releases`;
const LATEST_PAGE = `${RELEASES_PAGE}/latest`;

// ===== Theme Switcher (shared with portfolio via localStorage) =====
const themeToggle = document.getElementById('themeToggle');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');

const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
document.documentElement.setAttribute('data-theme', savedTheme);
updateActiveTheme(savedTheme);

themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('open');
});

document.addEventListener('click', () => themeDropdown.classList.remove('open'));

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

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});
if ('ontouchstart' in window) cursorGlow.style.display = 'none';

// ===== Reveal on scroll (no GSAP dependency) =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => revealObserver.observe(el));

// ===== Smooth scroll for in-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
    });
});

// ===== Waveform bars in the app mock =====
(function buildWaveform() {
    const bars = document.getElementById('awBars');
    if (!bars) return;
    // Deterministic pseudo-random heights so it looks like real audio.
    let seed = 7;
    const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    const count = 64;
    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        // Envelope: louder in the middle, quieter at the edges.
        const env = Math.sin((i / count) * Math.PI);
        const h = 12 + (rand() * 0.6 + env * 0.4) * 88;
        span.style.height = h + '%';
        bars.appendChild(span);
    }
})();

// ===== Platform icons (cloned from <template>, no innerHTML) =====
function platformIcon(os) {
    const tpl = document.getElementById(os === 'win' ? 'iconWin' : 'iconApple');
    return tpl ? tpl.content.cloneNode(true) : null;
}

function setIcon(el, os) {
    if (!el) return;
    el.replaceChildren();
    const icon = platformIcon(os);
    if (icon) el.appendChild(icon);
}

// ===== OS detection =====
function detectOS() {
    const ua = (navigator.userAgent || '').toLowerCase();
    const platform = (navigator.platform || '').toLowerCase();
    if (/mac/.test(platform) || /mac os x|macintosh/.test(ua)) {
        // iPads can report MacIntel; treat touch-only mobile as non-desktop.
        if (navigator.maxTouchPoints > 1 && /mobile/.test(ua)) return 'other';
        return 'mac';
    }
    if (/win/.test(platform) || /windows/.test(ua)) return 'win';
    return 'other';
}

// ===== Helpers =====
function formatSize(bytes) {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
}

function configureButton(refs, os, { label, sub, href }) {
    setIcon(refs.icon, os);
    refs.label.textContent = label;
    refs.sub.textContent = sub;
    refs.el.href = href;
}

// ===== Fetch latest release and wire up downloads =====
async function loadLatestRelease() {
    const os = detectOS();

    const dlMac = document.getElementById('dlMac');
    const dlWin = document.getElementById('dlWin');
    const dlWinMsi = document.getElementById('dlWinMsi');
    const macSub = document.getElementById('macSub');
    const winSub = document.getElementById('winSub');
    const versionChip = document.getElementById('releaseVersion');
    const cardMac = document.getElementById('cardMac');
    const cardWin = document.getElementById('cardWin');
    const macBadge = document.getElementById('macBadge');
    const winBadge = document.getElementById('winBadge');

    const primary = {
        el: document.getElementById('dlPrimary'),
        icon: document.getElementById('dlPrimaryIcon'),
        label: document.getElementById('dlPrimaryLabel'),
        sub: document.getElementById('dlPrimarySub'),
    };
    const secondary = {
        el: document.getElementById('dlSecondary'),
        icon: document.getElementById('dlSecondaryIcon'),
        label: document.getElementById('dlSecondaryLabel'),
        sub: document.getElementById('dlSecondarySub'),
    };

    // Highlight the detected platform card.
    if (os === 'mac' && cardMac) { cardMac.classList.add('is-detected'); macBadge.hidden = false; }
    if (os === 'win' && cardWin) { cardWin.classList.add('is-detected'); winBadge.hidden = false; }

    // Defaults / fallbacks if the GitHub API is unreachable (e.g. rate limited).
    // The .dmg has a stable filename, so its "latest/download" link always works.
    let macHref = `${LATEST_PAGE}/download/SoloTrainer.dmg`;
    let winHref = LATEST_PAGE;
    let macSize = '';
    let winSize = '';

    try {
        const res = await fetch(`https://api.github.com/repos/${RELEASES_REPO}/releases/latest`, {
            headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const assets = data.assets || [];
        const byName = (re) => assets.find(a => re.test(a.name.toLowerCase()));

        const mac = byName(/\.dmg$/);
        const winExe = byName(/setup\.exe$/) || byName(/\.exe$/);
        const winMsi = byName(/\.msi$/);

        if (mac) { macHref = mac.browser_download_url; macSize = formatSize(mac.size); }
        if (winExe) { winHref = winExe.browser_download_url; winSize = formatSize(winExe.size); }
        if (winMsi && dlWinMsi) dlWinMsi.href = winMsi.browser_download_url;

        if (data.tag_name && versionChip) {
            versionChip.textContent = `${data.tag_name} · Free`;
        }
    } catch (err) {
        console.warn('Could not load latest release from GitHub:', err);
    }

    // Apply hrefs + sizes to the platform cards.
    if (dlMac) dlMac.href = macHref;
    if (dlWin) dlWin.href = winHref;
    if (macSize && macSub) macSub.textContent = `Apple disk image (.dmg) · ${macSize}`;
    if (winSize && winSub) winSub.textContent = `64-bit installer (.exe) · ${winSize}`;

    // Hero buttons, ordered by detected OS.
    const macBtn = { label: 'Download for Mac', sub: macSize || 'Apple silicon & Intel', href: macHref };
    const winBtn = { label: 'Download for Windows', sub: winSize || '64-bit installer', href: winHref };

    if (os === 'win') {
        configureButton(primary, 'win', winBtn);
        configureButton(secondary, 'mac', macBtn);
    } else {
        // Mac primary by default; for "other", still offer both (Mac first).
        configureButton(primary, 'mac', macBtn);
        configureButton(secondary, 'win', winBtn);
    }
}

loadLatestRelease();

// ===== Console easter egg =====
console.log('%c🎸 SoloTrainer', 'font-size: 20px; font-weight: bold;');
console.log('%cSlow it down. Nail the part.', 'font-size: 13px; color: #6366f1;');
