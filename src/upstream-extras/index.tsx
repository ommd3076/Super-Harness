import "../upstream/foundation.css";
import AgentScreen from "./AgentScreen";
import ChatComposer from "./ChatComposer";
import { RecordsTable } from "./RecordsTable";
import { SelectionActions } from "./SelectionActions";

/** Local-only interactive primitives for the mixed audit scene. */
export function UpstreamAuditExtras() {
  return <div className="flex flex-col gap-5"><div className="flex flex-wrap items-start gap-5"><AgentScreen agentName="Research assistant" /><ChatComposer /></div><RecordsTable /><SelectionActions /></div>;
}
