import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronRight, CircleHelp, LockKeyhole, RotateCcw, Sparkles } from 'lucide-react';
import './styles.css';

export const studyScenes = [
  { id: 'dfa', title: 'A small automaton', description: 'Trace a DFA that recognizes strings ending in abb.' },
  { id: 'rsa', title: 'RSA, one step at a time', description: 'Work through a tiny RSA example with guided arithmetic.' },
  { id: 'code', title: 'Rebuild the route', description: 'Reconstruct an Express and Mongoose endpoint from its parts.' },
  { id: 'assessment', title: 'Name the value', description: 'Infer a variable’s type from the evidence in a program.' },
  { id: 'clarification', title: 'Ask before assuming', description: 'Resolve an underspecified request with one useful question.' },
] as const;

type SceneId = (typeof studyScenes)[number]['id'];
type Saved = { answers: Record<string, string>; complete: boolean };
const blank: Saved = { answers: {}, complete: false };

function load(sessionId: string, scene: string): Saved {
  try { return JSON.parse(localStorage.getItem(`study:${sessionId}:${scene}`) || 'null') || blank; }
  catch { return blank; }
}

export function Study({ sessionId, scene }: { sessionId: string; scene?: string }) {
  const selected = studyScenes.find((item) => item.id === scene)?.id ?? 'dfa';
  const [active, setActive] = useState<SceneId>(selected);
  const [saved, setSaved] = useState<Saved>(() => load(sessionId, selected));
  useEffect(() => { setActive(selected); }, [selected]);
  useEffect(() => { setSaved(load(sessionId, active)); }, [sessionId, active]);
  useEffect(() => { localStorage.setItem(`study:${sessionId}:${active}`, JSON.stringify(saved)); }, [sessionId, active, saved]);

  const answer = (key: string) => saved.answers[key] || '';
  const setAnswer = (key: string, value: string) => setSaved((current) => ({ ...current, answers: { ...current.answers, [key]: value }, complete: false }));
  const reset = () => { setSaved(blank); };
  const current = useMemo(() => studyScenes.find((item) => item.id === active)!, [active]);
  const check = (ok: boolean) => setSaved((current) => ({ ...current, complete: ok }));
  return <main className="study-shell">
    <header className="study-top"><div className="study-brand"><span className="study-mark"><Sparkles size={17}/></span><span>Fieldnotes <i>·</i> Study lab</span></div><span className="study-session"><span className="session-dot"/> SESSION SAVED</span></header>
    <div className="study-layout">
      <aside className="study-rail"><p className="eyebrow">LEARNING PATH</p><h2>Make it<br/>make sense.</h2><p className="rail-copy">Short, focused exercises that turn abstract ideas into working intuition.</p><nav aria-label="Study scenes">{studyScenes.map((item, i) => <button key={item.id} className={`scene-link ${active === item.id ? 'is-active' : ''}`} onClick={() => setActive(item.id)}><span className="scene-num">0{i + 1}</span><span>{item.title}</span><ChevronRight size={15}/></button>)}</nav><div className="rail-note"><LockKeyhole size={15}/><span>Your progress stays on this device and session.</span></div></aside>
      <section className="study-main"><div className="scene-heading"><div><p className="eyebrow">INTERACTIVE EXERCISE <span>·</span> 6 MIN</p><h1>{current.title}</h1><p>{current.description}</p></div><button className="reset-button" onClick={reset} title="Reset this exercise"><RotateCcw size={15}/> Reset</button></div>
        {active === 'dfa' && <Dfa answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'rsa' && <Rsa answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'code' && <CodeTask answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'assessment' && <Assessment answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'clarification' && <Clarification answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        <footer className="study-footer"><span>FIELDNOTES / FOUNDATIONS</span><span>{String(studyScenes.findIndex((x) => x.id === active) + 1).padStart(2, '0')} — 05</span></footer>
      </section>
    </div>
  </main>;
}

type Props = { answer: (key: string) => string; setAnswer: (key: string, value: string) => void; check: (ok: boolean) => void; complete: boolean };
function Panel({ children, title, label }: { children: React.ReactNode; title: string; label: string }) { return <article className="exercise-card"><div className="card-kicker"><span>{label}</span><span>01 / 01</span></div><h2>{title}</h2>{children}</article>; }
function Feedback({ complete, correct, text }: { complete: boolean; correct: boolean; text: string }) { return <div className={`feedback ${complete ? (correct ? 'good' : 'bad') : ''}`}>{complete ? <><span className="feedback-icon">{correct ? <Check size={15}/> : <CircleHelp size={15}/>}</span>{text}</> : <><span className="feedback-icon"><CircleHelp size={15}/></span>Take a guess. You can revise it as you go.</>}</div>; }
function Submit({ onClick, label = 'Check answer' }: { onClick: () => void; label?: string }) { return <button className="submit-button" onClick={onClick}>{label}<ArrowRight size={16}/></button>; }
function OptionList({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) { return <div className="option-list">{options.map((option, i) => <button key={option} onClick={() => onChange(option)} className={`option ${value === option ? 'selected' : ''}`}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{value === option && <Check size={16}/>}</button>)}</div>; }

function Dfa({ answer, setAnswer, check, complete }: Props) {
  const [input, setInput] = useState('');
  const [trace, setTrace] = useState<number[]>([0]);
  const states = ['q₀', 'q₁', 'q₂', 'q₃'];
  const transition = (q: number, c: string) => c === 'a' ? [1, 1, 1, 1][q] : [0, 2, 3, 0][q];
  const run = () => { let q = 0; const path = [q]; for (const c of input) { q = transition(q, c); path.push(q); } setTrace(path); };
  return <Panel label="AUTOMATA THEORY" title="Which strings should this machine accept?"><p className="prompt">This DFA accepts exactly the strings over <b>{'{a, b}'}</b> that end in <code>abb</code>. Trace a sample, then choose the string it accepts.</p>
    <div className="dfa-card"><div className="dfa-visual"><div className="start-arrow">START <ArrowRight size={17}/></div>{states.map((state, i) => <div key={state} className={`dfa-state ${i === 3 ? 'accepting' : ''} ${trace.at(-1) === i ? 'current' : ''}`}><span>{state}</span>{i === 3 && <small>accept</small>}</div>)}</div><div className="dfa-caption">State tracks the longest suffix that is also a prefix of <code>abb</code>.</div></div>
    <div className="trace-row"><label htmlFor="dfa-input">TRY A STRING</label><input id="dfa-input" value={input} onChange={(e) => setInput(e.target.value.replace(/[^ab]/g, ''))} placeholder="e.g. aabb"/><button onClick={run}>Trace <ArrowRight size={14}/></button></div>{trace.length > 1 && <p className="trace-result">Path: {trace.map((q) => states[q]).join(' → ')} <span>· {trace.at(-1) === 3 ? 'accepted' : 'not accepted'}</span></p>}
    <div className="question-block"><p className="question-label">Choose the string that ends in <code>abb</code>.</p><OptionList value={answer('dfa')} onChange={(v) => setAnswer('dfa', v)} options={['ababa', 'aabb', 'babab', 'abba']}/><div className="action-row"><Feedback complete={complete} correct={answer('dfa') === 'aabb'} text={answer('dfa') === 'aabb' ? 'Exactly. The final two b’s complete the abb suffix.' : 'Not quite. Follow the final three symbols.'}/><Submit onClick={() => check(answer('dfa') === 'aabb')}/></div></div>
  </Panel>;
}

function Rsa({ answer, setAnswer, check, complete }: Props) {
 const stages = ['Choose primes', 'Find n and φ(n)', 'Choose e', 'Find d'];
 const vals = [answer('rsa1'), answer('rsa2'), answer('rsa3'), answer('rsa4')];
 return <Panel label="PUBLIC KEY CRYPTOGRAPHY" title="Build a tiny RSA key by hand."><p className="prompt">Use <b>p = 5</b> and <b>q = 11</b>. We will keep the numbers small so you can see how each part fits together.</p><div className="rsa-summary"><div><small>PRIMES</small><strong>p = 5 <i>·</i> q = 11</strong></div><div><small>PUBLIC KEY</small><strong>(e, n)</strong></div><div><small>PRIVATE KEY</small><strong>(d, n)</strong></div></div>{stages.map((s, i) => <div className={`rsa-step ${vals[i] ? 'answered' : ''}`} key={s}><div className="step-index">{vals[i] ? <Check size={14}/> : `0${i + 1}`}</div><div className="step-content"><label>{s}</label><p>{['The primes are supplied for this example.', 'Compute n = p × q and φ(n) = (p − 1)(q − 1).', 'Pick a number coprime to φ(n), greater than 1.', 'Find d such that e × d leaves remainder 1 when divided by φ(n).'][i]}</p>{i === 0 ? <div className="step-answer static">5 and 11 <span>given</span></div> : <input className="step-answer" value={vals[i] || ''} onChange={(e) => setAnswer(`rsa${i + 1}`, e.target.value)} placeholder={['','n, φ(n)','e (for example 3)','d'][i]} />}</div></div>)}<div className="action-row"><Feedback complete={complete} correct={vals[1] === '55, 40' && vals[2] === '3' && vals[3] === '27'} text="Good work. 3 × 27 = 81, which is 1 mod 40."/><Submit onClick={() => check(vals[1]?.replace(/\s/g, '') === '55,40' && vals[2] === '3' && vals[3] === '27')} label="Check key"/></div></Panel>;
}

function CodeTask({ answer, setAnswer, check, complete }: Props) { const choices=['app.get("/users/:id", async (req, res) => {','const user = await User.findById(req.params.id);','if (!user) return res.status(404).json({ error: "Not found" });','return res.json(user);']; let picked: string[]=[]; try { picked=JSON.parse(answer('code') || '[]'); } catch { picked=[]; } const sequence=choices; const toggle = (line: string) => { const next = picked.includes(line) ? picked.filter((x)=>x!==line) : [...picked, line]; setAnswer('code', JSON.stringify(next)); }; return <Panel label="BACKEND PATTERNS" title="Put the endpoint back together."><p className="prompt">A client requests <code>GET /users/42</code>. Arrange the pieces into an Express route that looks up a MongoDB user and returns it.</p><div className="code-surface"><div className="code-bar"><span/><span/><span/><b>routes/users.js</b><i>JavaScript</i></div><pre><code><span className="code-purple">import</span> {'{'} User {'}'} <span className="code-purple">from</span> <span className="code-green">'../models/User.js'</span>;{'\n\n'}<span className="code-muted">// click lines below in order</span>{'\n'}{picked.length ? picked.map((x,i)=><span key={x} className="code-line">{i + 1}  {x}{'\n'}</span>) : <span className="code-blank">Your route will appear here…</span>}</code></pre></div><p className="question-label">Add each line in the order it should run.</p><div className="option-list code-options">{choices.map((line,i)=><button key={line} onClick={()=>toggle(line)} className={`option ${picked.includes(line)?'selected':''}`}><span className="option-letter">{picked.includes(line)?picked.indexOf(line)+1:String.fromCharCode(65+i)}</span><code>{line}</code>{picked.includes(line)&&<Check size={16}/>}</button>)}</div><div className="action-row"><Feedback complete={complete} correct={picked.join('|')===sequence.join('|')} text="Start with the route, await the query, handle a missing record, then send it."/><Submit onClick={() => check(picked.join('|')===sequence.join('|'))} label="Check order"/></div></Panel>; }

function Assessment({ answer, setAnswer, check, complete }: Props) { const literal = answer('assessValue') || '"hello"'; const inferred = literal === 'true' || literal === 'false' ? 'boolean' : /^-?\d+(\.\d+)?$/.test(literal) ? 'number' : /^\[.*\]$/.test(literal) ? 'string[]' : 'string'; const code=`const greeting = "hello";\nconst count = 3;\nconst ready = count > 0;\nconst value = ${literal};`; return <Panel label="TYPES & INFERENCE" title="Read the value, infer the type."><p className="prompt">A type checker infers a variable’s type from its value. Edit the last line, then predict the type TypeScript will infer.</p><div className="code-surface assessment-code"><div className="code-bar"><span/><span/><span/><b>example.ts</b><i>TypeScript</i></div><pre><code>{code.split('\n').map((line,i)=><span key={line} className="assess-line"><em>{i+1}</em>{line}<small>{i === 3 ? inferred : ['string','number','boolean'][i]}</small>{'\n'}</span>)}</code></pre></div><label className="literal-editor">EDIT VALUE <input value={literal} onChange={(e) => setAnswer('assessValue', e.target.value)} aria-label="Variable value"/><span>Try <code>42</code>, <code>true</code>, or <code>["one", "two"]</code></span></label><div className="question-block"><p className="question-label">What type does <code>value</code> have?</p><OptionList value={answer('assessment')} onChange={(v) => setAnswer('assessment',v)} options={['number','boolean','string','string[]']}/><div className="action-row"><Feedback complete={complete} correct={answer('assessment')===inferred} text={`Right. This literal is inferred as ${inferred}.`}/><Submit onClick={() => check(answer('assessment')===inferred)}/></div></div></Panel>; }

function Clarification({ answer, setAnswer, check, complete }: Props) { return <Panel label="CLEAR REQUIREMENTS" title="Before you build, ask one thing."><p className="prompt">A teammate says: <i>“Can you make the report faster? It takes too long.”</i> You can start investigating, but the request lacks a success measure and context.</p><div className="quote-card"><span>REQUEST</span><p>“Can you make the report faster? It takes too long.”</p><small>— Project channel, 9:14 AM</small></div><p className="question-label">Which clarification will best guide the next step?</p><OptionList value={answer('clarification')} onChange={(v) => setAnswer('clarification',v)} options={['What is the desired load time, and which report or step feels slowest?','Would you like me to rewrite the report in a different language?','Can you tell me more about the project?','I’ll optimize the database queries right away.']}/><div className="action-row"><Feedback complete={complete} correct={answer('clarification')?.startsWith('What is the desired')} text="A useful question asks for a measurable target and where the delay occurs."/><Submit onClick={() => check(answer('clarification')?.startsWith('What is the desired'))} label="Submit response"/></div></Panel>; }
