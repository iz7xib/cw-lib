"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CwPlayer = void 0;
const react_1 = __importStar(require("react"));
const morseMap_1 = __importDefault(require("./morseMap"));
const audio_1 = require("./audio");
const CwPlayer = ({ text, frequency = 600, wpm = 20 }) => {
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const totalDuration = (0, react_1.useRef)(0);
    const playTimeouts = (0, react_1.useRef)([]);
    const dotDuration = (1.2 / wpm) * 1000;
    const dashDuration = dotDuration * 3;
    const interElementGap = dotDuration;
    const letterGap = dotDuration * 3;
    const wordGap = dotDuration * 7;
    const playMorseCode = () => {
        if (isPlaying)
            return;
        setIsPlaying(true);
        let delay = 2000;
        for (const char of text.toUpperCase()) {
            const morseCode = morseMap_1.default.get(char) || '';
            if (morseCode === " ") {
                delay += wordGap;
            }
            else {
                for (const symbol of morseCode) {
                    const duration = symbol === "." ? dotDuration : dashDuration;
                    playTimeouts.current.push(window.setTimeout(() => (0, audio_1.playTone)(frequency, duration), delay));
                    delay += duration + interElementGap;
                }
                delay += letterGap;
            }
        }
        totalDuration.current = delay;
        playTimeouts.current.push(window.setTimeout(() => {
            setIsPlaying(false);
            setProgress(100);
        }, delay));
    };
    const stopPlayback = () => {
        playTimeouts.current.forEach(clearTimeout);
        playTimeouts.current = [];
        (0, audio_1.stopTone)();
        setIsPlaying(false);
        setProgress(0);
    };
    const pausePlayback = () => {
        setIsPlaying(false);
        (0, audio_1.stopTone)();
    };
    (0, react_1.useEffect)(() => {
        // Replace NodeJS.Timeout with this type
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => Math.min(prev + (100 / totalDuration.current) * dotDuration, 100));
            }, dotDuration);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);
    (0, react_1.useEffect)(() => {
        return () => stopPlayback(); // Cleanup on unmount
    }, []);
    return (react_1.default.createElement("div", { style: { width: "300px", margin: "20px" } },
        react_1.default.createElement("h3", null, "CW Player"),
        react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
            react_1.default.createElement("button", { onClick: isPlaying ? pausePlayback : playMorseCode }, isPlaying ? "Pause" : "Play"),
            react_1.default.createElement("button", { onClick: stopPlayback, disabled: !isPlaying }, "Stop")),
        react_1.default.createElement("progress", { value: progress, max: "100", style: { width: "100%", marginTop: "10px" } })));
};
exports.CwPlayer = CwPlayer;
