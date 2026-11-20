# Super Harness

Super Harness is a browser-local workbench for conversations, study, project runs, research, and simulated voice sessions. Its examples combine fixture playback, a declarative UI runtime, and original Beautiful UI components.

```sh
npm ci
npm run dev -- --port 4173
```

Open [the local preview](http://127.0.0.1:4173/). Search for **Build a decision brief** to try the conditional interview, demand scenario, editable criteria, draft history and approval. **Thinking in systems** opens the mixed response and report workbench. The development server exposes the 21 original Beautiful UI demos at `/dev/components` and the local scenarios at `/dev/examples`.

```sh
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

Browser tests use the running preview and Chromium or Edge. See the [installation audit](COMPONENT_AUDIT.md), [48-extension status](docs/selected-extensions.md), and [progress](PROGRESS.md).
