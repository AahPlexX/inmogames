export interface VaultAudio {
  play(): void;
  close(): void;
}

export function createVaultAudio(): VaultAudio {
  let context: AudioContext | null = null;
  let closed = false;

  return {
    play() {
      if (closed || typeof globalThis.AudioContext !== 'function') return;
      try {
        context ??= new AudioContext();
        if (context.state === 'closed') return;
        if (context.state === 'suspended') void context.resume().catch(() => {});

        const start = context.currentTime;
        for (const [frequency, offset] of [[392, 0], [587.33, 0.075]] as const) {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const at = start + offset;
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(frequency, at);
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.045, at + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.14);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(at);
          oscillator.stop(at + 0.15);
        }
      } catch {
        // Sound is optional and must never interrupt a settled spin.
      }
    },
    close() {
      closed = true;
      const current = context;
      context = null;
      try {
        if (current && current.state !== 'closed') void current.close().catch(() => {});
      } catch {
        // Browser audio cleanup is best effort.
      }
    },
  };
}
