import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate } from './validate.mjs';
const example = JSON.parse(readFileSync(new URL('../examples/extension.json', import.meta.url), 'utf8'));
const fixture = () => ({ schemaVersion: 1, revision: 1, extensions: [structuredClone(example)] });
test('accepts empty registry and complete monorepo metadata', () => {
  validate({schemaVersion:1,revision:1,extensions:[]});
  const value=fixture(); value.extensions[0].directory='packages/extension'; validate(value);
});
for (const [name, mutate] of [
  ['mutable commit', e=>e.commit='main'],
  ['credential URL', e=>e.repository='https://token@github.com/example/repo'],
  ['lookalike host', e=>e.repository='https://github.com.evil.test/example/repo'],
  ['URL query', e=>e.repository+='?token=secret'],
  ['path traversal', e=>e.installation='../INSTALL.md'],
  ['encoded traversal', e=>e.directory='%2e%2e'],
  ['absolute path', e=>e.security='/SECURITY.md'],
  ['HTML', e=>e.summary='<script>alert(1)</script>'],
  ['bidi', e=>e.name='Hidden\u202etext'],
  ['executable field', e=>e.installCommand='npm install'],
  ['missing license', e=>delete e.license],
  ['unspecified license', e=>e.license.id='UNLICENSED'],
  ['missing compatibility evidence', e=>delete e.compatibility.evidence],
  ['wildcard compatibility', e=>e.compatibility.testedLyreVersions=['*']],
  ['active image', e=>e.screenshots=['images/preview.svg']],
]) test(`rejects ${name}`, () => {const value=fixture();mutate(value.extensions[0]);assert.throws(()=>validate(value));});
test('rejects duplicate IDs and too many entries',()=>{const value=fixture();value.extensions.push(structuredClone(example));assert.throws(()=>validate(value));value.extensions=Array.from({length:201},()=>structuredClone(example));assert.throws(()=>validate(value));});
test('requires a revision increase for changes including withdrawals',()=>{const previous=fixture();const next=fixture();next.extensions[0].status='withdrawn';assert.throws(()=>validate(next,previous));next.revision=2;validate(next,previous);next.revision=0;assert.throws(()=>validate(next,previous));});
test('license declarations do not assign ownership or assert approval',()=>{const value=fixture();value.extensions[0].license.id='MPL-2.0';validate(value);value.extensions[0].license.id='LicenseRef-Custom';validate(value);value.extensions[0].approved=true;assert.throws(()=>validate(value));});
