"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopTone = exports.playTone = void 0;
let audioContext = null;
function playTone(frequency, duration, volume = 0.5) {
    if (!audioContext)
        audioContext = new AudioContext(); // Create once
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
exports.playTone = playTone;
function stopTone() {
    if (audioContext) {
        audioContext.close().then(() => (audioContext = null)); // Reset context
    }
}
exports.stopTone = stopTone;
