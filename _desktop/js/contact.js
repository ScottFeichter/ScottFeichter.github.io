document.addEventListener('DOMContentLoaded', () => {
    const form    = document.getElementById('contact-form');
    const heading = document.getElementById('form-heading');
    const success = document.getElementById('form-success');
    const card    = document.getElementById('contact-form-card');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                // Lock card height before fading so it doesn't snap
                card.style.minHeight = card.offsetHeight + 'px';

                // Fade out form and heading
                form.style.transition = 'opacity 0.8s ease';
                heading.style.transition = 'opacity 0.8s ease';
                form.style.opacity = '0';
                heading.style.opacity = '0';

                // Swap content and transition card size immediately after fade
                setTimeout(() => {
                    form.style.display = 'none';
                    heading.style.display = 'none';
                    card.style.transition = 'min-height 0.5s ease';
                    card.style.minHeight = '6rem';

                    // Fade in success message
                    success.style.opacity = '0';
                    success.style.display = 'block';
                    success.style.transition = 'opacity 0.8s ease';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            success.style.opacity = '1';
                        });
                    });

                    // Fade out success after 3s, then fade card
                    setTimeout(() => {
                        success.style.transition = 'opacity 3s ease';
                        success.style.opacity = '0';
                        setTimeout(() => {
                            card.style.transition = 'opacity 2s ease';
                            card.style.opacity = '0';
                        }, 3000);
                    }, 3000);

                }, 800);
            }
        } catch (err) {}
    });
});
