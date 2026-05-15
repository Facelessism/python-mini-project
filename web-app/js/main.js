/*
  main.js - lightweight app wiring
  - safe: guards around missing functions/elements
  - ensures Try It / Play buttons open modal even if project rendering fails
*/

const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getFocusableElements(root) {
    const selector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll(selector)).filter(el => !el.closest('[aria-hidden="true"]') && !el.classList.contains('visually-hidden'));
}

function trapFocus(modalEl) {
    let handler = (e) => {
        if (e.key !== 'Tab' || !modalEl.classList.contains('active')) return;
        const focusables = getFocusableElements(modalEl);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
}

function safeRun(fn) {
    try { fn(); } catch (err) { console.error(err); }
}

document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const backToTop = document.getElementById('backToTop');
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalDialogTitle');

    // Theme
    if (themeToggle) {
        const saved = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', saved);
        themeToggle.addEventListener('click', () => {
            const cur = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', cur);
            localStorage.setItem('theme', cur);
        });
    }

    // Sound (safe)
    if (soundToggle) {
        const update = () => {
            if (window.audioController) soundToggle.innerHTML = window.audioController.isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        };
        update();
        soundToggle.addEventListener('click', () => {
            if (window.audioController && typeof window.audioController.toggleMute === 'function') {
                const muted = window.audioController.toggleMute();
                update();
                if (!muted && typeof window.audioController.play === 'function') window.audioController.play('click');
            }
        });
    }

    // Tabs
    function applyFilter(category) {
        projectCards.forEach(card => {
            const cat = card.getAttribute('data-category') || 'all';
            card.style.display = (category === 'all' || cat === category) ? '' : 'none';
        });
    }
    tabs.forEach(tab => tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); applyFilter(tab.getAttribute('data-category') || 'all'); }));

    // Modal helpers
    let removeTrap = null;
    function openProjectSafe(name, trigger) {
        if (!modal || !modalBody) return;
        lastFocusedElement = trigger || document.activeElement;
        if (modalTitle && trigger) {
            const card = trigger.closest('.project-card');
            const h = card?.querySelector('h3')?.textContent?.trim();
            modalTitle.textContent = h || (name || 'Project');
        }
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setMainInert(true);

        // load content safely
        safeRun(() => {
            if (typeof getProjectHTML === 'function') {
                modalBody.innerHTML = getProjectHTML(name) || '<div style="padding:1rem">Project content unavailable.</div>';
            } else {
                modalBody.innerHTML = '<div style="padding:1rem">Project content unavailable.</div>';
            }
            if (typeof initializeProject === 'function') initializeProject(name);
        });

        // focus trap
        removeTrap = trapFocus(modal);
        // initial focus
        const focusables = getFocusableElements(modalBody);
        (focusables[0] || modalClose)?.focus();
    }

    function closeProjectSafe() {
        if (!modal || !modal.classList.contains('active')) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setMainInert(false);
        if (removeTrap) { removeTrap(); removeTrap = null; }
        if (modalBody) modalBody.innerHTML = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
        lastFocusedElement = null;
    }

    if (modalClose) modalClose.addEventListener('click', closeProjectSafe);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeProjectSafe(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectSafe(); });

    // Wire cards and play buttons
    projectCards.forEach(card => {
        const name = card.getAttribute('data-project');
        const play = card.querySelector('.btn-play');
        if (play) {
            play.setAttribute('aria-label', `Open ${name}`);
            play.addEventListener('click', (e) => { e.stopPropagation(); openProjectSafe(name, play); });
        }
        card.addEventListener('click', () => openProjectSafe(name, card));
    });

    // Back to top
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Intersection animations
    if (!prefersReducedMotion()) {
        try {
            const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.style.animation = 'fadeInUp 0.6s ease'; }); }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
            projectCards.forEach(c => observer.observe(c));
        } catch (e) { /* ignore */ }
    }
});

// Accessibility helper referenced by modal code
function setMainInert(isInert) {
    const main = document.getElementById('main-content');
    if (!main) return;
    if (isInert) main.setAttribute('inert', ''); else main.removeAttribute('inert');
}

let lastFocusedElement = null;

// End of file (single coherent main.js implementation above)
