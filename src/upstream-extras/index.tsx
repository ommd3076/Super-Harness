import "../upstream/foundation.css";
import AgentScreen from "./AgentScreen";
import ChatComposer from "./ChatComposer";

/** Local-only interactive primitives for the mixed audit scene. */
export function UpstreamAuditExtras() {
  return <div className="flex flex-wrap items-start gap-5"><AgentScreen agentName="Research assistant" /><ChatComposer /></div>;
}
