// ============================================================
// Theme toggle — terminal / mono / nightshift / paper, persisted
// locally, with a manual "next theme" button and an auto-cycle mode
// ============================================================
const THEME_ORDER = ['terminal', 'mono', 'nightshift', 'paper'];
const themeButtons = document.querySelectorAll('.theme-swatch');
const themeAutoBtn = document.getElementById('themeAuto');
const root = document.documentElement;

let autoTimer = null;

function setTheme(name, opts = {}) {
  root.setAttribute('data-theme', name);
  themeButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.themeChoice === name));
  });
  try { localStorage.setItem('nf-theme', name); } catch (e) { /* storage unavailable, ignore */ }
  // Manually picking a theme (not the auto-cycle tick itself) turns auto-play off
  if (!opts.fromAuto && autoTimer) {
    stopAutoCycle();
  }
}

function nextTheme(current) {
  const idx = THEME_ORDER.indexOf(current);
  return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
}

function startAutoCycle() {
  if (autoTimer) return;
  themeAutoBtn.setAttribute('aria-pressed', 'true');
  autoTimer = setInterval(() => {
    setTheme(nextTheme(root.getAttribute('data-theme')), { fromAuto: true });
  }, 5000);
  try { localStorage.setItem('nf-theme-auto', '1'); } catch (e) { /* ignore */ }
}

function stopAutoCycle() {
  clearInterval(autoTimer);
  autoTimer = null;
  themeAutoBtn.setAttribute('aria-pressed', 'false');
  try { localStorage.removeItem('nf-theme-auto'); } catch (e) { /* ignore */ }
}

// Reflect whatever the inline head script already applied
const currentTheme = root.getAttribute('data-theme') || 'terminal';
setTheme(currentTheme);

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.themeChoice));
});

// Themes are now switched only via the swatches or the auto toggle below.
themeAutoBtn.addEventListener('click', () => {
  if (autoTimer) {
    stopAutoCycle();
  } else {
    startAutoCycle();
  }
});

// Resume auto-cycling if it was on last visit
try {
  if (localStorage.getItem('nf-theme-auto') === '1') startAutoCycle();
} catch (e) { /* storage unavailable, ignore */ }

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// Active nav link on scroll
// ============================================================
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a[data-nav]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ============================================================
// Flip card — click / tap / keyboard to flip photo <-> avatar
// ============================================================
const flipcard = document.getElementById('flipcard');
const ringWrap = document.querySelector('.ring-wrap');
const prefersReducedMotionFlip = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleFlip() {
  const flipped = flipcard.classList.toggle('flipped');
  flipcard.setAttribute('aria-pressed', String(flipped));

  if (!prefersReducedMotionFlip && ringWrap) {
    // Restart the jump animation every time (works for both auto-flip and manual taps)
    ringWrap.classList.remove('jump');
    void ringWrap.offsetWidth; // force reflow so the animation can replay
    ringWrap.classList.add('jump');
  }
}

flipcard.addEventListener('click', toggleFlip);
flipcard.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleFlip();
  }
});

// Auto-flip between photo and avatar every 90 seconds, unless the
// person prefers reduced motion. Also do one intro flip shortly
// after the page first loads so people notice the interaction.
if (!prefersReducedMotionFlip) {
  window.addEventListener('load', () => {
    setTimeout(toggleFlip, 1400);
  });
  setInterval(toggleFlip, 90000);
}

// ============================================================
// Cipher decode hero name animation
// Scrambles through cipher-like characters, then resolves to
// the real name — a nod to the Cipher Text Converter project.
// ============================================================
const cipherEl = document.getElementById('cipherName');
const realText = cipherEl.dataset.real;
const glyphs = '!<>-_\\/[]{}—=+*^?#&%$@ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function decodeText(el, text, duration = 900) {
  if (prefersReducedMotion) {
    el.textContent = text;
    return;
  }
  const frameRate = 30;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;

  function randomGlyph() {
    return glyphs[Math.floor(Math.random() * glyphs.length)];
  }

  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const revealCount = Math.floor(progress * text.length);

    let output = '';
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        output += ' ';
      } else if (i < revealCount) {
        output += `<span>${text[i]}</span>`;
      } else {
        output += `<span class="ch-scramble">${randomGlyph()}</span>`;
      }
    }
    el.innerHTML = output;

    if (frame >= totalFrames) {
      clearInterval(interval);
      el.textContent = text;
    }
  }, 1000 / frameRate);
}

window.addEventListener('DOMContentLoaded', () => {
  decodeText(cipherEl, realText, 1000);
});

// ============================================================
// Scroll reveal for key content blocks
// ============================================================
const revealTargets = document.querySelectorAll(
  '.about-grid, .skills-grid, .projects-grid, .contact-grid'
);
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ============================================================
// Mouse-tracking spotlight (Brittany Chiang-style)
// A soft glow follows the cursor across the whole page, and a
// tighter glow follows it inside project/contact/cert cards.
// Colors come entirely from theme CSS variables, so every theme
// (including auto-cycled ones) gets a matching glow automatically.
// ============================================================
const prefersReducedMotionSpotlight = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(hover: none)').matches;

if (!prefersReducedMotionSpotlight && !coarsePointer) {
  const cursorSpotlight = document.getElementById('cursorSpotlight');
  let rafPending = false;
  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;

  function paintSpotlight() {
    rafPending = false;
    root.style.setProperty('--spot-x', lastX + 'px');
    root.style.setProperty('--spot-y', lastY + 'px');
  }

  window.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    cursorSpotlight.classList.add('active');
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(paintSpotlight);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    cursorSpotlight.classList.remove('active');
  });

  // Per-card glow: track pointer position as a percentage of each card
  const glowCards = document.querySelectorAll('.project-card, .contact-card, .cert-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    }, { passive: true });
  });
}
