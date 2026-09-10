import assert from 'node:assert/strict';
import { readFileSync, lstatSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const unsafe = /[<>\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u;
function text(value, max = 120) {
  assert(typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= max && !unsafe.test(value), 'Invalid display text');
}
function object(value, keys) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'Expected object');
  assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), 'Missing or unknown fields');
}
function list(value, min, max) {
  assert(Array.isArray(value) && value.length >= min && value.length <= max, 'Invalid list size');
  assert.equal(new Set(value).size, value.length, 'Duplicate list items');
}
function path(value, allowRoot = false) {
  text(value, 240);
  if (allowRoot && value === '.') return;
  assert(value.split('/').every(part => /^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(part)), 'Unsafe repository path');
}
export function validate(catalog, previous) {
  object(catalog, ['schemaVersion', 'revision', 'extensions']);
  assert.equal(catalog.schemaVersion, 1, 'Unsupported schema');
  assert(Number.isSafeInteger(catalog.revision) && catalog.revision > 0, 'Invalid revision');
  list(catalog.extensions, 0, 200);
  const ids = new Set();
  for (const entry of catalog.extensions) {
    object(entry, ['id', 'name', 'summary', 'author', 'repository', 'commit', 'directory', 'version', 'license', 'compatibility', 'permissions', 'installation', 'security', 'screenshots', 'status']);
    text(entry.id, 100);
    assert(/^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/.test(entry.id), 'Use author.extension id');
    assert(!ids.has(entry.id), 'Duplicate extension id'); ids.add(entry.id);
    text(entry.name, 80); text(entry.summary, 280); text(entry.author, 80);
    assert(typeof entry.repository === 'string' && /^https:\/\/github\.com\/[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(entry.repository) && !entry.repository.endsWith('.git'), 'Expected public GitHub repository URL');
    assert(typeof entry.commit === 'string' && /^[a-f0-9]{40}$/.test(entry.commit) && !/^0+$/.test(entry.commit), 'Immutable full commit required');
    path(entry.directory, true);
    text(entry.version, 60);
    assert(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[A-Za-z0-9.-]+)?$/.test(entry.version), 'Expected version');
    object(entry.license, ['id', 'path']);
    assert(['MIT','Apache-2.0','BSD-2-Clause','BSD-3-Clause','ISC','MPL-2.0','GPL-3.0-only','GPL-3.0-or-later','AGPL-3.0-only','AGPL-3.0-or-later','LicenseRef-Custom'].includes(entry.license.id), 'Unrecognized license; request contract review');
    path(entry.license.path);
    object(entry.compatibility, ['testedLyreVersions', 'platforms', 'evidence']);
    list(entry.compatibility.testedLyreVersions, 1, 10);
    for (const version of entry.compatibility.testedLyreVersions) { text(version, 60); assert(/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(version), 'Exact tested Lyre version required'); }
    list(entry.compatibility.platforms, 1, 5);
    for (const platform of entry.compatibility.platforms) assert(['windows','macos','linux','ios','android'].includes(platform), 'Unknown platform');
    path(entry.compatibility.evidence);
    list(entry.permissions, 0, 20); for (const permission of entry.permissions) text(permission, 200);
    path(entry.installation); path(entry.security);
    list(entry.screenshots, 0, 6); for (const screenshot of entry.screenshots) { path(screenshot); assert(/\.(png|jpg|jpeg|webp)$/.test(screenshot), 'Raster screenshots only'); }
    assert(['listed','withdrawn'].includes(entry.status), 'Invalid status');
  }
  assert.deepEqual([...ids], [...ids].sort(), 'Sort entries by id');
  if (previous) {
    validate(previous);
    const changed = JSON.stringify(previous.extensions) !== JSON.stringify(catalog.extensions);
    assert(catalog.revision >= previous.revision, 'Revision cannot decrease');
    if (changed) assert(catalog.revision > previous.revision, 'Changed entries require a higher revision');
  }
  return catalog;
}
export function load(file) {
  const stat = lstatSync(file);
  assert(stat.isFile() && !stat.isSymbolicLink() && stat.size <= 262144, 'Registry must be a regular file at most 256 KiB');
  return JSON.parse(readFileSync(file, 'utf8'));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const catalog = validate(load(process.argv[2] ?? 'extensions.json'), process.argv[3] ? load(process.argv[3]) : undefined);
    console.log(`Registry valid: ${catalog.extensions.length} entries, revision ${catalog.revision}. Metadata only; human review required.`);
  } catch (error) { console.error(`Registry rejected: ${error.message}`); process.exitCode = 1; }
}
