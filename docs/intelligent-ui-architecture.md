# Intelligent UI runtime

The runtime renders a JSON-like description through a closed React component registry. Import `IntelligentUI` from `src/runtime` and pass `{ definition, sessionId, instanceId }`; the optional `onEvent` callback receives typed user events. The exported TypeScript schema is `UINode` / `UIChild`, with a union for each supported node kind. `validateDefinition(unknown)` returns a safe, normalized tree before rendering.

## Nodes

Layout nodes: `stack`, `column`, `row`, `grid`, `card`, `panel`, `group`, `section`, `form`, and `steps`. Their `children` (or `items`) may be nested arrays, nodes, strings, or numbers. Text nodes: `text`, `heading`, `title`, `caption`, `paragraph`, `clarify`, and `feedback`. Form controls: `input`, `text-input`, `textarea`, `code`, `number`, `range`, `choice`, `select`, and `checkbox`. Actions and dynamic content: `button`, `action`, `conditional`, `reveal`, and the bundled widget enum (`badge`, `callout`, `metric`, `progress`, `divider`). Controls use `id`, `prompt`/`label`, `value`, and relevant native attributes such as `min`, `max`, `step`, `required`, and `placeholder`. Choices accept strings, numbers, or `{ label, value }` options.

Output nodes include `chart` (labeled numeric points and a local numeric binding), `table` (columns, rows, and optionally editable cells), `diagram` (ordered steps using Beautiful UI’s Flowchart), `artifact` (escaped text), `mini-app` (a sandboxed text preview bound to local state), and `approval` (a Beautiful UI approval card for a simulated decision). Open **Build a decision brief** to see the same response render interview lengths of 1, 5, and 12, apply a demand factor to a chart, edit a table, preview a draft and record a local decision.

The study schema `{ kind: 'choice'|'text'|'code'|'steps'|'clarify', id, prompt, options?, placeholder?, answer?, feedback? }` is supported. `kind` is normalized to `type`. Text with a placeholder or answer becomes an editable input; code is an editable plain textarea; choice is a radio group.

## Validation and trust boundary

Validation copies known props and structured chart, table and diagram data into a closed set of node types. Unrecognized nodes become plain text. Cycles and content past 40 levels become readable markers. Arrays accept up to 500 siblings, and numeric series, table cells and option lists have their own limits. The renderer evaluates conditions against local values. Code fields are textareas. The mini-app preview escapes draft text before inserting it into an iframe with an empty sandbox and a default-deny content security policy. It loads no external content and runs no JavaScript.

## State and events

Values, table edits and completion state persist under keys scoped to the session and response instance. Forms use native required-field validation and render a summary of currently applicable answers. Edit preserves answers, and Start over clears that form’s own fields. `form.submit` records a user's clarification. `approval.decide` records a separate simulated decision. Events also include `control.change`, `choice.select`, `control.toggle`, `reveal.toggle`, and `button.submit`, each scoped to the session and response instance.
