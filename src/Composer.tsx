import { ArrowUp, AudioLines, Check, ChevronDown, Paperclip, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Session } from './session';

export function Composer({session, update, send, voice, busy}:{session:Session;update:(patch:Partial<Session>)=>void;send:()=>void;voice:()=>void;busy:boolean}) {
  const [open, setOpen] = useState<'model'|'tools'|null>(null);
  const root = useRef<HTMLFormElement>(null);
  useEffect(()=>{
    if(!open)return;
    const outside=(event:PointerEvent)=>{
      if(event.target instanceof Node&&!root.current?.contains(event.target))setOpen(null);
    };
    window.addEventListener('pointerdown',outside);
    return ()=>window.removeEventListener('pointerdown',outside);
  },[open]);
  const files = useRef<HTMLInputElement>(null);
  const draft = useRef<HTMLTextAreaElement>(null);
  return <form ref={root} className="composer" onKeyDown={event=>{if(event.key==='Escape')setOpen(null);}} onSubmit={event=>{event.preventDefault();if(!busy)send();}}>
    {session.attachments.length>0 && <div className="attachments">{session.attachments.map(name=><button key={name} type="button" onClick={()=>update({attachments:session.attachments.filter(file=>file!==name)})}>{name}<X size={13}/></button>)}</div>}
    <textarea ref={draft} aria-label="Message" placeholder="Ask, explore, or build anything…" value={session.draft} rows={2} onChange={event=>update({draft:event.target.value})} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();if(!busy)send();}}}/>
    <input hidden type="file" ref={files} multiple onChange={event=>{update({attachments:[...new Set([...session.attachments,...Array.from(event.target.files??[],file=>file.name)])]});event.target.value='';}}/>
    <div className="composer-tools">
      <button type="button" className="icon-button attach" title="Attach files" aria-label="Attach files" onClick={()=>files.current?.click()}><Paperclip size={17}/></button>
      <div className="popover-anchor">
        <button type="button" className="tool-button" aria-expanded={open==='tools'} onClick={()=>setOpen(open==='tools'?null:'tools')}><SlidersHorizontal size={15}/> Tools</button>
        {open==='tools'&&<div className="popover above">{[['Interactive assessment','Build an interactive assessment.'],['Source comparison','Compare sources in a research evidence matrix.'],['Architecture diagram','Map a software architecture.']].map(([label,value])=><button type="button" key={label} onClick={()=>{update({draft:value});setOpen(null);draft.current?.focus();}}>{label}</button>)}</div>}
      </div>
      <span className="grow"/>
      <div className="popover-anchor">
        <button type="button" className="tool-button model-button" aria-expanded={open==='model'} onClick={()=>setOpen(open==='model'?null:'model')}><span className="model-dot"/>{session.model}<ChevronDown size={13}/></button>
        {open==='model'&&<div className="popover above right">{['Harness 1.0','Harness Reasoning','Harness Fast'].map(model=><button type="button" key={model} onClick={()=>{update({model});setOpen(null);}}>{model}{session.model===model&&<Check size={14}/>}</button>)}</div>}
      </div>
      <button type="button" className="icon-button voice-button" title="Open Live" aria-label="Open Live" onClick={voice}><AudioLines size={18}/></button>
      <button type="submit" className="send-button" title="Send message" aria-label="Send message" disabled={busy||(!session.draft.trim()&&!session.attachments.length)}><ArrowUp size={20}/></button>
    </div>
  </form>;
}
