import type { GameMeta } from './game-meta';
import { threefoldMeta } from './games/threefold/threefold.meta';
import { royalPalaceBlackjackMeta } from './games/royal-palace-blackjack/royal-palace-blackjack.meta';
import { mergroveMeta } from './games/mergrove/mergrove.meta';

export const games: readonly GameMeta[] = [threefoldMeta, royalPalaceBlackjackMeta, mergroveMeta];
