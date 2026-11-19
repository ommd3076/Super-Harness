# Super Harness progress

## Branch and remote

- The checkout is `/workspace/super-harness`. The active branch is `feat/super-harness-ui-foundation`.
- The user supplied [ommd3076/Super-Harness](https://github.com/ommd3076/Super-Harness). The installation reports push access. Git reached the empty remote and accepted a branch-creation dry run.
- To verify the published revision, compare `git rev-parse HEAD` with `git ls-remote origin refs/heads/feat/super-harness-ui-foundation`.

## Implemented

- React, TypeScript and Vite shell with browser-local tabs, conversation history, drafts, model preferences, settings and inspector.
- Typed declarative runtime with validated nested layouts, controls, events, per-message state and a fixed bundled widget vocabulary.
- Ten bundled examples across Chat, Study, Workspace and Research, plus a local Live simulation. Source component provenance is tracked in [the manifest](docs/component-manifest.md).
- Cloud Vite server runs on port 4173. Headless Chromium scenarios and viewport screenshots use `npm run test:browser`.

## Resume

Run `npm ci`, start the preview with `npm run dev -- --port 4173`, then run lint, typecheck, build and browser tests. Verify the remote branch after each push. Review `docs/component-manifest.md` for source production coverage. All demo data and actions stay in browser state. External service adapters are future work.

## Verified handoff

- Lint, typecheck and production build pass. Chromium reported 5 passing tests and 3 viewport-specific skips. Both desktop and mobile mounted all ten examples. The DFA accepted `aabb`, and changing the Market Monitor period updated the chart path.
- Desktop and mobile screenshots are in `screenshots/`. The preview is on `http://127.0.0.1:4173/` inside the Cloud desktop. This environment provides no forwarded preview URL.
- All 21 Beautiful UI sources are archived. The app uses 18 upstream implementations, two local equivalents, and its own sidebar. See the manifest for exact component scope and dependencies.
- Remaining source fidelity work, if needed, is to adapt the archived Records Table, Selection Actions, and Sidebar Nav. The dedicated branch tracks `origin/feat/super-harness-ui-foundation`.
