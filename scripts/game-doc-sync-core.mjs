export function checkGameDocChangeSet({ label, changedPaths, slugs, specPathFor, indexLineChanged, testTouchesGame }) {
  const problems = [];
  const changed = new Set(changedPaths);
  const perGameDocumentation = new Set(['TRACKER.md', 'PRD.md', 'todo.md']);

  for (const slug of slugs) {
    const trackerPath = `src/games/${slug}/TRACKER.md`;
    const specPath = specPathFor(slug);
    if (!specPath) continue;
    const trackerChanged = changed.has(trackerPath);
    const specChanged = changed.has(specPath);
    const prefix = `src/games/${slug}/`;
    const implementationChanged = changedPaths.some((path) => path.startsWith(prefix) && !perGameDocumentation.has(path.slice(prefix.length)));
    const testChanged = changedPaths.some((path) => testTouchesGame(path, slug));

    if ((implementationChanged || testChanged) && !(trackerChanged && specChanged)) {
      problems.push(`${label}: ${slug}: implementation/test changes require both spec and tracker updates in the same integration`);
    }
    if (trackerChanged !== specChanged) {
      problems.push(`${label}: ${slug}: spec and tracker must be updated together`);
    }
    if (indexLineChanged(slug) && !(trackerChanged && specChanged)) {
      problems.push(`${label}: ${slug}: GAME_INDEX row changes require both spec and tracker updates in the same integration`);
    }
  }
  return problems;
}
