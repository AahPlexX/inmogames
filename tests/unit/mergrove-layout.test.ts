import { describe, expect, it } from 'vitest';
import { BOARD_CELLS } from '../../src/games/mergrove/engine';
import {
  CLASSIC_5, CROSSROADS_6, STANDARD_6, defineLayout, layoutCellCount, layoutNeighbors, resolveLayout,
} from '../../src/games/mergrove/layout';

const rows = (count: number, width: number) => Array.from({ length: count }, () => '#'.repeat(width));

describe('Mergrove board layouts (src/games/mergrove)', () => {
  it('ships classic-5 identical to the v1 board', () => {
    expect(CLASSIC_5).toMatchObject({ id: 'classic-5', width: 5, height: 5 });
    expect(layoutCellCount(CLASSIC_5)).toBe(BOARD_CELLS);
    expect(CLASSIC_5.playable.every(Boolean)).toBe(true);
  });

  it('ships a full 6 by 6 board and a cut-corner shaped board', () => {
    expect(STANDARD_6.playable.filter(Boolean)).toHaveLength(36);
    expect(CROSSROADS_6.playable.filter(Boolean)).toHaveLength(32);
    expect(CROSSROADS_6.playable[0]).toBe(false);
    expect(CROSSROADS_6.playable[5]).toBe(false);
    expect(CROSSROADS_6.playable[30]).toBe(false);
    expect(CROSSROADS_6.playable[35]).toBe(false);
  });

  it('freezes released layouts', () => {
    expect(Object.isFrozen(CLASSIC_5)).toBe(true);
    expect(() => { (CLASSIC_5 as { width: number }).width = 9; }).toThrow(/read only|read-only|frozen/i);
  });

  it('hands out neighbor copies so callers cannot corrupt the shared table', () => {
    const first = layoutNeighbors(CLASSIC_5, 12);
    first.length = 0;
    expect(layoutNeighbors(CLASSIC_5, 12)).toHaveLength(4);
  });

  it('precomputes adjacency that matches layoutNeighbors for every cell of every layout', () => {
    for (const layout of [CLASSIC_5, STANDARD_6, CROSSROADS_6]) {
      for (let index = 0; index < layoutCellCount(layout); index += 1) {
        expect([...layout.adjacency[index]]).toEqual(layoutNeighbors(layout, index));
      }
    }
  });

  it('resolves released ids and rejects unknown ones', () => {
    expect(resolveLayout('classic-5')).toBe(CLASSIC_5);
    expect(resolveLayout('standard-6')).toBe(STANDARD_6);
    expect(resolveLayout('crossroads-6')).toBe(CROSSROADS_6);
    expect(resolveLayout('nope')).toBeNull();
    expect(resolveLayout('__proto__')).toBeNull();
  });

  it('defines a layout from mask rows', () => {
    const layout = defineLayout({ id: 'test-4', width: 4, height: 4, mask: rows(4, 4) });
    expect(layoutCellCount(layout)).toBe(16);
  });

  it('defaults to a fully playable rectangle when no mask is given', () => {
    expect(defineLayout({ id: 'plain-4', width: 4, height: 5 }).playable).toHaveLength(20);
  });

  it.each([
    ['width below 4', { id: 'a', width: 3, height: 5 }, /dimensions/i],
    ['width above 8', { id: 'a', width: 9, height: 5 }, /dimensions/i],
    ['height below 4', { id: 'a', width: 5, height: 3 }, /dimensions/i],
    ['non-integer height', { id: 'a', width: 5, height: 4.5 }, /dimensions/i],
    ['bad id', { id: 'Bad Id', width: 5, height: 5 }, /id/i],
    ['wrong mask row count', { id: 'a', width: 5, height: 5, mask: rows(4, 5) }, /mask/i],
    ['wrong mask row width', { id: 'a', width: 5, height: 5, mask: rows(5, 4) }, /mask/i],
    ['unknown mask character', { id: 'a', width: 4, height: 4, mask: ['####', '##x#', '####', '####'] }, /mask/i],
    ['fewer than 12 playable cells', { id: 'a', width: 4, height: 4, mask: ['##..', '##..', '##..', '##..'] }, /12/],
    ['disconnected playable region', { id: 'a', width: 6, height: 4, mask: ['###..#', '###..#', '###..#', '###..#'] }, /connected/i],
  ])('rejects %s', (_label, input, message) => {
    expect(() => defineLayout(input)).toThrow(message);
  });

  it('gives corners 2 neighbors, edges 3 and the interior 4 on classic-5', () => {
    expect(layoutNeighbors(CLASSIC_5, 0).sort((a, b) => a - b)).toEqual([1, 5]);
    expect(layoutNeighbors(CLASSIC_5, 4).sort((a, b) => a - b)).toEqual([3, 9]);
    expect(layoutNeighbors(CLASSIC_5, 2)).toHaveLength(3);
    expect(layoutNeighbors(CLASSIC_5, 12).sort((a, b) => a - b)).toEqual([7, 11, 13, 17]);
  });

  it('never wraps across rows and never uses diagonals', () => {
    // Cell 5 ends row 0 and cell 6 starts row 1: they are consecutive indexes but not neighbors.
    expect(layoutNeighbors(STANDARD_6, 5).sort((a, b) => a - b)).toEqual([4, 11]);
    expect(layoutNeighbors(STANDARD_6, 6).sort((a, b) => a - b)).toEqual([0, 7, 12]);
    expect(layoutNeighbors(STANDARD_6, 7).sort((a, b) => a - b)).toEqual([1, 6, 8, 13]);
  });

  it('omits unplayable cells from the neighbor list', () => {
    expect(layoutNeighbors(CROSSROADS_6, 1).sort((a, b) => a - b)).toEqual([2, 7]);
    expect(layoutNeighbors(CROSSROADS_6, 6).sort((a, b) => a - b)).toEqual([7, 12]);
  });

  it('rejects out-of-range indexes', () => {
    expect(() => layoutNeighbors(CLASSIC_5, 25)).toThrow(/out of range/i);
    expect(() => layoutNeighbors(CLASSIC_5, -1)).toThrow(/out of range/i);
  });
});
