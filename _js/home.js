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
const brevityIframe = document.getElementById('brevity-video-iframe');

let trueModalTimers = [];

function clearTrueModalTimers() {
    trueModalTimers.forEach(t => clearTimeout(t));
    trueModalTimers = [];
}

function fadeOutTrueModal() {
    clearTrueModalTimers();
    modalTrue.style.transition = 'opacity 1s ease, visibility 1s ease';
    modalTrue.classList.remove('visible');
    brevityIframe.src = '';
    setTimeout(() => { modalTrue.style.transition = ''; }, 1000);
}

function closeVideoModal(callback) {
    fadeOutTrueModal();
    setTimeout(() => { if (callback) callback(); }, 1000);
}

window.onYouTubeIframeAPIReady = function() {
    new YT.Player('brevity-video-iframe', {
        events: {
            onStateChange: (e) => {
                if (e.data === 0) fadeOutTrueModal();
            }
        }
    });
};

const ytScript = document.createElement('script');
ytScript.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(ytScript);

document.getElementById('button_splash_agree').addEventListener('click', () => {
    modalTrue.classList.add('visible');
    brevityIframe.src = brevityIframe.dataset.src;
});

modalTrue.addEventListener('click', (e) => {
    if (e.target === modalTrue) fadeOutTrueModal();
});

document.getElementById('brevity-video-close').addEventListener('click', () => closeVideoModal());
document.getElementById('brevity-video-next').addEventListener('click', () => closeVideoModal(() => {
    const aboutLink = document.querySelector('#site-nav a[href="/about"]');
    if (aboutLink) aboutLink.click();
}));

const warPeaceCard = document.getElementById('war-peace-card');
const falseAudio = new Audio('/mp3/greeting3.mp3');

document.getElementById('button_splash_disagree').addEventListener('click', () => {
    warPeaceCard.classList.toggle('open');
    falseAudio.currentTime = 0;
    falseAudio.play();
});
