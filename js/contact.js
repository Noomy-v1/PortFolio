const emailButton = document.querySelector('.email-copy');

emailButton.addEventListener('click', async () => {
    const email = emailButton.dataset.email;

    try {
        await navigator.clipboard.writeText(email);
        const originalText = emailButton.textContent;
        emailButton.textContent = 'Copié ✓';

        setTimeout(() => {
            emailButton.textContent = originalText;
        }, 2000);
    } catch (err) {
        console.error('Impossible de copier :', err);
    }
});

export { };