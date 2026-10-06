import { GameState } from './game-state.js';
const melodies = { click: [440, 660], correct: [523, 659, 784], wrong: [220, 165], star: [659, 880, 1047], win: [523, 659, 784, 1047], lose: [392, 330, 262, 196], warning: [880] };
class AudioManager {
  context = null;
  musicTimer = null;
  note = 0;
  async unlock() {
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      if (!this.context) { this.context = new Context(); this.master = this.context.createGain(); this.master.connect(this.context.destination); }
      if (this.context.state === 'suspended') await this.context.resume();
      this.configure();
    } catch { /* Audio is optional on browsers with restricted playback. */ }
  }
  tone(frequency, at, duration, volume = .12, type = 'sine') {
    if (!this.context || this.context.state !== 'running') return;
    const oscillator = this.context.createOscillator(), envelope = this.context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0, at); envelope.gain.linearRampToValueAtTime(volume, at + .025);
    envelope.gain.exponentialRampToValueAtTime(.001, at + duration);
    oscillator.connect(envelope); envelope.connect(this.master);
    oscillator.start(at); oscillator.stop(at + duration + .03);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  play(name) {
    if (!GameState.settings.effects || !this.context) return;
    (melodies[name] || melodies.click).forEach((frequency, i) => this.tone(frequency, this.context.currentTime + i * .085, .22));
  }
  configure() {
    if (!this.context) return;
    this.master.gain.setTargetAtTime(GameState.settings.volume, this.context.currentTime, .04);
    clearInterval(this.musicTimer); this.musicTimer = null;
    if (GameState.settings.music && !document.hidden) {
      const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
      this.musicTimer = setInterval(() => { if (this.context.state === 'running') this.tone(notes[this.note++ % notes.length], this.context.currentTime, 1.8, .035); }, 1100);
    }
  }
  async suspend() { clearInterval(this.musicTimer); this.musicTimer = null; if (this.context?.state === 'running') try { await this.context.suspend(); } catch {} }
}
export const Audio = new AudioManager();
