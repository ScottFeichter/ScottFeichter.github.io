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

document.getElementById('button_splash_agree').addEventListener('click', () => {
    modalTrue.classList.add('visible');
    // Fade text out first
    setTimeout(() => {
        modalTrue.querySelector('p').style.transition = 'opacity 2s ease';
        modalTrue.querySelector('p').style.opacity = '0';
    }, 5000);
    // Then fade window — overlaps with end of text fade
    setTimeout(() => {
        modalTrue.style.transition = 'opacity 2s ease, visibility 2s ease';
        modalTrue.classList.remove('visible');
    }, 6000);
    setTimeout(() => {
        modalTrue.style.transition = '';
        modalTrue.querySelector('p').style.transition = '';
        modalTrue.querySelector('p').style.opacity = '';
    }, 8000);
});

const warPeaceCard = document.getElementById('war-peace-card');

document.getElementById('button_splash_disagree').addEventListener('click', () => {
    warPeaceCard.classList.toggle('open');
});
