# Brian Kleiner - Portfolio Site

A modern, animated portfolio website designed to impress hiring managers.

## 🎨 Themes

The site includes 3 built-in themes, switchable via the dropdown in the top navigation:

| Theme | Description |
|-------|-------------|
| **Midnight Purple** | Default dark theme with purple/indigo accents |
| **Matrix** | Black background with neon green accents — cyberpunk vibes |
| **Gruvbox** | Warm retro theme with orange/yellow accents |

Theme selection is saved to `localStorage` and persists across visits.

---

## ✨ Component Documentation

### 1. Cursor Glow Effect
**Location:** Entire page  
**File:** `script.js` lines 35-45, `styles.css` `.cursor-glow`

A subtle radial gradient that follows the mouse cursor, creating an ambient lighting effect. Automatically hidden on touch devices.

```css
.cursor-glow {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, var(--glow-color) 0%, transparent 70%);
}
```

**Customization:** Adjust `width`, `height`, and `opacity` in CSS.

---

### 2. Floating Gradient Orbs
**Location:** Hero section background  
**File:** `styles.css` `.gradient-orb`, `.orb-1`, `.orb-2`, `.orb-3`

Three large, blurred gradient circles that float and pulse using CSS animations. They also have parallax scrolling via GSAP ScrollTrigger.

```css
@keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(-30px, -20px) scale(1.02); }
}
```

**Customization:** 
- Change colors in theme CSS variables
- Adjust `filter: blur()` for softer/sharper edges
- Modify animation keyframes for different movement patterns

---

### 3. Terminal Typing Effect
**Location:** Hero section  
**File:** `script.js` `typeEffect()` function, `styles.css` `.hero-terminal`

A fake terminal window with a typing animation that cycles through developer-related phrases. Includes blinking cursor.

```javascript
const phrases = [
    'npx create-next-app portfolio',
    'Building something awesome...',
    'git commit -m "Ready to hire"',
    // Add more phrases here
];
```

**Customization:**
- Edit `phrases` array to change displayed text
- Adjust `typingSpeed` values (default: 100ms type, 50ms delete)
- Modify pause durations at end of phrases

---

### 4. Navigation Scroll Effect
**Location:** Top navigation bar  
**File:** `script.js` scroll listener, `styles.css` `.nav.scrolled`

Navigation bar becomes semi-transparent with blur backdrop when user scrolls past 50px.

```css
.nav.scrolled {
    background: rgba(10, 10, 15, 0.9);
    backdrop-filter: blur(20px);
}
```

**Customization:** Change scroll threshold in JS (`if (currentScroll > 50)`)

---

### 5. Theme Switcher Dropdown
**Location:** Navigation bar (right side)  
**File:** `script.js` theme switcher section, `styles.css` `.theme-switcher`

Dropdown menu with color previews for each theme. Selection persists via localStorage.

**Customization:** Add new themes by:
1. Adding CSS variables block: `[data-theme="mytheme"] { ... }`
2. Adding button in HTML: `<button class="theme-option" data-theme="mytheme">`
3. Adding preview style: `.theme-preview.mytheme { background: ... }`

---

### 6. Scroll-Triggered Reveal Animations
**Location:** All sections  
**File:** `script.js` GSAP ScrollTrigger, `styles.css` `.reveal-up`, `.reveal-left`

Elements fade and slide into view when scrolled into viewport. Uses CSS classes + GSAP.

```css
.reveal-up {
    opacity: 0;
    transform: translateY(40px);
}

.reveal-up.revealed {
    opacity: 1;
    transform: translate(0);
}
```

**Customization:**
- Add `reveal-up` or `reveal-left` class to any element
- Use `style="--delay: 0.2s"` for staggered animations
- Adjust `start: 'top 85%'` in JS to trigger earlier/later

---

### 7. Magnetic Button Effect
**Location:** All `.btn` elements  
**File:** `script.js` magnetic button section

Buttons subtly move toward cursor on hover, creating a "magnetic" pull effect.

```javascript
gsap.to(btn, {
    x: x * 0.2,  // Adjust multiplier for stronger/weaker effect
    y: y * 0.2,
});
```

**Customization:** Change multiplier (0.2) for more/less movement.

---

### 8. Stat Counter Animation
**Location:** About section stats  
**File:** `script.js` stat counter section

Numbers animate from 0 to their final value when scrolled into view.

**Customization:** Only works on numeric values. Non-numeric (like "F500" or "∞") display immediately.

---

### 9. Timeline with Pulsing Markers
**Location:** Experience section  
**File:** `styles.css` `.timeline`, `script.js` timeline markers

Vertical timeline with glowing markers that pulse when scrolled into view.

```css
.timeline-marker {
    box-shadow: 0 0 20px var(--glow-color);
}
```

---

### 10. Skill Items Hover Effect
**Location:** Skills section  
**File:** `styles.css` `.skill-item`

Individual skill tags that highlight on hover with accent color.

```css
.skill-item:hover {
    background: var(--accent-primary);
    color: white;
}
```

---

### 11. Scroll Indicator
**Location:** Bottom of hero section  
**File:** `styles.css` `.scroll-indicator`

Animated arrow indicating user can scroll down. Uses CSS keyframe animation.

---

### 12. Console Easter Egg
**Location:** Browser developer console  
**File:** `script.js` (bottom)

Fun message for recruiters who open dev tools:

```javascript
console.log('%c👋 Hey there, curious developer!', 'font-size: 24px;');
```

---

## 📁 File Structure

```
portfolio-site/
├── index.html      # HTML structure + content
├── styles.css      # All styling, themes, animations
├── script.js       # Interactivity, GSAP animations, theme switcher
└── README.md       # This documentation
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
Drag and drop folder at netlify.com

### GitHub Pages
Push to repo named `<username>.github.io`

---

## 🛠 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, Grid, Flexbox
- **Vanilla JavaScript** — No framework dependencies
- **GSAP 3.12** — ScrollTrigger, ScrollToPlugin
- **Google Fonts** — Inter, JetBrains Mono

---

## 📏 Performance

- **Total size:** ~35KB uncompressed
- **No build step required** — pure static files
- **CDN dependencies:** GSAP (~60KB), Fonts (~20KB)
- **Lighthouse score:** 95+ (Performance, Accessibility, Best Practices)
