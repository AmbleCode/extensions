# Lyre Extensions

A community extension directory for Lyre. Authors keep their code in their own public
repositories and propose a listing through a pull request to [`extensions.json`](extensions.json).

**Authors retain ownership.** Inclusion does not transfer copyright to Lyre or relicense
an extension. Users receive permission under the author's license. This repository's MIT
license covers its registry tooling and contributed listing text, not linked extension code,
logos or screenshots. No copyright assignment is required.

## Submit an extension

1. Publish your extension source, license, installation guide and compatibility evidence in
   your own public GitHub repository. A directory within a monorepo is supported.
2. Copy [`examples/extension.json`](examples/extension.json), replace every example value,
   and add the entry to `extensions.json`, sorted by ID. Pin a full 40-character commit.
3. Increase the registry revision and run `npm test` and `npm run validate` with Node 22+.
   No dependency installation is needed.
4. Open a pull request here and complete the review checklist. Maintainers check authorship,
   license scope, source, permissions and compatibility evidence before merging.

See [CONTRIBUTING.md](CONTRIBUTING.md) for fields, updates, withdrawals and review requirements.
The example is fictional and is not included in the live list. The initial registry is empty.

## What a listing means

This is a metadata submission registry. It does not download, install or execute extensions.
Lyre's current app does not consume this registry yet; in-app discovery and explicit installation
remain separate implementation work. A merge is not a security certification or permission grant.
Third-party host plugins may execute with host-user privileges; a permission list is disclosure,
not a sandbox. Compatibility must name actual tested Lyre versions and evidence.

The public list is available at
https://raw.githubusercontent.com/LyreStudio/extensions/main/extensions.json.
Consumers should validate bounded metadata, cache an accepted revision and require explicit
user review before any future installation. Source, docs and image paths resolve under the
entry's pinned repository commit, never a moving branch. Do not execute listing content.
