# Beautiful UI installation audit

The development gallery at `/dev/components` loads the author's 21 interactive demos from [Beautiful UI commit `44a274e`](https://github.com/slev12397/beautiful-ui/tree/44a274e598395ab61e7c96c26fda2758780253b7). It uses the original shared atoms, gallery catalog, CSS, keyframes and shadow tokens. Inter Variable and JetBrains Mono Variable are bundled locally. The preserved MIT notice is in `src/beautiful/LICENSE`.

| Original component | Installed source under `src/beautiful/components/primitives/` | Visual check |
| --- | --- | --- |
| Loading State | `LoadingState.tsx` | Desktop and mobile. Drive, Dots, Orbit, Surfer. |
| Thinking | `ThinkingState.tsx` | Desktop and mobile. Steps, Reasoning, Search, Coding. |
| Streaming Text | `StreamingText.tsx` | Desktop and mobile. Stream and source chips. |
| Approval Card | `ApprovalCard.tsx` | Desktop and mobile. Original questionnaire. |
| Tool Chips | `ToolChips.tsx` | Desktop and mobile. Staged tool trace. |
| Task Rows | `TaskRows.tsx` | Desktop and mobile. Capsules and List. |
| Chat | `ChatComposer.tsx` | Desktop and mobile. Tabbed chat and inline composer. |
| Prompt Bar | `PromptBar.tsx` | Desktop and mobile. Rounded and Pill. |
| Recommendation Card | `RecommendationCard.tsx` | Desktop and mobile. Recommendation and alternatives control. |
| Context Cards | `ContextCards.tsx` | Desktop and mobile. Source and excerpt layout. |
| Diff Table | `DiffTable.tsx` | Desktop and mobile. Proposed edit rows. |
| Records Table | `RecordsTable.tsx` | Desktop and mobile. Original scrollable table. |
| Filter Table | `FilterTable.tsx` | Desktop and mobile. Original status controls. |
| Sidebar Nav | `SidebarNav.tsx` | Desktop and mobile. Lucide replaces the commercial icon imports. |
| Search | `SearchList.tsx` | Desktop and mobile. Live filter and suggestions. |
| Flowchart | `Flowchart.tsx` | Desktop and mobile. Trigger and condition nodes. |
| Insight Cards | `InsightCards.tsx` | Desktop and mobile. Original Liveline chart. |
| Code Block | `CodeBlock.tsx` | Desktop and mobile. Code and Diff. |
| Fine-tune Card | `FineTuneCard.tsx` | Desktop and mobile. Inspector and adjustable fields. |
| Selection Actions | `SelectionActions.tsx` | Desktop and mobile. A gallery-only clip margin gives the anchored toolbar room at 390px. |
| Agent Screen | `AgentScreen.tsx` | Desktop and mobile. Working and Loading with the genuine bundled screen image. |

All 21 sources were obtained. After normalizing line endings, 20 files match the source checkout exactly. The Sidebar Nav changes are limited to the openly licensed icon equivalents. Agent Screen comes from the repository because the published registry indexes only 20 showcase entries. The reusable `src/beautiful/globals.css` matches the author's file.

Browser captures compared all 21 cards with the public author gallery in light mode at 1440px and 390px. Timed demos advance independently, so captured frames show different points in the same animations. The gallery uses Super Harness framing. The patched app retains its pinned Glimm version from the existing project. Surfer retains the original author-hosted video URL and needs network access for that asset.

Gallery checks passed on both viewports. They cover all cards, declared variant switches, the two font families, approval navigation, Prompt Bar input, Agent Screen's simulated recording controls, page errors, and viewport overflow. [Desktop screenshot](screenshots/original-components-desktop.png) · [Mobile screenshot](screenshots/original-components-mobile.png). `/dev/examples` retains the existing ten local fixture demonstrations. The original gallery is excluded from production builds.

Impeccable's rendered scan flagged low-contrast captions, component cards inside gallery preview frames, and animation in the loading demo. The gallery captions now use the author's darker text token. The component colors, loader and frames preserve the reference. This is a source-fidelity check and does not certify accessibility for the original demos.
