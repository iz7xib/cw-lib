let audioContext: AudioContext | null = null;

export function playTone(frequency: number, duration: number, volume = 0.5) {
  if (!audioContext) audioContext = new AudioContext(); // Create once
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  setTimeout(() => oscillator.stop(), duration);
}

export function stopTone() {
  if (audioContext) {
    audioContext.close().then(() => (audioContext = null)); // Reset context
  }
}
