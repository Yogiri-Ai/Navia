// ==================================================
// FONTAINE MUSIC BOX & GEO AUDIO ENGINE (Web Audio API)
// ==================================================

class NaviaAudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.masterGain = null;
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.stepIndex = 0;
    this.freqData = new Uint8Array(16);

    // Gentle 3/4 Fontaine Waltz Music Box Melody (D Major / B Minor pentatonic)
    this.waltzNotes = [
      // Bar 1
      { note: 587.33, bass: 146.83, dur: 0.42 }, // D5 + D3
      { note: 659.25, bass: null,   dur: 0.42 }, // E5
      { note: 739.99, bass: 220.00, dur: 0.42 }, // F#5 + A3
      // Bar 2
      { note: 880.00, bass: 196.00, dur: 0.65 }, // A5 + G3
      { note: 739.99, bass: null,   dur: 0.35 }, // F#5
      { note: 659.25, bass: 246.94, dur: 0.42 }, // E5 + B3
      // Bar 3
      { note: 587.33, bass: 185.00, dur: 0.42 }, // D5 + F#3
      { note: 493.88, bass: null,   dur: 0.42 }, // B4
      { note: 587.33, bass: 220.00, dur: 0.42 }, // D5 + A3
      // Bar 4
      { note: 659.25, bass: 146.83, dur: 0.84 }, // E5 + D3
      { note: 739.99, bass: 220.00, dur: 0.42 }, // F#5
      // Bar 5
      { note: 987.77, bass: 246.94, dur: 0.55 }, // B5 + B3
      { note: 880.00, bass: null,   dur: 0.35 }, // A5
      { note: 739.99, bass: 185.00, dur: 0.42 }, // F#5 + F#3
      // Bar 6
      { note: 659.25, bass: 196.00, dur: 0.42 }, // E5 + G3
      { note: 587.33, bass: null,   dur: 0.42 }, // D5
      { note: 659.25, bass: 220.00, dur: 0.42 }, // E5 + A3
      // Bar 7
      { note: 587.33, bass: 146.83, dur: 0.95 }  // D5 + D3
    ];
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.65;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 32;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  playChime(freqBase = 587.33) {
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
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.55);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.6);
      });
    } catch (e) {}
  }

  playSaluteCannon() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Golden crystalline arpeggio + warm low thump
      const chord = [293.66, 440.0, 587.33, 739.99, 880.0, 1174.66];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(idx === 0 ? 0.16 : 0.075, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.9);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.95);
      });
    } catch (e) {}
  }

  scheduleNextMusicBoxNote() {
    if (!this.isPlayingBgm || !this.ctx) return;
    const item = this.waltzNotes[this.stepIndex % this.waltzNotes.length];
    this.stepIndex++;
    const now = this.ctx.currentTime;

    // Music box bell tone (fundamental sine + celesta 2nd harmonic)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(item.note, now);
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(item.note * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

    const harmGain = this.ctx.createGain();
    harmGain.gain.value = 0.22;

    osc1.connect(gain);
    osc2.connect(harmGain);
    harmGain.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);

    // Warm harp bass accompaniment
    if (item.bass) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = "triangle";
      bOsc.frequency.setValueAtTime(item.bass, now);
      bGain.gain.setValueAtTime(0.0001, now);
      bGain.gain.exponentialRampToValueAtTime(0.055, now + 0.03);
      bGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
      bOsc.connect(bGain);
      bGain.connect(this.masterGain);
      bOsc.start(now);
      bOsc.stop(now + 1.4);
    }

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextMusicBoxNote();
    }, item.dur * 1000);
  }

  toggleMusicBox() {
    this.init();
    this.isPlayingBgm = !this.isPlayingBgm;
    if (this.isPlayingBgm) {
      this.scheduleNextMusicBoxNote();
    } else {
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
    for (let i = 0; i < bars; i++) {
      let val = this.analyser ? this.freqData[i + 1] / 255 : 0;
      if (this.isPlayingBgm && val < 0.15) {
        val = 0.2 + 0.25 * Math.abs(Math.sin(performance.now() * 0.006 + i));
      }
      const bh = Math.max(3, val * (h - 2));
      const x = i * (barW + gap) + 1;
      const y = (h - bh) / 2;
      ctx.fillStyle = this.isPlayingBgm ? "#ffe49e" : "rgba(255, 228, 158, 0.45)";
      ctx.fillRect(x, y, barW, bh);
    }
  }
}

export const audioEngine = new NaviaAudioEngine();
