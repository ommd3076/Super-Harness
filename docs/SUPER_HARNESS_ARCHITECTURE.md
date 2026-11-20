# Super-Harness Architecture & Runtime Specification

## 1. System Overview
Super-Harness provides an interactive local-first AI development harness combining:
- Beautiful UI primitive gallery
- Dynamic workbench report visualizer
- Interactive prompt bar with WebGL celebrate sweep shader
- Persistent split sessions and approval cards

## 2. Component Hierarchy
- `src/App.tsx`: Root application shell and view selector
- `src/beautiful/components/primitives/`:
  - `AgentScreen.tsx`: Viewport and media stream rendering
  - `ApprovalCard.tsx`: Decision gating and review cards
  - `PromptBar.tsx`: Contextual prompt composer with shader support
  - `StreamingText.tsx`: Tokenized streaming typography
  - `RecordsTable.tsx`: Tabular execution log and telemetry viewer
- `src/beautiful/components/workbench/`:
  - `ReportWorkbench.tsx`: Interactive report exploration
