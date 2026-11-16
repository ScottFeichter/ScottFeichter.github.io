document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');

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
                form.style.transition = 'opacity 0.6s ease';
                form.style.opacity = '0';
                setTimeout(() => {
                    form.style.display = 'none';
                    success.style.display = 'block';
                    success.style.opacity = '0';
                    success.style.transition = 'opacity 0.6s ease';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            success.style.opacity = '1';
                        });
                    });
                }, 600);
            }
        } catch (err) {
            // fail silently — Formspree will handle errors
        }
    });
});
