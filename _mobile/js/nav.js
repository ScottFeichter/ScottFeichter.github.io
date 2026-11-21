function initNav() {

    // Hamburger toggle
    const hamburger = document.getElementById('hamburger');
    const navUl = document.querySelector('#site-nav ul');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('open');
        });
    }

    const activeLink = document.querySelector('#site-nav a.currentPage');
    const navigatedTo = sessionStorage.getItem('navigatedTo');

    // On page load — animate active button from click state to active
    if (navigatedTo === window.location.pathname || navigatedTo === window.location.href) {
        sessionStorage.removeItem('navigatedTo');
        if (activeLink) {
            activeLink.style.transition = 'none';
            activeLink.style.backgroundColor = 'white';
            activeLink.style.color = 'black';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    activeLink.style.transition = 'background-color 0.8s ease, color 0.8s ease';
                    activeLink.style.backgroundColor = 'black';
                    activeLink.style.color = 'white';
                });
            });
        }
    }

    // On nav click
    document.querySelectorAll('#site-nav a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;
            e.preventDefault();

            sessionStorage.setItem('navigatedTo', href);

            if (activeLink) {
                activeLink.style.transition = 'background-color 0.7s ease, color 0.7s ease';
                activeLink.style.backgroundColor = 'rgba(255, 255, 255, 0.82)';
                activeLink.style.color = 'royalblue';
            }

            const content = document.getElementById('page-content');
            if (content) {
                content.style.transition = 'opacity 0.3s ease';
                content.style.opacity = '0';
            }

            setTimeout(() => { window.location.href = href; }, 300);
        });
    });

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
} else {
    initNav();
}
