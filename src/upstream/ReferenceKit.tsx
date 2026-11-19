import "./foundation.css";
import LoadingState from "./LoadingState";
import StreamingText from "./StreamingText";
import ApprovalCard from "./ApprovalCard";
import CodeBlock from "./CodeBlock";
import ToolChips from "./ToolChips";
import TaskRows from "./TaskRows";
import ContextCards from "./ContextCards";

export function UpstreamLoading({ variant = "Drive", label = "Refreshing inventory" }: { variant?: string; label?: string }) {
  return <LoadingState variant={variant} label={label} />;
}

export function UpstreamResponse(props: Parameters<typeof StreamingText>[0] = {}) {
  return <StreamingText {...props} />;
}

export function UpstreamReview(props: Parameters<typeof ApprovalCard>[0] = {}) {
  return <ApprovalCard {...props} />;
}

export function UpstreamCode(props: Parameters<typeof CodeBlock>[0] = {}) {
  return <CodeBlock {...props} />;
}

export function UpstreamTools(props: Parameters<typeof ToolChips>[0] = {}) {
  return <ToolChips {...props} />;
}

export function UpstreamTasks(props: Parameters<typeof TaskRows>[0] = {}) {
  return <TaskRows {...props} />;
}

export function UpstreamContext(props: Parameters<typeof ContextCards>[0] = {}) {
  return <ContextCards {...props} />;
}
