// ==================================================
// FONTAINE SYMPHONIC MUSIC BOX & JP VOICE ENGINE
// - Default Auto-Play BGM (3 Fontaine Tracks + Reverb)
// - Auto-Pause BGM when Navia JP Voice (Toyosaki Aki)
//   plays on Card / Salute click, then Auto-Resume BGM!
// ==================================================
import { JP_VOICE_LINES } from "./catalog.js?v=3";

class NaviaAudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.delayNode = null;

    this.isPlayingBgm = true; // ON BY DEFAULT
    this.isVoiceSpeaking = false;
    this.bgmLoopRunning = false;
    this.bgmTimer = null;
    this.stepIndex = 0;
    this.trackIndex = 0;
    this.freqData = new Uint8Array(16);
    this.unlockBound = false;

    // Instant in-memory HTML5 Audio Player for Pre-Extracted JP Voice Clips
    this.voiceAudio = new Audio();
    this.voiceAudio.preload = "auto";
    this.voiceStopTimer = null;
    this.skillClipCursor = 0;
    this.burstClipCursor = 0;
    this.onStateChangeCallback = null;
    this.onVoiceSubCallback = null;

    this.tracks = [
      {
        title: "La Rose Radieuse",
        notes: [
          { note: 587.33, counter: 880.00, bass: 146.83, pad: 293.66, dur: 0.40 },
          { note: 659.25, counter: null,   bass: 220.00, pad: null,   dur: 0.40 },
          { note: 739.99, counter: 1108.7, bass: 293.66, pad: null,   dur: 0.40 },
          { note: 880.00, counter: 1318.5, bass: 196.00, pad: 392.00, dur: 0.60 },
          { note: 739.99, counter: null,   bass: 293.66, pad: null,   dur: 0.30 },
          { note: 659.25, counter: 987.77, bass: 246.94, pad: null,   dur: 0.38 },
          { note: 587.33, counter: 880.00, bass: 185.00, pad: 369.99, dur: 0.40 },
          { note: 493.88, counter: null,   bass: 246.94, pad: null,   dur: 0.40 },
          { note: 587.33, counter: 739.99, bass: 220.00, pad: null,   dur: 0.40 },
          { note: 659.25, counter: 987.77, bass: 164.81, pad: 329.63, dur: 0.78 },
          { note: 739.99, counter: 1108.7, bass: 220.00, pad: null,   dur: 0.40 },
          { note: 987.77, counter: 1479.9, bass: 246.94, pad: 493.88, dur: 0.52 },
          { note: 880.00, counter: null,   bass: 220.00, pad: null,   dur: 0.34 },
          { note: 739.99, counter: 1108.7, bass: 185.00, pad: null,   dur: 0.40 },
          { note: 659.25, counter: 987.77, bass: 196.00, pad: 392.00, dur: 0.40 },
          { note: 587.33, counter: null,   bass: 220.00, pad: null,   dur: 0.40 },
          { note: 659.25, counter: 880.00, bass: 164.81, pad: null,   dur: 0.40 },
          { note: 587.33, counter: 1174.6, bass: 146.83, pad: 293.66, dur: 0.85 }
        ]
      },
      {
        title: "Poisson Macaron Salon",
        notes: [
          { note: 783.99, counter: 1174.6, bass: 196.00, pad: 392.00, dur: 0.36 },
          { note: 880.00, counter: null,   bass: 293.66, pad: null,   dur: 0.36 },
          { note: 987.77, counter: 1479.9, bass: 246.94, pad: 493.88, dur: 0.54 },
          { note: 1174.6, counter: null,   bass: 164.81, pad: null,   dur: 0.36 },
          { note: 987.77, counter: 1318.5, bass: 246.94, pad: null,   dur: 0.36 },
          { note: 880.00, counter: null,   bass: 220.00, pad: 440.00, dur: 0.36 },
          { note: 783.99, counter: 1174.6, bass: 196.00, pad: null,   dur: 0.54 },
          { note: 659.25, counter: 987.77, bass: 164.81, pad: 329.63, dur: 0.36 },
          { note: 739.99, counter: null,   bass: 185.00, pad: null,   dur: 0.36 },
          { note: 783.99, counter: 1567.9, bass: 196.00, pad: 392.00, dur: 0.72 }
        ]
      },
      {
        title: "Verdict of the Spina",
        notes: [
          { note: 493.88, counter: 987.77, bass: 123.47, pad: 246.94, dur: 0.30 },
          { note: 587.33, counter: null,   bass: 185.00, pad: null,   dur: 0.30 },
          { note: 739.99, counter: 1108.7, bass: 246.94, pad: null,   dur: 0.30 },
          { note: 987.77, counter: 1479.9, bass: 123.47, pad: 369.99, dur: 0.45 },
          { note: 880.00, counter: null,   bass: 164.81, pad: null,   dur: 0.30 },
          { note: 739.99, counter: 1108.7, bass: 185.00, pad: 329.63, dur: 0.30 },
          { note: 659.25, counter: null,   bass: 196.00, pad: null,   dur: 0.30 },
          { note: 739.99, counter: 1479.9, bass: 185.00, pad: 369.99, dur: 0.45 },
          { note: 587.33, counter: 880.00, bass: 146.83, pad: null,   dur: 0.30 },
          { note: 493.88, counter: 987.77, bass: 123.47, pad: 246.94, dur: 0.60 }
        ]
      }
    ];
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.72;
    this.bgmGain.connect(this.masterGain);

    // Stereo Cathedral Delay / Reverb network
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.value = 0.28;
    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.value = 0.34;
    const delayFilter = this.ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 2400;

    this.delayNode.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.bgmGain);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 32;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  startDefaultBgm(onStateChange, onVoiceSubtitle) {
    this.isPlayingBgm = true;
    this.onStateChangeCallback = onStateChange;
    this.onVoiceSubCallback = onVoiceSubtitle;
    this.init();

    const ensureLoop = () => {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().then(() => {
          if (this.isPlayingBgm && !this.isVoiceSpeaking && !this.bgmLoopRunning) {
            this.bgmLoopRunning = true;
            this.scheduleNextMusicBoxNote();
          }
          if (this.onStateChangeCallback) {
            this.onStateChangeCallback(this.isPlayingBgm, this.getCurrentTrackTitle(), this.isVoiceSpeaking);
          }
        }).catch(() => {});
      } else if (this.isPlayingBgm && !this.isVoiceSpeaking && !this.bgmLoopRunning) {
        this.bgmLoopRunning = true;
        this.scheduleNextMusicBoxNote();
        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(this.isPlayingBgm, this.getCurrentTrackTitle(), this.isVoiceSpeaking);
        }
      }
    };

    ensureLoop();

    if (!this.unlockBound) {
      this.unlockBound = true;
      const unlockEvents = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel", "click"];
      const handler = () => {
        ensureLoop();
        if (this.ctx && this.ctx.state === "running") {
          unlockEvents.forEach((ev) => window.removeEventListener(ev, handler));
        }
      };
      unlockEvents.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
    }
  }

  // ==================================================
  // PLAY NAVIA JAPANESE VOICE LINE (Mutes BGM -> Plays JP Voice -> Resumes BGM)
  // ==================================================
  playJpVoice(categoryOrId = "skill") {
    this.init();

    let clip = null;
    if (typeof categoryOrId === "number") {
      clip = JP_VOICE_LINES[categoryOrId % JP_VOICE_LINES.length];
    } else if (categoryOrId === "burst") {
      const burstClips = JP_VOICE_LINES.filter((v) => v.type === "burst");
      clip = burstClips[this.burstClipCursor % burstClips.length];
      this.burstClipCursor++;
    } else {
      const skillClips = JP_VOICE_LINES.filter((v) => v.type === "skill");
      clip = skillClips[this.skillClipCursor % skillClips.length];
      this.skillClipCursor++;
    }

    // 1. Immediately mute / pause BGM loop while Navia speaks
    this.isVoiceSpeaking = true;
    clearTimeout(this.bgmTimer);
    this.bgmLoopRunning = false;

    if (this.ctx && this.bgmGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
      this.bgmGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
    }

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.isPlayingBgm, "🎙️ JP: " + clip.romaji.split(" ")[0], true);
    }
    if (this.onVoiceSubCallback) {
      this.onVoiceSubCallback(clip, true);
    }

    // 2. Play pre-extracted Japanese voice clip from in-memory cache (0ms latency, 0 network aborts)
    clearTimeout(this.voiceStopTimer);
    try {
      this.voiceAudio.pause();
      const cacheMap = window.NAVIA_JP_VOICES || {};
      this.voiceAudio.src = cacheMap[String(clip.id)] || clip.audioFile;
      this.voiceAudio.currentTime = 0;
      this.voiceAudio.volume = 1.0;
      const playPromise = this.voiceAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {}

    const durationMs = Math.round((clip.durSec || 5.7) * 1000);

    // 3. When JP Voice clip finishes, automatically resume BGM!
    this.voiceStopTimer = setTimeout(() => {
      try {
        this.voiceAudio.pause();
      } catch (e) {}

      this.isVoiceSpeaking = false;
      if (this.onVoiceSubCallback) {
        this.onVoiceSubCallback(clip, false);
      }

      if (this.isPlayingBgm) {
        if (this.ctx && this.bgmGain) {
          const now = this.ctx.currentTime;
          this.bgmGain.gain.cancelScheduledValues(now);
          this.bgmGain.gain.setValueAtTime(0.001, now);
          this.bgmGain.gain.linearRampToValueAtTime(0.72, now + 0.35);
        }
        this.bgmLoopRunning = true;
        this.scheduleNextMusicBoxNote();
      }

      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(this.isPlayingBgm, this.getCurrentTrackTitle(), false);
      }
    }, durationMs);

    return clip;
  }

  getCurrentTrackTitle() {
    return this.tracks[this.trackIndex].title;
  }

  nextTrack() {
    this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
    this.stepIndex = 0;
    if (!this.isPlayingBgm) {
      this.isPlayingBgm = true;
    }
    if (!this.isVoiceSpeaking) {
      this.bgmLoopRunning = true;
      clearTimeout(this.bgmTimer);
      this.scheduleNextMusicBoxNote();
    }
    return this.getCurrentTrackTitle();
  }

  playChime(freqBase = 587.33) {
    if (this.isVoiceSpeaking) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [freqBase, freqBase * 1.25, freqBase * 1.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.07, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.55);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.6);
      });
    } catch (e) {}
  }

  playSaluteCannon() {
    this.playJpVoice("burst");
  }

  playWishFanfare() {
    this.playJpVoice("burst");
  }

  scheduleNextMusicBoxNote() {
    if (!this.isPlayingBgm || this.isVoiceSpeaking || !this.ctx) {
      this.bgmLoopRunning = false;
      return;
    }
    const track = this.tracks[this.trackIndex];
    const item = track.notes[this.stepIndex % track.notes.length];
    this.stepIndex++;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(item.note, now);
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(item.note * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    const harmGain = this.ctx.createGain();
    harmGain.gain.value = 0.24;

    osc1.connect(gain);
    osc2.connect(harmGain);
    harmGain.connect(gain);
    gain.connect(this.bgmGain);
    if (this.delayNode) gain.connect(this.delayNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);

    if (item.counter) {
      const cOsc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      cOsc.type = "sine";
      cOsc.frequency.setValueAtTime(item.counter, now + 0.03);
      cGain.gain.setValueAtTime(0.0001, now + 0.03);
      cGain.gain.exponentialRampToValueAtTime(0.038, now + 0.05);
      cGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      cOsc.connect(cGain);
      cGain.connect(this.bgmGain);
      if (this.delayNode) cGain.connect(this.delayNode);
      cOsc.start(now + 0.03);
      cOsc.stop(now + 1.15);
    }

    if (item.bass) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = "triangle";
      bOsc.frequency.setValueAtTime(item.bass, now);
      bGain.gain.setValueAtTime(0.0001, now);
      bGain.gain.exponentialRampToValueAtTime(0.065, now + 0.025);
      bGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);
      bOsc.connect(bGain);
      bGain.connect(this.bgmGain);
      bOsc.start(now);
      bOsc.stop(now + 1.5);
    }

    if (item.pad) {
      const pOsc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      pOsc.type = "sine";
      pOsc.frequency.setValueAtTime(item.pad, now);
      pGain.gain.setValueAtTime(0.0001, now);
      pGain.gain.linearRampToValueAtTime(0.032, now + 0.35);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
      pOsc.connect(pGain);
      pGain.connect(this.bgmGain);
      if (this.delayNode) pGain.connect(this.delayNode);
      pOsc.start(now);
      pOsc.stop(now + 2.0);
    }

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextMusicBoxNote();
    }, item.dur * 1000);
  }

  toggleMusicBox() {
    this.init();
    this.isPlayingBgm = !this.isPlayingBgm;
    if (this.isPlayingBgm && !this.isVoiceSpeaking) {
      if (this.ctx && this.bgmGain) {
        this.bgmGain.gain.setValueAtTime(0.72, this.ctx.currentTime);
      }
      this.bgmLoopRunning = true;
      clearTimeout(this.bgmTimer);
      this.scheduleNextMusicBoxNote();
    } else {
      this.bgmLoopRunning = false;
      clearTimeout(this.bgmTimer);
    }
    return this.isPlayingBgm;
  }

  drawVisualizer(canvasEl) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    const w = canvasEl.width;
    const h = canvasEl.height;
    ctx.clearRect(0, 0, w, h);

    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.freqData);
    }

    const bars = 6;
    const barW = 3.5;
    const gap = 2.5;
    const t = performance.now() * 0.012;
    for (let i = 0; i < bars; i++) {
      let val = this.analyser ? this.freqData[i + 1] / 255 : 0;
      if (this.isVoiceSpeaking) {
        val = 0.38 + 0.58 * Math.abs(Math.sin(t * 1.6 + i * 1.1));
      } else if (this.isPlayingBgm && val < 0.22) {
        val = 0.25 + 0.45 * Math.abs(Math.sin(t * 0.6 + i * 0.85));
      }
      const bh = Math.max(3, val * (h - 2));
      const x = i * (barW + gap) + 1;
      const y = (h - bh) / 2;
      ctx.fillStyle = this.isVoiceSpeaking
        ? "#ffd859"
        : this.isPlayingBgm
        ? "#ffe49e"
        : "rgba(255, 228, 158, 0.35)";
      ctx.fillRect(x, y, barW, bh);
    }
  }
}

export const audioEngine = new NaviaAudioEngine();
