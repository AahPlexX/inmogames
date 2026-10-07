/**
 * Board geometry for Mergrove. Pure data and functions; imports nothing.
 * Cells are row-major indexes: row = floor(index / width), column = index % width.
 * Released layouts are frozen and ids are permanent: add a new layout, never edit one.
 */
export interface BoardLayout {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  /** playable[index] is true when a spirit may stand on that cell. Length is width * height. */
  readonly playable: readonly boolean[];
  /**
   * adjacency[index] lists the playable orthogonal neighbors of a cell. Precomputed by defineLayout.
   * Treat as read-only: the inner arrays are deliberately not Object.frozen because frozen arrays measured
   * ~35% slower in the flood-fill hot path. Use layoutNeighbors() for a safe copy.
   */
  readonly adjacency: readonly (readonly number[])[];
}

export interface LayoutInput {
  id: string;
  width: number;
  height: number;
  /** One string per row: '#' is playable, '.' is not. Omit for a fully playable rectangle. */
  mask?: readonly string[];
}

const MIN_SIDE = 4;
const MAX_SIDE = 8;
const MIN_PLAYABLE = 12;

function neighborIndexes(width: number, height: number, index: number): number[] {
  const row = Math.floor(index / width);
  const column = index % width;
  const found: number[] = [];
  if (row > 0) found.push(index - width);
  if (row < height - 1) found.push(index + width);
  if (column > 0) found.push(index - 1);
  if (column < width - 1) found.push(index + 1);
  return found;
}

function isSide(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_SIDE && value <= MAX_SIDE;
}

export function defineLayout(input: LayoutInput): BoardLayout {
  const { id, width, height } = input;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Layout id must be kebab-case.');
  if (!isSide(width) || !isSide(height)) throw new Error(`Layout dimensions must be whole numbers from ${MIN_SIDE} to ${MAX_SIDE}.`);
  const rows = input.mask ?? Array.from({ length: height }, () => '#'.repeat(width));
  if (rows.length !== height || rows.some(row => row.length !== width)) throw new Error('Layout mask must have one row per board row, each as wide as the board.');
  if (rows.some(row => /[^#.]/.test(row))) throw new Error("Layout mask may only contain '#' (playable) and '.' (blocked).");

  const playable = rows.join('').split('').map(char => char === '#');
  const open = playable.flatMap((isOpen, index) => (isOpen ? [index] : []));
  if (open.length < MIN_PLAYABLE) throw new Error(`Layout needs at least ${MIN_PLAYABLE} playable cells.`);

  const seen = new Set<number>([open[0]]);
  const stack = [open[0]];
  while (stack.length > 0) {
    const at = stack.pop() as number;
    for (const next of neighborIndexes(width, height, at)) {
      if (playable[next] && !seen.has(next)) { seen.add(next); stack.push(next); }
    }
  }
  if (seen.size !== open.length) throw new Error('Layout playable cells must form one connected region.');

  const adjacency = Array.from({ length: width * height }, (_, index) =>
    neighborIndexes(width, height, index).filter(next => playable[next]));
  return Object.freeze({ id, width, height, playable, adjacency });
}

export function layoutCellCount(layout: BoardLayout): number {
  return layout.width * layout.height;
}

/** Playable orthogonal neighbors only: never diagonal, never wrapping to another row. Returns a fresh array. */
export function layoutNeighbors(layout: BoardLayout, index: number): number[] {
  if (!Number.isInteger(index) || index < 0 || index >= layoutCellCount(layout)) throw new Error('Cell is out of range.');
  return [...layout.adjacency[index]];
}

export const CLASSIC_5: BoardLayout = defineLayout({ id: 'classic-5', width: 5, height: 5 });
export const STANDARD_6: BoardLayout = defineLayout({ id: 'standard-6', width: 6, height: 6 });
export const CROSSROADS_6: BoardLayout = defineLayout({
  id: 'crossroads-6', width: 6, height: 6,
  mask: ['.####.', '######', '######', '######', '######', '.####.'],
});

const RELEASED: ReadonlyMap<string, BoardLayout> = new Map([CLASSIC_5, STANDARD_6, CROSSROADS_6].map(layout => [layout.id, layout]));

/** Returns a released layout by id, or null. A Map keeps ids like "__proto__" harmless. */
export function resolveLayout(id: string): BoardLayout | null {
  return RELEASED.get(id) ?? null;
}
