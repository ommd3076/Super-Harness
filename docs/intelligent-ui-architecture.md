+# Intelligent UI runtime

The runtime renders a JSON-like description through a closed React component registry. Import `IntelligentUI` from `src/runtime` and pass `{ definition, sessionId, instanceId }`; the optional `onEvent` callback receives typed user events. The exported TypeScript schema is `UINode` / `UIChild`, with a union for each supported node kind. `validateDefinition(unknown)` returns a safe, normalized tree before rendering.

## Nodes

Layout nodes: `stack`, `column`, `row`, `grid`, `card`, `panel`, `group`, `section`, `form`, and `steps`. Their `children` (or `items`) may be nested arrays, nodes, strings, or numbers. Text nodes: `text`, `heading`, `title`, `caption`, `paragraph`, `clarify`, and `feedback`. Form controls: `input`, `text-input`, `textarea`, `code`, `number`, `range`, `choice`, `select`, and `checkbox`. Actions and dynamic content: `button`, `action`, `conditional`, `reveal`, and the bundled widget enum (`badge`, `callout`, `metric`, `progress`, `divider`). Controls use `id`, `prompt`/`label`, `value`, and relevant native attributes such as `min`, `max`, `step`, `required`, and `placeholder`. Choices accept strings, numbers, or `{ label, value }` options.

The study schema `{ kind: 'choice'|'text'|'code'|'steps'|'clarify', id, prompt, options?, placeholder?, answer?, feedback? }` is supported. `kind` is normalized to `type`. Text with a placeholder or answer becomes an editable input; code is an editable plain textarea; choice is a radio group.

## Validation and trust boundary

Validation copies only known scalar props, drops unsupported executable values, bounds display strings and option text, and maps unknown component names to plain text. Cyclic references are replaced with a readable marker. To prevent excessive recursive nesting, content beyond 40 levels is replaced with a marker; this does not cap the number of questions or sibling nodes. The runtime never evaluates HTML, scripts, expressions, model-provided URLs, or component names. Code fields are textareas and do not execute code. It sends no network requests and invokes no external actions.

## State and events

Control state is stored in local storage under a key scoped to both `sessionId` and `instanceId`; radio names are instance scoped as well. Keep sensitive values out of persisted forms. Each callback event has `{ type, status: 'accepted', nodeId, value?, sessionId, instanceId, occurredAt }`. Event types are fixed: `control.change`, `choice.select`, `control.toggle`, `reveal.toggle`, `form.submit`, and `button.submit`. Button and form submissions show local submitted status. Hosts should independently validate events before using them to trigger any consequential behavior.
