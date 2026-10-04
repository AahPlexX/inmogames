export function SaveStatus({ status, error, retry, scope }: { status: string; error: string | null; retry(): void; scope: string }) {
  return <aside className="save-status" aria-label="Game progress">
    <p role="status">{error ?? status}</p>
    {error && scope !== 'guest' && <button onClick={retry}>Retry account sync</button>}
  </aside>;
}
