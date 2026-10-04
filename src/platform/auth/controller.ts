export interface Account { uid: string; email: string | null }
export interface AuthAdapter {
  prepare(): Promise<string | null>;
  observe(next: (user: Account | null) => void, error: (error: unknown) => void): () => void;
  register(email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  signOut(): Promise<void>;
}
export interface AuthSnapshot {
  status: 'loading' | 'ready' | 'unconfigured' | 'unavailable';
  user: Account | null;
  busy: boolean;
  error: string | null;
  notice: string | null;
}
export function authError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  const messages: Record<string,string> = {
    'auth/invalid-credential': 'Check your email and password, then try again.',
    'auth/wrong-password': 'Check your email and password, then try again.',
    'auth/user-not-found': 'Check your email and password, then try again.',
    'auth/email-already-in-use': 'An account already uses that email. Sign in or reset its password.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Choose a stronger password that meets this project’s password policy.',
    'auth/password-does-not-meet-requirements': 'Choose a stronger password that meets this project’s password policy.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes before trying again.',
    'auth/network-request-failed': 'Could not connect. Check your connection and try again.',
    'auth/user-disabled': 'This account is disabled. Contact the site owner.',
    'auth/operation-not-allowed': 'Email/password accounts are unavailable. Contact the site owner.',
    'auth/unauthorized-domain': 'Accounts are not enabled for this hostname. Contact the site owner.',
  };
  return messages[code] ?? 'Accounts are temporarily unavailable. Try again later; guest play remains available.';
}
export class AuthController {
  private snapshot: AuthSnapshot;
  private listeners = new Set<() => void>();
  private adapter: AuthAdapter | null = null;
  private unsubscribe?: () => void;
  constructor(status: AuthSnapshot['status'] = 'loading') {
    this.snapshot = { status, user: null, busy: false, error: null, notice: null };
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private publish(update: Partial<AuthSnapshot>) { this.snapshot = { ...this.snapshot, ...update }; this.listeners.forEach(listener => listener()); }
  canWrite = (uid: string) => this.snapshot.status === 'ready' && this.snapshot.user?.uid === uid;
  async start(adapter: AuthAdapter): Promise<void> {
    if (this.adapter) return;
    this.adapter = adapter;
    try {
      const notice = await adapter.prepare();
      this.publish({ notice });
      this.unsubscribe = adapter.observe(user => this.publish({ status: 'ready', user }), () => this.publish({ status: 'unavailable', user: null, error: authError(null) }));
    } catch { this.publish({ status: 'unavailable', user: null, error: authError(null) }); }
  }
  unavailable(): void { this.publish({ status: 'unavailable', user: null, error: authError(null) }); }
  private async action(run: (adapter: AuthAdapter) => Promise<void>): Promise<void> {
    if (!this.adapter || this.snapshot.status !== 'ready' || this.snapshot.busy) throw new Error('Accounts are not ready. You can keep playing as a guest.');
    this.publish({ busy: true, error: null, notice: null });
    try { await run(this.adapter); }
    catch (error) { const message = authError(error); this.publish({ error: message }); throw new Error(message); }
    finally { this.publish({ busy: false }); }
  }
  register(email: string, password: string) { return this.action(adapter => adapter.register(email.trim(), password)); }
  signIn(email: string, password: string) { return this.action(adapter => adapter.signIn(email.trim(), password)); }
  resetPassword(email: string) { return this.action(async adapter => { await adapter.resetPassword(email.trim()); this.publish({ notice: 'If that email has an account, a password reset message will arrive. Check your inbox and spam folder.' }); }); }
  async signOut(): Promise<void> {
    const previous = this.snapshot.user;
    await this.action(async adapter => {
      this.publish({ status: 'loading', user: null });
      try { await adapter.signOut(); this.publish({ status: 'ready', user: null }); }
      catch (error) { this.publish({ status: 'ready', user: previous }); throw error; }
    });
  }
  dispose() { this.unsubscribe?.(); }
}
