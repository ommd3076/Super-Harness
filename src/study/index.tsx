import { useEffect, useId, useMemo, useState } from 'react';
import { ArrowRight, Check, ChevronRight, CircleHelp, LockKeyhole, RotateCcw, Sparkles } from 'lucide-react';
import { IntelligentUI } from '../runtime';
import { Nfa } from './Nfa';
import './styles.css';

export const studyScenes = [
  { id: 'dfa', title: 'A small automaton', description: 'Trace a DFA that recognizes strings ending in abb.' },
  { id: 'rsa', title: 'RSA, one step at a time', description: 'Work through a tiny RSA example with guided arithmetic.' },
  { id: 'code', title: 'Rebuild the route', description: 'Reconstruct an Express and Mongoose endpoint from its parts.' },
  { id: 'assessment', title: 'Name the value', description: 'Infer a variable’s type from the evidence in a program.' },
  { id: 'clarification', title: 'Ask before assuming', description: 'Resolve an underspecified request with one useful question.' },
  { id: 'nfa', title: 'Branch the automaton', description: 'Follow all active states, including epsilon transitions.' },
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
  const [formReset, setFormReset] = useState(0);
  const storageScope = `${sessionId}::${active}`;
  const [loadedScope, setLoadedScope] = useState('');
  useEffect(() => { setActive(selected); }, [selected]);
  useEffect(() => { setSaved(load(sessionId, active)); setLoadedScope(storageScope); }, [sessionId, active, storageScope]);
  useEffect(() => { if (loadedScope !== storageScope) return; try { localStorage.setItem(`study:${sessionId}:${active}`, JSON.stringify(saved)); } catch { /* storage can be unavailable */ } }, [sessionId, active, saved, loadedScope, storageScope]);

  const answer = (key: string) => saved.answers[key] || '';
  const setAnswer = (key: string, value: string) => setSaved((current) => ({ ...current, answers: { ...current.answers, [key]: value }, complete: false }));
  const reset = () => { setSaved(blank); setFormReset((n) => n + 1); try { localStorage.removeItem(`intelligent-ui:${encodeURIComponent(sessionId)}:${encodeURIComponent(`${active}-form`)}`); } catch { /* storage can be unavailable */ } };
  const current = useMemo(() => studyScenes.find((item) => item.id === active)!, [active]);
  const check = () => setSaved((current) => ({ ...current, complete: true }));
  return <div className="study-shell">
    <header className="study-top"><div className="study-brand"><span className="study-mark"><Sparkles size={17}/></span><span>Super Harness <i>·</i> Study lab</span></div><span className="study-session"><span className="session-dot"/> SESSION SAVED</span></header>
    <div className="study-layout">
      <aside className="study-rail"><p className="eyebrow">LEARNING PATH</p><h2>Make it<br/>make sense.</h2><p className="rail-copy">Short, focused exercises that turn abstract ideas into working intuition.</p><nav aria-label="Study scenes">{studyScenes.map((item, i) => <button key={item.id} className={`scene-link ${active === item.id ? 'is-active' : ''}`} onClick={() => setActive(item.id)}><span className="scene-num">0{i + 1}</span><span>{item.title}</span><ChevronRight size={15}/></button>)}</nav><div className="rail-note"><LockKeyhole size={15}/><span>Your progress stays on this device and session.</span></div></aside>
      <section className="study-main"><div className="scene-heading"><div><p className="eyebrow">INTERACTIVE EXERCISE</p><h1>{current.title}</h1><p>{current.description}</p></div><button className="reset-button" onClick={reset} title="Reset this exercise"><RotateCcw size={15}/> Reset</button></div>
        {active === 'dfa' && <Dfa answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'rsa' && <Rsa answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'code' && <CodeTask answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'assessment' && <Assessment answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete}/>}
        {active === 'clarification' && <Clarification answer={answer} setAnswer={setAnswer} check={check} complete={saved.complete} sessionId={sessionId} resetKey={formReset}/>}
        {active === 'nfa' && <Panel label="Automata theory" title="Trace a nondeterministic machine"><Nfa input={answer('nfaInput')} position={Number(answer('nfaStep')) || 0} onInput={value=>{setAnswer('nfaInput',value);setAnswer('nfaStep','0');}} onStep={step=>setAnswer('nfaStep',String(step))}/></Panel>}
        <footer className="study-footer"><span>STUDY / FOUNDATIONS</span><span>{String(studyScenes.findIndex((x) => x.id === active) + 1).padStart(2, '0')} — {String(studyScenes.length).padStart(2, '0')}</span></footer>
      </section>
    </div>
  </div>;
}

type Props = { answer: (key: string) => string; setAnswer: (key: string, value: string) => void; check: (ok: boolean) => void; complete: boolean; sessionId?: string; resetKey?: number };
function Panel({ children, title, label }: { children: React.ReactNode; title: string; label: string }) { return <article className="exercise-card"><div className="card-kicker"><span>{label}</span></div><h2>{title}</h2>{children}</article>; }
function Feedback({ complete, correct, text }: { complete: boolean; correct: boolean; text: string }) { return <div className={`feedback ${complete ? (correct ? 'good' : 'bad') : ''}`}>{complete ? <><span className="feedback-icon">{correct ? <Check size={15}/> : <CircleHelp size={15}/>}</span>{text}</> : <><span className="feedback-icon"><CircleHelp size={15}/></span>Take a guess. You can revise it as you go.</>}</div>; }
function Submit({ onClick, label = 'Check answer' }: { onClick: () => void; label?: string }) { return <button className="submit-button" onClick={onClick}>{label}<ArrowRight size={16}/></button>; }
function OptionList({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) { return <div className="option-list">{options.map((option, i) => <button key={option} onClick={() => onChange(option)} className={`option ${value === option ? 'selected' : ''}`}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{value === option && <Check size={16}/>}</button>)}</div>; }

function Dfa({ answer, setAnswer, check, complete }: Props) {
  const graphId = useId();
  const input = answer('dfaInput');
  const position = Math.min(Number(answer('dfaPosition') || '0'), input.length);
  const started = answer('dfaStarted') === 'yes';
  const trace = [0];
  const states = ['q₀', 'q₁', 'q₂', 'q₃'];
  const transition = (q: number, c: string) => c === 'a' ? [1, 1, 1, 1][q] : [0, 2, 3, 0][q];
  for (const symbol of input.slice(0, position)) trace.push(transition(trace.at(-1)!,symbol));
  const active = trace.at(-1)!;
  const move = (next: number) => { setAnswer('dfaPosition', String(next)); setAnswer('dfaStarted', 'yes'); };
  return <Panel label="AUTOMATA THEORY" title="Which strings should this machine accept?"><p className="prompt">This DFA accepts exactly the strings over <b>{'{a, b}'}</b> that end in <code>abb</code>. Trace a sample, then choose the string it accepts.</p>
    <div className="dfa-card">
      <svg className="dfa-graph" viewBox="0 0 460 172" role="img" aria-label="DFA. From every state a goes to q1. On b, q0 stays at q0, q1 goes to q2, q2 goes to q3, and q3 goes to q0. Only q3 accepts.">
        <defs><marker id={graphId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6Z" fill="currentColor"/></marker></defs>
        <g className="dfa-arrows" markerEnd={`url(#${graphId})`}>
          <path d="M9 89H40"/><path d="M87 89H151"/><path d="M197 89H261"/><path d="M307 89H371"/>
          <path d="M53 68C22 26 100 26 74 68"/><path d="M163 68C130 26 210 26 184 68"/>
          <path d="M276 67Q230 13 184 67"/><path d="M385 69Q    288 -31 183 69"/><path d="M381 107Q230 225 78 107"/>
        </g>
        <g className="dfa-labels"><text x="116" y="81">a</text><text x="227" y="81">b</text><text x="336" y="81">b</text><text x="57" y="39">b</text><text x="150" y="38">a</text><text x="229" y="34">a</text><text x="294" y="22">a</text><text x="225" y="162">b</text></g>
        {states.map((state,index)=><g key={state} className={`dfa-node ${active===index?'dfa-node-active':''}`}><circle cx={64+index*110} cy="89" r="22"/>{index===3&&<circle cx="394" cy="89" r="17" className="dfa-inner"/>}<text x={64+index*110} y="94" textAnchor="middle">{state}</text></g>)}
      </svg><div className="dfa-caption">Each state tracks the longest current suffix that is also a prefix of <code>abb</code>.</div>
    </div>
    <div className="trace-row"><label htmlFor={`${graphId}-input`}>TRY A STRING</label><input id={`${graphId}-input`} value={input} onChange={event=>{setAnswer('dfaInput',event.target.value.replace(/[^ab]/g,'').slice(0,120));setAnswer('dfaPosition','0');setAnswer('dfaStarted','');}} placeholder="e.g. aabb"/><button onClick={()=>move(Math.min(position+1,input.length))} disabled={started&&position===input.length}>Step</button><button onClick={()=>move(input.length)}>Trace <ArrowRight size={14}/></button><button onClick={()=>{setAnswer('dfaPosition','0');setAnswer('dfaStarted','');}}>Reset trace</button></div>
    {started && <p className="trace-result" role="status">Path: {trace.map(q=>states[q]).join(' → ')} <span>· {position<input.length?`${position} / ${input.length} symbols`:active===3?'accepted':'not accepted'}</span></p>}
    <div className="question-block"><p className="question-label">Choose the string that ends in <code>abb</code>.</p><OptionList value={answer('dfa')} onChange={(v) => setAnswer('dfa', v)} options={['ababa', 'aabb', 'babab', 'abba']}/><div className="action-row"><Feedback complete={complete} correct={answer('dfa') === 'aabb'} text={answer('dfa') === 'aabb' ? 'Exactly. The final two b’s complete the abb suffix.' : 'Not quite. Follow the final three symbols.'}/><Submit onClick={() => check(answer('dfa') === 'aabb')}/></div></div>
  </Panel>;
}

function Rsa({ answer, setAnswer, check, complete }: Props) {
 const stages = ['Choose primes', 'Find n and φ(n)', 'Choose e', 'Find d'];
 const vals = [answer('rsa1'), answer('rsa2'), answer('rsa3'), answer('rsa4')];
 const e = Number(vals[2]);
 let expectedD = 0;
 for (let candidate = 1; candidate < 40; candidate += 1) if ((e * candidate) % 40 === 1) { expectedD = candidate; break; }
 const correctNAndPhi = vals[1]?.replace(/\s/g, '') === '55,40';
 const correctE = e > 1 && e < 40 && expectedD > 0;
 const correct = correctNAndPhi && correctE && Number(vals[3]) === expectedD;
 return <Panel label="PUBLIC KEY CRYPTOGRAPHY" title="Build a tiny RSA key by hand."><p className="prompt">Use <b>p = 5</b> and <b>q = 11</b>. We will keep the numbers small so you can see how each part fits together.</p><div className="rsa-summary"><div><small>PRIMES</small><strong>p = 5 <i>·</i> q = 11</strong></div><div><small>PUBLIC KEY</small><strong>(e, n)</strong></div><div><small>PRIVATE KEY</small><strong>(d, n)</strong></div></div>{stages.map((s, i) => <div className={`rsa-step ${vals[i] ? 'answered' : ''}`} key={s}><div className="step-index">{vals[i] ? <Check size={14}/> : `0${i + 1}`}</div><div className="step-content"><label>{s}</label><p>{['The primes are supplied for this example.', 'Compute n = p × q and φ(n) = (p − 1)(q − 1).', 'Choose any integer e where 1 < e < 40 and gcd(e, 40) = 1.', 'Find d such that e × d leaves remainder 1 when divided by φ(n).'][i]}</p>{i === 0 ? <div className="step-answer static">5 and 11 <span>given</span></div> : <input className="step-answer" value={vals[i] || ''} onChange={(event) => setAnswer(`rsa${i + 1}`, event.target.value)} placeholder={['','n, φ(n)','e, e.g. 3 or 7','d'][i]} />}</div></div>)}<div className="action-row"><Feedback complete={complete} correct={correct} text={correct ? `Correct. ${e} × ${expectedD} ≡ 1 (mod 40), so the keys are (${e}, 55) and (${expectedD}, 55).` : 'Check n = 55, φ(n) = 40, then choose e coprime to 40 and its modular inverse d.'}/><Submit onClick={() => check(correct)} label="Check key"/></div></Panel>;
}

function CodeTask({ answer, setAnswer, check, complete }: Props) {
  const choices = [
    'app.patch("/users/:id", async (req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {',
    'const { displayName, bio } = req.body;',
    'const user = await User.findByIdAndUpdate(req.params.id, { displayName, bio }, { new: true, runValidators: true });',
    'if (!user) return res.status(404).json({ error: "User not found" });',
    'return res.json(user);\n});',
  ];
  let picked: string[] = [];
  try { picked = JSON.parse(answer('code') || '[]'); } catch { picked = []; }
  const toggle = (line: string) => setAnswer('code', JSON.stringify(picked.includes(line) ? picked.filter((x) => x !== line) : [...picked, line]));
  const typed = answer('codeDraft');
  const expects = [
    /app\.patch\s*\(/,
    /Request\s*<[^>]+UpdateUserBody/,
    /findByIdAndUpdate\s*\(\s*req\.params\.id/,
    /runValidators\s*:\s*true/,
    /new\s*:\s*true/,
    /res\.status\s*\(404\)/,
    /res\.json\s*\(user\)/,
  ];
  const correct = typed.trim() ? expects.every(pattern => pattern.test(typed)) : picked.join('|') === choices.join('|');
  return <Panel label="BACKEND PATTERNS" title="Put the typed update route back together."><p className="prompt">A client sends <code>PATCH /users/42</code> with optional profile fields. Reconstruct a typed Express handler that updates the Mongoose document, validates the update, and returns a clear 404 when the user is missing.</p>
    <div className="code-surface"><div className="code-bar"><span/><span/><span/><b>routes/users.ts</b><i>TypeScript</i></div><pre><code><span className="code-purple">import type</span> {'{'} Request, Response {'}'} <span className="code-purple">from</span> <span className="code-green">'express'</span>;{'\n'}<span className="code-purple">import</span> {'{'} User {'}'} <span className="code-purple">from</span> <span className="code-green">'../models/User.js'</span>;{'\n'}<span className="code-purple">type</span> UpdateUserBody = {'{'} displayName?: string; bio?: string {'}'};{'\n\n'}{picked.length ? picked.map((x,i)=><span key={x} className="code-line">{i + 1}  {x}{'\n'}</span>) : <span className="code-blank">Select route fragments to assemble the handler…</span>}</code></pre></div>
    <label className="route-editor">Write the route <textarea rows={5} value={typed} onChange={event=>setAnswer('codeDraft',event.target.value)} placeholder="app.patch(…)" spellCheck={false}/></label>
    <p className="question-label">Alternatively, assemble the route from fragments in execution order.</p><div className="option-list code-options">{choices.map((line,i)=><button key={line} onClick={()=>toggle(line)} className={`option ${picked.includes(line)?'selected':''}`}><span className="option-letter">{picked.includes(line)?picked.indexOf(line)+1:String.fromCharCode(65+i)}</span><code>{line}</code>{picked.includes(line)&&<Check size={16}/>}</button>)}</div>
    <div className="action-row"><Feedback complete={complete} correct={correct} text={correct ? 'Correct. The validator flag and `new: true` return the updated document safely.' : 'Check the order: route, typed fields, validated update, missing record, response.'}/><Submit onClick={() => check(correct)} label="Check route"/></div>
    {(complete && correct || answer('codeReference') === 'shown') && <div className="reference-code"><div className="reference-title"><Check size={14}/> REFERENCE IMPLEMENTATION</div><pre><code>{choices.join('\n')}</code></pre></div>}
    <button className="reference-toggle" onClick={() => setAnswer('codeReference', answer('codeReference') === 'shown' ? '' : 'shown')}>{answer('codeReference') === 'shown' ? 'Hide' : 'Show'} reference implementation</button>
  </Panel>;
}

function Assessment({ answer, setAnswer, check }: Props) {
  const questions = [
    { name: 'nickname', expression: '"Mina"', type: 'string', options: ['number','boolean','string','string[]'] },
    { name: 'score', expression: '18 + 24', type: 'number', options: ['number','boolean','string','number[]'] },
    { name: 'isReady', expression: 'score >= 40', type: 'boolean', options: null },
    { name: 'labels', expression: '["new", "popular"]', type: 'string[]', options: ['string','string[]','number[]','object'] },
  ];
  const index = Number(answer('assessmentIndex') || '0');
  const score = Number(answer('assessmentScore') || '0');
  const done = answer('assessmentDone') === 'true';
  const count = questions.length;
  const q = questions[Math.min(index, count - 1)];
  const choiceKey = `assessment-${index}`;
  const current = answer(choiceKey).trim().toLowerCase();
  const advance = () => {
    const nextScore = score + (current === q.type ? 1 : 0);
    setAnswer('assessmentScore', String(nextScore));
    setAnswer(choiceKey, current || 'Skipped');
    if (index === questions.length - 1) { setAnswer('assessmentDone', 'true'); check(true); }
    else { setAnswer('assessmentIndex', String(index + 1)); check(false); }
  };
  return <Panel label="TYPES & INFERENCE" title="Read the value, infer the type."><p className="prompt">Work through short expressions. The inferred type changes with each value; review your score and the reasoning at the end.</p>
    <div className="assessment-progress"><span>QUESTION {done ? count : index + 1} / {count}</span><div><i style={{width:`${done ? 100 : index / count * 100}%`}}/></div><span>SCORE {score} / {count}</span></div>
    {!done ? <><div className="code-surface assessment-code"><div className="code-bar"><span/><span/><span/><b>example.ts</b><i>TypeScript</i></div><pre><code>{index === 2 && <span className="assess-line"><em>1</em>const score = 18 + 24;</span>}{index === 2 && '\n'}<span className="assess-line"><em>{index === 2 ? 2 : 1}</em>let {q.name} = {q.expression};</span>{'\n'}<span className="code-muted">// What type is inferred for {q.name}?</span></code></pre></div><div className="question-block"><p className="question-label">Choose the inferred type.</p><>{q.options ? <OptionList value={current} onChange={(v) => setAnswer(choiceKey,v)} options={q.options}/> : <label className="route-editor">Type the inferred type <input value={answer(choiceKey)} onChange={event=>setAnswer(choiceKey,event.target.value)}/></label>}</><div className="action-row"><Feedback complete={false} correct={current === q.type} text={current ? (current === q.type ? 'That fits. Keep going.' : 'Try again, or continue to the next expression.') : 'Answer to continue; you can also skip this one.'}/><div className="assessment-controls"><button className="text-button" onClick={advance}>Skip</button><Submit onClick={advance} label={index === questions.length - 1 ? 'Finish assessment' : 'Next question'}/></div></div></div></> : <><div className="score-card"><span className="score-number">{score}<small>/ {count}</small></span><div><b>{score === count ? 'Excellent type intuition.' : score >= count / 2 ? 'A solid start.' : 'A useful first pass.'}</b><p>Each inferred type follows from the expression’s value and operators.</p></div></div><div className="review-list">{questions.map((item,i)=><div className="review-item" key={item.name}><span className={answer(`assessment-${i}`)===item.type?'review-correct':'review-missed'}>{answer(`assessment-${i}`)===item.type?<Check size={14}/>:String(i+1).padStart(2,'0')}</span><div><b><code>{item.name}</code> → {item.type}</b><p><code>{item.expression}</code> {item.type==='boolean'?'uses a comparison, so it evaluates to true or false.':item.type==='string[]'?'contains string elements, so the array has type string[].':'is a '+item.type+' value.'}</p></div></div>)}</div><button className="text-button retake" onClick={()=>{setAnswer('assessmentIndex','0');setAnswer('assessmentScore','0');setAnswer('assessmentDone','');questions.forEach((_,i)=>setAnswer(`assessment-${i}`,''));check(false);}}>Try again <RotateCcw size={13}/></button></>}</Panel>;
}

function Clarification({ answer, setAnswer, check, complete, sessionId = 'study', resetKey = 0 }: Props) {
  const step = Number(answer('clarificationStep') || '0');
  const branches = ['Target and current delay', 'Which report or dataset', 'Affected people and workflow'];
  const branch = answer('clarificationBranch');
  const followups: Record<string, string[]> = {
    [branches[0]]: ['What is the current and desired load time, and which stage is slowest?', 'Can you show me the report output?', 'Should I change the report design?'],
    [branches[1]]: ['Which report, filters, and typical data size are involved?', 'Can you show me the report output?', 'Should I change the report design?'],
    [branches[2]]: ['Who experiences the delay, how often, and during which workflow?', 'Can you show me the report output?', 'Should I change the report design?'],
  };
  const questionOptions = followups[branch] || followups[branches[0]];
  const runtimeDefinition = step === 0 ? {
    kind: 'stack', children: [
      { kind: 'clarify', id: 'clarify-label', prompt: 'What should you clarify first?' },
      { kind: 'choice', id: 'clarification-branch', options: branches },
      { kind: 'button', id: 'clarification-next', event: 'submit', label: 'Continue to a focused follow-up' },
    ],
  } : {
    kind: 'stack', children: [
      { kind: 'clarify', id: 'clarify-label', prompt: branch ? `Focus: ${branch.toLowerCase()}. Which follow-up would make the request actionable?` : 'Choose a helpful follow-up, or go back to select a focus.' },
      { kind: 'choice', id: 'clarification-followup', options: questionOptions },
      { kind: 'text', id: 'clarification-reason', prompt: 'Write the question you would ask.', placeholder: 'One clear sentence…' },
      { kind: 'button', id: 'clarification-submit', event: 'submit', label: 'Save this clarification' },
    ],
  };
  const done = step >= 2;
  const completePlan = Boolean(answer('clarificationBranch') && answer('clarificationFollowup') && answer('clarificationReason')?.trim());
  const goBack = () => { setAnswer('clarificationStep', String(Math.max(0, step - 1))); check(false); };
  const skip = () => { if (step === 0) setAnswer('clarificationStep', '1'); else setAnswer('clarificationStep', '2'); check(false); };
  return <Panel label="CLEAR REQUIREMENTS" title="Before you build, ask one thing."><p className="prompt">A teammate says: <i>“Can you make the report faster? It takes too long.”</i> You can start investigating, but the request lacks a success measure and context.</p><div className="quote-card"><span>REQUEST</span><p>“Can you make the report faster? It takes too long.”</p><small>— Project channel, 9:14 AM</small></div>
    {!done ? <><div className="clarify-progress">STEP 0{step + 1} <span>OF 02</span><div><i style={{width:step ? '100%' : '50%'}}/></div></div><div className="runtime-form"><IntelligentUI key={`${resetKey}-${step}`} definition={runtimeDefinition} sessionId={sessionId} instanceId="clarification-form" onEvent={(event) => {
      if (event.nodeId === 'clarification-branch') setAnswer('clarificationBranch', String(event.value ?? ''));
      if (event.nodeId === 'clarification-followup') setAnswer('clarificationFollowup', String(event.value ?? ''));
      if (event.nodeId === 'clarification-reason') setAnswer('clarificationReason', String(event.value ?? ''));
      if (event.type === 'button.submit') {
        if (step === 0) setAnswer('clarificationStep', '1');
        else { const valid = Boolean(branch && answer('clarificationFollowup') && answer('clarificationReason')?.trim()); check(valid); if (valid) setAnswer('clarificationStep', '2'); }
      }
    }}/></div><div className="clarify-nav">{step > 0 ? <button className="text-button" onClick={goBack}>← Back</button> : <span/>}<button className="text-button" onClick={skip}>Skip this step</button></div></> : <div className="clarify-review"><span className="review-correct">{completePlan ? <Check size={14}/> : <CircleHelp size={14}/>}</span><div><b>{completePlan ? 'Clarification saved.' : 'You skipped the remaining steps.'}</b><p>{completePlan ? `${branch}: “${answer('clarificationFollowup')}”` : 'Go back to add a focus and a follow-up question.'}</p></div><button className="text-button" onClick={goBack}>← Back</button></div>}
    <div className="action-row"><Feedback complete={complete} correct={completePlan} text={completePlan ? 'The request now has a focused next question and a clear reason.' : 'Clarify the target, scope, or impact before choosing an optimization.'}/></div></Panel>;
}
