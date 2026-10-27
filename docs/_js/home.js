const video = document.getElementById('videoBackground');
const activeLink = document.querySelector('nav a.active');

// Initial 5 second delay before first play
setTimeout(() => {
    video.play();
}, 5000);

// When video starts playing, fade active text to white
video.addEventListener('play', () => {
    activeLink.classList.add('video-playing');
});

// Fade text back to royalblue 2 seconds before video ends
video.addEventListener('timeupdate', () => {
    if (video.duration - video.currentTime <= 2) {
        activeLink.classList.remove('video-playing');
    }
});

// When video ends, wait 10 seconds then replay
video.addEventListener('ended', () => {
    setTimeout(() => {
        video.play();
    }, 10000);
});
