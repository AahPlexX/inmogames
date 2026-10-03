import type { ComponentType, LazyExoticComponent } from 'react';

// Map slug -> lazy(() => import('./<slug>/<Name>Workspace')).
export const workspaces: Record<string, LazyExoticComponent<ComponentType>> = {};
