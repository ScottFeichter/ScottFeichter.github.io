const video = document.getElementById('videoBackground');
const activeLink = document.querySelector('nav a.active');

// Initial delay before first play
setTimeout(() => {
    video.play();
}, 3500);

// When video starts playing, transition active text to white (1.5s)
video.addEventListener('play', () => {
    setTimeout(() => {
        activeLink.style.transition = 'color 1.5s ease';
        activeLink.classList.add('video-playing');
    }, 1000);
});

// Fade text back to royalblue 1 second before video ends (2s duration)
video.addEventListener('timeupdate', () => {
    if (video.duration - video.currentTime <= 1) {
        activeLink.style.transition = 'color 2s ease';
        activeLink.classList.remove('video-playing');
    }
});

// When video ends, wait 10 seconds then replay
video.addEventListener('ended', () => {
    setTimeout(() => {
        video.play();
    }, 10000);
});

// ============================================================
// BREVITY MODALS
// ============================================================

const modalTrue  = document.getElementById('modal-true');
const modalFalse = document.getElementById('modal-false');

document.getElementById('button_splash_agree').addEventListener('click', () => {
    modalTrue.classList.add('visible');
    setTimeout(() => {
        modalTrue.style.transition = 'opacity 1.5s ease, visibility 1.5s ease';
        modalTrue.classList.remove('visible');
    }, 1000);
    setTimeout(() => {
        modalTrue.style.transition = '';
    }, 2500);
});

document.getElementById('button_splash_disagree').addEventListener('click', () => {
    modalFalse.classList.add('visible');
});

document.getElementById('modal-false-close').addEventListener('click', () => {
    modalFalse.classList.remove('visible');
});
