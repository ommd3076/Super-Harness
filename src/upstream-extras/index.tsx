import "../upstream/foundation.css";
import AgentScreen from "./AgentScreen";
import ChatComposer from "./ChatComposer";
import RecordsTable, { type RecordRow } from "../beautiful/components/primitives/RecordsTable";
import SelectionActions from "../beautiful/components/primitives/SelectionActions";
import "./records.css";

const sources: RecordRow[] = [
  { id:"atlas", name:"Atlas Research", tags:["Analytics","Benchmark"], last:"Today", strength:"strong" },
  { id:"northstar", name:"Northstar Labs", tags:["Infrastructure"], last:"Yesterday", strength:"weak" },
  { id:"fieldnote", name:"Fieldnote Studio", tags:["Design","Research"], last:"Oct 16", strength:"strong" },
  { id:"openline", name:"Openline Systems", tags:["Security"], last:"Oct 12", strength:"none" },
];

/** Local-only interactive primitives for the mixed audit scene. */
export function UpstreamAuditExtras() {
  return <div className="flex min-w-0 flex-col gap-5">
    <div className="flex flex-wrap items-start gap-5"><AgentScreen agentName="Research assistant" /><ChatComposer /></div>
    <RecordsTable rows={sources}/>
    <SelectionActions text={{
      lead:"The rollout tracker has a useful baseline. ",
      original:"Review the request counters before the next change to make sure traffic is comparable.",
      rewrite:"Before the next change, check that the baseline and rollout windows have comparable traffic.",
    }}/>
  </div>;
}
