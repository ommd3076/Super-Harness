const states = ['start', 'A', 'A₁', 'A₂', 'B', 'B₁', 'B₂'] as const;
type State = typeof states[number];
type Symbol = 'a' | 'b';

const edges: Record<State, Partial<Record<Symbol | 'ε', readonly State[]>>> = {
  start: { ε:['A','B'] },
  A: { a:['A','A₁'], b:['A'] },
  'A₁': { b:['A₂'] },
  'A₂': {},
  B: { a:['B'], b:['B','B₁'] },
  'B₁': { b:['B₂'] },
  'B₂': { a:['B₂'], b:['B₂'] },
};
const accepting = new Set<State>(['A₂','B₂']);

function closure(input: Iterable<State>) {
  const expanded = new Set(input);
  for (const state of expanded) for (const next of edges[state].ε ?? []) expanded.add(next);
  return expanded;
}

export function Nfa({ input, position, onInput, onStep }: {
  input: string;
  position: number;
  onInput: (value: string) => void;
  onStep: (position: number) => void;
}) {
  const step = Math.min(position, input.length);
  const history = [closure(['start'])];
  for (const symbol of input.slice(0, step)) {
    const previous = history.at(-1)!;
    history.push(closure([...previous].flatMap(state=>edges[state][symbol as Symbol] ?? [])));
  }
  const active = history.at(-1)!;
  const accepted = [...active].some(state=>accepting.has(state));
  return <div className="nfa-machine">
    <p>A accepts strings ending in <code>ab</code>. B accepts strings containing <code>bb</code>. The start state enters both branches without consuming a symbol.</p>
    <label className="nfa-input">Try a string
      <input placeholder="ab or abb" value={input} onChange={event=>onInput(event.target.value.replace(/[^ab]/g,'').slice(0,120))}/>
    </label>
    <div className="nfa-actions">
      <button type="button" disabled={step===0} onClick={()=>onStep(step-1)}>Previous</button>
      <button type="button" disabled={step===input.length} onClick={()=>onStep(step+1)}>Step NFA</button>
      <button type="button" disabled={step===input.length} onClick={()=>onStep(input.length)}>Run to end</button>
    </div>
    <div className="nfa-states" aria-label="Machine states">
      {states.map(state=><span key={state} data-active={active.has(state)} data-accepting={accepting.has(state)}>{state}</span>)}
    </div>
    <p role="status" className="nfa-result">
      Step {step} of {input.length} · Active: {[...active].join(', ') || 'none'}
      {step===input.length ? ` · ${accepted ? 'Accepted' : 'Rejected'}` : ''}
    </p>
    <details><summary>Transition table</summary><table>
      <thead><tr><th scope="col">State</th><th scope="col">ε</th><th scope="col">a</th><th scope="col">b</th></tr></thead>
      <tbody>{states.map(state=><tr key={state}>
        <th scope="row">{state}</th>{(['ε','a','b'] as const).map(symbol=><td key={symbol}>{edges[state][symbol]?.join(', ') ?? '—'}</td>)}
      </tr>)}</tbody>
    </table></details>
  </div>;
}
