# Super Harness progress

## Current implementation

- Windows checkout: `C:/tmp/SH-UI/Super-Harness`. GitHub's default feature branch and the local base both resolved to `b670270f9727fd4c71f9b965db253919178a1e2a` on 2026-11-20. This work uses `feat/beautiful-ui-source-fidelity`.
- The author checkout at `44a274e598395ab61e7c96c26fda2758780253b7` supplied all 21 demos for the development-only `/dev/components` route. The existing ten fixtures remain at `/dev/examples`. See [the source and browser audit](COMPONENT_AUDIT.md).
- UI Skills is enabled in Codex. An ephemeral native Codex session successfully retrieved its `improve-ui` and `fixing-motion-performance` skills. Impeccable 4.10.0 is installed locally and its audit and polish guidance are in use.
- Phase 1 browser tests passed in Edge at 1440px and 390px, including approval navigation and the Agent Screen viewer. Lint passed with six preserved vendor-directive warnings and the production build passed. Captures are in `screenshots/original-components-{desktop,mobile}.png`.
- Phase 2 connects the original Prompt Bar adaptation to local session state and includes command filtering, draft previews, split workspace, a compact tool trace and live appearance controls. Browser checks at both widths verified the empty, active and split routes, independent drafts across reload, and preference changes.
- Phase 3 adds the Decision Brief with a persistent interview, chart, editable table, original Flowchart, isolated preview and local approval. The Study lab has an NFA stepper. The workbench now imports the original Records Table and Selection Actions.
- Remaining: verify the final selected extensions, document all 48 statuses, run the complete desktop and mobile suite, and publish the verified feature branch. The phase checkpoints are local commits.

## Previous handoff

### Branch and remote

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
