document.addEventListener('DOMContentLoaded', () => {

    const activeLink = document.querySelector('#site-nav a.active');
    const isHome = !!document.getElementById('videoBackground');
    const navigatedTo = sessionStorage.getItem('navigatedTo');

    // On page load — if we just navigated here via a click, animate active button from click state to active
    if (navigatedTo === window.location.pathname || navigatedTo === window.location.href) {
        sessionStorage.removeItem('navigatedTo');
        if (activeLink && !isHome) {
            activeLink.style.transition = 'none';
            activeLink.style.backgroundColor = 'white';
            activeLink.style.color = 'black';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    activeLink.style.transition = 'background-color 0.8s ease, color 0.8s ease';
                    activeLink.style.backgroundColor = 'transparent';
                    activeLink.style.color = 'royalblue';
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

            // Store destination so new page knows it was navigated to
            sessionStorage.setItem('navigatedTo', href);

            // Transition previously active button back to normal
            if (activeLink) {
                activeLink.style.transition = 'background-color 0.7s ease, color 0.7s ease';
                activeLink.style.backgroundColor = 'royalblue';
                activeLink.style.color = 'white';
            }

            // Fade page content
            const content = document.getElementById('page-content');
            if (content) {
                content.style.transition = 'opacity 0.3s ease';
                content.style.opacity = '0';
            }

            setTimeout(() => { window.location.href = href; }, 300);
        });
    });

});
