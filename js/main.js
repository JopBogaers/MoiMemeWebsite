const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.panel');

const mediaCredits = document.querySelectorAll('.media-credit');
const supportsTapToExpand = window.matchMedia('(hover: none) and (pointer: coarse)');

mediaCredits.forEach((credit) => {
    credit.setAttribute('aria-expanded', 'false');

    credit.addEventListener('click', (event) => {
        if (!supportsTapToExpand.matches) return;

        if (!credit.classList.contains('is-expanded')) {
            event.preventDefault();
            mediaCredits.forEach((item) => {
                item.classList.remove('is-expanded');
                item.setAttribute('aria-expanded', 'false');
            });
            credit.classList.add('is-expanded');
            credit.setAttribute('aria-expanded', 'true');
        }
    });
});

document.addEventListener('click', (event) => {
    if (!supportsTapToExpand.matches || event.target.closest('.media-credit')) return;

    mediaCredits.forEach((credit) => {
        credit.classList.remove('is-expanded');
        credit.setAttribute('aria-expanded', 'false');
    });
});

document.querySelectorAll('.video-audio-toggle').forEach((button) => {
    const video = button.parentElement.querySelector('video');
    if (!video) return;

    button.addEventListener('click', () => {
        video.muted = !video.muted;
        button.textContent = video.muted ? 'Unmute' : 'Mute';
        button.setAttribute('aria-label', `${video.muted ? 'Unmute' : 'Mute'} video`);
        button.setAttribute('aria-pressed', String(!video.muted));
    });
});

function getHomeThemeThreshold() {
    const heroImage = document.querySelector('.hero-image');

    if (!heroImage) return 0;

    return Math.max(0, window.scrollY + heroImage.getBoundingClientRect().bottom);
}

function updateHomeTheme() {
    const nextSection = document.getElementById('section-2');
    const nextSectionTop = nextSection
        ? window.scrollY + nextSection.getBoundingClientRect().top
            - Number.parseFloat(getComputedStyle(nextSection).scrollMarginTop || '0')
        : Infinity;
    const isInHomeTheme = window.scrollY >= getHomeThemeThreshold() - 1;
        //&& window.scrollY < nextSectionTop - 1;
    document.body.classList.toggle('home-theme', isInHomeTheme);
}

navButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const targetSection = document.getElementById(targetId);

        if (targetId === 'section-1') {
            window.scrollTo({
                top: getHomeThemeThreshold(),
                behavior: 'smooth'
            });
        } else if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        navButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id = entry.target.id;
            navButtons.forEach((button) => {
                const isActive = button.dataset.target === id;
                button.classList.toggle('active', isActive);
            });
        });
        updateHomeTheme();
    },
    {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.2
    }
);

sections.forEach((section) => observer.observe(section));

window.addEventListener('scroll', updateHomeTheme, { passive: true });
window.addEventListener('resize', updateHomeTheme);

const heroImage = document.querySelector('.hero-image');
heroImage?.addEventListener('load', updateHomeTheme);
updateHomeTheme();
