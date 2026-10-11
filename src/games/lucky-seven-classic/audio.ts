export type LuckySevenCue = 'pull' | 'stop' | 'win';

const cueFrequency: Record<LuckySevenCue, number> = {
  pull: 150,
  stop: 235,
  win: 740,
};

export function playLuckySevenCue(cue: LuckySevenCue, enabled: boolean): void {
  if (!enabled || typeof globalThis.AudioContext === 'undefined') return;

  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const duration = cue === 'win' ? 0.18 : 0.08;

    oscillator.type = cue === 'win' ? 'triangle' : 'square';
    oscillator.frequency.setValueAtTime(cueFrequency[cue], now);
    if (cue === 'win') oscillator.frequency.exponentialRampToValueAtTime(980, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(cue === 'win' ? 0.075 : 0.035, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.addEventListener('ended', () => { void context.close(); }, { once: true });
    oscillator.start(now);
    oscillator.stop(now + duration + 0.01);
  } catch {
    // Audio is optional feedback. Gameplay remains fully functional when unavailable.
  }
}
