import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
export const workspaces: Record<string, LazyExoticComponent<ComponentType>> = {
  threefold: lazy(() => import('./threefold/ThreefoldWorkspace')),
  'royal-palace-blackjack': lazy(() => import('./royal-palace-blackjack/RoyalPalaceBlackjackWorkspace')),
  mergrove: lazy(() => import('./mergrove/MergroveWorkspace')),
  'cloudline-couriers': lazy(() => import('./cloudline-couriers/CloudlineCouriersWorkspace')),
  'royal-fortune-slots': lazy(() => import('./royal-fortune-slots/RoyalFortuneSlotsWorkspace')),
};
