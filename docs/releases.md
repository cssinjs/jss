# Releases

Releases use reviewed version changes followed by GitHub Actions and npm trusted publishing.
All 19 packages keep the same version and exact internal dependencies. Stable versions use
`latest`; SemVer prereleases (for example `alpha.0` or `dev.0`) use `next`.
Numeric prerelease identifiers must not exceed `Number.MAX_SAFE_INTEGER` (9007199254740991).
Verkit 0.5.0 can round larger numeric identifiers during comparison, so validation and npm
rollback checks deliberately reject them. Nonnumeric identifiers such as `1e16` or
`9007199254740993a` remain supported.

## One-time setup

1. In GitHub repository settings, create the **npm-release** environment:
   - Require maintainer approval (preferably prevent self-review).
   - Restrict deployment branches to **master**.
   - Do not add an npm token or `NODE_AUTH_TOKEN` secret.
2. On npm, open each package's **Settings → Trusted publishing**, choose GitHub Actions,
   and enter these exact, case-sensitive values:

   | Field             | Value         |
   | ----------------- | ------------- |
   | Organization/user | `cssinjs`     |
   | Repository        | `jss`         |
   | Workflow filename | `release.yml` |
   | Environment       | `npm-release` |

   Configure every package:

   - `css-jss`
   - `jss`
   - `jss-plugin-cache`
   - `jss-plugin-camel-case`
   - `jss-plugin-compose`
   - `jss-plugin-default-unit`
   - `jss-plugin-expand`
   - `jss-plugin-extend`
   - `jss-plugin-global`
   - `jss-plugin-isolate`
   - `jss-plugin-nested`
   - `jss-plugin-props-sort`
   - `jss-plugin-rule-value-function`
   - `jss-plugin-rule-value-observable`
   - `jss-plugin-template`
   - `jss-plugin-vendor-prefixer`
   - `jss-preset-default`
   - `jss-starter-kit`
   - `react-jss`

3. Keep normal branch protection and review requirements on `master`. Protect changes to
   `.github/workflows/` and `scripts/release.js` with maintainer review.
4. After the first successful trusted publication, revoke old npm publishing tokens and
   remove unused npm credentials from CI. In npm's publishing access settings, choose the
   option requiring 2FA and disallowing token publishing; trusted publishers remain usable.

The publishing job uses GitHub-hosted runners, Node 24, pinned npm 11.16.0 (trusted publishing
requires npm 11.5.1+), and `id-token: write`. npm exchanges the job's OIDC identity for a
short-lived publishing credential and generates provenance. No GitHub App, PAT, npm token,
or GitHub password is needed by these workflows.

## Prepare and review

Maintain the release notes under `## Next` in `changelog.md`. Prepare releases locally
from a clean, up-to-date `master` using Node 24 and pnpm 12.18.0:

```sh
pnpm install --frozen-lockfile
pnpm release:prepare patch
pnpm install --lockfile-only --ignore-scripts
pnpm install --frozen-lockfile
pnpm build
```

Use `patch`, `minor`, or `major` for stable releases; `prepatch`, `preminor`, or `premajor`
starts a prerelease sequence with the default `alpha` identifier, and `prerelease` advances it.
Preparation runs Lerna without committing, tagging, or publishing. Lerna uses its npm
client for versioning; pnpm updates `pnpm-lock.yaml` afterward.

Then format the changed files, create a release branch, and commit the version files,
changelog, lockfile, and package READMEs. Open a normal PR for human review of versions,
dependency changes, and release notes; let CI pass, then merge normally. Lerna does not
update peer dependency ranges automatically; review them separately.

## Publish

1. Run **Actions → Release → Run workflow** on `master`, entering the exact merged version.
2. Validation runs against the workflow's immutable commit, not a later branch tip:
   formatting, build, Flow/TypeScript/lint/size checks, unit/release/browser tests, and Node 10
   development/production consumer smoke tests. The smoke tests install the **same tarballs**
   that will be published.
3. Inspect the `npm-release` artifact and approve the protected environment deployment.
4. The publishing job installs no workspace dependencies and runs no lifecycle scripts.
   Its external runtime dependencies, `tinyexec` and `verkit`, are included in the artifact
   from the validation job's frozen-lockfile installation and resolved through `NODE_PATH`.
   It checks the artifact's commit, version, package list, and SHA-512 hashes, then publishes
   each tarball with public access, the appropriate dist-tag, and provenance.
5. Only after all packages are verified on npm does the final job create `v<VERSION>` and
   the GitHub Release from that version's changelog section. Prereleases are marked as such
   and explicitly excluded from latest selection. Stable releases omit `--latest`, leaving
   latest selection to GitHub's native automatic behavior.

A dry validation command is available without any credentials:

```sh
pnpm release:validate 10.10.0
pnpm test:release
```

Neither command publishes anything. There is no local publish command.

## Failure and recovery

npm publication is **not atomic across packages**: users may briefly see some new packages
before the others. The workflow serializes publications and never cancels an active release.

- If publication or finalization fails, use **Re-run failed jobs** on the original workflow
  run. This reuses its original commit and already-tested artifacts (retained for 30 days).
- Already-published versions are skipped only when their npm integrity matches the original
  tarball. A different artifact, registry error, conflicting Git tag, or newer npm dist-tag
  aborts the release rather than overwriting or silently continuing.
- Do not modify a release's source or rebuild it to work around a conflicting published
  archive. Investigate the mismatch and prepare a new version if needed. If artifacts have
  expired, stop and investigate rather than assuming a rebuild will be byte-identical.
- If all npm packages succeeded but GitHub release creation failed, rerun only failed jobs;
  tags and GitHub Releases are created idempotently.
- npm may make versions visible before their dist-tags update. Check all 19 packages after
  recovery. If a package exists with matching integrity but its tag is wrong, correct it
  through npm's authenticated maintainer tooling; OIDC publication does not republish an
  existing version merely to repair a tag.
- Before retrying an older run, ensure no newer version has been released. The npm guard
  rejects moving a newer tag backwards.

This workflow assumes all package names already exist on npm: its dist-tag lookup fails
for missing names. An entirely new package name needs an initial authenticated maintainer
publication before npm makes trusted-publisher configuration available. Bootstrap it
separately, before the coordinated release, without pre-publishing a conflicting archive
at the intended release version. Keep bootstrap credentials out of these workflows, then
configure the new package's trusted publisher before it joins a release. Update the package
list above whenever workspace membership changes.
