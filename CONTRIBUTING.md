# Contributing an extension listing

Submit metadata here; keep extension source in your own public repository. Do not upload
private code, credentials, compiled binaries or other people's assets to this registry.

## Required fields

Use the complete [example](examples/extension.json). The validator rejects unknown fields.

| Field | Meaning |
| --- | --- |
| `id` | Stable lowercase `author.extension` ID; do not reuse withdrawn IDs |
| `name`, `summary`, `author` | Plain text, accurate public attribution; 80/280/80 characters |
| `repository`, `commit` | Public GitHub repository URL and immutable full commit SHA |
| `directory` | Extension directory relative to repository root, or `.` |
| `version` | Extension version, e.g. `0.1.0` |
| `license.id`, `license.path` | Supported SPDX identifier or `LicenseRef-Custom`, and actual license file |
| `compatibility` | Exact tested Lyre versions, supported platforms and evidence file |
| `permissions` | Full prose disclosure of filesystem, process, network, account, capture/input and other access; `[]` only when none is needed |
| `installation`, `security` | Setup and security/contact documents |
| `screenshots` | Up to six PNG/JPEG/WebP paths, with rights/attribution in source |
| `status` | `listed` or `withdrawn`; neither permits automatic execution |

All file paths, including docs, license and screenshots, are **repository-root relative** at
`commit`; they are not relative to `directory`. No traversal, absolute paths, remote image URLs,
HTML or shell commands. Initial submissions support GitHub repositories; other public hosts
need a reviewed contract change. Up to 200 listings / 256 KiB. Sort by ID and increase `revision`
for any listing change. The executable contract is the existing Lyre host integration, not a new
SDK defined by this JSON. The evidence file must identify that integration and its requirements.

## License and ownership

You must own the submitted material or be authorized to submit it. Authors keep copyright.
Contributed registry text is offered under this repository's MIT license; source, screenshots,
fonts, logos and dependencies retain their own licenses. Supply accurate attribution and
evidence you may display the listed images. Listing does not grant trademark ownership.

A public repository alone is not a software license. The license must actually permit the
proposed use with Lyre. MIT/Apache/BSD/ISC licenses are straightforward candidates; MPL/GPL/AGPL
and custom terms need their applicable obligations reviewed for the integration and distribution.
An accepted identifier is not an automatic compatibility decision. `LicenseRef-Custom` requires
explicit written terms in the pinned license file, including permitted use and restrictions.
No missing license, invented permission, copyright assignment or blanket relicensing.

## Maintainer review before merge

- Confirm submitter authority and public source ownership; inspect the exact pinned commit.
- Verify directory and every referenced file exists there, including license and image rights.
- Review source/dependency licenses, required notices, redistribution/source obligations and
  whether installation would require accepting additional terms or paid services.
- Inspect source and complete privilege/data-destination disclosures. Do not run contributor
  code on a maintainer machine or in the registry validation job.
- Review compatibility evidence, failure/uninstall behavior and version/platform claims.
  Any execution testing requires a separately authorized isolated environment.
- Confirm no credentials, tracking surprises, impersonation or misleading endorsement.
- Check CI passes and the revision increases. Workflow/tooling changes require separate scrutiny.

Automated checks validate shape and bounds only. They do not establish remote file existence,
license rights, safe execution or compatibility. Maintainer approval remains required.

## Updates and removal

Updates use another PR with a new immutable commit, version/evidence and revision. Existing
users must not silently receive new executable code. Withdraw using `status: "withdrawn"`,
retain the ID/attribution, increase revision and explain the reason in the PR. Removal from
discovery cannot delete installed copies or revoke previously granted license rights.
For security issues, use [SECURITY.md](SECURITY.md); do not publish an exploit or secret in a PR.
