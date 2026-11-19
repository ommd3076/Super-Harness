# Super Harness frontend handoff

Run `npm ci` and `npm run dev -- --port 4173`. Open `http://127.0.0.1:4173/` in the same environment. Use `npm run lint`, `npm run typecheck`, and `npm run build` to verify the project. Vite writes the static build to `dist/`. The host should serve `index.html` for client routes.

| Route | Surface |
| --- | --- |
| `/` | Chat, Study, Workspace, Research, and Live share a tabbed shell. |
| `/dev/components` | Developer-only entry in navigation policy, with interactive fixture previews. It is a public route if the static app is hosted publicly. |

Workspace search opens conversations and bundled examples. The composer supports drafts, model labels, example tools, local attachment names, and fixture playback. Study exercises evaluate answers locally. Workspace runs, its browser preview, and approvals use synthetic state. Research uses bundled datasets. Live uses local animation and transcript playback. Settings are stored in the browser.

The main integration points are `src/session.ts` for session data, `src/Scene.tsx` for choosing local fixtures, and `src/runtime/` for declarative UI and events. A future host adapter can supply response blocks and consume validated UI events after applying its authorization logic. The frontend accepts only declarative data and UI actions are scoped to local state.
