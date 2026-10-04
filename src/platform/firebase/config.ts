export interface WebConfig { apiKey: string; authDomain: string; projectId: string; appId: string }
export type FirebaseConfigResult = { status: 'configured'; value: WebConfig } | { status: 'unconfigured' | 'invalid' };
export function readFirebaseConfig(env: Record<string, unknown>): FirebaseConfigResult {
  const names = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID'] as const;
  const entries = names.map(name => typeof env[name] === 'string' ? (env[name] as string).trim() : '');
  if (entries.every(value => !value)) return { status: 'unconfigured' };
  const [apiKey, authDomain, projectId, appId] = entries;
  if (!apiKey || /\s/.test(apiKey) || !/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(authDomain) || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId) || !/^1:\d+:web:[a-zA-Z0-9]+$/.test(appId)) return { status: 'invalid' };
  return { status: 'configured', value: { apiKey, authDomain, projectId, appId } };
}
