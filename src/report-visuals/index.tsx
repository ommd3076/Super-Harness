import InsightCards from './InsightCards';
import PromptBar from './PromptBar';
import { useStored } from '../session';

export function ReportVisuals({storageKey,onInspect}:{storageKey:string;onInspect:(detail:{title:string;body:string})=>void}) {
  const [note,setNote] = useStored(storageKey, '');
  return <div className="reference-section">
    <InsightCards labels={{title:'Service cost insights'}} onPick={title=>onInspect({title,body:'Use the bundled release and spend summaries to compare changes. The chart values are fictional and local to this example.'})}/>
    <section aria-label="Report follow-up">
      <h3>Report follow-up</h3>
      <PromptBar demo={false} tall placeholder="Draft a local reviewer note…" onSend={setNote}/>
      {note&&<p role="status">Saved note · {note}</p>}
    </section>
  </div>;
}
