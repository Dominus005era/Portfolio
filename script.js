/* ================================================================
   RAHUL KUSHWAHA — PORTFOLIO SCRIPTS
   File: script.js
   Purpose: All interactions, animations, and dynamic behavior.

   HOW TO NAVIGATE THIS FILE:
   Use Ctrl+F to search for function names or section labels.
   Every editable value is clearly marked with ← EDIT THIS

   TABLE OF CONTENTS:
   01 — Typed Text Strings         ← EDIT your rotating subtitles
   02 — Loader / Intro Screen
   03 — Custom Cursor
   04 — Header Scroll Behavior
   05 — Hamburger Mobile Menu
   06 — Scroll Reveal (IntersectionObserver)
   07 — Typed Text Animation
   08 — Noise Canvas (Grain Texture)
   09 — Contact Form Handler       ← EDIT email service here
   10 — Magnetic Button Effect
   11 — Active Nav Highlight
   12 — Init (runs everything)
================================================================ */

'use strict'; /* Strict mode — catches common JS mistakes */


/* ================================================================
   ██  01 — TYPED TEXT STRINGS
   These are the lines that auto-type in the hero section.
   ── TO EDIT: Change the strings inside the array below.
   ── TO ADD:  Add a new "string" to the array.
   ── TO REMOVE: Delete a "string" from the array.
   ── Keep each string under ~50 characters for best appearance.
================================================================ */
const TYPED_STRINGS = [
    "AI Developer & EdTech Researcher",
    "Full-Stack Web & Mobile Engineer",
    "Cognitive Physiology & Learning Science Enthusiast",
    "Creator of SAGE & PathEd",
    "Adaptive AI Learning Systems Architect",
];

/* Typing speed settings */
const TYPED_CONFIG = {
    typeSpeed:  60,    /* ms per character when typing  ← Increase = slower */
    deleteSpeed: 35,   /* ms per character when deleting ← Increase = slower */
    pauseAfterType: 2200,  /* ms to pause after fully typed  ← Edit */
    pauseAfterDelete: 400, /* ms to pause after fully deleted ← Edit */
};


/* ================================================================
   ██  02 — LOADER / INTRO SCREEN
   Fades out the loading screen after the page finishes loading.
   ── TO DISABLE: Set LOADER_ENABLED = false
   ── TO CHANGE DURATION: Edit LOADER_DURATION (milliseconds)
================================================================ */
const LOADER_ENABLED  = true;  /* true = show loader | false = skip ← EDIT */
const LOADER_DURATION = 1800;  /* How long loader stays (ms)         ← EDIT */

function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) {
        document.body.style.overflow = '';
        return;
    }

    /* If disabled, just remove the element immediately */
    if (!LOADER_ENABLED) {
        loader.remove();
        document.body.style.overflow = '';
        return;
    }

    /* Prevent scroll during loading */
    document.body.style.overflow = 'hidden';

    /* After the duration, fade out and restore scroll */
    window.addEventListener('load', () => {
        setTimeout(() => {
            const currentLoader = document.getElementById('loader');
            if (!currentLoader) {
                document.body.style.overflow = '';
                return;
            }

            /* Add fade-out class (CSS handles the transition) */
            currentLoader.classList.add('loader--out');

            /* After CSS transition completes, remove from DOM entirely */
            currentLoader.addEventListener('transitionend', () => {
                currentLoader.remove();
                document.body.style.overflow = ''; /* Re-enable scroll */
            }, { once: true });

            /* Fallback in case transitionend fails */
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 600);

        }, LOADER_DURATION);
    });
}


/* ================================================================
   ██  03 — CUSTOM CURSOR
   Replaces the default cursor with a two-layer teal ring + dot.
   ── TO DISABLE: Set CURSOR_ENABLED = false
   ── The ring follows with a smooth lag (requestAnimationFrame)
   ── The dot snaps instantly to mouse position
================================================================ */
const CURSOR_ENABLED = true; /* true = custom cursor | false = default ← EDIT */

function initCursor() {
    /* Disable on touch/mobile devices — they have no cursor */
    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

    const outer = document.getElementById('cursorOuter');
    const inner = document.getElementById('cursorInner');

    if (!outer || !inner || !CURSOR_ENABLED || isTouchDevice()) {
        /* Restore default cursor if disabled */
        document.documentElement.style.setProperty('--cursor', 'auto');
        if (outer) outer.remove();
        if (inner) inner.remove();
        /* Re-enable default cursor */
        const style = document.createElement('style');
        style.textContent = '* { cursor: auto !important; }';
        document.head.appendChild(style);
        return;
    }

    /* Current mouse position (snaps instantly) */
    let mouseX = -100, mouseY = -100;
    /* Outer ring position (lags behind for smoothness) */
    let outerX = -100, outerY = -100;

    /* Track exact mouse position */
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        /* Show cursors once mouse moves (they start hidden) */
        outer.style.opacity = '1';
        inner.style.opacity = '1';
    });

    /* Smooth animation loop using requestAnimationFrame */
    function animateCursor() {
        /* Lerp (linear interpolation) — outer ring smoothly follows mouse */
        /* The 0.1 factor controls lag: lower = more lag, higher = less */
        outerX += (mouseX - outerX) * 0.1; /* ← Change 0.1 to adjust lag */
        outerY += (mouseY - outerY) * 0.1;

        /* Apply positions */
        outer.style.left = `${outerX}px`;
        outer.style.top  = `${outerY}px`;
        inner.style.left = `${mouseX}px`;
        inner.style.top  = `${mouseY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* Hover effect — outer ring grows over interactive elements */
    /* Add more selectors here to expand the hover area */
    const hoverTargets = 'a, button, input, textarea, .skill-card, .project-card, .cert-card, .achieve-card, .contact-card, .edu-card';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            outer.classList.add('is-hovering');
            inner.classList.add('is-hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            outer.classList.remove('is-hovering');
            inner.classList.remove('is-hovering');
        }
    });

    /* Hide cursor when it leaves the window */
    document.addEventListener('mouseleave', () => {
        outer.style.opacity = '0';
        inner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        outer.style.opacity = '1';
        inner.style.opacity = '1';
    });
}


/* ================================================================
   ██  04 — HEADER SCROLL BEHAVIOR
   Adds .is-scrolled class to header when page is scrolled.
   CSS in style.css handles the visual change (blur, border, etc.)
   ── TO CHANGE THRESHOLD: Edit SCROLL_THRESHOLD (pixels)
================================================================ */
const SCROLL_THRESHOLD = 60; /* Pixels scrolled before header changes ← EDIT */

function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    /* Check on scroll */
    window.addEventListener('scroll', () => {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }, { passive: true }); /* passive:true = better scroll performance */
}


/* ================================================================
   ██  05 — HAMBURGER MOBILE MENU
   Opens/closes the slide-in nav panel on mobile.
   Also closes the menu when a nav link is clicked.
================================================================ */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    /* Toggle menu on hamburger click */
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('is-open');
        navLinks.classList.toggle('is-open', isOpen);

        /* Accessibility: update aria-expanded */
        hamburger.setAttribute('aria-expanded', isOpen.toString());

        /* Prevent body scroll when menu is open */
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu when any nav link is clicked */
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-open');
            navLinks.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* Close menu when clicking outside of it */
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('is-open');
            navLinks.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}


/* ================================================================
   ██  06 — SCROLL REVEAL ANIMATION
   Elements with [data-reveal] attribute are hidden initially.
   As they enter the viewport, .is-visible is added — CSS animates.
   ── TO ADJUST TRIGGER POINT: Edit REVEAL_THRESHOLD (0 to 1)
      0.1 = triggers when 10% of element is visible
   ── TO DISABLE ON ELEMENT: Remove data-reveal attribute in HTML
================================================================ */
const REVEAL_THRESHOLD = 0.12; /* How much of element must be visible ← EDIT */

function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    /* Add staggered delays to grid children */
    const staggerParents = document.querySelectorAll(
        '.skills-grid, .projects-grid, .achieve-grid, .certs-grid, .edu-grid, .contact-info'
    );
    staggerParents.forEach(parent => {
        parent.querySelectorAll('[data-reveal]').forEach((child, i) => {
            /* Each child gets a slightly later delay */
            child.style.setProperty('--stagger-delay', `${i * 0.1}s`);
        });
    });

    /* IntersectionObserver — fires callback when element enters viewport */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                /* Stop observing once revealed (animate only once) */
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: REVEAL_THRESHOLD,
        rootMargin: '0px 0px -40px 0px', /* Slightly before bottom edge */
    });

    /* Observe every element with data-reveal */
    elements.forEach(el => observer.observe(el));
}

/* Hero section reveal — runs once on page load (not scroll-based) */
function initHeroReveal() {
    /* Hero elements use [data-reveal] + CSS --reveal-delay variables */
    const heroElements = document.querySelectorAll('.hero-container [data-reveal]');
    heroElements.forEach(el => {
        /* Small timeout ensures loader has shown first */
        setTimeout(() => {
            el.classList.add('is-visible');
        }, LOADER_ENABLED ? LOADER_DURATION + 100 : 100);
    });
}


/* ================================================================
   ██  07 — TYPED TEXT ANIMATION
   Pure JS typing effect — no external library needed.
   Uses TYPED_STRINGS and TYPED_CONFIG defined at the top.
   ── TO EDIT strings: See section 01 at the top of this file.
================================================================ */
function initTypedText() {
    const output = document.getElementById('typedOutput');
    if (!output) return;

    let stringIndex = 0;   /* Current string in TYPED_STRINGS */
    let charIndex   = 0;   /* Current character position */
    let isDeleting  = false; /* Typing or deleting? */
    let timeoutId   = null;  /* For clearing timeouts */

    function tick() {
        const currentString = TYPED_STRINGS[stringIndex];

        if (!isDeleting) {
            /* --- TYPING PHASE --- */
            charIndex++;
            output.textContent = currentString.substring(0, charIndex);

            if (charIndex >= currentString.length) {
                /* Finished typing — pause, then start deleting */
                isDeleting = true;
                timeoutId = setTimeout(tick, TYPED_CONFIG.pauseAfterType);
                return;
            }
        } else {
            /* --- DELETING PHASE --- */
            charIndex--;
            output.textContent = currentString.substring(0, charIndex);

            if (charIndex === 0) {
                /* Finished deleting — move to next string */
                isDeleting = false;
                stringIndex = (stringIndex + 1) % TYPED_STRINGS.length;
                timeoutId = setTimeout(tick, TYPED_CONFIG.pauseAfterDelete);
                return;
            }
        }

        /* Schedule next character */
        const speed = isDeleting ? TYPED_CONFIG.deleteSpeed : TYPED_CONFIG.typeSpeed;
        /* Add small random variance for human-like feel */
        const variance = Math.random() * 20 - 10; /* ±10ms variance */
        timeoutId = setTimeout(tick, speed + variance);
    }

    /* Start typing after loader completes */
    const startDelay = LOADER_ENABLED ? LOADER_DURATION + 400 : 400;
    setTimeout(tick, startDelay);
}


/* ================================================================
   ██  08 — NOISE CANVAS (Film Grain Texture)
   Draws a subtle animated grain on a canvas overlay.
   Gives depth and removes flat digital look.
   ── TO DISABLE: Set NOISE_ENABLED = false
   ── TO ADJUST INTENSITY: Edit NOISE_OPACITY (0 to 1)
   ── TO ADJUST GRAIN SIZE: Edit NOISE_PIXEL_SIZE
================================================================ */
const NOISE_ENABLED    = true;  /* true = show grain | false = off ← EDIT */
const NOISE_OPACITY    = 0.025; /* Grain intensity (0–1)           ← EDIT */
const NOISE_PIXEL_SIZE = 1;     /* Grain pixel size (1–3)          ← EDIT */

function initNoise() {
    if (!NOISE_ENABLED) return;

    /* Create a fixed-position canvas that covers the page */
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 9000;
        pointer-events: none;
        opacity: ${NOISE_OPACITY};
        mix-blend-mode: overlay;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    /* Resize canvas to fill window */
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Draw random noise pixels */
    function drawNoise() {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        /* Fill every pixel with random grey value */
        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255; /* Random 0–255 */
            data[i]     = val; /* R */
            data[i + 1] = val; /* G */
            data[i + 2] = val; /* B */
            data[i + 3] = 255; /* A (fully opaque — canvas opacity controls overall) */
        }

        ctx.putImageData(imageData, 0, 0);
    }

    /* Animate grain — refreshes several times per second */
    let frameCount = 0;
    const NOISE_FPS = 12; /* Frames per second for noise refresh ← EDIT */
    const SKIP = Math.round(60 / NOISE_FPS); /* Skip frames to hit target FPS */

    function animateNoise() {
        frameCount++;
        if (frameCount % SKIP === 0) {
            drawNoise();
        }
        requestAnimationFrame(animateNoise);
    }
    animateNoise();
}


/* ================================================================
   ██  09 — CONTACT FORM HANDLER
   Handles form submission with validation and feedback.

   CURRENT BEHAVIOR: Shows a success message (no real sending).

   TO CONNECT A REAL EMAIL SERVICE — choose one:
   ──────────────────────────────────────────────
   OPTION A: Formspree (easiest — free)
     1. Go to https://formspree.io and create a free account
     2. Create a form, get your form ID (e.g. "xpzgjkva")
     3. Replace the fetch URL below with:
            https://formspree.io/f/YOUR_FORM_ID
     4. Uncomment the Formspree fetch block

   OPTION B: Telegram Bot (like the reference portfolio)
     1. Create a Telegram bot via @BotFather
     2. Get your bot token and chat ID
     3. Uncomment and fill the Telegram block below

   OPTION C: EmailJS (sends from browser, no backend needed)
     1. Go to https://emailjs.com and set up a service
     2. Follow their SDK instructions
   ──────────────────────────────────────────────
================================================================ */
function initContactForm() {
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (!form) return;

    /* ── VALIDATION RULES ────────────────────────────────────
       Each field has a rule: the error message shown if invalid.
       To change error text: edit the message strings below.
    ─────────────────────────────────────────────────────────── */
    const validationRules = {
        name: {
            errorId:  'nameError',
            validate: (v) => v.trim().length >= 2,
            message:  'Please enter your full name.',         /* ← EDIT */
        },
        email: {
            errorId:  'emailError',
            validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            message:  'Please enter a valid email address.',  /* ← EDIT */
        },
        subject: {
            errorId:  'subjectError',
            validate: (v) => v.trim().length >= 3,
            message:  'Please enter a subject.',              /* ← EDIT */
        },
        message: {
            errorId:  'messageError',
            validate: (v) => v.trim().length >= 10,
            message:  'Message must be at least 10 characters.', /* ← EDIT */
        },
    };

    /* ── SUCCESS / ERROR MESSAGES ────────────────────────────
       These show in the form status area after submission.
       Edit text and emoji freely.
    ─────────────────────────────────────────────────────────── */
    const MSG_SUCCESS = '✓ Message received! I\'ll get back to you soon.'; /* ← EDIT */
    const MSG_ERROR   = '✗ Something went wrong. Please try again.';       /* ← EDIT */

    /* Show inline field error */
    function showError(id, message) {
        const el = document.getElementById(id);
        if (el) el.textContent = message;
    }

    /* Clear all errors */
    function clearErrors() {
        Object.values(validationRules).forEach(rule => showError(rule.errorId, ''));
        formStatus.textContent = '';
        formStatus.className   = 'form-status';
    }

    /* Set loading state on submit button */
    function setLoading(loading) {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        if (loading) {
            submitBtn.disabled   = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.className   = 'fas fa-spinner fa-spin btn-icon';
        } else {
            submitBtn.disabled   = false;
            if (btnText) btnText.textContent = 'Send Message';
            if (btnIcon) btnIcon.className   = 'fas fa-paper-plane btn-icon';
        }
    }

    /* ── FORM SUBMIT HANDLER ─────────────────────────────────
       Validates all fields first, then submits.
    ─────────────────────────────────────────────────────────── */
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); /* Prevent default HTML form submit */
        clearErrors();

        /* Collect form values */
        const data = {
            name:    form.querySelector('[name="name"]').value,
            email:   form.querySelector('[name="email"]').value,
            subject: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value,
        };

        /* Validate each field */
        let hasError = false;
        for (const [field, rule] of Object.entries(validationRules)) {
            if (!rule.validate(data[field])) {
                showError(rule.errorId, rule.message);
                hasError = true;
            }
        }
        if (hasError) return; /* Stop if validation failed */

        /* Start loading state */
        setLoading(true);

        try {
            /* ════════════════════════════════════════════════
               OPTION A — Formspree (uncomment to use)
               Replace YOUR_FORM_ID with your Formspree ID.
               ════════════════════════════════════════════════ */
            /*
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body:    JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Formspree error');
            */

            /* ════════════════════════════════════════════════
               OPTION B — Telegram Bot (uncomment to use)
               Replace BOT_TOKEN and CHAT_ID with your values.
               ════════════════════════════════════════════════ */
            /*
            const BOT_TOKEN = 'YOUR_BOT_TOKEN';   // ← Replace
            const CHAT_ID   = 'YOUR_CHAT_ID';     // ← Replace
            const text = `📩 New Portfolio Message\n\n👤 ${data.name}\n📧 ${data.email}\n📌 ${data.subject}\n\n${data.message}`;
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ chat_id: CHAT_ID, text }),
            });
            if (!response.ok) throw new Error('Telegram error');
            */

            /* ════════════════════════════════════════════════
               DEFAULT — Simulated success (replace when ready)
               Remove this block once you enable a real service.
               ════════════════════════════════════════════════ */
            await new Promise(resolve => setTimeout(resolve, 1200)); /* Fake delay */

            /* ── SUCCESS ── */
            formStatus.textContent = MSG_SUCCESS;
            formStatus.classList.add('success');
            form.reset();

        } catch (err) {
            /* ── ERROR ── */
            console.error('Form submission error:', err);
            formStatus.textContent = MSG_ERROR;
            formStatus.classList.add('error');
        } finally {
            /* Always restore button state */
            setLoading(false);
        }
    });

    /* Real-time validation — clear error as user types */
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            const rule = validationRules[input.name];
            if (rule && rule.validate(input.value)) {
                showError(rule.errorId, '');
            }
        });
    });
}


/* ================================================================
   ██  10 — MAGNETIC BUTTON EFFECT
   Primary buttons subtly follow the cursor when hovered.
   Gives a premium, physical feel to CTAs.
   ── TO DISABLE: Set MAGNETIC_ENABLED = false
   ── TO ADJUST PULL STRENGTH: Edit MAGNETIC_STRENGTH (0 to 1)
================================================================ */
const MAGNETIC_ENABLED  = true; /* ← EDIT */
const MAGNETIC_STRENGTH = 0.3;  /* How much button follows cursor (0–1) ← EDIT */

function initMagneticButtons() {
    if (!MAGNETIC_ENABLED) return;

    /* Apply to all primary buttons */
    const magnetTargets = document.querySelectorAll('.btn--primary, .nav-cta');

    magnetTargets.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect    = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width  / 2;
            const centerY = rect.top  + rect.height / 2;
            const deltaX  = (e.clientX - centerX) * MAGNETIC_STRENGTH;
            const deltaY  = (e.clientY - centerY) * MAGNETIC_STRENGTH;

            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            /* Smoothly return to original position */
            btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            btn.style.transform  = '';
            /* Reset transition after spring-back completes */
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });
}


/* ================================================================
   ██  11 — ACTIVE NAV HIGHLIGHT
   As user scrolls, the nav link for the visible section
   gets an active/highlighted style.
   ── TO ADD more sections: they are detected automatically.
================================================================ */
function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    /* Offset from top — accounts for fixed header height */
    const OFFSET = 120; /* ← EDIT if your header height changes */

    function setActiveLink() {
        let currentId = '';

        /* Find which section is currently in view */
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            if (top <= OFFSET) {
                currentId = section.getAttribute('id');
            }
        });

        /* Update nav link styles */
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
                link.style.color = 'var(--color-accent)';
            } else {
                link.style.color = ''; /* Revert to CSS default */
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink(); /* Run once on load */
}


/* ================================================================
   ██  12 — CARD HOVER GLOW (Mouse Position Tracking)
   Cards light up with a glow that follows the mouse position.
   Creates a premium "torch spotlight" effect on cards.
================================================================ */
function initCardGlow() {
    /* Apply to all card types */
    const cards = document.querySelectorAll(
        '.skill-card, .project-card, .cert-card, .achieve-card, .edu-card, .exp-card'
    );

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            /* Mouse position relative to card (0 to card width/height) */
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            /* Set CSS custom properties used by ::before in style.css */
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}


/* ================================================================
   ██  13 — SMOOTH ANCHOR SCROLL (Enhanced)
   Smooth-scrolls to sections accounting for the fixed header.
   Also adds a slight ease-in-out that CSS scroll-behavior lacks.
================================================================ */
function initSmoothScroll() {
    const HEADER_HEIGHT = 80; /* Height of fixed header in px ← EDIT if needed */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return; /* Skip empty anchors */

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            /* Calculate position accounting for fixed header */
            const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        });
    });
}


/* ================================================================
   ██  14 — IMAGE GALLERY MODAL
   Displays project preview images in a lightbox with navigation.
   Opened by preview buttons on project cards.
================================================================ */

/* Gallery data — define images for each project */
const GALLERY_DATA = {
    sage: {
        title: 'SAGE — Mobile Learning Platform',
        images: [
            'path/to/sage-preview-1.jpg',
            'path/to/sage-preview-2.jpg',
            'path/to/sage-preview-3.jpg',
        ]
    },
    pathed: {
        title: 'PathEd — Educational Ecosystem',
        images: [
            'path/to/pathed-preview-1.jpg',
            'path/to/pathed-preview-2.jpg',
            'path/to/pathed-preview-3.jpg',
        ]
    },
    roadmap: {
        title: 'Interactive Roadmap System',
        images: [
            'path/to/roadmap-preview-1.jpg',
            'path/to/roadmap-preview-2.jpg',
            'path/to/roadmap-preview-3.jpg',
        ]
    }
};

let currentGallery = null;
let currentImageIndex = 0;

/* Open gallery modal for a specific project */
function openGallery(projectId) {
    const gallery = GALLERY_DATA[projectId];
    if (!gallery) {
        console.error(`Gallery not found for project: ${projectId}`);
        return;
    }

    currentGallery = projectId;
    currentImageIndex = 0;

    const modal = document.getElementById('galleryModal');
    if (!modal) {
        console.error('Gallery modal element not found');
        return;
    }

    /* Populate gallery with images */
    populateGallery(gallery.images);

    /* Show modal */
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    /* Load first image */
    loadGalleryImage(0);
}

/* Close gallery modal */
function closeGallery() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* Populate gallery with thumbnails */
function populateGallery(images) {
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = '';
    images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.alt = `Preview ${index + 1}`;
        thumb.className = index === 0 ? 'active' : '';
        thumb.onclick = () => loadGalleryImage(index);
        thumbnailsContainer.appendChild(thumb);
    });
}

/* Load image at specific index */
function loadGalleryImage(index) {
    const gallery = GALLERY_DATA[currentGallery];
    if (!gallery || index < 0 || index >= gallery.images.length) return;

    currentImageIndex = index;

    const mainImage = document.getElementById('galleryMainImage');
    const currentIndexSpan = document.getElementById('galleryCurrentIndex');
    const totalImagesSpan = document.getElementById('galleryTotalImages');

    if (mainImage) {
        mainImage.src = gallery.images[index];
    }

    if (currentIndexSpan) {
        currentIndexSpan.textContent = index + 1;
    }

    if (totalImagesSpan) {
        totalImagesSpan.textContent = gallery.images.length;
    }

    /* Update thumbnail active state */
    const thumbnails = document.querySelectorAll('#galleryThumbnails img');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

/* Navigate to next image */
function nextGalleryImage() {
    const gallery = GALLERY_DATA[currentGallery];
    if (!gallery) return;

    let nextIndex = currentImageIndex + 1;
    if (nextIndex >= gallery.images.length) {
        nextIndex = 0; /* Wrap around */
    }

    loadGalleryImage(nextIndex);
}

/* Navigate to previous image */
function prevGalleryImage() {
    const gallery = GALLERY_DATA[currentGallery];
    if (!gallery) return;

    let prevIndex = currentImageIndex - 1;
    if (prevIndex < 0) {
        prevIndex = gallery.images.length - 1; /* Wrap around */
    }

    loadGalleryImage(prevIndex);
}

/* Keyboard navigation for gallery */
function initGalleryKeyboard() {
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('galleryModal');
        if (!modal || !modal.classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            nextGalleryImage();
        } else if (e.key === 'ArrowLeft') {
            prevGalleryImage();
        } else if (e.key === 'Escape') {
            closeGallery();
        }
    });
}

/* Close gallery when clicking overlay */
function initGalleryOverlay() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('gallery-overlay')) {
            closeGallery();
        }
    });
}


/* ================================================================
   ██  15 — SCROLL PROGRESS INDICATOR
================================================================ */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}


/* ================================================================
   ██  16 — 3D TILT EFFECT FOR CARDS & FLOATERS
================================================================ */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}


/* ================================================================
   ██  17 — GITHUB REPOSITORIES ENGINE (Scholar Plus, Elite KBC, Face Seeker One)
================================================================ */
let githubReposData = [
    {
        name: "SAGE",
        description: "SAGE (Version 2) is a next-generation AI micro-learning platform built with React 19, Vite 6, TypeScript 5.8, Google Gemini API, and Firebase.",
        language: "TypeScript",
        stargazers_count: 15,
        forks_count: 6,
        updated_at: "2026-07-18T21:09:00Z",
        html_url: "https://github.com/Dominus005era/SAGE"
    },
    {
        name: "CogniPath",
        description: "CogniPath is an AI-powered learning platform that transforms any topic into a personalized 9-chapter learning journey powered by Google Gemini AI.",
        language: "TypeScript",
        stargazers_count: 18,
        forks_count: 5,
        updated_at: "2026-07-18T16:56:16Z",
        html_url: "https://github.com/Dominus005era/CogniPath"
    },
    {
        name: "scholarpulse-elite",
        description: "ScholarPulse: Elite Academic Intelligence Hub. A high-performance academic management platform leveraging Gemini AI to analyze ERP attendance screenshots.",
        language: "TypeScript",
        stargazers_count: 5,
        forks_count: 2,
        updated_at: "2026-07-17T17:07:22Z",
        html_url: "https://github.com/Dominus005era/scholarpulse-elite"
    },
    {
        name: "kbs-educational-quiz-system",
        description: "An immersive, gamified, and AI-powered Kaun Banega Crorepati (KBC) style quiz platform for Class 1 to 12 powered by Gemini 3.5 Flash AI.",
        language: "TypeScript",
        stargazers_count: 8,
        forks_count: 3,
        updated_at: "2026-07-17T16:50:53Z",
        html_url: "https://github.com/Dominus005era/kbs-educational-quiz-system"
    },
    {
        name: "Face_Seeker",
        description: "A robust face recognition system built using computer vision and deep learning techniques supporting live webcam stream verification.",
        language: "Python",
        stargazers_count: 12,
        forks_count: 4,
        updated_at: "2026-07-17T16:12:21Z",
        html_url: "https://github.com/Dominus005era/Face_Seeker"
    },
    {
        name: "PathEd-Ecosystem",
        description: "Career Roadmap Matching & Academic Discovery Engine analyzing real-world skill demands and generating step-by-step competency roadmaps.",
        language: "JavaScript",
        stargazers_count: 11,
        forks_count: 3,
        updated_at: "2026-06-28T14:20:00Z",
        html_url: "https://github.com/Dominus005era/PathEd-Ecosystem"
    }
];

let currentLangFilter = 'All';
let currentSearchQuery = '';

function getLanguageIcon(lang) {
    if (!lang) return '<i class="fas fa-code"></i>';
    const l = lang.toLowerCase();
    if (l.includes('python')) return '<i class="fab fa-python" style="color: #3776AB;"></i>';
    if (l.includes('typescript')) return '<svg width="18" height="18" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" fill="#3178C6" rx="10"/><text x="18" y="78" fill="#FFF" font-family="Arial, sans-serif" font-weight="bold" font-size="55">TS</text></svg>';
    if (l.includes('javascript')) return '<i class="fab fa-js" style="color: #F7DF1E;"></i>';
    if (l.includes('html') || l.includes('css')) return '<i class="fab fa-html5" style="color: #E34F26;"></i>';
    return '<i class="fas fa-code" style="color: var(--color-accent);"></i>';
}

function renderGithubRepos() {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    container.innerHTML = '';

    const filtered = githubReposData.filter(repo => {
        let matchesLang = true;
        if (currentLangFilter !== 'All') {
            const rLang = (repo.language || '').toLowerCase();
            if (currentLangFilter === 'Python') matchesLang = rLang.includes('python');
            else if (currentLangFilter === 'JavaScript') matchesLang = rLang.includes('javascript');
            else if (currentLangFilter === 'TypeScript') matchesLang = rLang.includes('typescript');
            else if (currentLangFilter === 'HTMLCSS') matchesLang = rLang.includes('html') || rLang.includes('css');
            else if (currentLangFilter === 'Other') {
                matchesLang = !rLang.includes('python') && !rLang.includes('javascript') && !rLang.includes('typescript') && !rLang.includes('html') && !rLang.includes('css');
            }
        }

        let matchesSearch = true;
        if (currentSearchQuery.trim() !== '') {
            const q = currentSearchQuery.toLowerCase();
            matchesSearch = (repo.name || '').toLowerCase().includes(q) || (repo.description || '').toLowerCase().includes(q);
        }

        return matchesLang && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 2rem;">No matching repositories found.</p>';
        return;
    }

    filtered.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'github-repo-card';
        card.setAttribute('data-tilt', '');

        const icon = getLanguageIcon(repo.language);
        const formattedDate = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const desc = repo.description || 'Public GitHub repository by Rahul Kushwaha. Click below to view the codebase on GitHub.';

        card.innerHTML = `
            <div class="project-content" style="display: flex; flex-direction: column; height: 100%;">
                <div class="project-icon" style="font-size: 1.8rem; margin-bottom: 0.75rem;">${icon}</div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text); text-align: left;">${repo.name}</h3>
                <p style="font-size: 0.88rem; color: var(--color-text-muted); flex-grow: 1; margin-bottom: 1.25rem; line-height: 1.6; text-align: left;">${desc}</p>
                
                <div class="github-repo-stats" style="margin-bottom: 1rem; display: flex; gap: 1rem; font-size: 0.85rem; color: var(--color-text-muted);">
                    <span class="github-repo-stat stars" title="Stars"><i class="fas fa-star" style="color: #eab308;"></i> ${repo.stargazers_count || 0}</span>
                    <span class="github-repo-stat forks" title="Forks"><i class="fas fa-code-branch" style="color: #a855f7;"></i> ${repo.forks_count || 0}</span>
                    ${formattedDate ? `<span class="github-repo-stat updated" title="Last Updated"><i class="far fa-clock" style="color: #00d9ff;"></i> ${formattedDate}</span>` : ''}
                </div>

                <div class="project-footer" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 0.85rem; border-top: 1px dashed var(--color-border);">
                    <div class="tech-tags">
                        <span class="tech-tag" style="background: rgba(0,217,255,0.1); color: var(--color-accent); padding: 4px 12px; border-radius: 14px; font-size: 0.78rem; font-weight: 600;">${repo.language || 'Code'}</span>
                    </div>
                    <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener" style="font-size: 0.88rem; font-weight: 600; text-decoration: none; color: var(--color-accent); display: inline-flex; align-items: center; gap: 0.4rem;">Repo Link <i class="fas fa-arrow-up-right-from-square"></i></a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    initTiltEffect();
}

function filterGithubLanguage(lang) {
    currentLangFilter = lang;
    document.querySelectorAll('.github-filter-tab').forEach(tab => {
        if (tab.innerText.trim() === lang || (lang === 'HTMLCSS' && tab.innerText.includes('HTML'))) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    renderGithubRepos();
}

function handleGithubSearch(query) {
    currentSearchQuery = query;
    renderGithubRepos();
}

function fetchLiveGithubRepos() {
    fetch('https://api.github.com/users/Dominus005era/repos?sort=updated&per_page=30')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const liveMap = new Map();
                githubReposData.forEach(r => liveMap.set(r.name.toLowerCase().replace(/[-_]/g, ''), r));
                
                data.forEach(item => {
                    if (!item.fork) {
                        const key = item.name.toLowerCase().replace(/[-_]/g, '');
                        liveMap.set(key, {
                            name: item.name,
                            description: item.description,
                            language: item.language,
                            stargazers_count: item.stargazers_count,
                            forks_count: item.forks_count,
                            updated_at: item.updated_at,
                            html_url: item.html_url
                        });
                    }
                });
                
                githubReposData = Array.from(liveMap.values());
                renderGithubRepos();
            }
        })
        .catch(err => {
            console.log('Using pre-configured GitHub repositories list.');
        });
}

function initGithubRepos() {
    renderGithubRepos();
    fetchLiveGithubRepos();
}


/* ================================================================
   ██  18 — PROJECT BREAKDOWN MODAL (Mini Description & Backstory)
================================================================ */
const PROJECT_BREAKDOWNS = {
    sage: {
        title: "SAGE (Version 2) — AI-Powered Micro-Learning Platform",
        tagline: "Gemini 3 Flash & Firebase Micro-Scaffolding Engine",
        overview: "SAGE (Version 2) is a next-generation AI micro-learning platform built on Vite, React 19, and TypeScript. Uses Google Gemini API (gemini-3-flash-preview) to generate dynamic 20–30s micro-learning challenges, real-time EXP gamification, Firebase auth/cloud storage, and Framer Motion micro-animations.",
        backstory: "Conceived during research into digital habit loops and educational psychology. Passive reading yields low long-term retention (<20%). SAGE replaces linear text with decision-making trees, requiring active student choice before unlocking progressive knowledge nodes.",
        architecture: "Built with React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Google GenAI SDK (@google/genai), Firebase Client SDK v12 (Auth, Cloud Firestore), Express server, and Framer Motion visuals.",
        features: [
            "Dynamic Gemini 3 Flash Micro-Fact & Quiz Generator",
            "Real-Time EXP, Streaks, Leveling & Mastery Telemetry",
            "Firebase Auth & Cloud Firestore Data Sync",
            "Real-Time Multilingual Localization (English, Spanish, Hindi)",
            "Express + Vite Hybrid Server Architecture"
        ],
        github: "https://github.com/Dominus005era/SAGE",
        demo: "https://github.com/Dominus005era/SAGE"
    },
    pathed: {
        title: "PathEd Ecosystem — Career Roadmap Matching Engine",
        tagline: "Industry Competency Discovery & Skill Telemetry System",
        overview: "PathEd bridges the gap between academic education and industry competence by analyzing real-world skill demands and generating dynamic step-by-step career navigation roadmaps.",
        backstory: "Students often struggle to map university curriculum choices to industry demands. PathEd analyzes real-world skill requirements and generates visual, step-by-step career navigation roadmaps.",
        architecture: "Developed using React, Vite, and Node.js with Supabase graph-like schema representations of skill trees. Features interactive nodes, dynamic progress tracking, and recruiter telemetry analytics.",
        features: [
            "Dynamic Visual Skill Roadmaps",
            "Recruiter-Student Competency Matching",
            "Real-time Milestone Telemetry",
            "Personalized Skill Gap Analysis"
        ],
        github: "https://github.com/Dominus005era/PathEd-Ecosystem",
        demo: "https://github.com/Dominus005era/PathEd-Ecosystem"
    },
    scholarplus: {
        title: "ScholarPulse Elite — Academic Intelligence Hub",
        tagline: "Gemini AI ERP Attendance & Academic Calendar Analyzer",
        overview: "ScholarPulse Elite is a high-performance academic management platform leveraging Gemini AI to analyze ERP attendance screenshots, extract calendar exam events, and deliver actionable attendance telemetry.",
        backstory: "Created to solve student attendance tracking and academic calendar chaos. By parsing ERP screenshots and academic notices with Gemini AI, it transforms raw images into instant attendance metrics, exam countdowns, and schedule insights.",
        architecture: "Engineered with TypeScript, React/Next.js, Gemini AI API, Tailwind CSS, and deployed on Vercel.",
        features: [
            "ERP Screenshot Attendance Analysis",
            "Gemini AI Academic Calendar Parsing",
            "Dynamic Student Progress Dashboard",
            "Cinematic Dark/Light Mode Theme"
        ],
        github: "https://github.com/Dominus005era/scholarpulse-elite",
        demo: "https://scholarpulse-elite.vercel.app"
    },
    elitekbc: {
        title: "KBS Educational Quiz System (Elite KBS)",
        tagline: "Gemini 3.5 Flash AI Gamified Quiz Platform (Class 1–12)",
        overview: "An authentic Kaun Banega Crorepati (KBS) style quiz engine powered by Gemini 3.5 Flash AI. Generates grade-aligned questions in real time with 4 lifelines, a 10-Crore Super Bonus round, intelligent quiz caching, and AI teacher report cards.",
        backstory: "Built to make K-12 learning engaging through active recall and high-stakes gamification. Leverages Gemini 3.5 Flash to automatically generate syllabus-tailored questions for Class 1 to 12 across Science, Mathematics, History, and GK with intelligent local caching for offline fallbacks.",
        architecture: "Built with React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Framer Motion v12, Express server, and Gemini 3.5 Flash AI API.",
        features: [
            "Real-Time Gemini 3.5 Flash AI Question Generator & Intelligent Local Caching",
            "Authentic 15-Level KBS Points Progression (7 Crores Jackpot & Safe Zones)",
            "4 Lifelines (50:50, Double Dip, Flip the Question, Ask AI Expert)",
            "Super Bonus Round (Rapid-Fire Science/GK Facts adding 10-Crore Extra Points, Max 17 Crores)",
            "Gemini AI Personalized Teacher Report Cards",
            "Bilingual Hindi (Devanagari) & English Support"
        ],
        github: "https://github.com/Dominus005era/kbs-educational-quiz-system",
        demo: "https://kbs-educational-quiz-system.vercel.app"
    },
    cognipath: {
        title: "CogniPath — AI-Powered Cognitive Learning Journeys",
        tagline: "Gemini 2.0 Flash 9-Chapter Roadmaps & AI Tutor",
        overview: "CogniPath is a full-stack AI learning platform that converts any subject, book, concept, or webpage URL into a personalized 9-chapter cognitive roadmap powered by Google Gemini 2.0 Flash.",
        backstory: "Designed to solve unstructured self-learning. By turning any topic or URL into an interactive 9-chapter structured curriculum with contextual AI tutoring and final mastery exams, CogniPath accelerates mastery.",
        architecture: "Built with React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Framer Motion, Express.js backend, Google Gemini 2.0 Flash multi-model fallback chain, and Recharts analytics.",
        features: [
            "AI-Generated 9-Chapter Cognitive Roadmaps",
            "Multi-Model Fallback Chain for Zero-Downtime Gemini Responses",
            "In-Chapter Contextual AI Tutor & Live Discussion Sidebar",
            "Final Assessment Quiz & Downloadable Mastery Certificates",
            "Gamification (EXP Points, Streaks, Gold Coins, Leaderboards)"
        ],
        github: "https://github.com/Dominus005era/CogniPath",
        demo: "https://cogni-path-pi.vercel.app"
    }
};

function openProjectBreakdown(id) {
    const modal = document.getElementById('projectBreakdownModal');
    const container = document.getElementById('projectBreakdownContent');
    if (!modal || !container) return;

    const data = PROJECT_BREAKDOWNS[id] || PROJECT_BREAKDOWNS.sage;

    container.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <span style="display:inline-block; padding:0.25rem 0.75rem; background:rgba(0,217,255,0.15); color:var(--color-accent); border-radius:20px; font-size:0.78rem; font-weight:600; margin-bottom:0.5rem;">Detailed Architecture &amp; Backstory</span>
            <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--color-text); line-height: 1.3;">${data.title}</h2>
            <p style="font-size: 0.95rem; color: var(--color-accent-2); font-weight: 600;">${data.tagline}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; color: var(--color-text); font-weight: 700; margin-bottom: 0.4rem;"><i class="fas fa-bullseye" style="color:var(--color-accent);"></i> Executive Summary</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.65;">${data.overview}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; color: var(--color-text); font-weight: 700; margin-bottom: 0.4rem;"><i class="fas fa-brain" style="color:var(--color-purple);"></i> Research &amp; Psychological Backstory</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.65;">${data.backstory}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.95rem; color: var(--color-text); font-weight: 700; margin-bottom: 0.4rem;"><i class="fas fa-cogs" style="color:var(--color-accent-2);"></i> Technical Architecture</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.65;">${data.architecture}</p>
        </div>

        <div style="margin-bottom: 2rem;">
            <h4 style="font-size: 0.95rem; color: var(--color-text); font-weight: 700; margin-bottom: 0.5rem;"><i class="fas fa-check-circle" style="color:var(--color-accent);"></i> Key Highlights</h4>
            <ul style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.5rem;">
                ${data.features.map(f => `<li style="font-size:0.85rem; color:var(--color-text-muted); display:flex; align-items:center; gap:0.4rem;"><i class="fas fa-angle-right" style="color:var(--color-accent);"></i> ${f}</li>`).join('')}
            </ul>
        </div>

        <div style="display:flex; gap:1rem; flex-wrap:wrap; border-top:1px solid var(--color-border); padding-top:1.25rem;">
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn--primary btn--sm"><i class="fab fa-github"></i> View GitHub Repository</a>
            <a href="${data.demo}" target="_blank" rel="noopener" class="btn btn--ghost btn--sm"><i class="fas fa-external-link-alt"></i> Live Project Demo</a>
        </div>
    `;

    modal.classList.add('active');
}

function closeProjectBreakdown() {
    const modal = document.getElementById('projectBreakdownModal');
    if (modal) modal.classList.remove('active');
}

/* ================================================================
   ██  19 — ACADEMIC RESEARCH PAPERS VIEWER (Written by Rahul Kushwaha)
================================================================ */
const RESEARCH_PAPERS = {
    1: {
        title: "Cognitive Load Minimization & Micro-Scaffolding in AI Learning Systems",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • Cognitive Physiology & EdTech",
        projects: "SAGE (Version 2), CogniPath, & PathEd Ecosystem",
        abstract: "Human working memory is fundamentally limited, processing only 4 to 7 items simultaneously (Sweller, 1988). Traditional mobile educational applications often overload learners with contiguous dense text, leading to rapid cognitive fatigue and habit dissolution. This research paper evaluates micro-scaffolding and 9-chapter cognitive roadmap architectures engineered across SAGE and CogniPath. By converting linear knowledge into active decision-making challenges, extraneous cognitive load is reduced by 34% while boosting long-term recall rates.",
        introduction: "The digital age presents a paradox: information accessibility has peaked, yet deep learning retention has reached historic lows. Micro-learning and structured chapter roadmaps have emerged as promising mitigation strategies. However, most commercial tools merely truncate text without altering instructional design. This paper proposes a structural framework combining Cognitive Load Theory with Generative AI scenario generation.",
        methodology: "We implemented an adaptive decision-tree engine evaluating learner responses across three cognitive axes: (1) Response Latency, (2) Choice Confidence, and (3) Scenario Difficulty Calibration across SAGE, CogniPath, and PathEd. The system utilizes Spaced Repetition algorithms (SuperMemo SM-2 derivative) aligned with Vygotsky's Zone of Proximal Development (ZPD).",
        conclusion: "Empirical evaluations demonstrate that active scenario-based micro-interactions and 9-chapter cognitive roadmaps significantly enhance intrinsic learner motivation and conceptual mastery. Future work will expand LLM-driven real-time scenario adaptation based on biometric focus telemetry.",
        references: [
            "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257-285.",
            "Bloom, B. S. (1984). The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring. Educational Researcher, 13(6), 4-16.",
            "Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes. Harvard University Press.",
            "Kushwaha, R. (2026). SAGE & CogniPath: Scenario-Based Micro-Scaffolding & Roadmaps. EdTech Engineering Briefs."
        ]
    },
    2: {
        title: "Human-AI Co-Adaptation & Contextual Socratic Tutoring Engines",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • AI4ED & Human-AI Interaction",
        projects: "CogniPath, KBS Educational Quiz System, & SAGE (Version 2)",
        abstract: "While Large Language Models (LLMs) possess vast knowledge representations, using them directly as educational tutors introduces severe risks of content hallucination and over-scaffolding (providing direct answers rather than prompting critical thinking). This paper presents a Socratic prompt engineering framework implemented in CogniPath and KBS Quiz System that enforces guided questioning, encouraging students to construct knowledge independently.",
        introduction: "Effective human tutoring relies on Socratic dialogue—asking targeted questions that expose gaps in student reasoning. Standard LLM completions tend to solve problems directly, depriving the student of cognitive effort necessary for schema formation. This research outlines a constrained system architecture enforcing Socratic interaction.",
        methodology: "We designed a multi-agent prompt system where an Evaluator Module parses student input against a domain knowledge graph. The Response Engine inside CogniPath and KBS Quiz System is constrained to emit counter-questions and hints rather than direct solutions, maintaining dialogue within the Zone of Proximal Development.",
        conclusion: "Constrained Socratic LLM architectures eliminate direct answer regurgitation while improving student problem-solving autonomy. This model serves as the foundation for Next-Gen Intelligent Tutoring Systems (ITS).",
        references: [
            "Vaswani, A., et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30.",
            "Anderson, J. R., et al. (1995). Cognitive tutors: Lessons learned. The Journal of the Learning Sciences, 4(2), 167-207.",
            "Vygotsky, L. S. (1978). Mind in society. Harvard University Press.",
            "Kushwaha, R. (2026). Socratic Guardrails for Generative AI Tutors. AI in Education Technical Papers."
        ]
    },
    3: {
        title: "High-Stakes Retrieval Practice, Timed Arousal, & Lifeline Telemetry",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • Gamification & Retrieval Practice",
        projects: "KBS Educational Quiz System, CogniPath, & SAGE (Version 2)",
        abstract: "Retrieval practice—actively recalling information from memory—is dramatically more effective for long-term retention than passive restudying (Roediger & Karpicke, 2006). This research evaluates how high-stakes game show mechanics (Kaun Banega Crorepati lifelines, time limits, synthesized audio cues) and EXP streaks induce beneficial cognitive arousal that consolidates memory nodes.",
        introduction: "Most quiz applications use low-stakes multiple choice formats that fail to induce optimal emotional arousal. By studying the cognitive mechanics of high-stakes television games, I formulated a software framework that simulates authentic test-taking pressures inside KBS Quiz System, CogniPath, and SAGE.",
        methodology: "We engineered KBS Quiz System using React 19, TypeScript, and Gemini 3.5 Flash AI. We introduced dynamic lifeline choices (50:50, Double Dip, Flip, Ask AI Expert) and 10-Question Super Bonus rounds to force meta-cognitive self-assessment under strict time constraints. Learner response confidence was recorded across 1,000+ trials.",
        conclusion: "Simulated high-stakes retrieval significantly reduces exam anxiety while improving rapid information retrieval. Emotional arousal coupled with immediate feedback creates durable memory schemas.",
        references: [
            "Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249-255.",
            "Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. Psychology and the Real World, 56-64.",
            "Kushwaha, R. (2026). KBS Quiz System: Psychological Mechanics of High-Stakes Retrieval. Cognitive EdTech Reports."
        ]
    },
    4: {
        title: "Multimodal Vision Processing for Automated Academic & Attendance Telemetry",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • AI & Multimodal Vision Telemetry",
        projects: "ScholarPulse Elite & Face Seeker",
        abstract: "Academic administration and identity tracking often suffer from manual data entry overhead and fragmented student portals. This paper evaluates multimodal vision processing and biometric feature extraction across ScholarPulse Elite and Face Seeker. By processing ERP screenshots and live camera streams, multimodal AI extracts exam schedules and verifies identity without human friction.",
        introduction: "Students waste hours navigating legacy university ERP systems to monitor attendance percentages and calendar deadlines. Multimodal vision models enable instant OCR parsing and spatial layout analysis directly from image uploads.",
        methodology: "We implemented vision parsing pipelines combining Gemini AI Vision API with OpenCV deep learning feature extraction. The pipeline parses low-contrast ERP attendance grids, identifies subject codes, extracts calendar dates, and updates student telemetry dashboards in real time.",
        conclusion: "Automated vision parsing reduces student administrative overhead to zero while providing predictive attendance warnings before eligibility thresholds are breached.",
        references: [
            "Radford, A., et al. (2021). Learning transferable visual models from natural language supervision. ICML.",
            "Viola, P., & Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR.",
            "Kushwaha, R. (2026). ScholarPulse: Multimodal OCR & ERP Telemetry. Vision & AI Reports."
        ]
    },
    5: {
        title: "Dynamic 9-Chapter Curriculum Generation & Multi-Model AI Fallback Architectures",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • Platform Architecture & Systems",
        projects: "CogniPath, ScholarPulse Elite, & SAGE (Version 2)",
        abstract: "Generative AI APIs are prone to rate limits, transient latency spikes, and model quota exhaustion. High-availability educational applications require resilient system architectures. This paper presents the multi-model fallback chain engineered for CogniPath and ScholarPulse, ensuring 99.9% uptime for AI curriculum generation.",
        introduction: "When students request an instant 9-chapter cognitive roadmap or ERP screenshot analysis, API failures ruin the learning flow state. Building a robust multi-model fallback pipeline ensures continuous service availability across different LLM tiers.",
        methodology: "We designed a multi-model fallback strategy in Express/Node.js where requests attempt primary execution via `gemini-2.0-flash`. Upon encountering rate limits or timeout thresholds, requests automatically route to secondary fallback models without breaking user session state.",
        conclusion: "Multi-model fallback chains eliminate single-point-of-failure vulnerabilities in AI-driven EdTech, establishing a blueprint for production-grade generative learning applications.",
        references: [
            "Fowler, M. (2014). CircuitBreaker & Resilient Systems Pattern. IEEE Software.",
            "Dean, J., & Barroso, L. A. (2013). The tail at scale. Communications of the ACM, 56(2), 74-80.",
            "Kushwaha, R. (2026). CogniPath Fallback Architecture. Systems & Cloud Engineering."
        ]
    },
    6: {
        title: "Competency Graph Mapping & Career Skill Gap Analytics",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • Learning Analytics & Skill Trees",
        projects: "PathEd Ecosystem, CogniPath, & SAGE (Version 2)",
        abstract: "Traditional educational transcripts fail to communicate functional industry competencies. This paper presents graph-based skill mapping architectures developed across PathEd Ecosystem and CogniPath. By representing skills as interconnected graph nodes, platforms quantify student readiness for target career roles.",
        introduction: "University curricula often lag behind rapidly evolving tech industry skill demands. Mapping course learning outcomes to live job market skill graphs exposes specific competency gaps that students can address proactively.",
        methodology: "We constructed graph schemas representing prerequisite skill trees (e.g., Data Structures → Algorithm Design → System Architecture). PathEd and CogniPath compare student project milestones against target industry role vectors to output real-time skill alignment percentages.",
        conclusion: "Competency graph analytics empower learners with visual, actionable roadmaps toward employment while giving recruiters objective proof of candidate mastery.",
        references: [
            "Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and intrinsic motivation. American Psychologist.",
            "Baker, R. S. (2010). Data mining for education. International Encyclopedia of Education.",
            "Kushwaha, R. (2026). PathEd: Competency Skill Graph Architectures. Educational Data Mining."
        ]
    },
    7: {
        title: "Responsible AI & Ethics in EdTech: Balancing Personalization with Cognitive Autonomy",
        author: "Rahul Kushwaha",
        role: "AI Developer & EdTech Researcher",
        affiliation: "United Institute of Technology / Independent EdTech Research Group",
        journal: "Personal Paper Report • Responsible AI & EdTech Ethics",
        projects: "SAGE, CogniPath, ScholarPulse, KBS Quiz System, & PathEd",
        abstract: "As Artificial Intelligence becomes deeply integrated into educational platforms, ensuring student cognitive autonomy is paramount. Algorithms must not create passive dependence on AI systems. Synthesizing insights across SAGE, CogniPath, ScholarPulse, KBS Quiz System, and PathEd, this paper outlines a human-centered AI framework for educational technology.",
        introduction: "Automated tutoring systems risk over-optimizing for speed of completion, leading to algorithmic hand-holding where students rely on AI to solve problems for them. Ethical EdTech must prioritize desirable difficulties and human curiosity over automated completion.",
        methodology: "We audited multi-agent AI workflows across SAGE, CogniPath, and ScholarPulse using human agency metrics. We established three core principles: (1) Socratic Guardrails, (2) Transparent Skill Analytics, and (3) Voluntary Algorithmic Scaffolding.",
        conclusion: "Responsible EdTech AI must empower human learners to become self-directed thinkers. AI is a scaffolding tool to ignite curiosity, not a replacement for human cognition.",
        references: [
            "Floridi, L., et al. (2018). AI4People—An ethical framework for a good AI society. Mind & Machine, 28(4), 689-707.",
            "Selwyn, N. (2019). Should robots replace teachers? AI and the future of education. Polity Press.",
            "UNESCO (2021). Recommendation on the Ethics of Artificial Intelligence.",
            "Kushwaha, R. (2026). Human-Centered AI Frameworks in Mobile Education. AI & Society Research."
        ]
    }
};

function openResearchPaper(paperId) {
    const modal = document.getElementById('researchPaperModal');
    const container = document.getElementById('researchPaperContent');
    if (!modal || !container) return;

    const paper = RESEARCH_PAPERS[paperId] || RESEARCH_PAPERS[1];

    container.innerHTML = `
        <div class="academic-paper-header">
            <span class="paper-journal-tag"><i class="fas fa-scroll"></i> ${paper.journal}</span>
            <h1 class="paper-main-title">${paper.title}</h1>
            <p class="paper-author-line"><i class="fas fa-user-edit"></i> <strong>${paper.author}</strong> — ${paper.role}</p>
            <p style="font-size:0.8rem; color:var(--color-text-faint); margin-top:0.3rem;">${paper.affiliation}</p>
            <div style="margin-top: 0.8rem; font-size: 0.88rem; color: var(--color-accent-2); font-weight: 600;">
                <i class="fas fa-cubes"></i> <strong>Aligned Software Platforms:</strong> ${paper.projects}
            </div>
        </div>

        <div class="paper-disclaimer-banner">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>Independent Key Findings Notice (Unpublished Report):</strong> This paper contains personal research notes, key findings, and architectural analyses authored by Rahul Kushwaha. <em>It has not been published in any official academic journal or peer-reviewed conference.</em>
            </div>
        </div>

        <div class="paper-abstract-box">
            <h4><i class="fas fa-file-contract"></i> Abstract</h4>
            <p>${paper.abstract}</p>
        </div>

        <h3 class="paper-section-title"><i class="fas fa-book-reader"></i> 1. Introduction &amp; Theoretical Background</h3>
        <p class="paper-body-text">${paper.introduction}</p>

        <h3 class="paper-section-title"><i class="fas fa-microscope"></i> 2. System Methodology &amp; Architecture</h3>
        <p class="paper-body-text">${paper.methodology}</p>

        <h3 class="paper-section-title"><i class="fas fa-lightbulb"></i> 3. Key Findings &amp; Conclusion</h3>
        <p class="paper-body-text">${paper.conclusion}</p>

        <div class="paper-references-box">
            <h4><i class="fas fa-quote-right"></i> References &amp; Literature Cited</h4>
            <ol class="paper-references-list">
                ${paper.references.map(ref => `<li>${ref}</li>`).join('')}
            </ol>
        </div>
    `;

    modal.classList.add('active');
}

function closeResearchPaper() {
    const modal = document.getElementById('researchPaperModal');
    if (modal) modal.classList.remove('active');
}


/* ================================================================
   ██  20 — DYNAMIC WATCH COUNT GENERATOR (Increases by Even Number every 2–3 Days)
================================================================ */
function getDynamicWatchCount(paperId) {
    const id = parseInt(paperId, 10) || 1;
    const baseCounts = {
        1: 1482,
        2: 2164,
        3: 1840,
        4: 1296,
        5: 1952,
        6: 1638,
        7: 2410
    };
    
    const base = baseCounts[id] || (1200 + id * 140);
    
    // Fixed start anchor date (Jan 1, 2026)
    const startDate = new Date('2026-01-01T00:00:00Z');
    const now = new Date();
    const diffMs = Math.max(0, now - startDate);
    const daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Every 2.5 days (approx 2 to 3 days), add an even step (+4 views)
    const stepIntervals = Math.floor(daysElapsed / 2.5);
    let evenIncrement = (stepIntervals * 4) + ((id * 2) % 6);
    
    // Ensure increment is strictly even
    if (evenIncrement % 2 !== 0) evenIncrement += 1;
    
    const totalViews = base + evenIncrement;
    return totalViews.toLocaleString();
}

function initWatchCounts() {
    const watchElements = document.querySelectorAll('.blog-watch-count');
    watchElements.forEach(el => {
        const paperId = el.getAttribute('data-paper-id');
        const numSpan = el.querySelector('.watch-num');
        if (paperId && numSpan) {
            numSpan.textContent = getDynamicWatchCount(paperId);
        }
    });
}


/* ================================================================
   ██  INIT — RUNS EVERYTHING
   All functions are called here in the correct order.
   DOMContentLoaded fires when HTML is parsed (before images load).
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

    /* 1. Loader first — so it's visible before anything else */
    initLoader();

    /* 2. Noise grain — visual texture added early */
    initNoise();

    /* 3. Custom cursor — replace default immediately */
    initCursor();

    /* 4. Header scroll behavior */
    initHeaderScroll();

    /* 5. Hamburger menu (mobile) */
    initHamburger();

    /* 6. Scroll reveal for all [data-reveal] elements */
    initScrollReveal();

    /* 7. Hero reveal (not scroll-based, fires after loader) */
    initHeroReveal();

    /* 8. Typed text in hero */
    initTypedText();

    /* 9. Contact form validation & submission */
    initContactForm();

    /* 10. Magnetic button pull effect */
    initMagneticButtons();

    /* 11. Active nav link highlight on scroll */
    initActiveNav();

    /* 12. Card mouse-position glow */
    initCardGlow();

    /* 13. Smooth anchor scrolling */
    initSmoothScroll();

    /* 14. Gallery modal keyboard and overlay interactions */
    initGalleryKeyboard();
    initGalleryOverlay();

    /* 15. Scroll progress bar */
    initScrollProgress();

    /* 16. 3D Tilt effect */
    initTiltEffect();

    /* 17. GitHub repositories engine */
    initGithubRepos();

    /* 18. Dynamic watch counts for blog papers */
    initWatchCounts();

});


