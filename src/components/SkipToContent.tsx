import './skip-to-content.css';

export function SkipToContent({ label }: { label: string }) {
  function moveFocus() {
    const target = document.getElementById('main-content');
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start' });
  }

  return (
    <button type="button" className="skip-link" onClick={moveFocus}>
      {label}
    </button>
  );
}
