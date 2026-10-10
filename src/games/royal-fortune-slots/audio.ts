export type RoyalFortuneCue = 'spin' | 'stop' | 'win' | 'feature';

export function playRoyalFortuneCue(cue: RoyalFortuneCue, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') return;
  const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  try {
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const config: Record<RoyalFortuneCue, { frequency: number; duration: number; type: OscillatorType }> = {
      spin: { frequency: 180, duration: 0.07, type: 'triangle' },
      stop: { frequency: 260, duration: 0.05, type: 'square' },
      win: { frequency: 620, duration: 0.16, type: 'sine' },
      feature: { frequency: 760, duration: 0.22, type: 'triangle' },
    };
    const selected = config[cue];
    oscillator.type = selected.type;
    oscillator.frequency.setValueAtTime(selected.frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + selected.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + selected.duration + 0.01);
    oscillator.addEventListener('ended', () => { void context.close(); }, { once: true });
  } catch {
    // Audio is enhancement-only; gameplay remains fully functional without it.
  }
}
