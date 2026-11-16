document.addEventListener('DOMContentLoaded', () => {

    // Animate active button settling in on page load
    // Skip on home page - home.js handles the active button color via video logic
    const activeLink = document.querySelector('#site-nav a.active');
    if (activeLink && !document.getElementById('videoBackground')) {
        activeLink.style.transition = 'none';
        activeLink.style.backgroundColor = 'royalblue';
        activeLink.style.color = 'white';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                activeLink.style.transition = 'background-color 0.8s ease, color 0.8s ease';
                activeLink.style.backgroundColor = 'transparent';
                activeLink.style.color = 'royalblue';
            });
        });
    }

    // Fade page-content on nav click
    document.querySelectorAll('#site-nav a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;
            e.preventDefault();
            const content = document.getElementById('page-content');
            if (content) {
                content.style.transition = 'opacity 0.3s ease';
                content.style.opacity = '0';
            }
            setTimeout(() => { window.location.href = href; }, 300);
        });
    });

});
