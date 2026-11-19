# Beautiful UI component manifest

Source checked 2026-11-19. The official registry is [`references/beautiful-ui/registry.json`](../references/beautiful-ui/registry.json), captured from [beautifului.dev/r/registry.json](https://www.beautifului.dev/r/registry.json). Per-component shadcn registry payloads and unpacked upstream file contents are retained under [`references/beautiful-ui/`](../references/beautiful-ui/). The upstream GitHub snapshot is [`slev12397/beautiful-ui`](https://github.com/slev12397/beautiful-ui), branch `main`, tree `44a274e598395ab61e7c96c26fda2758780253b7`; its MIT license text is included as `references/beautiful-ui/LICENSE`.

The repository license is MIT (copyright Shane Levine, 2026); preserve its notice for copied substantial portions. Registry JSON itself omits license metadata. The harness is a live demo at [beautifului.dev/harness](https://www.beautifului.dev/harness), and its original route source is also captured. Registry payloads are the source of truth for direct-installable assets; captured GitHub files fill gaps. “Original available” means upstream file is captured verbatim; it does not imply integrated into this harness.

| Requested component | Registry item | Upstream original | Variants / notes |
|---|---|---|---|
| Loading State | `loading-state` | `components/primitives/LoadingState.tsx` | Registry component |
| Thinking | `thinking-state` | `components/primitives/ThinkingState.tsx` | Registry component |
| Streaming Text | `streaming-text` | `components/primitives/StreamingText.tsx` | Separate atomic `stream-text` also exists |
| Approval Card | `approval-card` | `components/primitives/ApprovalCard.tsx` | Registry component |
| Tool Chips | `tool-chips` | `components/primitives/ToolChips.tsx` | Registry component |
| Task Rows | `task-rows` | `components/primitives/TaskRows.tsx` | Registry component |
| Chat | `chat-composer` | `components/primitives/ChatComposer.tsx` | Registry label Chat; source name ChatComposer |
| Prompt Bar | `prompt-bar` | `components/primitives/PromptBar.tsx` | Registry component |
| Recommendation Card | `recommendation-card` | `components/primitives/RecommendationCard.tsx` | Registry component |
| Context Cards | `context-cards` | `components/primitives/ContextCards.tsx` | Registry component |
| Diff Table | `diff-table` | `components/primitives/DiffTable.tsx` | Registry component |
| Records Table | `records-table` | `components/primitives/RecordsTable.tsx`, plus `app/beautifui/records-table.css` | Registry component + stylesheet |
| Filter Table | `filter-table` | `components/primitives/FilterTable.tsx` | Registry component |
| Sidebar Nav | `sidebar-nav` | `components/primitives/SidebarNav.tsx`, plus `app/beautifui/sidebar-nav.css` | Registry component + stylesheet |
| Search | `search` | `components/primitives/SearchList.tsx` | Registry label Search; source name SearchList |
| Flowchart | `flowchart` | `components/primitives/Flowchart.tsx` | Registry component |
| Insight Cards | `insight-cards` | `components/primitives/InsightCards.tsx` | Registry component |
| Code Block | `code-block` | `components/primitives/CodeBlock.tsx` | Registry component |
| Fine-tune Card | `fine-tune-card` | `components/primitives/FineTuneCard.tsx` | Registry component |
| Selection Actions | `selection-actions` | `components/primitives/SelectionActions.tsx` | Registry component |
| Agent Screen | — | `components/primitives/AgentScreen.tsx` | Present in GitHub source, absent from registry; not an installable registry item |

The registry also provides foundation styles and reusable UI primitives (`button`, `glide-menu`, `entity-chip`, `value-pill`, `shimmer`, `stream-text`). These appear in the downloaded registry and source snapshot but are not additional entries in the requested component list. Per-item dependencies are recorded in each captured registry JSON. Several components expose configurable props or visual states; registry metadata does not define standardized “variants,” so the original source is retained rather than inventing a variant taxonomy.

## Harness integration status

This harness imports seven components directly from `src/upstream/ReferenceKit.tsx` and uses them in the local service measurement demo: Code Block, Context Cards, Approval Card, Task Rows, Tool Chips, Loading State, and Streaming Text. Seven additional captured components are composed in `src/upstream/ReportTools.tsx` as the named `UpstreamReportTools` export: Thinking State, Recommendation Card, Diff Table, Filter Table, Search List, Flowchart, and Fine-tune Card. Their examples use local service measurement fixtures and do not make external requests. Existing upstream primitive dependencies (Button, EntityChip, ValuePill, GlideMenu and foundation styles) remain imported locally where required.

The component inventory above contains 21 requested components. At this integration checkpoint 14 are used in the harness; 7 remain unintegrated: Chat Composer, Prompt Bar, Records Table, Sidebar Nav, Insight Cards, Selection Actions, and Agent Screen. Agent Screen is source-only and absent from the registry. Integration counts describe usage in the harness, not source availability or dependency count.
