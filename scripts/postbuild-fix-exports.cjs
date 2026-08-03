/**
 * ng-packagr writes its own package.json into dist/ and merges our custom
 * export conditions into it verbatim. Ours are written relative to the package
 * root (`./dist/fesm2022/...`), so inside dist/ the `browser` and `import`
 * conditions point at a `dist/dist/` that does not exist. Only `default`, which
 * ng-packagr generates itself, is correct.
 *
 * That manifest is the nearest one to the fesm bundles, so it is what resolves
 * their self-references — `@autorender/angular/viewtag/video` imports
 * `@autorender/angular/viewtag`, and any bundler using the `browser` or
 * `import` condition fails to resolve it.
 *
 * Strip the leading `./dist/` from every target so they are relative to dist/.
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const manifestPath = resolve(__dirname, '../dist/package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

function rebase(value) {
  if (typeof value === 'string') {
    return value.startsWith('./dist/') ? `./${value.slice('./dist/'.length)}` : value;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, target]) => [key, rebase(target)]));
  }
  return value;
}

manifest.exports = rebase(manifest.exports);
manifest.types = rebase(manifest.types);

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Rebased dist/package.json export targets to dist/');
