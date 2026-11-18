const video = document.getElementById('videoBackground');
const activeLink = document.querySelector('nav a.active');

if (video) {
    // Initial delay before first play
    setTimeout(() => { video.play(); }, 3500);

    video.addEventListener('play', () => {
        setTimeout(() => {
            activeLink.style.transition = 'color 1.5s ease';
            activeLink.classList.add('video-playing');
        }, 1000);
    });

    video.addEventListener('timeupdate', () => {
        if (video.duration - video.currentTime <= 1) {
            activeLink.style.transition = 'color 2s ease';
            activeLink.classList.remove('video-playing');
        }
    });

    video.addEventListener('ended', () => {
        setTimeout(() => { video.play(); }, 10000);
    });
}

// Mobile audio play/pause toggle
const audioPlayBtn = document.getElementById('audio-play-btn');
const audioPlayer = document.getElementById('audio');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');

function setAudioPlaying(playing) {
    if (playing) {
        audioPlayer.play();
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
    } else {
        audioPlayer.pause();
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
    }
}

if (audioPlayBtn) {
    audioPlayBtn.addEventListener('click', () => {
        setAudioPlaying(audioPlayer.paused);
    });
    audioPlayer.addEventListener('ended', () => {
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
    });
}



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
    if (!audioPlayer.paused) setAudioPlaying(false);
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

// Set PDF zoom for mobile
const warPeaceIframe = document.querySelector('#war-peace-card iframe');
if (warPeaceIframe && window.innerWidth <= 768) {
    warPeaceIframe.src = warPeaceIframe.src.replace('zoom=100', 'zoom=50');
}

const warPeaceCard = document.getElementById('war-peace-card');

const falseBtn = document.getElementById('button_splash_disagree');
falseBtn.addEventListener('click', () => {
    const isOpen = warPeaceCard.classList.toggle('open');
    if (isOpen) {
        audioPlayer.currentTime = 0;
        setAudioPlaying(true);
        falseBtn.classList.add('active-state');
    } else {
        setAudioPlaying(false);
        falseBtn.classList.remove('active-state');
    }
});
