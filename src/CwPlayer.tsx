import React, { useState, useEffect, useRef } from 'react';
import morseMap from "./morseMap";
import { playTone, stopTone } from "./audio";

interface CwPlayerProps {
  text: string;
  frequency?: number;
  wpm?: number;
}

export const CwPlayer: React.FC<CwPlayerProps> = ({ text, frequency = 600, wpm = 20 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalDuration = useRef(0);
  const playTimeouts = useRef<number[]>([]);

  const dotDuration = (1.2 / wpm) * 1000;
  const dashDuration = dotDuration * 3;
  const interElementGap = dotDuration;
  const letterGap = dotDuration * 3;
  const wordGap = dotDuration * 7;

  const playMorseCode = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    let delay = 1000;
    for (const char of text.toUpperCase()) {
      const morseCode = morseMap.get(char) || '';
      if (morseCode === " ") {
        delay += wordGap;
      } else {
        for (const symbol of morseCode) {
          const duration = symbol === "." ? dotDuration : dashDuration;
          playTimeouts.current.push(
            window.setTimeout(() => playTone(frequency, duration), delay)
          );
          delay += duration + interElementGap;
        }
        delay += letterGap;
      }
    }

    totalDuration.current = delay;
    playTimeouts.current.push(
      window.setTimeout(() => {
        setIsPlaying(false);
        setProgress(100);
      }, delay)
    );
  };

  const stopPlayback = () => {
    playTimeouts.current.forEach(clearTimeout);
    playTimeouts.current = [];
    stopTone();
    setIsPlaying(false);
    setProgress(0);
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    stopTone();
  };

  useEffect(() => {
    // Replace NodeJS.Timeout with this type
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + (100 / totalDuration.current) * dotDuration, 100));
      }, dotDuration);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    return () => stopPlayback(); // Cleanup on unmount
  }, []);

  return (
    <div style={{ width: "300px", margin: "20px" }}>
      <h3>CW Player</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={isPlaying ? pausePlayback : playMorseCode}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={stopPlayback} disabled={!isPlaying}>
          Stop
        </button>
      </div>
      <progress value={progress} max="100" style={{ width: "100%", marginTop: "10px" }} />
    </div>
  );
};
