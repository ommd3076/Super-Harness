# Intelligent UI runtime

The runtime accepts a vendor neutral JSON-like definition and turns it into a small, fixed set of React controls. Import `IntelligentUI` from `src/runtime` and pass `{ definition, sessionId, instanceId }`. An optional `onEvent` receives `{ type, nodeId, value, sessionId, instanceId }` for user changes and actions.

## Definition contract

Each node is a plain object with a `type` (or `kind`) string. Container nodes (`stack`, `column`, `row`, `grid`, `card`, `panel`, `group`, `section`, `form`, `steps`) contain nested `children` (or `items`) arrays. Children can be nested to arbitrary practical depth and can also be strings or numbers. Every node can have an `id`; when omitted, its structural position is used as a local state key.

Supported presentation nodes include `text`, `heading`, `title`, `caption`, `paragraph`, `clarify`, `feedback`. Controls include `input`, `textarea`, `code`, `choice`, `select`, `checkbox`, `button`, and `action`. Nodes can use `prompt`, `label`, `text`, `placeholder`, and `value` as appropriate. Choice `options` are strings/numbers or `{ label, value }` objects. `code` renders an editable plain textarea; it never executes code.

The task oriented study schema is also accepted: `{ kind: 'choice'|'text'|'code'|'steps'|'clarify', id, prompt, options?, placeholder?, answer?, feedback? }`. `choice`, `text`, and `code` become interactive controls when they contain corresponding answer/options data. `steps` can carry children. Model returned data should be validated by the host before being supplied.

## State and events

Input values are keyed by both `sessionId` and `instanceId` in local storage, so separate instances do not overwrite one another. A change emits `change`; selecting a choice emits `select`; a button emits `submit` by default (or its declared `event`). The event includes the node identifier and current value. Host applications may forward these events to their own state layer. Avoid sensitive information in persisted control values.

## Trust boundary

Definitions are data only. The renderer uses a closed allowlist of built in components and never evaluates strings, HTML, scripts, URLs, arbitrary component names, or model supplied executable content. Unknown elements degrade to readable text. No network requests, tools, production services, or external actions are initiated by the runtime. Any externally consequential behavior belongs to the integrating host and should validate the emitted event independently.
