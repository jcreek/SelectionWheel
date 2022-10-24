export default {
  pauseAudio(audio: HTMLAudioElement) {
    audio.pause();
  },
  playAudio(audio: HTMLAudioElement) {
    audio.play();
  },
  stopAudio(audio: HTMLAudioElement) {
    audio.pause();
    // eslint-disable-next-line no-param-reassign
    audio.currentTime = 0;
  },
  toggleMute(audio: HTMLAudioElement) {
    // eslint-disable-next-line no-param-reassign
    audio.muted = !audio.muted;
  },
};
