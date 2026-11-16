document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;
            e.preventDefault();
            const nav = document.querySelector('header');
            const rect = nav.getBoundingClientRect();
            nav.style.position = 'fixed';
            nav.style.top = rect.top + 'px';
            nav.style.left = rect.left + 'px';
            nav.style.width = rect.width + 'px';
            nav.style.zIndex = '9999';
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '0';
            nav.style.opacity = '1';
            setTimeout(() => { window.location.href = href; }, 300);
        });
    });
});
