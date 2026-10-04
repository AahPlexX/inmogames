import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useAccount, usePlatform } from '../PlatformProvider';
import './account.css';
type Mode = 'signin' | 'register' | 'reset';
export function AccountControls() {
  const account = useAccount();
  const { auth } = usePlatform();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  useEffect(() => {
    if (account.user) { dialog.current?.close(); setPassword(''); }
  }, [account.user?.uid]);
  function changeMode(next: Mode) { setMode(next); setPassword(''); setFeedback(null); emailInput.current?.focus(); }
  function open() { setFeedback(null); dialog.current?.showModal(); emailInput.current?.focus(); }
  function keepDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input:not(:disabled), button:not(:disabled)'));
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFeedback(null);
    try {
      if (mode === 'reset') { await auth.resetPassword(email); setFeedback('If that email has an account, a password reset message will arrive. Check your inbox and spam folder.'); }
      else if (mode === 'register') await auth.register(email, password);
      else await auth.signIn(email, password);
      setPassword('');
    } catch (error) { setFeedback(error instanceof Error ? error.message : 'Please try again.'); }
  }
  if (account.status === 'unconfigured') return <div className="account-bar"><p>Playing as a guest. Accounts are not available on this site yet.</p></div>;
  if (account.status === 'unavailable') return <div className="account-bar"><p role="status">Accounts are temporarily unavailable. Guest play remains available.</p></div>;
  return <div className="account-bar">
    {account.status === 'loading' ? <p role="status">Checking your account… You can keep playing.</p> : account.user ? <>
      <p>Signed in as <strong>{account.user.email ?? 'player'}</strong>.</p>
      <button disabled={account.busy} onClick={() => { void auth.signOut().catch(() => {}); }}>Sign out</button>
    </> : <><p>Play as a guest, or sign in to save progress across devices.</p><button onClick={open}>Sign in / create account</button></>}
    {account.error && <p role="alert">{account.error}</p>}
    {account.notice && <p role="status">{account.notice}</p>}
    <dialog ref={dialog} className="account-dialog" aria-labelledby={`${id}-title`} onClose={() => setPassword('')} onKeyDown={keepDialogFocus}>
      <h2 id={`${id}-title`}>{mode === 'register' ? 'Create account' : mode === 'reset' ? 'Reset password' : 'Sign in'}</h2>
      <p>Accounts are optional. Signing in loads account progress and starts a fresh game session. Completed progress follows your account; guest progress stays in this browser.</p>
      <form onSubmit={submit}>
        <fieldset disabled={account.busy}>
          <label htmlFor={`${id}-email`}>Email</label>
          <input ref={emailInput} id={`${id}-email`} type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
          {mode !== 'reset' && <><label htmlFor={`${id}-password`}>Password</label>
            <input id={`${id}-password`} type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 6 : undefined} required value={password} onChange={event => setPassword(event.target.value)} />
            {mode === 'register' && <p>Use at least 6 characters. Additional password requirements may apply.</p>}
          </>}
          <button type="submit">{account.busy ? 'Please wait…' : mode === 'register' ? 'Create account' : mode === 'reset' ? 'Send reset email' : 'Sign in'}</button>
        </fieldset>
      </form>
      {feedback && <p role="status" aria-live="polite">{feedback}</p>}
      {!feedback && account.error && <p role="alert">{account.error}</p>}
      <div className="account-actions">
        {mode !== 'signin' && <button disabled={account.busy} onClick={() => changeMode('signin')}>Sign in instead</button>}
        {mode !== 'register' && <button disabled={account.busy} onClick={() => changeMode('register')}>Create account</button>}
        {mode !== 'reset' && <button disabled={account.busy} onClick={() => changeMode('reset')}>Forgot password?</button>}
        <button onClick={() => dialog.current?.close()}>Continue playing</button>
      </div>
    </dialog>
  </div>;
}
