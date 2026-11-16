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
