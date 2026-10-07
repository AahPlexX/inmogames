// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PlatformProvider } from '../../src/platform/PlatformProvider';
import MergroveWorkspace from '../../src/games/mergrove/MergroveWorkspace';

// Component tests for src/games/mergrove: the real workspace inside the real (guest, unconfigured) platform.
function mount() {
  return render(<PlatformProvider><MergroveWorkspace /></PlatformProvider>);
}
const cells = () => screen.getAllByRole('button', { name: /^Row \d+ column \d+/ });
const place = (index: number) => fireEvent.click(cells()[index]);
// The page has two status regions: the shared save status and Mergrove's own result line.
const result = () => {
  const region = document.querySelector('output.mg-status');
  if (!region) throw new Error('Mergrove status region is missing.');
  return region;
};

beforeEach(() => { window.localStorage.clear(); });
afterEach(() => cleanup());

describe('Mergrove workspace', () => {
  it('names the board and the queue as groups and exposes 25 cells and 3 queue buttons', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    expect(screen.getByRole('group', { name: 'Mergrove 5 by 5 board' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Spirit queue' })).toBeTruthy();
    expect(cells()).toHaveLength(25);
    expect(within(screen.getByRole('group', { name: 'Spirit queue' })).getAllByRole('button')).toHaveLength(3);
  });

  it('announces results through a polite live region', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    const status = result();
    expect(status.tagName).toBe('OUTPUT');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(screen.getAllByRole('status')).toContain(status);
    place(0); place(1); place(2);
    expect(status.textContent).toMatch(/Sprout formed for \+30 points/);
  });

  it('labels each cell with row, column, state and action', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    expect(cells()[0].getAttribute('aria-label')).toBe('Row 1 column 1, empty, place Seed');
    place(0);
    expect(cells()[0].getAttribute('aria-label')).toBe('Row 1 column 1, Seed, occupied');
    expect((cells()[0] as HTMLButtonElement).disabled).toBe(true);
  });

  it('keeps Compost disabled below 4 sunlight and arms, announces and cancels it with Escape', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    const compost = screen.getByRole('button', { name: /Compost a piece \(4\)/ }) as HTMLButtonElement;
    expect(compost.disabled).toBe(true);
    for (const cell of [0, 1, 2, 5, 6, 7, 10, 11, 12]) place(cell);
    expect(compost.disabled).toBe(false);
    fireEvent.click(compost);
    expect(compost.getAttribute('aria-pressed')).toBe('true');
    expect(result().textContent).toMatch(/^Compost ready\./);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(compost.getAttribute('aria-pressed')).toBe('false');
    expect(result().textContent).toMatch(/^Compost cancelled\./);
  });

  it('ignores Escape when Compost is not armed', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    const before = result().textContent;
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(result().textContent).toBe(before);
  });

  it('adds the Escape listener only while Compost is armed and removes every one it added', async () => {
    const added: EventListenerOrEventListenerObject[] = [];
    const removed: EventListenerOrEventListenerObject[] = [];
    const add = document.addEventListener.bind(document);
    const remove = document.removeEventListener.bind(document);
    document.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: unknown) => {
      if (type === 'keydown') added.push(listener);
      return add(type, listener, options as boolean);
    }) as typeof document.addEventListener;
    document.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: unknown) => {
      if (type === 'keydown') removed.push(listener);
      return remove(type, listener, options as boolean);
    }) as typeof document.removeEventListener;
    try {
      const view = mount();
      await screen.findByRole('heading', { name: 'Grow the grove.' });
      expect(added).toHaveLength(0); // nothing is listening until Compost is armed
      for (const cell of [0, 1, 2, 5, 6, 7, 10, 11, 12]) place(cell);
      const compost = screen.getByRole('button', { name: /Compost a piece \(4\)/ });
      fireEvent.click(compost); // arm
      expect(added).toHaveLength(1);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel compost' })); // disarm by button
      expect(removed).toEqual(added);
      fireEvent.click(compost); // arm again, then unmount while armed
      expect(added).toHaveLength(2);
      view.unmount();
      expect(removed).toEqual(added); // the unmounted component left no listener behind
    } finally {
      document.addEventListener = add;
      document.removeEventListener = remove;
    }
  });

  it('shows the next arrival as text and keeps queue selection state non-colour', async () => {
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    expect(document.querySelector('[data-mg="next-draw"]')?.textContent).toMatch(/^Next to arrive: Seed/);
    const queue = within(screen.getByRole('group', { name: 'Spirit queue' })).getAllByRole('button');
    expect(queue[0].getAttribute('aria-pressed')).toBe('true');
    expect(queue[0].getAttribute('aria-label')).toMatch(/selected$/);
    fireEvent.click(queue[2]);
    expect(queue[2].getAttribute('aria-pressed')).toBe('true');
    expect(queue[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('persists the active run to guest storage and restores it on remount', async () => {
    const first = mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    place(12);
    expect(window.localStorage.getItem('inmogames:mergrove:v1')).toContain('"turns":1');
    first.unmount();
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    expect(cells()[12].getAttribute('aria-label')).toBe('Row 3 column 3, Seed, occupied');
    expect(result().textContent).toMatch(/Saved grove restored/);
  });

  it('resets only Mergrove progress', async () => {
    window.localStorage.setItem('inmogames:other-game:v1', 'keep');
    mount();
    await screen.findByRole('heading', { name: 'Grow the grove.' });
    place(3);
    fireEvent.click(screen.getByRole('button', { name: 'Reset Mergrove progress' }));
    expect(cells()[3].getAttribute('aria-label')).toBe('Row 1 column 4, empty, place Seed');
    expect(window.localStorage.getItem('inmogames:other-game:v1')).toBe('keep');
  });
});
