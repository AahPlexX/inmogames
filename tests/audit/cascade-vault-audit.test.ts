import { describe, expect, it } from 'vitest';
import { isCascadeVaultWager } from '../../src/games/cascade-vault/paytable';
import { simulateCascadeVaultPaidSpins } from '../../src/games/cascade-vault/simulation';

function requiredSafeInteger(name: string, minimum: number): number {
  const raw = process.env[name];
  if (!raw || !/^\d+$/.test(raw)) throw new Error(`${name} must be a base-10 integer.`);
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < minimum) throw new Error(`${name} must be >= ${minimum}.`);
  return value;
}

const enabled = process.env.CASCADE_VAULT_AUDIT === '1';
const audit = enabled ? describe : describe.skip;

audit('Cascade Vault non-routine probability audit', () => {
  it('runs the production-engine audit and applies optional acceptance gates', () => {
    const paidSpins = requiredSafeInteger('CASCADE_VAULT_AUDIT_SPINS', 2);
    const seed = requiredSafeInteger('CASCADE_VAULT_AUDIT_SEED', 0);
    const wagerCredits = requiredSafeInteger('CASCADE_VAULT_AUDIT_WAGER', 1);
    if (!isCascadeVaultWager(wagerCredits)) throw new Error('CASCADE_VAULT_AUDIT_WAGER is unsupported.');
    const requireAcceptance = process.env.CASCADE_VAULT_AUDIT_REQUIRE_ACCEPTANCE === 'true';

    try {
      const report = simulateCascadeVaultPaidSpins({ paidSpins, seed, wagerCredits });
      const intervalIntersectsTarget = report.ci95Low <= 0.97 && report.ci95High >= 0.94;
      const acceptancePassed = paidSpins >= 10_000_000
        && report.corruptionGuardHits === 0
        && intervalIntersectsTarget;
      console.log(`CASCADE_VAULT_AUDIT_RESULT ${JSON.stringify({
        completed: true,
        requireAcceptance,
        acceptancePassed,
        intervalIntersectsTarget,
        ...report,
      })}`);

      if (requireAcceptance) {
        expect(paidSpins).toBeGreaterThanOrEqual(10_000_000);
        expect(report.corruptionGuardHits).toBe(0);
        expect(intervalIntersectsTarget).toBe(true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const guardHit = /50|cascade limit|corrupt/i.test(message);
      console.log(`CASCADE_VAULT_AUDIT_RESULT ${JSON.stringify({
        completed: false,
        requireAcceptance,
        acceptancePassed: false,
        paidSpins,
        seed,
        wagerCredits,
        corruptionGuardHits: guardHit ? 1 : null,
        error: message,
      })}`);
      throw error;
    }
  }, 7_200_000);
});
