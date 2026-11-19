# Super Harness

Super Harness is a browser-local workbench for conversations, study, project runs, research, and simulated voice sessions. Its ten examples combine fixture playback, a declarative UI runtime, and native React components.

```sh
npm ci
npm run dev -- --port 4173
```

Open [the local preview](http://127.0.0.1:4173/). Start with **Learn a concept**, or choose **Thinking in systems** for a conversation with an editable query, comparison controls, an architecture diagram, and a local approval. All examples are available at `/dev/components`.

```sh
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

Browser tests use the running preview and Chromium. See the [frontend handoff](docs/frontend-handoff.md), [component manifest](docs/component-manifest.md), and [resume notes](PROGRESS.md).
