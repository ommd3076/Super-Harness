import { ArrowDownRight, ArrowUpRight, AudioLines, BookOpen, Braces, ChevronDown, CircleCheck, Columns2, Command, FileText, FlaskConical, FolderOpen, GitBranch, MessageCircle, PanelLeft, PanelRight, Plus, Search, Settings2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Brand } from './brand';
import { Composer } from './Composer';
import { defaults, examples, inferScene, newSession, useStored } from './session';
import type { Area, Exchange, Preferences, Session } from './session';
import { Scene } from './Scene';
import { UpstreamLoading, UpstreamResponse, UpstreamTools } from './upstream/ReferenceKit';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';

const nav = [
  {name:'Chat',icon:MessageCircle}, {name:'Study',icon:BookOpen}, {name:'Workspace',icon:FolderOpen},
  {name:'Research',icon:FlaskConical}, {name:'Live',icon:AudioLines},
] as const;
const starters = [
  {label:'Learn a concept',description:'Explore a topic step by step',icon:BookOpen,id:'dfa'},
  {label:'Build something',description:'Map out a technical idea',icon:Braces,id:'architecture'},
  {label:'Explore a question',description:'Compare sources and evidence',icon:FlaskConical,id:'evidence'},
] as const;
const preferenceFields = [
  ['Appearance','appearance',['Light','Dark','System']], ['Composer shape','composer',['Rounded','Pill']],
  ['Chat density','density',['Comfortable','Compact']], ['Message width','width',['Standard','Wide']],
  ['Thinking indicator','thinking',['Orbit','Dots','Drive','Surfer']], ['Motion','motion',['Off','Subtle','Expressive']],
  ['Activity trace','activity',['Expanded','Compact']], ['Code spacing','code',['Comfortable','Compact']],
  ['Live visual','voice',['fluid','matrix']],
] as const;
type Detail = {title:string; body:string};
const storage = 'super-harness';

function initialSessions() { const session = newSession(); return {sessions:[session],active:session.id}; }
const waitTime = 720;
const localTokens = 'I can work through this with you using an interactive example. Try an automaton, a software architecture map, or an evidence comparison to see how the interface adapts.'.split(' ').map(text => ({text}));
const localFollowUps = ['Make an interactive DFA for strings ending in abb.', 'Map a software architecture as an interactive diagram.', 'Compare sources in a research evidence matrix.'];
const fixtureTrace = [{
  icon:'think', label:'Local fixture', chip:'Prepared interactive response', mono:false, detailMono:false,
  detail:[{text:'Loaded the bundled example and restored this conversation’s local state.'}],
}];

export default function App() {
  const [state, setState] = useStored(storage+'-sessions',initialSessions);
  const [storedPreferences,setPreferences] = useStored<Preferences>(storage+'-preferences',defaults);
  const preferences = {...defaults,...storedPreferences};
  const [collapsed,setCollapsed] = useStored(storage+'-collapsed',false);
  const [splitId,setSplitId] = useStored<string|null>(storage+'-split',null);
  const [mobileNav,setMobileNav] = useState(false);
  const [overlay,setOverlay] = useState<'search'|'settings'|null>(null);
  const [query,setQuery] = useState('');
  const [detail,setDetail] = useState<Detail|null>(null);
  const [preview,setPreview] = useState(()=>newSession());
  const [tick,setTick] = useState(Date.now);
  const scrollBox = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const scroll = useRef<Record<string, number>>({});
  const session = state.sessions.find(tab=>tab.id===state.active) ?? state.sessions[0];
  const dev = import.meta.env.DEV && ['/dev','/dev/examples'].includes(location.pathname);
  const splitSession = state.sessions.find(tab=>tab.id===splitId&&tab.id!==session.id&&tab.area==='Chat');
  const latest = session.exchanges.at(-1);
  const isLoading = (exchange:Exchange) => Math.max(tick,Date.now())-exchange.started<waitTime;
  const busy = Boolean(latest && isLoading(latest));

  useEffect(()=>{
    const now=Date.now();
    const pending=state.sessions.flatMap(tab=>tab.exchanges).filter(exchange=>exchange.started+waitTime>now);
    const deadline=Math.min(...pending.map(exchange=>exchange.started+waitTime));
    if(Number.isFinite(deadline)){
      const handle=window.setTimeout(()=>setTick(Date.now()),deadline-now+5);
      return ()=>window.clearTimeout(handle);
    }
  },[state.sessions,tick]);
  useEffect(()=>{
    const handle=(event:KeyboardEvent)=>{
      if ((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k') {
        event.preventDefault();
        setOverlay(current=>current==='search'?null:'search');
      }
      if (event.key==='Escape') {setDetail(null);setMobileNav(false);}
    };
    window.addEventListener('keydown',handle);
    return ()=>window.removeEventListener('keydown',handle);
  },[]);
  useEffect(()=>{
    if (overlay && !dialog.current?.open) dialog.current?.showModal();
    if (!overlay && dialog.current?.open) dialog.current.close();
  },[overlay]);
  useEffect(()=>{
    if(scrollBox.current) scrollBox.current.scrollTop=scroll.current[session.id]??0;
  },[session.id]);
  useEffect(()=>{
    if(latest?.started && Date.now()-latest.started<waitTime+250) {
      scrollBox.current?.querySelector('.exchange:last-child')?.scrollIntoView({ block:'start' });
    }
  },[latest?.started]);

  function update(patch:Partial<Session>, id=session.id) {
    setState(current=>({...current,sessions:current.sessions.map(tab=>tab.id===id?{...tab,...patch}:tab)}));
  }
  function select(id:string) {
    if (id===splitId) setSplitId(session.area==='Chat'?session.id:null);
    setState(current=>({...current,active:id}));setMobileNav(false);setDetail(null);setOverlay(null);
  }
  function add(area:Area='Chat',scene?:string) {
    const example = examples.find(item=>item.id===scene);
    const item=newSession(area,example?.title,scene);
    setState(current=>({sessions:[...current.sessions,item],active:item.id}));
    setMobileNav(false);setDetail(null);setOverlay(null);
  }
  function openArea(area:Area) {
    const existing=state.sessions.find(tab=>tab.area===area);
    if(existing)select(existing.id);else add(area);
  }
  function close(id:string) {
    setState(current=>{
      const tabs=current.sessions.filter(item=>item.id!==id);
      if(!tabs.length)return initialSessions();
      const index=current.sessions.findIndex(item=>item.id===id);
      return {sessions:tabs,active:current.active===id?tabs[Math.max(0,index-1)].id:current.active};
    });
    if(id===splitId)setSplitId(null);
    if(id===session.id)setDetail(null);
  }
  function toggleSplit() {
    if(splitSession) { setSplitId(null); return; }
    const previous = state.sessions.find(tab=>tab.id!==session.id&&tab.area==='Chat');
    if(previous) { setSplitId(previous.id); return; }
    const next = newSession();
    setState(current=>({...current,sessions:[...current.sessions,next]}));
    setSplitId(next.id);
  }
  function sendFor(target:Session, override?:string) {
    const input=(override??target.draft).trim();
    if (!input&&!target.attachments.length)return;
    const pending=target.exchanges.at(-1);
    if (pending&&isLoading(pending))return;
    const started=Date.now();
    const exchange:Exchange={id:crypto.randomUUID(),input:input||'Attached files',scene:inferScene(input),attachments:override?[]:target.attachments,started};
    setTick(started);
    update({exchanges:[...target.exchanges,exchange],draft:override?target.draft:'',attachments:override?target.attachments:[],title:target.title==='New chat'?(input||'Attached files').slice(0,45):target.title},target.id);
  }
  const onInspect = (next:Detail)=>setDetail(next);
  function renderConversation(target:Session) {
    const followUp = (text:string) => sendFor(target,text);
    return <div className="conversation">
      {target.scene&&<Response key={target.scene} scene={target.scene} sessionId={target.id} instanceId="seed" input={examples.find(item=>item.id===target.scene)?.description??target.title} attachments={[]} preferences={preferences} onInspect={onInspect} onFollowUp={followUp}/>}
      {target.exchanges.map(exchange=><Response key={exchange.id} scene={exchange.scene} sessionId={target.id} instanceId={exchange.id} input={exchange.input} attachments={exchange.attachments} loading={isLoading(exchange)} preferences={preferences} onInspect={onInspect} onFollowUp={followUp}/>)}
    </div>;
  }
  const hasChat = session.scene || session.exchanges.length>0;
  const composer=<Composer key={session.id} session={session} variant={preferences.composer} tall={!hasChat} update={update} send={()=>sendFor(session)} voice={()=>openArea('Live')} busy={busy}/>;
  const pinned = [examples[5],examples[7]];
  const recent = [...state.sessions].reverse().filter(item=>item.title!=='New chat').slice(0,4);
  const filtered = examples.filter(item=>(item.title+' '+item.description).toLowerCase().includes(query.toLowerCase()));
  const matchingSessions = state.sessions.filter(item=>item.title.toLowerCase().includes(query.trim().toLowerCase()));
  const commands = [
    {label:'Start a new chat', icon:Plus, run:()=>add()},
    {label:splitSession?'Close split workspace':'Open split workspace', icon:Columns2, run:()=>{toggleSplit();setOverlay(null);}},
    {label:'Open appearance settings', icon:Settings2, run:()=>setOverlay('settings')},
  ].filter(item=>item.label.toLowerCase().includes(query.trim().toLowerCase()));
  const currentIcon = nav.find(item=>item.name===session.area)?.icon ?? MessageCircle;
  const CurrentIcon = currentIcon;
  return <div className="app" data-theme={preferences.appearance.toLowerCase()} data-density={preferences.density.toLowerCase()} data-width={preferences.width.toLowerCase()} data-composer={preferences.composer.toLowerCase()} data-motion={preferences.motion.toLowerCase()} data-code={preferences.code.toLowerCase()}>
    <a className="skip-link" href="#content">Skip to conversation</a>
    {mobileNav&&<button className="nav-scrim" aria-label="Close navigation" onClick={()=>setMobileNav(false)}/>}
    <aside className={`sidebar ${collapsed?'collapsed':''} ${mobileNav?'mobile-open':''}`} aria-label="Workspace navigation">
      <div className="side-brand"><span className="brand-mark"><Brand size={22}/></span><strong>Super Harness</strong><button className="icon-button collapse-button" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} title={collapsed?'Expand sidebar':'Collapse sidebar'} onClick={()=>setCollapsed(!collapsed)}><PanelLeft size={17}/></button></div>
      <button className="side-search" aria-label="Search workspace" onClick={()=>{setQuery('');setOverlay('search');}}><Search size={17}/><span>Search workspace</span><kbd><Command size={11}/> K</kbd></button>
      <nav className="primary-nav" aria-label="Experiences">
        <div className="side-label">WORKSPACE</div>
        {nav.map(({name,icon:Icon})=><button key={name} className={session.area===name?'nav-item active':'nav-item'} aria-current={session.area===name?'page':undefined} title={name} onClick={()=>openArea(name)}><Icon size={18}/><span>{name}</span>{session.area===name&&<i/>}</button>)}
      </nav>
      <div className="side-group">
        <div className="side-label">PINNED</div>
        {pinned.map(item=><button key={item.id} className="side-entry" onClick={()=>add(item.id==='finance'?'Research':'Workspace',item.id)}><FolderOpen size={15}/><span>{item.title}</span></button>)}
      </div>
      <div className="side-group recent">
        <div className="side-label">RECENT</div>
        {recent.length ? recent.map(item=><button key={item.id} className="side-entry" onClick={()=>select(item.id)}><MessageCircle size={15}/><span>{item.title}</span></button>) :
          [examples[0],examples[2],examples[9]].map(item=><button key={item.id} className="side-entry" onClick={()=>add('Chat',item.id)}><MessageCircle size={15}/><span>{item.title}</span></button>)}
      </div>
      <div className="side-bottom">
        <button className="nav-item settings-button" title="Settings" onClick={()=>setOverlay('settings')}><Settings2 size={18}/><span>Settings</span></button>
        <div className="local-account"><span className="account-mark"><Brand size={17}/></span><div><strong>Personal workspace</strong><small>Local demo</small></div></div>
      </div>
    </aside>
    <div className="main-region">
      <header className="top">
        <button className="icon-button mobile-toggle" aria-label="Open navigation" onClick={()=>setMobileNav(!mobileNav)}><PanelLeft size={20}/></button>
        <div className="tabs" aria-label="Open sessions">
          {state.sessions.map(item=>{
            const Icon=nav.find(entry=>entry.name===item.area)?.icon??MessageCircle;
            return <div key={item.id} className={item.id===session.id?'tab selected':'tab'} data-split={item.id===splitSession?.id||undefined}>
              <button type="button" onClick={()=>select(item.id)} aria-current={item.id===session.id?'page':undefined} title={item.title}><Icon size={15}/><span>{item.title}</span></button>
              <button className="tab-close" aria-label={`Close ${item.title}`} onClick={()=>close(item.id)}><X size={13}/></button>
            </div>;
          })}
        </div>
        <button className="icon-button new-tab" title="New chat" aria-label="New chat" onClick={()=>add()}><Plus size={19}/></button>
        <span className="grow"/>
        <button className={`icon-button split-toggle ${splitSession?'is-active':''}`} title="Split workspace" aria-label="Split workspace" aria-pressed={Boolean(splitSession)} onClick={toggleSplit}><Columns2 size={17}/></button>
        <button className={`icon-button inspector-toggle ${detail?'is-active':''}`} title="Toggle inspector" aria-label="Toggle inspector" aria-expanded={Boolean(detail)} onClick={()=>setDetail(detail?null:{title:'Session details',body:'This session runs entirely in your browser. Open an artifact, diagram node, or source to inspect it here.'})}><PanelRight size={18}/></button>
      </header>
      <div className="breadcrumb"><CurrentIcon size={15}/><span>{session.area}</span><span className="crumb-slash">/</span><strong>{session.title}</strong><span className="grow"/><span className="local-status"><i/> Local mode</span></div>
      <div className={`work-area ${splitSession?'has-split':''}`}>
        <main id="content" className="workspace">
          <div className={`viewport ${!dev&&session.area==='Chat'&&!hasChat?'home-viewport':''}`} ref={scrollBox} onScroll={event=>{scroll.current[session.id]=event.currentTarget.scrollTop;}}>
            {dev ? <div className="gallery"><h1>Interactive examples</h1>{examples.map(item=><details key={item.id}><summary>{item.title}</summary><Scene scene={item.id} sessionId={session.id} instanceId={item.id} onInspect={onInspect}/></details>)}</div>
            :session.area==='Chat'&&!hasChat?<div className="home">
              <div className="home-intro"><h1>What’s on your mind?</h1></div>
              {composer}
              <div className="starters">{starters.map(({id,label,description,icon:Icon})=><button key={id} onClick={()=>{const example=examples.find(item=>item.id===id)!;update({draft:example.description});document.querySelector<HTMLTextAreaElement>('.home .conversation-prompt textarea')?.focus();}}><span className="starter-icon"><Icon size={17}/></span><span><strong>{label}</strong><small>{description}</small></span><ArrowUpRight className="starter-arrow" size={14}/></button>)}</div>
              <div className="home-recent"><span>Pick up where you left off</span><button onClick={()=>add('Chat','dfa')}>Automata and formal languages <ArrowDownRight size={14}/></button></div>
            </div>
            :session.area==='Chat'?renderConversation(session):<Scene key={session.id} area={session.area} scene={session.scene} sessionId={session.id} instanceId="environment" voiceStyle={preferences.voice} onInspect={onInspect}/>}
          </div>
          {!dev&&session.area==='Chat'&&hasChat&&<div className="composer-dock">{composer}</div>}
          {!dev&&session.area==='Chat'&&<footer className="workspace-footer"><span>Responses use local examples.</span><span><kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line</span></footer>}
        </main>
        {splitSession&&<aside className="workspace split-workspace" aria-label="Split session">
          <header className="split-header"><Columns2 size={15}/><label><span>Split with</span><select aria-label="Split with" value={splitSession.id} onChange={event=>setSplitId(event.target.value)}>
            {state.sessions.filter(tab=>tab.area==='Chat'&&tab.id!==session.id).map(tab=><option key={tab.id} value={tab.id}>{tab.title}</option>)}
          </select></label><span className="grow"/><button className="icon-button" aria-label="Close split session" onClick={()=>setSplitId(null)}><X size={16}/></button></header>
          <div className="viewport" key={splitSession.id}>
            {splitSession.scene||splitSession.exchanges.length?renderConversation(splitSession):<p className="split-empty">Start a conversation in this pane.</p>}
          </div>
          <div className="composer-dock"><Composer key={splitSession.id} session={splitSession} variant={preferences.composer} update={patch=>update(patch,splitSession.id)} send={()=>sendFor(splitSession)} voice={()=>openArea('Live')} busy={splitSession.exchanges.some(isLoading)}/></div>
        </aside>}
        {detail&&<aside className="inspector" aria-label="Inspector"><header><PanelRight size={17}/><strong>Inspector</strong><span className="grow"/><button className="icon-button" aria-label="Close inspector" onClick={()=>setDetail(null)}><X size={17}/></button></header><article><FileText size={22}/><h2>{detail.title}</h2><p>{detail.body}</p></article></aside>}
      </div>
    </div>
    <dialog ref={dialog} className="modal" onCancel={()=>setOverlay(null)} onClick={event=>{if(event.target===event.currentTarget)setOverlay(null);}}>
      {overlay==='search'&&<section><div className="modal-header"><Search size={20}/><input autoFocus aria-label="Search conversations and examples" placeholder="Search conversations and examples…" value={query} onChange={event=>setQuery(event.target.value)}/><button className="icon-button" aria-label="Close search" onClick={()=>setOverlay(null)}><X size={18}/></button></div><div className="search-results">
        {commands.map(({label,icon:Icon,run})=><button key={label} onClick={run}><Icon size={17}/><span><strong>{label}</strong></span></button>)}
        {matchingSessions.filter(item=>query||item.title!=='New chat').map(item=><button key={item.id} onClick={()=>select(item.id)}><MessageCircle size={17}/><span><strong>{item.title}</strong><small>{item.draft ? `Draft · ${item.draft}` : item.exchanges.at(-1)?.input ?? `${item.area} session`}</small></span></button>)}
        {filtered.map(item=><button key={item.id} onClick={()=>add('Chat',item.id)}><Brand size={17}/><span><strong>{item.title}</strong><small>{item.description}</small></span><ArrowUpRight size={15}/></button>)}
        {filtered.length===0&&matchingSessions.length===0&&commands.length===0&&<p>No matching conversations, commands or examples.</p>}
      </div></section>}
      {overlay==='settings'&&<section><div className="modal-header"><Settings2 size={20}/><h2>Settings</h2><span className="grow"/><button className="icon-button" aria-label="Close settings" onClick={()=>setOverlay(null)}><X size={18}/></button></div><form className="settings-form" onSubmit={(event:FormEvent)=>event.preventDefault()}>
        {preferenceFields.map(([label,key,values])=><label key={key}><span>{label}</span><select value={preferences[key]} onChange={event=>setPreferences({...preferences,[key]:event.target.value})}>{values.map(value=><option key={value} value={value}>{value[0].toUpperCase()+value.slice(1)}</option>)}</select></label>)}
        <div className="settings-preview"><UpstreamLoading variant={preferences.thinking} label="Thinking indicator preview"/></div>
        <div className="appearance-sample" aria-label="Composer preview">
          <Composer session={preview} variant={preferences.composer} update={patch=>setPreview(current=>({...current,...patch}))} send={()=>setPreview(current=>({...current,draft:'',attachments:[]}))} voice={()=>openArea('Live')} busy={false}/>
        </div>
        <button type="button" className="reset-button" onClick={()=>setPreferences(defaults)}>Restore defaults</button>
      </form></section>}
    </dialog>
  </div>;
}

function Response({scene,sessionId,instanceId,input,attachments,loading,preferences,onInspect,onFollowUp}:{scene:string;sessionId:string;instanceId:string;input:string;attachments:string[];loading?:boolean;preferences:Preferences;onInspect:(detail:Detail)=>void;onFollowUp:(text:string)=>void}) {
  return <article className="exchange">
    <div className="user-message">{input}{attachments.map(file=><span className="user-attachment" key={file}><FileText size={14}/>{file}</span>)}</div>
    <div className="assistant-message"><span className="answer-avatar"><Brand size={20}/></span><div className="assistant-content"><div className="assistant-name">Super Harness</div>
      {loading?<div className="activity" role="status"><UpstreamLoading variant={preferences.thinking} label="Preparing a local response"/></div>:<>
        {scene!=='conversation'&&<details className="activity-capsule" open={preferences.activity==='Expanded'}><summary><CircleCheck size={15}/> Local example ready <ChevronDown size={13}/></summary><UpstreamTools className="activity-trace" steps={fixtureTrace} diffs={[]} labels={{header:'Trace details'}}/></details>}
        {scene==='conversation'?<UpstreamResponse content={localTokens} sources={[]} followUps={localFollowUps} loop={false} fill onFollowUp={onFollowUp}/>:<Scene scene={scene} sessionId={sessionId} instanceId={instanceId} onInspect={onInspect}/>}
        {scene==='mixed'&&<button className="artifact-link" onClick={()=>onInspect({title:'Service measurement brief',body:'Track p95 latency, request volume, and error rate together. Compare a typical interval with a known peak and record the rollout decision.'})}><GitBranch size={15}/> Open measurement brief <ArrowUpRight size={14}/></button>}
      </>}
    </div></div>
  </article>;
}
