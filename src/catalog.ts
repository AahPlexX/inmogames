import type { GameMeta } from './game-meta';
import { threefoldMeta } from './games/threefold/threefold.meta';
import { royalPalaceBlackjackMeta } from './games/royal-palace-blackjack/royal-palace-blackjack.meta';
import { mergroveMeta } from './games/mergrove/mergrove.meta';
import { cloudlineCouriersMeta } from './games/cloudline-couriers/cloudline-couriers.meta';
import { royalFortuneSlotsMeta } from './games/royal-fortune-slots/royal-fortune-slots.meta';
export const games: readonly GameMeta[] = [threefoldMeta, royalPalaceBlackjackMeta, mergroveMeta, cloudlineCouriersMeta, royalFortuneSlotsMeta];
