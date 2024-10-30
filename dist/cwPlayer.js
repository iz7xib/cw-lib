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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CwPlayer = void 0;
const react_1 = __importStar(require("react"));
const morseMap_1 = __importDefault(require("./morseMap"));
const CwPlayer = ({ text, frequency = 600, dotDuration = 120 }) => {
    const audioContextRef = (0, react_1.useRef)(null);
    const audioElementRef = (0, react_1.useRef)(document.createElement("audio"));
    (0, react_1.useEffect)(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const generateMorseAudio = () => __awaiter(void 0, void 0, void 0, function* () {
            const audioBuffer = yield createMorseAudioBuffer(text, frequency, dotDuration);
            const audioBlob = yield audioBufferToBlob(audioBuffer);
            audioElementRef.current.src = URL.createObjectURL(audioBlob);
        });
        generateMorseAudio();
        return () => {
            var _a;
            // Cleanup dell'AudioContext alla disattivazione del componente
            (_a = audioContextRef.current) === null || _a === void 0 ? void 0 : _a.close();
        };
    }, [text, frequency, dotDuration]);
    const createMorseAudioBuffer = (text, frequency, dotDuration) => __awaiter(void 0, void 0, void 0, function* () {
        const context = audioContextRef.current;
        const dotTime = dotDuration / 1000;
        const sampleRate = context.sampleRate;
        const buffer = context.createBuffer(1, sampleRate * text.length * dotTime, sampleRate);
        const data = buffer.getChannelData(0);
        let offset = 0;
        for (const char of text.toUpperCase()) {
            const morseCode = morseMap_1.default.get(char);
            if (morseCode) {
                for (const symbol of morseCode) {
                    const duration = symbol === "." ? dotTime : dotTime * 3;
                    for (let i = 0; i < duration * sampleRate; i++) {
                        data[offset + i] = Math.sin(2 * Math.PI * frequency * (i / sampleRate));
                    }
                    offset += duration * sampleRate;
                    offset += dotTime * sampleRate; // gap tra simboli
                }
                offset += dotTime * 3 * sampleRate; // gap tra lettere
            }
        }
        return buffer;
    });
    const audioBufferToBlob = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        const audioData = buffer.getChannelData(0);
        const wave = new Float32Array(audioData.length);
        for (let i = 0; i < audioData.length; i++)
            wave[i] = audioData[i];
        return new Blob([wave.buffer], { type: "audio/wav" });
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h3", null, "CW Player"),
        react_1.default.createElement("audio", { ref: audioElementRef, controls: true })));
};
exports.CwPlayer = CwPlayer;
